import { Button } from "@/components/ui/button";
import { Evaluation } from "@/types/session";
import { 
  Trophy, 
  ThumbsUp, 
  AlertCircle, 
  Lightbulb, 
  HelpCircle,
  RotateCcw,
  Star
} from "lucide-react";

interface EvaluationPageProps {
  evaluation: Evaluation;
  onStartNew: () => void;
}

const EvaluationPage = ({ evaluation, onStartNew }: EvaluationPageProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-accent";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent!";
    if (score >= 80) return "Great Job!";
    if (score >= 70) return "Good Work!";
    if (score >= 60) return "Nice Try!";
    return "Keep Practicing!";
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent/10 mb-6">
            <Trophy className="w-10 h-10 text-accent" />
          </div>
          <h1 className="font-display text-4xl font-bold mb-2">Teaching Complete!</h1>
          <p className="text-muted-foreground">Here's how you did as a teacher</p>
        </div>

        {/* Score Card */}
        <div 
          className="bg-card rounded-2xl shadow-card p-8 mb-6 text-center border border-border/50 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-6 h-6 ${i < Math.floor(evaluation.score / 20) ? "text-accent fill-accent" : "text-muted"}`}
              />
            ))}
          </div>
          <div className={`font-display text-7xl font-bold mb-2 ${getScoreColor(evaluation.score)}`}>
            {evaluation.score}
          </div>
          <p className="text-lg font-medium">{getScoreLabel(evaluation.score)}</p>
        </div>

        {/* Evaluation Sections */}
        <div className="space-y-4">
          {/* Strengths */}
          <EvaluationSection
            icon={<ThumbsUp className="w-5 h-5" />}
            title="Strengths"
            items={evaluation.strengths}
            variant="success"
            delay="0.2s"
          />

          {/* Weaknesses */}
          <EvaluationSection
            icon={<AlertCircle className="w-5 h-5" />}
            title="Areas for Improvement"
            items={evaluation.weaknesses}
            variant="warning"
            delay="0.3s"
          />

          {/* Suggestions */}
          <EvaluationSection
            icon={<Lightbulb className="w-5 h-5" />}
            title="Suggestions"
            items={evaluation.suggestions}
            variant="info"
            delay="0.4s"
          />

          {/* Follow-up Questions */}
          <EvaluationSection
            icon={<HelpCircle className="w-5 h-5" />}
            title="Questions to Explore"
            items={evaluation.follow_up_questions}
            variant="default"
            delay="0.5s"
          />
        </div>

        {/* Action Button */}
        <div 
          className="mt-10 text-center opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <Button variant="hero" size="xl" onClick={onStartNew}>
            <RotateCcw className="w-5 h-5" />
            Teach Again
          </Button>
        </div>
      </div>
    </div>
  );
};

interface EvaluationSectionProps {
  icon: React.ReactNode;
  title: string;
  items: string[];
  variant: "success" | "warning" | "info" | "default";
  delay: string;
}

const EvaluationSection = ({ icon, title, items, variant, delay }: EvaluationSectionProps) => {
  const variantStyles = {
    success: "bg-success/5 border-success/20",
    warning: "bg-accent/5 border-accent/20",
    info: "bg-primary/5 border-primary/20",
    default: "bg-muted border-border/50",
  };

  const iconStyles = {
    success: "bg-success/10 text-success",
    warning: "bg-accent/10 text-accent",
    info: "bg-primary/10 text-primary",
    default: "bg-muted-foreground/10 text-muted-foreground",
  };

  if (!items || items.length === 0) return null;

  return (
    <div 
      className={`rounded-xl border p-5 opacity-0 animate-fade-in-up ${variantStyles[variant]}`}
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconStyles[variant]}`}>
          {icon}
        </div>
        <h3 className="font-display font-semibold text-lg">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-2 flex-shrink-0" />
            <span className="text-sm text-foreground/80">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EvaluationPage;
