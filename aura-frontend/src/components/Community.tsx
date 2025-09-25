import { useState, useEffect } from "react";
import { X, Plus, MessageCircle, Users, Heart, Share2, MoreHorizontal } from "lucide-react";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
  category: string;
  isAnonymous: boolean;
}

interface CommunityProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Community({ isOpen, onClose }: CommunityProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with FastAPI backend call
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // TODO: Backend integration with FastAPI
        // const response = await fetch('/api/community/posts', {
        //   headers: { 'Authorization': `Bearer ${userToken}` }
        // });
        // const data = await response.json();
        
        // Mock data for now
        const mockPosts: Post[] = [
          {
            id: '1',
            author: {
              name: 'Anonymous User',
              avatar: '',
              isVerified: false
            },
            content: 'Started therapy last week and feeling hopeful for the first time in months. Anyone else have similar experiences?',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            likes: 24,
            comments: 8,
            isLiked: false,
            category: 'Support',
            isAnonymous: true
          },
          {
            id: '2',
            author: {
              name: 'Sarah M.',
              avatar: 'SM',
              isVerified: true
            },
            content: 'Reminder: Its okay to have bad days. Progress isnt always linear. Be kind to yourself. 💙',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            likes: 56,
            comments: 12,
            isLiked: true,
            category: 'Motivation',
            isAnonymous: false
          }
        ];
        
        setPosts(mockPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchPosts();
    }
  }, [isOpen]);

  const categories = ['all', 'Support', 'Motivation', 'Resources', 'Success Stories', 'Questions'];

  const handleSubmitPost = async () => {
    if (!newPost.trim()) return;

    try {
      // TODO: Backend integration with FastAPI
      // const response = await fetch('/api/community/posts', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${userToken}`
      //   },
      //   body: JSON.stringify({
      //     content: newPost,
      //     category: selectedCategory === 'all' ? 'General' : selectedCategory,
      //     isAnonymous
      //   })
      // });

      // Mock implementation
      const mockPost: Post = {
        id: Date.now().toString(),
        author: {
          name: isAnonymous ? 'Anonymous User' : 'You',
          avatar: isAnonymous ? '' : 'Y',
          isVerified: false
        },
        content: newPost,
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        isLiked: false,
        category: selectedCategory === 'all' ? 'General' : selectedCategory,
        isAnonymous
      };

      setPosts(prev => [mockPost, ...prev]);
      setNewPost("");
    } catch (error) {
      console.error('Error posting:', error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      // TODO: Backend integration with FastAPI
      // const response = await fetch(`/api/community/posts/${postId}/like`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${userToken}` }
      // });

      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-medium">Community</h2>
              <p className="text-sm text-muted-foreground">Connect with others on similar journeys</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Post Creation */}
        <div className="p-6 border-b border-border">
          <div className="space-y-4">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your thoughts, experiences, or ask for support..."
              className="w-full p-4 bg-muted rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded"
                  />
                  Post anonymously
                </label>
              </div>
              <button
                onClick={handleSubmitPost}
                disabled={!newPost.trim()}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="px-6 py-3 border-b border-border">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {category === 'all' ? 'All Posts' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm">
                        {post.author.avatar || '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{post.author.name}</span>
                          {post.author.isVerified && (
                            <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {post.timestamp.toLocaleDateString()} • {post.category}
                        </span>
                      </div>
                    </div>
                    <button className="w-6 h-6 rounded-full hover:bg-muted flex items-center justify-center">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <p className="text-sm mb-4 leading-relaxed">{post.content}</p>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        post.isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      {post.comments}
                    </button>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 className="h-4 w-4" />
                      Share
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