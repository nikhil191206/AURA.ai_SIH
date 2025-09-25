import { ChevronRight, Bot, BookOpen, Users, UserCheck, Phone } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  onClick?: () => void;
}

interface ProductShowcaseProps {
  onOpenChatbot?: () => void;
  onOpenResourceLibrary?: () => void;
  onOpenCommunity?: () => void;
  onOpenCounsellor?: () => void;
  onOpenCrisisSupport?: () => void;
}

export function ProductShowcase({ 
  onOpenChatbot, 
  onOpenResourceLibrary,
  onOpenCommunity,
  onOpenCounsellor,
  onOpenCrisisSupport 
}: ProductShowcaseProps) {
  const services: Service[] = [
    {
      id: '1',
      name: 'AI Bot',
      description: 'Your AI wellness companion available 24/7 for emotional support',
      icon: Bot,
      color: 'from-green-50 to-green-100',
      onClick: onOpenChatbot
    },
    {
      id: '2',
      name: 'Resource Library',
      description: 'Comprehensive collection of mental health resources and tools.',
      icon: BookOpen,
      color: 'from-blue-50 to-blue-100',
      onClick: onOpenResourceLibrary
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-pink-25">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={service.id}
                className={`relative rounded-3xl p-12 bg-gradient-to-br ${service.color} overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]`}
                onClick={service.onClick}
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 mb-6 bg-white/50 rounded-2xl flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-4xl mb-4">
                    {service.name}
                  </h3>
                  <p className="text-lg text-muted-foreground mb-8">
                    {service.description}
                  </p>
                  <div className="flex space-x-6">
                    <button 
                      className="flex items-center gap-2 text-primary hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle learn more
                      }}
                    >
                      Learn more
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button 
                      className="flex items-center gap-2 text-primary hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        service.onClick?.();
                      }}
                    >
                      {service.name === 'AI Bot' ? 'Chat now' : 'Get started'}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="absolute right-8 top-8 opacity-10">
                  <IconComponent className="h-32 w-32" />
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Additional smaller service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { 
              name: 'Community', 
              tagline: 'Connect. Share. Heal together.', 
              icon: Users, 
              color: 'from-pink-50 to-pink-100',
              onClick: onOpenCommunity
            },
            { 
              name: 'Counsellor Connect', 
              tagline: 'Professional therapy and guidance.', 
              icon: UserCheck, 
              color: 'from-green-50 to-green-100',
              onClick: onOpenCounsellor
            },
            { 
              name: '24/7 Crisis Support', 
              tagline: 'Always here when you need us.', 
              icon: Phone, 
              color: 'from-blue-50 to-blue-100',
              onClick: onOpenCrisisSupport
            }
          ].map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={index}
                className={`bg-gradient-to-br ${item.color} rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300 cursor-pointer`}
                onClick={item.onClick}
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-white/50 rounded-xl flex items-center justify-center">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-2xl mb-3">{item.name}</h4>
                <p className="text-muted-foreground mb-6">{item.tagline}</p>
                <div className="flex justify-center space-x-6">
                  <button 
                    className="flex items-center gap-1 text-primary hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle learn more
                    }}
                  >
                    Learn more
                    <ChevronRight className="h-3 w-3" />
                  </button>
                  <button 
                    className="flex items-center gap-1 text-primary hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onClick?.();
                    }}
                  >
                    Join now
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}