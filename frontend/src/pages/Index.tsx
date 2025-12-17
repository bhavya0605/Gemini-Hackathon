import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Landing from "@/components/Landing";
import ChatInterface from "@/components/ChatInterface";
import EvaluationPage from "@/components/EvaluationPage";
import { Message, Evaluation } from "@/types/session";

const API_BASE = "http://localhost:8000";

type AppState = "landing" | "chat" | "evaluation";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("landing");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const { toast } = useToast();

  const startSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/session/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to start session");
      }

      const data = await response.json();
      setSessionId(data.session_id);
      setMessages([]);
      setAppState("chat");
    } catch (error) {
      console.error("Error starting session:", error);
      toast({
        title: "Connection Error",
        description: "Could not connect to the server. Make sure the backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!sessionId) return;

    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      const assistantMessage: Message = { role: "assistant", content: data.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Message Error",
        description: "Could not send message. Please try again.",
        variant: "destructive",
      });
      // Remove the user message if we couldn't get a response
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const endTeaching = async () => {
    if (!sessionId) return;

    setIsEnding(true);
    try {
      const response = await fetch(
        `${API_BASE}/session/end_teaching?session_id=${sessionId}`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Failed to end teaching session");
      }

      const data = await response.json();
      setEvaluation(data);
      setAppState("evaluation");
    } catch (error) {
      console.error("Error ending session:", error);
      toast({
        title: "Evaluation Error",
        description: "Could not get evaluation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnding(false);
    }
  };

  const startNew = () => {
    setSessionId(null);
    setMessages([]);
    setEvaluation(null);
    setAppState("landing");
  };

  return (
    <>
      {appState === "landing" && (
        <Landing onStartTeaching={startSession} isLoading={isLoading} />
      )}
      {appState === "chat" && (
        <ChatInterface
          messages={messages}
          onSendMessage={sendMessage}
          onEndTeaching={endTeaching}
          isLoading={isLoading}
          isEnding={isEnding}
        />
      )}
      {appState === "evaluation" && evaluation && (
        <EvaluationPage evaluation={evaluation} onStartNew={startNew} />
      )}
    </>
  );
};

export default Index;
