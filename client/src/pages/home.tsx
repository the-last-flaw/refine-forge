import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LandingInterface from "../components/landing-interface";
import ChatInterface from "../components/chat-interface";

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "chat">("landing");

  const handleStartChat = () => {
    setCurrentView("chat");
  };

  const handleNewSession = () => {
    setCurrentView("landing");
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {currentView === "landing" ? (
          <motion.div
            key="landing"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100vh" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <LandingInterface onStartChat={handleStartChat} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: "100vh" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <ChatInterface onNewSession={handleNewSession} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
