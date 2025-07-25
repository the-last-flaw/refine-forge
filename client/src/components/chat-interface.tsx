import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, RotateCcw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ChatMessage } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ChatInterfaceProps {
  onNewSession: () => void;
  selectedPersona: "judas" | "heavens-fang";
}

export default function ChatInterface({ onNewSession, selectedPersona }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/messages"],
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/messages", { message, persona: selectedPersona });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setInputValue("");
      setIsTyping(false);
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsTyping(false);
    },
  });

  // Clear messages mutation
  const clearMessagesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/messages");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      onNewSession();
    },
    onError: (error) => {
      console.error("Error clearing messages:", error);
      toast({
        title: "Error",
        description: "Failed to start new session. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [inputValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !sendMessageMutation.isPending) {
      setIsTyping(true);
      sendMessageMutation.mutate(inputValue.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleNewSession = () => {
    clearMessagesMutation.mutate();
  };

  // Auto-typing effect component
  const TypewriterText = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, 30);
        return () => clearTimeout(timeout);
      } else if (currentIndex === text.length && !isComplete) {
        setIsComplete(true);
      }
    }, [currentIndex, text, isComplete]);

    useEffect(() => {
      // Reset when text changes
      setDisplayedText("");
      setCurrentIndex(0);
      setIsComplete(false);
    }, [text]);

    return (
      <span className="relative">
        {displayedText}
        {!isComplete && (
          <span className="animate-pulse ml-1">|</span>
        )}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-yellow-400/20 bg-gray-900/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-100">
                {selectedPersona === "heavens-fang" ? "Heaven's Fang" : "Judas"}
              </h2>
              <p className="text-xs text-gray-400">
                {selectedPersona === "heavens-fang" ? "Psychological Analysis" : "Strategic Guidance"}
              </p>
            </div>
          </div>
          <button
            onClick={handleNewSession}
            disabled={clearMessagesMutation.isPending}
            className="px-4 py-2 text-sm border border-yellow-400/30 rounded-lg text-yellow-400 hover:bg-yellow-400/10 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Session</span>
          </button>
        </div>
      </header>

      {/* Chat Messages Container */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
            </div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "user" ? (
                  <div className="max-w-lg backdrop-divine border border-yellow-400/30 rounded-2xl px-6 py-4">
                    <p className="text-gray-100">{message.content}</p>
                  </div>
                ) : (
                  <div className="max-w-2xl">
                    <div className="flex items-start space-x-3">
                      <motion.div
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex-shrink-0 mt-1"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <div className="backdrop-divine border border-gray-300/10 rounded-2xl px-6 py-4">
                        <div className="text-gray-100 leading-relaxed">
                          {index === messages.length - 1 && message.role === "assistant" ? (
                            <TypewriterText text={message.content} />
                          ) : (
                            message.content
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}

          {/* Thinking Indicator */}
          {(isTyping || sendMessageMutation.isPending) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3">
                <motion.div
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex-shrink-0 mt-1"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="backdrop-divine border border-gray-300/10 rounded-2xl px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <motion.div
                        className="w-2 h-2 bg-yellow-400 rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-yellow-400 rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-yellow-400 rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                      />
                    </div>
                    <span className="text-gray-400 text-sm">
                      {selectedPersona === "heavens-fang" 
                        ? "Analyzing psychological patterns..." 
                        : "Calculating optimal path..."
                      }
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="border-t border-yellow-400/20 bg-gray-900/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Seek guidance..."
              className="w-full px-6 py-4 pr-16 backdrop-divine border border-yellow-400/30 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-400 resize-none transition-all duration-300 min-h-[60px] max-h-[200px]"
              rows={1}
              disabled={sendMessageMutation.isPending}
            />
            <motion.button
              type="submit"
              disabled={!inputValue.trim() || sendMessageMutation.isPending}
              className="absolute right-3 bottom-3 w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center hover:scale-105 transition-transform duration-200 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </form>
        </div>
      </footer>
    </div>
  );
}