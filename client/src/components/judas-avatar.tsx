export default function JudasAvatar({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`${className} rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center relative overflow-hidden`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background */}
        <circle cx="50" cy="50" r="50" fill="url(#judasGradient)" />
        
        {/* Face shape */}
        <ellipse cx="50" cy="45" rx="25" ry="30" fill="#2d1810" opacity="0.9" />
        
        {/* Eyes */}
        <circle cx="42" cy="40" r="2" fill="#fbbf24" opacity="0.8" />
        <circle cx="58" cy="40" r="2" fill="#fbbf24" opacity="0.8" />
        
        {/* Eye pupils */}
        <circle cx="42" cy="40" r="1" fill="#1f2937" />
        <circle cx="58" cy="40" r="1" fill="#1f2937" />
        
        {/* Nose */}
        <path d="M50 45 L52 50 L50 52 L48 50 Z" fill="#1f2937" opacity="0.6" />
        
        {/* Mouth - slight smirk */}
        <path d="M45 55 Q50 58 55 55" stroke="#1f2937" strokeWidth="1.5" fill="none" opacity="0.7" />
        
        {/* Hair/head covering */}
        <path d="M25 35 Q25 20 50 20 Q75 20 75 35 Q75 25 70 30 Q65 25 60 28 Q55 22 50 25 Q45 22 40 28 Q35 25 30 30 Q25 25 25 35 Z" 
              fill="#4b5563" opacity="0.8" />
        
        {/* Facial hair */}
        <path d="M45 52 Q50 55 55 52 Q55 58 50 60 Q45 58 45 52" fill="#374151" opacity="0.6" />
        
        <defs>
          <radialGradient id="judasGradient" cx="0.3" cy="0.3">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}