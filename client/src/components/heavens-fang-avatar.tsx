export default function HeavensFangAvatar({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`${className} rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center relative overflow-hidden`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background */}
        <circle cx="50" cy="50" r="50" fill="url(#adamGradient)" />
        
        {/* Face shape */}
        <ellipse cx="50" cy="45" rx="24" ry="28" fill="#f3e8d0" opacity="0.95" />
        
        {/* Eyes - more piercing */}
        <ellipse cx="43" cy="39" rx="3" ry="2" fill="#1f2937" />
        <ellipse cx="57" cy="39" rx="3" ry="2" fill="#1f2937" />
        
        {/* Eye pupils with mystical glow */}
        <circle cx="43" cy="39" r="1.5" fill="#fbbf24" opacity="0.9" />
        <circle cx="57" cy="39" r="1.5" fill="#fbbf24" opacity="0.9" />
        
        {/* Third eye symbol on forehead */}
        <circle cx="50" cy="32" r="2" fill="none" stroke="#d97706" strokeWidth="1" opacity="0.7" />
        <circle cx="50" cy="32" r="1" fill="#fbbf24" opacity="0.6" />
        
        {/* Nose */}
        <path d="M50 44 L51 49 L50 51 L49 49 Z" fill="#d4a574" opacity="0.8" />
        
        {/* Mouth - neutral, calculating */}
        <line x1="47" y1="54" x2="53" y2="54" stroke="#8b7355" strokeWidth="1.5" opacity="0.8" />
        
        {/* Hair - elegant, swept back */}
        <path d="M26 38 Q30 18 50 16 Q70 18 74 38 Q72 22 68 26 Q64 20 58 24 Q54 18 50 20 Q46 18 42 24 Q36 20 32 26 Q28 22 26 38 Z" 
              fill="#8b4513" opacity="0.9" />
        
        {/* Jawline definition */}
        <path d="M32 50 Q40 58 50 60 Q60 58 68 50" stroke="#d4a574" strokeWidth="0.5" fill="none" opacity="0.5" />
        
        {/* Mystical aura lines */}
        <path d="M20 30 L25 32" stroke="#fbbf24" strokeWidth="1" opacity="0.4" />
        <path d="M80 30 L75 32" stroke="#fbbf24" strokeWidth="1" opacity="0.4" />
        <path d="M25 70 L30 68" stroke="#fbbf24" strokeWidth="1" opacity="0.4" />
        <path d="M75 70 L70 68" stroke="#fbbf24" strokeWidth="1" opacity="0.4" />
        
        <defs>
          <radialGradient id="adamGradient" cx="0.3" cy="0.3">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}