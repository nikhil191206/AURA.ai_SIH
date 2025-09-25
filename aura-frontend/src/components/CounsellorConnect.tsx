import { useState, useEffect } from "react";
import { X, Star, Calendar, Clock, Video, MessageCircle, MapPin, Filter } from "lucide-react";

interface Counsellor {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  rating: number;
  experience: number;
  location: string;
  avatar: string;
  isOnline: boolean;
  nextAvailable: Date;
  sessionTypes: ('video' | 'audio' | 'chat')[];
  bio: string;
  price: number;
  totalSessions: number;
  languages: string[];
}

interface CounsellorConnectProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CounsellorConnect({ isOpen, onClose }: CounsellorConnectProps) {
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [selectedSessionType, setSelectedSessionType] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [loading, setLoading] = useState(true);

  // Mock data - replace with FastAPI backend call
  useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        setLoading(true);
        // TODO: Backend integration with FastAPI
        // const response = await fetch('/api/counsellors', {
        //   headers: { 'Authorization': `Bearer ${userToken}` }
        // });
        // const data = await response.json();
        
        // Mock data for now
        const mockCounsellors: Counsellor[] = [
          {
            id: '1',
            name: 'Dr. Sarah Chen',
            title: 'Licensed Clinical Psychologist',
            specializations: ['Anxiety', 'Depression', 'Trauma'],
            rating: 4.9,
            experience: 8,
            location: 'San Francisco, CA',
            avatar: 'SC',
            isOnline: true,
            nextAvailable: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
            sessionTypes: ['video', 'audio', 'chat'],
            bio: 'Specializing in cognitive behavioral therapy with a focus on anxiety and trauma recovery.',
            price: 120,
            totalSessions: 1250,
            languages: ['English', 'Mandarin']
          },
          {
            id: '2',
            name: 'Dr. Michael Torres',
            title: 'Licensed Marriage & Family Therapist',
            specializations: ['Couples Therapy', 'Family Counseling', 'Communication'],
            rating: 4.8,
            experience: 12,
            location: 'Austin, TX',
            avatar: 'MT',
            isOnline: false,
            nextAvailable: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            sessionTypes: ['video', 'audio'],
            bio: 'Helping couples and families build stronger relationships through evidence-based approaches.',
            price: 150,
            totalSessions: 890,
            languages: ['English', 'Spanish']
          },
          {
            id: '3',
            name: 'Dr. Emily Watson',
            title: 'Clinical Psychologist',
            specializations: ['Teen Counseling', 'ADHD', 'Self-Esteem'],
            rating: 4.7,
            experience: 6,
            location: 'Boston, MA',
            avatar: 'EW',
            isOnline: true,
            nextAvailable: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
            sessionTypes: ['video', 'chat'],
            bio: 'Passionate about helping teens and young adults navigate life transitions and build confidence.',
            price: 100,
            totalSessions: 650,
            languages: ['English']
          }
        ];
        
        setCounsellors(mockCounsellors);
      } catch (error) {
        console.error('Error fetching counsellors:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCounsellors();
    }
  }, [isOpen]);

  const specializations = ['all', 'Anxiety', 'Depression', 'Trauma', 'Couples Therapy', 'Teen Counseling', 'ADHD'];
  const sessionTypes = ['all', 'video', 'audio', 'chat'];

  const filteredAndSortedCounsellors = counsellors
    .filter(counsellor => {
      const matchesSpecialization = selectedSpecialization === 'all' || 
        counsellor.specializations.includes(selectedSpecialization);
      const matchesSessionType = selectedSessionType === 'all' || 
        counsellor.sessionTypes.includes(selectedSessionType as any);
      return matchesSpecialization && matchesSessionType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience - a.experience;
        case 'price':
          return a.price - b.price;
        case 'availability':
          return a.nextAvailable.getTime() - b.nextAvailable.getTime();
        default:
          return 0;
      }
    });

  const handleBookSession = async (counsellorId: string) => {
    try {
      // TODO: Backend integration with FastAPI
      // const response = await fetch('/api/sessions/book', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${userToken}`
      //   },
      //   body: JSON.stringify({ counsellorId, sessionType: 'video' })
      // });
      console.log(`Booking session with counsellor ${counsellorId}`);
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-3 w-3" />;
      case 'audio': return <Clock className="h-3 w-3" />;
      case 'chat': return <MessageCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-medium">Counsellor Connect</h2>
              <p className="text-sm text-muted-foreground">Find and book sessions with licensed therapists</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-border">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="px-3 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {specializations.map(spec => (
                  <option key={spec} value={spec}>
                    {spec === 'all' ? 'All Specializations' : spec}
                  </option>
                ))}
              </select>
            </div>
            
            <select
              value={selectedSessionType}
              onChange={(e) => setSelectedSessionType(e.target.value)}
              className="px-3 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sessionTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Session Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="rating">Sort by Rating</option>
              <option value="experience">Sort by Experience</option>
              <option value="price">Sort by Price</option>
              <option value="availability">Sort by Availability</option>
            </select>
          </div>
        </div>

        {/* Counsellors List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAndSortedCounsellors.map((counsellor) => (
                <div key={counsellor.id} className="bg-muted/30 rounded-xl p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-lg font-medium">
                        {counsellor.avatar}
                      </div>
                      {counsellor.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{counsellor.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{counsellor.title}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{counsellor.rating}</span>
                        </div>
                        <span>{counsellor.experience} years exp.</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{counsellor.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium">${counsellor.price}</div>
                      <div className="text-xs text-muted-foreground">per session</div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {counsellor.specializations.slice(0, 3).map(spec => (
                        <span key={spec} className="bg-accent/20 text-accent px-2 py-1 rounded-full text-xs">
                          {spec}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{counsellor.bio}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {counsellor.sessionTypes.map(type => (
                        <div key={type} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                          {getSessionTypeIcon(type)}
                          <span className="text-xs">{type}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Next: {counsellor.nextAvailable.toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBookSession(counsellor.id)}
                      className="flex-1 bg-primary text-primary-foreground py-2 rounded-full text-sm hover:bg-primary/90 transition-colors"
                    >
                      Book Session
                    </button>
                    <button className="px-4 py-2 border border-primary text-primary rounded-full text-sm hover:bg-primary/5 transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}