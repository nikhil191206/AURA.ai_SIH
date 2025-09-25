import { useState } from "react";
import { Menu } from "lucide-react";

interface HeaderProps {
  onNavigate?: (page: string) => void;
  onLogin?: () => void;
  onSignup?: () => void;
}

export function Header({ onNavigate, onLogin, onSignup }: HeaderProps) {
  const [activeTab, setActiveTab] = useState<string>('home');

  const handleNavClick = (page: string) => {
    setActiveTab(page);
    onNavigate?.(page);
  };

  const handleLogin = async () => {
    try {
      // TODO: Backend integration with FastAPI
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      onLogin?.();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSignup = async () => {
    try {
      // TODO: Backend integration with FastAPI
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, name })
      // });
      onSignup?.();
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-border z-50">
      <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div 
            className="text-xl font-medium cursor-pointer hover:text-primary transition-colors"
            onClick={() => handleNavClick('home')}
          >
            AURA.AI
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => handleNavClick('chatbot')}
              className={`transition-colors ${
                activeTab === 'chatbot' ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              AI CHATBOT
            </button>
            <button 
              onClick={() => handleNavClick('resources')}
              className={`transition-colors ${
                activeTab === 'resources' ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Resource Library
            </button>
            <button 
              onClick={() => handleNavClick('community')}
              className={`transition-colors ${
                activeTab === 'community' ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Community
            </button>
            <button 
              onClick={() => handleNavClick('counsellor')}
              className={`transition-colors ${
                activeTab === 'counsellor' ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              Counsellor Connect
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleLogin}
            className="text-foreground/80 hover:text-foreground transition-colors px-4 py-2 rounded-full hover:bg-muted"
          >
            Login
          </button>
          <button 
            onClick={handleSignup}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
          >
            Sign Up
          </button>
          <button className="md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>
    </header>
  );
}