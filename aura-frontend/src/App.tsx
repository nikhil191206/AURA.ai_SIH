import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProductShowcase } from "./components/ProductShowcase";
import { Footer } from "./components/Footer";
import { Chatbot } from "./components/Chatbot";
import { ResourceLibrary } from "./components/ResourceLibrary";
import { Community } from "./components/Community";
import { CounsellorConnect } from "./components/CounsellorConnect";
import { CrisisSupport } from "./components/CrisisSupport";
import { AnimatedBackground } from "./components/AnimatedBackground";

export default function App() {
  // Modal states
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isResourceLibraryOpen, setIsResourceLibraryOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isCounsellorConnectOpen, setIsCounsellorConnectOpen] = useState(false);
  const [isCrisisSupportOpen, setIsCrisisSupportOpen] = useState(false);

  // Navigation state
  const [currentPage, setCurrentPage] = useState('home');

  // Authentication state (for future backend integration)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Modal handlers
  const openChatbot = () => setIsChatbotOpen(true);
  const closeChatbot = () => setIsChatbotOpen(false);

  const openResourceLibrary = () => setIsResourceLibraryOpen(true);
  const closeResourceLibrary = () => setIsResourceLibraryOpen(false);

  const openCommunity = () => setIsCommunityOpen(true);
  const closeCommunity = () => setIsCommunityOpen(false);

  const openCounsellorConnect = () => setIsCounsellorConnectOpen(true);
  const closeCounsellorConnect = () => setIsCounsellorConnectOpen(false);

  const openCrisisSupport = () => setIsCrisisSupportOpen(true);
  const closeCrisisSupport = () => setIsCrisisSupportOpen(false);

  // Navigation handler
  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    
    // Close any open modals first
    setIsChatbotOpen(false);
    setIsResourceLibraryOpen(false);
    setIsCommunityOpen(false);
    setIsCounsellorConnectOpen(false);
    setIsCrisisSupportOpen(false);

    // Open the appropriate modal based on navigation
    switch (page) {
      case 'chatbot':
        openChatbot();
        break;
      case 'resources':
        openResourceLibrary();
        break;
      case 'community':
        openCommunity();
        break;
      case 'counsellor':
        openCounsellorConnect();
        break;
      case 'home':
      default:
        // Stay on home page
        break;
    }
  };

  // Authentication handlers (for future backend integration)
  const handleLogin = async () => {
    try {
      // TODO: Backend integration with FastAPI
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      // if (data.success) {
      //   setIsAuthenticated(true);
      //   setUser(data.user);
      //   localStorage.setItem('token', data.token);
      // }
      console.log('Login functionality - to be implemented with FastAPI backend');
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
      // const data = await response.json();
      // if (data.success) {
      //   setIsAuthenticated(true);
      //   setUser(data.user);
      //   localStorage.setItem('token', data.token);
      // }
      console.log('Signup functionality - to be implemented with FastAPI backend');
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        <Header 
          onNavigate={handleNavigation}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
        <main>
          <Hero />
          <ProductShowcase 
            onOpenChatbot={openChatbot}
            onOpenResourceLibrary={openResourceLibrary}
            onOpenCommunity={openCommunity}
            onOpenCounsellor={openCounsellorConnect}
            onOpenCrisisSupport={openCrisisSupport}
          />
        </main>
        <Footer />
      </div>
      
      {/* Modals */}
      <Chatbot 
        isOpen={isChatbotOpen} 
        onClose={closeChatbot} 
      />
      <ResourceLibrary 
        isOpen={isResourceLibraryOpen} 
        onClose={closeResourceLibrary} 
      />
      <Community 
        isOpen={isCommunityOpen} 
        onClose={closeCommunity} 
      />
      <CounsellorConnect 
        isOpen={isCounsellorConnectOpen} 
        onClose={closeCounsellorConnect} 
      />
      <CrisisSupport 
        isOpen={isCrisisSupportOpen} 
        onClose={closeCrisisSupport} 
      />
    </div>
  );
}