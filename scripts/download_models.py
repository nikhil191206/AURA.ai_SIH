# File path: scripts/download_models.py
import os
from transformers import AutoTokenizer, AutoModelForCausalLM
from transformers import BertTokenizer, AutoModelForMaskedLM as IndicModel
import torch

# --- Configuration ---
# Set the models we need to download
# Llama3 is the core model for deep conversational AI
llama3_model_name = "meta-llama/Llama-3-8b-instruct"

# IndicBERT is a multilingual model pre-trained on Indian languages
indicbert_model_name = "ai4bharat/indic-bert"

# --- Main Script ---
def download_llama3():
    """Downloads the Llama3 model and tokenizer from Hugging Face."""
    print(f"--- Downloading Llama3 model: {llama3_model_name} ---")
    try:
        # We need to use a token for Llama3, which is a gated model.
        # You must log in to Hugging Face on your local machine first.
        # Use the command: `huggingface-cli login` in your terminal.
        tokenizer = AutoTokenizer.from_pretrained(llama3_model_name)
        model = AutoModelForCausalLM.from_pretrained(
            llama3_model_name,
            torch_dtype=torch.bfloat16,
        )
        print("Llama3 download complete.")
    except Exception as e:
        print(f"Error downloading Llama3: {e}")
        print("Please ensure you have access to this model on Hugging Face and are logged in.")

def download_indicbert():
    """Downloads the IndicBERT model and tokenizer from Hugging Face."""
    print(f"--- Downloading IndicBERT model: {indicbert_model_name} ---")
    try:
        # We need to use the specific tokenizer type that works with this model.
        # BertTokenizer is the compatible 'slow' tokenizer for IndicBERT.
        indic_tokenizer = BertTokenizer.from_pretrained(indicbert_model_name)
        indic_model = IndicModel.from_pretrained(indicbert_model_name)
        print("IndicBERT download complete.")
    except Exception as e:
        print(f"Error downloading IndicBERT: {e}")

def main():
    """
    Main function to initiate the model downloads.
    """
    if not os.path.exists("models"):
        os.makedirs("models")

    # Download Llama3
    download_llama3()

    # Download IndicBERT
    download_indicbert()

    print("\nAll model downloads initiated. Check your Hugging Face cache for files.")

if __name__ == "__main__":
    main()
