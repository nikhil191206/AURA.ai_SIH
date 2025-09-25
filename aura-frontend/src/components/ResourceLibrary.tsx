import { useState, useEffect } from "react";
import { X, Search, BookOpen, FileText, Video, Headphones, Download, Star } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'audio' | 'pdf' | 'worksheet';
  category: string;
  rating: number;
  downloads: number;
  duration?: string;
  author: string;
  tags: string[];
}

interface ResourceLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResourceLibrary({ isOpen, onClose }: ResourceLibraryProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // Mock data - replace with FastAPI backend call
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        // TODO: Backend integration with FastAPI
        // const response = await fetch('/api/resources', {
        //   headers: { 'Authorization': `Bearer ${userToken}` }
        // });
        // const data = await response.json();
        
        // Mock data for now
        const mockResources: Resource[] = [
          {
            id: '1',
            title: 'Understanding Anxiety: A Comprehensive Guide',
            description: 'Learn about anxiety disorders, symptoms, and coping strategies.',
            type: 'article',
            category: 'Anxiety',
            rating: 4.8,
            downloads: 1245,
            author: 'Dr. Sarah Wilson',
            tags: ['anxiety', 'coping', 'mental health']
          },
          {
            id: '2',
            title: 'Mindful Breathing Techniques',
            description: 'Guided audio sessions for stress relief and relaxation.',
            type: 'audio',
            category: 'Meditation',
            rating: 4.9,
            downloads: 2156,
            duration: '15 min',
            author: 'James Miller',
            tags: ['meditation', 'breathing', 'relaxation']
          },
          {
            id: '3',
            title: 'Daily Mood Tracking Worksheet',
            description: 'Track your emotional patterns and identify triggers.',
            type: 'worksheet',
            category: 'Self-Help',
            rating: 4.6,
            downloads: 987,
            author: 'AURA.AI Team',
            tags: ['mood tracking', 'worksheet', 'self-awareness']
          }
        ];
        
        setResources(mockResources);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchResources();
    }
  }, [isOpen]);

  const categories = ['all', 'Anxiety', 'Depression', 'Meditation', 'Self-Help', 'Therapy'];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Headphones className="h-4 w-4" />;
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'worksheet': return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleDownload = async (resourceId: string) => {
    try {
      // TODO: Backend integration with FastAPI
      // const response = await fetch(`/api/resources/${resourceId}/download`, {
      //   headers: { 'Authorization': `Bearer ${userToken}` }
      // });
      console.log(`Downloading resource ${resourceId}`);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-medium">Resource Library</h2>
              <p className="text-sm text-muted-foreground">Mental health resources and tools</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-muted rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(resource.type)}
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {resource.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">{resource.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-medium mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>By {resource.author}</span>
                    {resource.duration && <span>{resource.duration}</span>}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      <span className="text-xs">{resource.downloads}</span>
                    </div>
                    <button
                      onClick={() => handleDownload(resource.id)}
                      className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs hover:bg-primary/90 transition-colors"
                    >
                      Access
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