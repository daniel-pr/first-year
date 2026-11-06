import React, { useEffect, useState } from 'react';

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

export const HeartParticles: React.FC = () => {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    const colors = ['#e8a5b3', '#ffdada', '#d4af37', '#ca7379', '#4a0e17'];
    const initialHearts: FloatingHeart[] = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      x: Math.random() * 95,
      y: 100 + Math.random() * 20,
      size: 14 + Math.random() * 16,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 10 + Math.random() * 12,
      delay: Math.random() * 8,
    }));

    setHearts(initialHearts);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-10 select-none opacity-40"
    >
      {hearts.map((h) => (
        <svg
          key={h.id}
          viewBox="0 0 24 24"
          fill={h.color}
          style={{
            position: 'absolute',
            left: `${h.x}%`,
            bottom: '-40px',
            width: `${h.size}px`,
            height: `${h.size}px`,
            animation: `floatUpward ${h.duration}s ease-in infinite`,
            animationDelay: `${h.delay}s`,
          }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ))}

      <style>{`
        @keyframes floatUpward {
          0% {
            transform: translateY(0) scale(0.8) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-110vh) scale(1.2) rotate(35deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
