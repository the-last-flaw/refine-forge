import { useState, useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { Send, RotateCcw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ChatMessage } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import JudasAvatar from "./judas-avatar";
import HeavensFangAvatar from "./heavens-fang-avatar";

interface ChatInterfaceProps {
  onNewSession: () => void;
  selectedPersona: "judas" | "heavens-fang";
  onPersonaChange?: (persona: "judas" | "heavens-fang") => void;
}

export default function ChatInterface({ onNewSession, selectedPersona, onPersonaChange }: ChatInterfaceProps) {
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

  // Send greeting when first entering chat and no messages exist
  useEffect(() => {
    if (messages && messages.length === 0 && !sendMessageMutation.isPending && !isLoading) {
      sendMessageMutation.mutate("hello");
    }
  }, [messages, selectedPersona, isLoading]);

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

  // Get theme classes based on persona
  const getThemeClasses = () => {
    if (selectedPersona === "heavens-fang") {
      return {
        background: "bg-gray-50 dark:bg-gray-900",
        headerBg: "bg-white/90 dark:bg-gray-800/90",
        headerBorder: "border-blue-200 dark:border-blue-800",
        accent: "text-blue-600 dark:text-blue-400",
        accentBorder: "border-blue-300 dark:border-blue-600",
        accentHover: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
        messageBg: "bg-white dark:bg-gray-800",
        messageBorder: "border-blue-100 dark:border-blue-800",
        userMessageBg: "bg-blue-50 dark:bg-blue-900/20",
        userMessageBorder: "border-blue-200 dark:border-blue-700",
        text: "text-gray-900 dark:text-gray-100",
        mutedText: "text-gray-600 dark:text-gray-400",
        avatar: "from-blue-400 to-blue-600"
      };
    } else {
      return {
        background: "bg-gray-900",
        headerBg: "bg-gray-900/90",
        headerBorder: "border-red-800",
        accent: "text-red-400",
        accentBorder: "border-red-600",
        accentHover: "hover:bg-red-900/20",
        messageBg: "bg-gray-800",
        messageBorder: "border-red-800",
        userMessageBg: "bg-red-900/20",
        userMessageBorder: "border-red-700",
        text: "text-gray-100",
        mutedText: "text-gray-400",
        avatar: "from-red-400 to-red-600"
      };
    }
  };

  const theme = getThemeClasses();

  return (
    <div className={`min-h-screen flex flex-col ${theme.background}`}>
      {/* Header */}
      <header className={`border-b ${theme.headerBorder} ${theme.headerBg} backdrop-blur-sm sticky top-0 z-50`}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              {selectedPersona === "heavens-fang" ? (
                <HeavensFangAvatar className="w-8 h-8" />
              ) : (
                <JudasAvatar className="w-8 h-8" />
              )}
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${theme.text}`}>
                {selectedPersona === "heavens-fang" ? "Heaven's Fang" : "Judas"}
              </h2>
              <p className={`text-xs ${theme.mutedText}`}>
                {selectedPersona === "heavens-fang" ? "Psychological Analysis" : "Strategic Guidance"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {onPersonaChange && (
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => onPersonaChange("judas")}
                  className={`px-3 py-1 text-xs transition-colors duration-200 ${
                    selectedPersona === "judas"
                      ? "bg-red-500 text-white"
                      : `${theme.text} hover:bg-red-500/20`
                  }`}
                >
                  Judas
                </button>
                <button
                  onClick={() => onPersonaChange("heavens-fang")}
                  className={`px-3 py-1 text-xs transition-colors duration-200 ${
                    selectedPersona === "heavens-fang"
                      ? "bg-blue-500 text-white"
                      : `${theme.text} hover:bg-blue-500/20`
                  }`}
                >
                  Heaven's Fang
                </button>
              </div>
            )}
            <button
              onClick={handleNewSession}
              disabled={clearMessagesMutation.isPending}
              className={`px-4 py-2 text-sm border ${theme.accentBorder} rounded-lg ${theme.accent} ${theme.accentHover} transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>New Session</span>
            </button>
          </div>
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
                  <div className={`max-w-lg ${theme.userMessageBg} border ${theme.userMessageBorder} rounded-2xl px-6 py-4`}>
                    <p className={theme.text}>{message.content}</p>
                  </div>
                ) : (
                  <div className="max-w-2xl">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {selectedPersona === "heavens-fang" ? (
                          <HeavensFangAvatar className="w-8 h-8" />
                        ) : (
                          <JudasAvatar className="w-8 h-8" />
                        )}
                      </div>
                      <div className={`${theme.messageBg} border ${theme.messageBorder} rounded-2xl px-6 py-4`}>
                        <div className={`${theme.text} leading-relaxed`}>
                          {message.content}
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
                <div className="flex-shrink-0 mt-1">
                  {selectedPersona === "heavens-fang" ? (
                    <HeavensFangAvatar className="w-8 h-8" />
                  ) : (
                    <JudasAvatar className="w-8 h-8" />
                  )}
                </div>
                <div className={`${theme.messageBg} border ${theme.messageBorder} rounded-2xl px-6 py-4`}>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <motion.div
                        className={`w-2 h-2 rounded-full ${selectedPersona === "heavens-fang" ? "bg-blue-400" : "bg-red-400"}`}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div
                        className={`w-2 h-2 rounded-full ${selectedPersona === "heavens-fang" ? "bg-blue-400" : "bg-red-400"}`}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                      />
                      <motion.div
                        className={`w-2 h-2 rounded-full ${selectedPersona === "heavens-fang" ? "bg-blue-400" : "bg-red-400"}`}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                      />
                    </div>
                    <span className={`${theme.mutedText} text-sm`}>
                      {selectedPersona === "heavens-fang" 
                        ? "Analyzing..." 
                        : "Calculating..."
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
      <footer className={`border-t ${theme.headerBorder} ${theme.headerBg} backdrop-blur-sm`}>
        <div className="max-w-4xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedPersona === "heavens-fang" ? "Share your thoughts..." : "State your goal..."}
              className={`w-full px-6 py-4 pr-16 ${theme.messageBg} border ${theme.accentBorder} rounded-2xl ${theme.text} placeholder:${theme.mutedText} focus:outline-none focus:border-opacity-100 resize-none transition-all duration-300 min-h-[60px] max-h-[200px]`}
              rows={1}
              disabled={sendMessageMutation.isPending}
            />
            <motion.button
              type="submit"
              disabled={!inputValue.trim() || sendMessageMutation.isPending}
              className={`absolute right-3 bottom-3 w-10 h-10 bg-gradient-to-r ${theme.avatar} rounded-xl flex items-center justify-center hover:scale-105 transition-transform duration-200 text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
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