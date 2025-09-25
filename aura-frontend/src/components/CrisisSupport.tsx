import { useState } from "react";
import { X, Phone, MessageCircle, Heart, Clock, MapPin, Globe } from "lucide-react";

interface CrisisSupportProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HelplineInfo {
  name: string;
  phone: string;
  description: string;
  availability: string;
  type: 'emergency' | 'crisis' | 'support';
  country: string;
}

export function CrisisSupport({ isOpen, onClose }: CrisisSupportProps) {
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [urgencyLevel, setUrgencyLevel] = useState<'emergency' | 'crisis' | 'support'>('support');

  const helplines: HelplineInfo[] = [
    {
      name: "Emergency Services",
      phone: "911",
      description: "For immediate life-threatening emergencies",
      availability: "24/7",
      type: "emergency",
      country: "US"
    },
    {
      name: "National Suicide Prevention Lifeline",
      phone: "988",
      description: "Free and confidential emotional support for people in suicidal crisis",
      availability: "24/7",
      type: "crisis",
      country: "US"
    },
    {
      name: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "Free, 24/7 support for those in crisis via text message",
      availability: "24/7",
      type: "crisis",
      country: "US"
    },
    {
      name: "SAMHSA National Helpline",
      phone: "1-800-662-4357",
      description: "Treatment referral and information service for mental health and substance abuse",
      availability: "24/7",
      type: "support",
      country: "US"
    },
    {
      name: "National Alliance on Mental Illness (NAMI)",
      phone: "1-800-950-6264",
      description: "Information, referrals and support for people with mental health conditions",
      availability: "Monday-Friday 10am-10pm ET",
      type: "support",
      country: "US"
    }
  ];

  const handleEmergencyCall = async (phone: string) => {
    try {
      // TODO: Backend integration with FastAPI to log emergency calls
      // await fetch('/api/crisis/emergency-call', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${userToken}`
      //   },
      //   body: JSON.stringify({ phone, timestamp: new Date() })
      // });
      
      // Trigger phone call
      window.open(`tel:${phone}`, '_self');
    } catch (error) {
      console.error('Emergency call logging error:', error);
      // Still allow the call to proceed
      window.open(`tel:${phone}`, '_self');
    }
  };

  const handleChatSupport = async () => {
    try {
      // TODO: Backend integration with FastAPI
      // const response = await fetch('/api/crisis/chat-support', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${userToken}`
      //   }
      // });
      console.log('Starting crisis chat support');
    } catch (error) {
      console.error('Chat support error:', error);
    }
  };

  const filteredHelplines = helplines.filter(helpline => 
    helpline.country === selectedCountry &&
    (urgencyLevel === 'emergency' ? helpline.type === 'emergency' : true)
  );

  const getUrgencyColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-500';
      case 'crisis': return 'bg-orange-500';
      case 'support': return 'bg-primary';
      default: return 'bg-primary';
    }
  };

  const getUrgencyText = (type: string) => {
    switch (type) {
      case 'emergency': return 'EMERGENCY';
      case 'crisis': return 'CRISIS';
      case 'support': return 'SUPPORT';
      default: return 'SUPPORT';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-medium">24/7 Crisis Support</h2>
              <p className="text-sm text-muted-foreground">Immediate help when you need it most</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Emergency Banner */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6 rounded-r-lg">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-red-500" />
            <div>
              <p className="font-medium text-red-800">If you're in immediate danger, call emergency services</p>
              <button
                onClick={() => handleEmergencyCall('911')}
                className="bg-red-500 text-white px-4 py-2 rounded-full text-sm mt-2 hover:bg-red-600 transition-colors"
              >
                Call 911 Now
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 pb-6">
          <h3 className="font-medium mb-4">Quick Support Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleChatSupport}
              className="flex items-center gap-3 p-4 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors"
            >
              <MessageCircle className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-medium">Crisis Chat</div>
                <div className="text-sm text-muted-foreground">Start anonymous chat</div>
              </div>
            </button>
            <button
              onClick={() => handleEmergencyCall('988')}
              className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
            >
              <Phone className="h-5 w-5 text-orange-600" />
              <div className="text-left">
                <div className="font-medium">Crisis Hotline</div>
                <div className="text-sm text-muted-foreground">Call 988</div>
              </div>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 pb-4 border-b border-border">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-3 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>
            </div>
            <select
              value={urgencyLevel}
              onChange={(e) => setUrgencyLevel(e.target.value as any)}
              className="px-3 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="support">All Support</option>
              <option value="crisis">Crisis Only</option>
              <option value="emergency">Emergency Only</option>
            </select>
          </div>
        </div>

        {/* Helplines List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {filteredHelplines.map((helpline, index) => (
              <div key={index} className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{helpline.name}</h4>
                      <span className={`${getUrgencyColor(helpline.type)} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                        {getUrgencyText(helpline.type)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{helpline.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{helpline.availability}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{helpline.country}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="font-mono text-lg font-medium">{helpline.phone}</div>
                  <button
                    onClick={() => handleEmergencyCall(helpline.phone.replace(/[^\d]/g, ''))}
                    className={`${getUrgencyColor(helpline.type)} text-white px-4 py-2 rounded-full text-sm hover:opacity-90 transition-opacity flex items-center gap-2`}
                  >
                    <Phone className="h-4 w-4" />
                    Call Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Message */}
        <div className="p-6 bg-muted/30 rounded-b-2xl">
          <p className="text-sm text-muted-foreground text-center">
            You are not alone. Help is available 24/7. Your life matters and things can get better.
          </p>
        </div>
      </div>
    </div>
  );
}