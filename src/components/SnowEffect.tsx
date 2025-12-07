import React from 'react';

const SnowEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {Array.from({ length: 35 }).map((_, i) => {
        // Bigger snowflakes: 4-7px (was 2-5px)
        const size = Math.random() * 3 + 4;
        const delay = Math.random() * 2;
        const duration = Math.random() * 15 + 20;
        const startX = Math.random() * 100;
        const startY = Math.random() * -100;
        // More prominent but not distracting: opacity 0.25-0.45 (was 0.15-0.35)
        const opacity = Math.random() * 0.2 + 0.25;
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${startX}%`,
              top: `${startY}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: `rgba(255, 255, 255, ${opacity})`,
              boxShadow: `0 0 ${size * 1.2}px var(--accent-glow)`,
              animation: `snow-fall ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
              filter: 'blur(0.6px)' // Slightly less blur for more prominence
            }}
          />
        );
      })}
    </div>
  );
};

export default SnowEffect;

