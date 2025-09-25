import os
import torch
import sys
from transformers import (
    AutoTokenizer, 
    AutoModelForCausalLM, 
    Trainer, 
    TrainingArguments,
    DataCollatorForLanguageModeling,
    BitsAndBytesConfig
)
from datasets import load_from_disk, concatenate_datasets, Dataset
import logging
from peft import LoraConfig, get_peft_model, TaskType, prepare_model_for_kbit_training
import json
import gc
import psutil
import random

# --- CONFIGURATION ---
LLAMA_MODEL_PATH = "models/llama"   # Your local path
OUTPUT_DIR = "models/aura_ai_llama32_3b_mental_health"
LOGGING_DIR = "logs/aura_ai_training"
DATASETS_DIR = "data/datasets_used"

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Intel Arc GPU optimization (Hoping for a working environment)
os.environ["CUDA_VISIBLE_DEVICES"] = "0"
torch.backends.cudnn.benchmark = True

# Optimized Training Configuration for Intel Arc 8GB
TRAINING_ARGS = TrainingArguments(
    output_dir=OUTPUT_DIR,
    overwrite_output_dir=True,
    
    # Training parameters optimized for 8GB shared memory
    num_train_epochs=3,   
    per_device_train_batch_size=2,
    gradient_accumulation_steps=8,   # Effective batch size = 16
    max_steps=1500,
    
    # Memory and performance optimization
    fp16=True,   # Half precision for memory efficiency
    bf16=False,   # Use fp16 for broader compatibility (including Intel Arc)
    dataloader_pin_memory=True,
    dataloader_num_workers=4,
    
    # Checkpointing and logging
    save_steps=300,
    save_total_limit=3,
    logging_steps=50,
    
    # Evaluation
    eval_strategy="steps",
    eval_steps=300,
    per_device_eval_batch_size=2,
    
    # Optimizer settings 
    learning_rate=3e-4, 
    lr_scheduler_type="cosine_with_restarts",
    warmup_steps=150, 
    weight_decay=0.01,
    
    # Training strategy
    save_strategy="steps",
    load_best_model_at_end=True,
    metric_for_best_model="eval_loss",
    greater_is_better=False,
    report_to="none",
    remove_unused_columns=True,
    
    # Memory optimization
    gradient_checkpointing=True,
    torch_compile=False,
    max_grad_norm=1.0,
    group_by_length=True,
    
    # Intel Arc specific optimizations
    ddp_find_unused_parameters=False,
)

# LoRA Configuration for Mental Health Domain
LORA_CONFIG = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    inference_mode=False,
    r=16,
    lora_alpha=32,
    lora_dropout=0.1,
    target_modules=[
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj"
    ],
    bias="none",
    use_rslora=False,
)

# --- UTILITY FUNCTIONS ---

def get_quantization_config():
    """Returns BitsAndBytes config for QLoRA."""
    try:
        # Check if bitsandbytes is imported globally/available
        import bitsandbytes
        return BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16,
        )
    except (ImportError, AttributeError):
        logger.warning("bitsandbytes not available - using FP16 without 4-bit quantization. Memory usage will be higher.")
        return None

def clear_memory():
    """Clear GPU memory and garbage collect."""
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
        torch.cuda.synchronize()
    gc.collect()

def check_system_requirements():
    """Check system compatibility and memory."""
    logger.info("=== SYSTEM CHECK ===")
    
    if torch.cuda.is_available():
        gpu_name = torch.cuda.get_device_name()
        gpu_memory = torch.cuda.get_device_properties(0).total_memory / 1e9
        logger.info(f"CUDA available: YES (Proxy for Arc backend)")
        logger.info(f"GPU: {gpu_name}")
        logger.info(f"GPU Memory: {gpu_memory:.1f}GB")
        if gpu_memory < 7.5:
             logger.error("GPU memory detected is less than 8GB. Training stability might be severely impacted.")
    else:
        logger.warning("CUDA not detected. Training will run on CPU and be extremely slow.")
    
    ram_gb = psutil.virtual_memory().total / 1e9
    logger.info(f"System RAM: {ram_gb:.1f}GB")
    
    return True

