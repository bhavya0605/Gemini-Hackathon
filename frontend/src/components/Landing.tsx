import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Sparkles, Target } from "lucide-react";

interface LandingProps {
  onStartTeaching: () => void;
  isLoading: boolean;
}

const Landing = ({ onStartTeaching, isLoading }: LandingProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Floating icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-8 animate-float">
            <Brain className="w-10 h-10 text-primary" />
          </div>

          {/* Main heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="text-gradient">Reverse Tutor</span>
          </h1>

          {/* Subtitle */}
          <p 
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            The best way to learn is to teach. Explain concepts to an AI student 
            and discover how well you truly understand them.
          </p>

          {/* CTA Button */}
          <div 
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button 
              variant="hero" 
              size="xl" 
              onClick={onStartTeaching}
              disabled={isLoading}
              className="min-w-[200px]"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Start Teaching
                </>
              )}
            </Button>
          </div>

          {/* Features grid */}
          <div 
            className="grid md:grid-cols-3 gap-6 mt-20 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <FeatureCard 
              icon={<BookOpen className="w-6 h-6" />}
              title="Teach Any Topic"
              description="Choose any subject you want to master through teaching"
            />
            <FeatureCard 
              icon={<Brain className="w-6 h-6" />}
              title="AI Student"
              description="An intelligent student that asks clarifying questions"
            />
            <FeatureCard 
              icon={<Target className="w-6 h-6" />}
              title="Get Evaluated"
              description="Receive detailed feedback on your teaching ability"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Learn better by teaching smarter</p>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="p-6 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default Landing;
