import React, { useEffect, useRef } from 'react';
import '../styles/StarBackground.css';

const StarBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createStar = () => {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      
      // Random size
      const size = Math.random() * 3 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random duration and delay
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 2;
      star.style.setProperty('--duration', `${duration}s`);
      star.style.setProperty('--delay', `${delay}s`);

      container.appendChild(star);

      // Remove star after animation
      setTimeout(() => {
        star.remove();
      }, (duration + delay) * 1000);
    };

    // Create initial stars
    for (let i = 0; i < 50; i++) {
      createStar();
    }

    // Create new stars periodically
    const interval = setInterval(() => {
      createStar();
    }, 200);

    return () => {
      clearInterval(interval);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return <div ref={containerRef} className="star-background" />;
};

export default StarBackground; 