def create_mental_health_prompt_template():
    """Create the conversation template for AURA.ai mental health bot."""
    # System prompt is kept separate for clarity in formatting function
    system_prompt = """You are AURA.ai, a compassionate mental health AI assistant specifically designed for Indian college students. You provide:

1. Culturally sensitive support understanding Indian academic pressure, family expectations, and social contexts
2. Evidence-based mental health guidance using techniques from CBT, DBT, and mindfulness
3. Crisis detection and appropriate resource recommendations
4. Empathetic, non-judgemental responses that respect Indian values and traditions

Always prioritize user safety and recommend professional help when needed."""
    
    return system_prompt

def format_mental_health_conversations(dataset, max_samples=3000):
    """
    Format dataset specifically for mental health conversations 
    using the correct Llama 3 chat format.
    """
    logger.info(f"Formatting mental health dataset (max {max_samples} samples)")
    
    if len(dataset) > max_samples:
        dataset = dataset.select(range(max_samples))
    
    system_prompt = create_mental_health_prompt_template()
    
    def create_conversation_format(examples):
        formatted_texts = []
        
        # Use a list of common user queries related to the system prompt context
        user_queries = [
            "I'm feeling overwhelmed with academic pressure and family expectations.",
            "I'm struggling with anxiety and need someone to talk to.",
            "Can you help me cope with stress and depression?",
            "I'm having trouble managing my emotions and need guidance.",
            "I feel isolated and need support with my mental health.",
            "My parents want me to pursue a job I hate, what should I do?",
            "I feel hopeless because of my performance in my university exams."
        ]

        for text in examples.get('text', []):
            text_str = str(text).strip()
            if len(text_str) < 50:
                continue

            # Assuming the dataset 'text' field contains high-quality long mental health advice.
            if len(text_str) > 150:
                user_query = random.choice(user_queries)
                assistant_response = text_str[:600]   # Limit response length to prevent extreme sequence lengths
                
                # CRITICAL FIX: Correct Llama 3/3.2 chat format
                conversation = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>
{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>
{user_query}<|eot_id|><|start_header_id|>assistant<|end_header_id|>
{assistant_response}<|eot_id|>"""
                
                formatted_texts.append(conversation)
        
        return {"formatted_text": formatted_texts}
    
    formatted_dataset = dataset.map(
        create_conversation_format,
        batched=True,
        batch_size=100,
        remove_columns=dataset.column_names,
        num_proc=4,
        desc="Formatting mental health conversations"
    )
    
    # Filter for quality conversations based on length after formatting
    formatted_dataset = formatted_dataset.filter(
        lambda x: len(x["formatted_text"]) > 200 and len(x["formatted_text"]) < 2000,
        num_proc=4
    )
    
    logger.info(f"Formatted {len(formatted_dataset)} quality mental health conversations")
    return formatted_dataset

def load_mental_health_datasets():
    """Load and combine mental health datasets."""
    priority_datasets = [
        "mental_health_counseling",
        "mental_health_conversational",
        "mental_chat_16k",
        "mental_health_chatbot"
    ]
    
    loaded_datasets = []
    total_samples = 0
    max_total_samples = 8000
    
    for dataset_name in priority_datasets:
        if total_samples >= max_total_samples:
            break
            
        local_path = os.path.join(DATASETS_DIR, dataset_name)
        
        if os.path.exists(local_path):
            try:
                logger.info(f"Loading {dataset_name}...")
                dataset = load_from_disk(local_path)
                
                if 'text' in dataset.column_names and len(dataset) > 50:
                    samples_to_take = min(2000, len(dataset), max_total_samples - total_samples)
                    dataset = dataset.select(range(samples_to_take))
                    
                    loaded_datasets.append(dataset)
                    total_samples += len(dataset)
                    logger.info(f"Loaded {len(dataset)} samples from {dataset_name}")
                    
            except Exception as e:
                logger.error(f"Error loading {dataset_name} from disk: {e}")
                continue
    
    if not loaded_datasets:
        logger.warning("No datasets found - creating demo mental health dataset")
        # Fallback to demo data to allow the script to run/test
        demo_data = create_demo_mental_health_data() 
        loaded_datasets = [demo_data]
        total_samples = len(demo_data)
    
    logger.info(f"Total mental health samples loaded: {total_samples}")
    return loaded_datasets

def create_demo_mental_health_data():
    """Create demo mental health conversation data if no datasets are found."""
    conversations = [
        {
            "user": "I'm feeling really stressed about my upcoming exams and my parents' expectations.",
            "assistant": "I understand the pressure you're feeling with exams and family expectations. This is very common among Indian students. Let's break this down - what specific aspects of the exam stress feel most overwhelming right now? Remember, your worth isn't defined by grades alone."
        },
        {
            "user": "I've been having trouble sleeping and feel anxious all the time.",
            "assistant": "Sleep issues and anxiety often go hand in hand. This sounds really difficult to manage. Have you noticed any specific triggers for your anxiety? Some techniques that can help include deep breathing exercises, creating a calming bedtime routine, and limiting screen time before sleep. If this continues, it would be good to speak with a counselor."
        },
    ]
    
    system_prompt = create_mental_health_prompt_template()
    formatted_data = []
    
    for conv in conversations:
        # CRITICAL FIX: Correct Llama 3.2 chat format
        formatted_text = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>
{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>
{conv['user']}<|eot_id|><|start_header_id|>assistant<|end_header_id|>
{conv['assistant']}<|eot_id|>"""
        
        formatted_data.append({"text": formatted_text})
    
    # Duplicate for a minimally functional training set
    formatted_data = formatted_data * 50
    return Dataset.from_list(formatted_data).rename_column("text", "formatted_text") # Rename for consistency

def fine_tune_aura_ai_llama():
    """Fine-tune Llama 3.2-3B-Instruct for AURA.ai mental health chatbot."""
    logger.info("=== AURA.ai MENTAL HEALTH CHATBOT FINE-TUNING START ===")
    
    check_system_requirements()
    clear_memory()
    
    # Load model and tokenizer
    logger.info("Loading Llama 3.2-3B-Instruct...")
    quantization_config = get_quantization_config()
    
    try:
        tokenizer = AutoTokenizer.from_pretrained(
            LLAMA_MODEL_PATH,
            trust_remote_code=True,
            use_fast=True
        )
        
        # 1. Setup tokenizer (CRITICAL Llama 3 Fix)
        if tokenizer.pad_token is None:
             # Llama 3 uses EOT as PAD/EOS
            tokenizer.pad_token = tokenizer.eos_token
            tokenizer.pad_token_id = tokenizer.eos_token_id
            
        # 2. CRITICAL FIX: Set correct Llama 3 chat template for the tokenizer
        # This is for the Trainer's internal use/compatibility, though the data is manually formatted
        tokenizer.chat_template = "{% for message in messages %}{{'<|start_header_id|>' + message['role'] + '<|end_header_id|>\n' + message['content'] + '<|eot_id|>'}}{% endfor %}"

        # Load model with optimized settings for 8GB
        model_kwargs = {
            "trust_remote_code": True,
            "use_cache": False,
            "torch_dtype": torch.float16,
            "low_cpu_mem_usage": True,
        }
        
        if quantization_config:
            model_kwargs["quantization_config"] = quantization_config
            device_map = "auto"
            model_kwargs["device_map"] = device_map
        
        model = AutoModelForCausalLM.from_pretrained(
            LLAMA_MODEL_PATH,
            **model_kwargs
        )
        
        # 3. CRITICAL FIX: Resize token embeddings after setting special tokens
        model.resize_token_embeddings(len(tokenizer))
        
        logger.info(f"Model and tokenizer loaded successfully from {LLAMA_MODEL_PATH}")
        
    except Exception as e:
        logger.error(f"FATAL ERROR loading model or tokenizer: {e}")
        sys.exit(1)
    
    # Apply LoRA
    logger.info("Applying LoRA for efficient fine-tuning...")
    try:
        if quantization_config:
            model = prepare_model_for_kbit_training(model)
        
        model = get_peft_model(model, LORA_CONFIG)
        
        trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
        total_params = sum(p.numel() for p in model.parameters())
        logger.info(f"Trainable parameters: {trainable_params:,} ({100*trainable_params/total_params:.2f}%)")
        
    except Exception as e:
        logger.error(f"FATAL ERROR applying LoRA: {e}")
        sys.exit(1)
    
    # Load and format datasets
    logger.info("Preparing mental health datasets...")
    datasets = load_mental_health_datasets()
    
    try:
        combined_dataset = concatenate_datasets(datasets) if len(datasets) > 1 else datasets[0]
        formatted_dataset = format_mental_health_conversations(combined_dataset)
        
        if len(formatted_dataset) < 50:
            logger.error("FATAL: Insufficient quality training data!")
            sys.exit(1)
        
        formatted_dataset = formatted_dataset.shuffle(seed=42)
        dataset_size = len(formatted_dataset)
        train_size = int(dataset_size * 0.9)
        
        train_dataset = formatted_dataset.select(range(train_size))
        eval_dataset = formatted_dataset.select(range(train_size, dataset_size))
        
    except Exception as e:
        logger.error(f"FATAL ERROR preparing datasets: {e}")
        sys.exit(1)
    
    # Tokenization
    logger.info("Tokenizing conversations...")
    
    def tokenize_function(examples):
        # We rely on the formatting function to provide 'formatted_text'
        return tokenizer(
            examples["formatted_text"], 
            truncation=True,
            padding=False,
            max_length=1024,
            return_tensors=None
        )
    
    try:
        train_tokenized = train_dataset.map(tokenize_function, batched=True, batch_size=100, remove_columns=train_dataset.column_names, num_proc=4, desc="Tokenizing train data")
        eval_tokenized = eval_dataset.map(tokenize_function, batched=True, batch_size=100, remove_columns=eval_dataset.column_names, num_proc=4, desc="Tokenizing eval data")
        
        # Add labels (DataCollatorForLanguageModeling will handle the shifting)
        def add_labels(examples):
            examples["labels"] = examples["input_ids"].copy()
            return examples
        
        train_tokenized = train_tokenized.map(add_labels, batched=True, num_proc=4)
        eval_tokenized = eval_tokenized.map(add_labels, batched=True, num_proc=4)

        logger.info(f"Training set tokenized size: {len(train_tokenized)}")
        
    except Exception as e:
        logger.error(f"FATAL ERROR during tokenization: {e}")
        sys.exit(1)
    
    # Data collator
    data_collator = DataCollatorForLanguageModeling(
        tokenizer=tokenizer,
        mlm=False, # Causal Language Modeling
        return_tensors="pt"
    )
    
    # Initialize trainer
    logger.info("Initializing trainer and beginning training...")
    trainer = Trainer(
        model=model,
        args=TRAINING_ARGS,
        train_dataset=train_tokenized,
        eval_dataset=eval_tokenized,
        data_collator=data_collator,
        tokenizer=tokenizer,
    )
    
    # Start training
    try:
        trainer.train()
        logger.info("Training completed successfully!")
        
    except Exception as e:
        logger.error(f"FATAL ERROR during training: {e}")
        try:
            # Attempt to save partial model on failure
            trainer.save_model(OUTPUT_DIR + "_partial")
            logger.info("Partial model saved successfully.")
        except Exception:
            logger.warning("Could not save partial model.")
        sys.exit(1)
    
    # Save final model
    logger.info(f"Saving final AURA.ai model to {OUTPUT_DIR}...")
    try:
        trainer.save_model(OUTPUT_DIR)
        tokenizer.save_pretrained(OUTPUT_DIR)
        
        # Save training metadata
        training_info = {
            "model_name": "AURA.ai-Llama-3.2-3B-Mental-Health",
            "base_model": "meta-llama/Llama-3.2-3B-Instruct",
            "domain": "Mental Health Support for Indian College Students",
            "training_samples": len(train_tokenized),
            "eval_samples": len(eval_tokenized),
            "max_steps": TRAINING_ARGS.max_steps,
            "lora_config": {"r": LORA_CONFIG.r, "alpha": LORA_CONFIG.lora_alpha, "target_modules": LORA_CONFIG.target_modules},
            "hardware": "Intel Arc 8GB Optimized",
            "training_time_estimate": "45-60 minutes (YMMV)",
            "use_case": "AURA.ai Mental Wellness Chatbot"
        }
        with open(os.path.join(OUTPUT_DIR, "model_info.json"), "w") as f:
            json.dump(training_info, f, indent=2)
        
        logger.info("AURA.ai fine-tuning completed and model saved!")
        
    except Exception as e:
        logger.error(f"FATAL ERROR saving model: {e}")

if __name__ == "__main__":
    # Create directories
    for directory in [OUTPUT_DIR, LOGGING_DIR]:
        os.makedirs(directory, exist_ok=True)
    
    # Check dependencies
    required_packages = ['transformers', 'datasets', 'peft', 'accelerate', 'psutil']
    all_ok = True
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            logger.error(f"Missing required package: {package}. Install with: pip install {package}")
            all_ok = False
            
    try:
        import bitsandbytes
        logger.info("bitsandbytes available for quantization")
    except ImportError:
        logger.warning("bitsandbytes is not available. Please install and ensure it's correctly compiled for your environment to use 4-bit loading.")
    
    if all_ok:
        fine_tune_aura_ai_llama()
    else:
        sys.exit(1)