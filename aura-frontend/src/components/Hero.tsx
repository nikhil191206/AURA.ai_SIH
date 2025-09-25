import { ChevronRight, Heart, Brain, Users } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-14 min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Your Mental Wellness Journey
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Professional support. Peaceful mind. Personal growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2"
              onClick={() => {
                // TODO: Backend integration with FastAPI
                // Redirect to login page or open login modal
                console.log('Login clicked');
              }}
            >
              Login
              <ChevronRight className="h-4 w-4" />
            </button>
            <button 
              className="border border-primary text-primary px-8 py-3 rounded-full hover:bg-primary/5 transition-colors"
              onClick={() => {
                // TODO: Backend integration with FastAPI
                // Redirect to signup page or open signup modal
                console.log('SignUp clicked');
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="aspect-[16/10] rounded-3xl bg-gradient-to-br from-green-100 via-pink-50 to-blue-100 shadow-2xl p-16 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-8 w-full max-w-2xl">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                  <Heart className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg mb-2">Compassionate Care</h3>
                <p className="text-sm text-muted-foreground">Empathetic support when you need it most</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
                  <Brain className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-lg mb-2">Mental Clarity</h3>
                <p className="text-sm text-muted-foreground">Tools for mindfulness and focus</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Users className="h-10 w-10 text-secondary" />
                </div>
                <h3 className="text-lg mb-2">Community</h3>
                <p className="text-sm text-muted-foreground">Connect with others on similar journeys</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}