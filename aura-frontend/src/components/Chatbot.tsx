import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI wellness companion. I'm here to provide emotional support and help you navigate your mental health journey. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
      return "I understand you're feeling anxious. That's completely valid. Try this breathing exercise: breathe in for 4 counts, hold for 4, then breathe out for 6. Would you like me to guide you through some other coping strategies?";
    }
    
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
      return "I hear that you're going through a difficult time. Your feelings are valid, and it's okay to not feel okay sometimes. Small steps can make a big difference. What's one tiny thing that usually brings you a moment of peace?";
    }
    
    if (lowerMessage.includes('stressed') || lowerMessage.includes('stress')) {
      return "Stress can feel overwhelming. Let's break it down - what's the main thing causing you stress right now? Sometimes naming it can help us find ways to manage it better.";
    }
    
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
      return "Sleep is so important for mental health. Are you having trouble falling asleep, staying asleep, or both? I can suggest some relaxation techniques that might help.";
    }
    
    if (lowerMessage.includes('thank') || lowerMessage.includes('better')) {
      return "I'm so glad I could help! Remember, healing isn't linear - be patient and kind with yourself. Is there anything else you'd like to talk about?";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to support you. While I can offer coping strategies and a listening ear, please remember that for serious concerns, it's important to reach out to a mental health professional. What specific area would you like help with?";
    }
    
    // Default responses
    const defaultResponses = [
      "Thank you for sharing that with me. Can you tell me more about how you're feeling?",
      "I appreciate you opening up. What's been on your mind lately?",
      "It sounds like you're going through something. I'm here to listen and support you.",
      "That sounds important. How has this been affecting your day-to-day life?",
      "I want to understand better. What would help you feel more supported right now?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">AI Wellness Companion</h3>
              <p className="text-sm text-muted-foreground">Online now</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-accent/20 text-accent'
              }`}>
                {message.sender === 'user' ? 
                  <User className="h-4 w-4" /> : 
                  <Bot className="h-4 w-4" />
                }
              </div>
              <div className={`max-w-[80%] rounded-2xl p-3 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 opacity-70`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-accent/20 text-accent rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-2xl p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-muted rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This AI provides emotional support. For emergencies, contact a crisis helpline.
          </p>
        </div>
      </div>
    </div>
  );
}