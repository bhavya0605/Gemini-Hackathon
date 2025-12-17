import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, StopCircle, Loader2 } from "lucide-react";
import { Message } from "@/types/session";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onEndTeaching: () => void;
  isLoading: boolean;
  isEnding: boolean;
}

const ChatInterface = ({ 
  messages, 
  onSendMessage, 
  onEndTeaching, 
  isLoading,
  isEnding 
}: ChatInterfaceProps) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="text-xl">🎓</span>
          </div>
          <div>
            <h1 className="font-display font-semibold text-lg">Reverse Tutor</h1>
            <p className="text-xs text-muted-foreground">Teaching session in progress</p>
          </div>
        </div>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onEndTeaching}
          disabled={isEnding || messages.length < 2}
        >
          {isEnding ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Evaluating...
            </>
          ) : (
            <>
              <StopCircle className="w-4 h-4" />
              End Teaching
            </>
          )}
        </Button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <span className="text-3xl">👋</span>
              </div>
              <h2 className="font-display font-semibold text-xl mb-2">Welcome, Teacher!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start teaching any topic you want to master. I'm your curious student ready to learn!
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} index={index} />
          ))}

          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🤖</span>
              </div>
              <div className="bg-card rounded-2xl rounded-tl-sm px-4 py-3 shadow-card">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm px-4 md:px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Teach me something..."
                className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[52px] max-h-[200px]"
                rows={1}
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              size="icon" 
              className="h-[52px] w-[52px] rounded-xl"
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
  index: number;
}

const MessageBubble = ({ message, index }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div 
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""} opacity-0 ${isUser ? "animate-slide-in-right" : "animate-slide-in-left"}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? "bg-primary text-primary-foreground" : "bg-primary/10"
      }`}>
        <span className="text-sm">{isUser ? "👨‍🏫" : "🤖"}</span>
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-card ${
        isUser 
          ? "bg-primary text-primary-foreground rounded-tr-sm" 
          : "bg-card rounded-tl-sm"
      }`}>
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
};

export default ChatInterface;
