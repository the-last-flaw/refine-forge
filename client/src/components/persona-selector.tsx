import { motion } from "framer-motion";

interface PersonaSelectorProps {
  selectedPersona: "judas" | "heavens-fang";
  onPersonaChange: (persona: "judas" | "heavens-fang") => void;
}

export default function PersonaSelector({ selectedPersona, onPersonaChange }: PersonaSelectorProps) {
  return (
    <div className="flex flex-col items-center space-y-4 mb-8">
      <h3 className="text-lg font-semibold text-gray-300 mb-2">Choose Your Guide</h3>
      <div className="flex space-x-4">
        <motion.button
          onClick={() => onPersonaChange("judas")}
          className={`px-6 py-3 rounded-xl border-2 transition-all duration-300 ${
            selectedPersona === "judas"
              ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
              : "border-gray-600 bg-gray-800/50 text-gray-400 hover:border-yellow-400/50 hover:text-yellow-400/80"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-center">
            <div className="font-bold text-lg">Judas</div>
            <div className="text-xs opacity-80">Strategic Guidance</div>
          </div>
        </motion.button>

        <motion.button
          onClick={() => onPersonaChange("heavens-fang")}
          className={`px-6 py-3 rounded-xl border-2 transition-all duration-300 ${
            selectedPersona === "heavens-fang"
              ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
              : "border-gray-600 bg-gray-800/50 text-gray-400 hover:border-yellow-400/50 hover:text-yellow-400/80"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-center">
            <div className="font-bold text-lg">Heaven's Fang</div>
            <div className="text-xs opacity-80">Psychological Analysis</div>
          </div>
        </motion.button>
      </div>
    </div>
  );
}