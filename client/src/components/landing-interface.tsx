import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import PersonaSelector from "./persona-selector";

interface LandingInterfaceProps {
  onStartChat: () => void;
  selectedPersona: "judas" | "heavens-fang";
  onPersonaChange: (persona: "judas" | "heavens-fang") => void;
}

export default function LandingInterface({ onStartChat, selectedPersona, onPersonaChange }: LandingInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);

  const suggestions = [
    "I see through your pretenses.",
    "Every choice reveals your nature.",
    "Your patterns are predictable.",
    "Truth lies in your hesitation.",
    "Psychology is my weapon.",
    "You cannot hide from analysis."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestionIndex((prev) => (prev + 3) % suggestions.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [suggestions.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onStartChat();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Create mystical particles
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement("div");
      particle.className = "absolute w-1 h-1 bg-yellow-400 rounded-full opacity-20 animate-float pointer-events-none";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.animationDuration = Math.random() * 3 + 4 + "s";
      particle.style.animationDelay = Math.random() * 2 + "s";

      document.body.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 8000);
    };

    const interval = setInterval(createParticle, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      {/* Mystical Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-3/4 right-1/3 w-1 h-1 bg-yellow-400 rounded-full"
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full"
          animate={{ opacity: [0.25, 0.75, 0.25] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Brand Identity */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mystical-gradient mb-4 tracking-tight">
            {selectedPersona === "heavens-fang" ? "Heaven's Fang" : "Judas"}
          </h1>
        </motion.div>

        {/* Persona Selector */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <PersonaSelector 
            selectedPersona={selectedPersona} 
            onPersonaChange={onPersonaChange}
          />
        </motion.div>

        {/* Central Input Field */}
        <motion.form
          onSubmit={handleSubmit}
          className="relative mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <div className="relative group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What do you seek to refine?"
              className="w-full px-8 py-6 text-lg backdrop-divine border border-yellow-400/30 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/10 transition-all duration-300 group-hover:border-yellow-400/50"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>

          {/* Animated Submit Indicator */}
          <motion.button
            type="submit"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200 divine-glow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{ boxShadow: ["0 0 20px rgba(212, 175, 55, 0.3)", "0 0 30px rgba(212, 175, 55, 0.5)", "0 0 20px rgba(212, 175, 55, 0.3)"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Send className="w-4 h-4 text-gray-900" />
          </motion.button>
        </motion.form>

        {/* Whispered Suggestions */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="text-yellow-400/60 text-sm font-light italic hover:text-yellow-400/80 transition-colors duration-300 cursor-default"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
              whileHover={{ x: 10 }}
            >
              "{suggestions[(currentSuggestionIndex + index) % suggestions.length]}"
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}