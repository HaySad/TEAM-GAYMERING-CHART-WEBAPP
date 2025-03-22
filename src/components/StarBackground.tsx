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
      star.style.left = `${Math.random() * 100}vw`;
      
      // Random size between 2px and 6px
      const size = Math.random() * 4 + 2;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random duration between 2s and 4s
      const duration = Math.random() * 2 + 2;
      const delay = Math.random() * 2;
      star.style.setProperty('--duration', `${duration}s`);
      star.style.setProperty('--delay', `${delay}s`);

      container.appendChild(star);

      // Remove star after animation
      setTimeout(() => {
        if (star.parentNode === container) {
          star.remove();
        }
      }, (duration + delay) * 1000);
    };

    // Create initial stars
    for (let i = 0; i < 50; i++) {
      createStar();
    }

    // Create new stars continuously
    const interval = setInterval(() => {
      if (container.children.length < 100) {  // Limit maximum stars
        createStar();
      }
    }, 100);

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