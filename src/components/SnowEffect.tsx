import React from 'react';

const SnowEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {Array.from({ length: 30 }).map((_, i) => {
        const size = Math.random() * 3 + 2;
        const delay = Math.random() * 2; // Reduced from 5 to 2 seconds max
        const duration = Math.random() * 15 + 20;
        const startX = Math.random() * 100;
        const startY = Math.random() * -100; // Start from different heights
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${startX}%`,
              top: `${startY}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.15})`,
              boxShadow: `0 0 ${size * 0.8}px rgba(135, 206, 235, 0.3)`,
              animation: `snow-fall ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
              filter: 'blur(0.8px)'
            }}
          />
        );
      })}
    </div>
  );
};

export default SnowEffect;

