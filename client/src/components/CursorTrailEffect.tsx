import { useEffect, useState } from 'react';

interface TrailParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  id: number;
}

export default function CursorTrailEffect() {
  const [particles, setParticles] = useState<TrailParticle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    // Only track mouse inside templates container
    const container = document.querySelector('.templates-container');
    
    if (!container) return;
    
    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = container.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;
      
      setMousePosition({ x, y });
      setIsActive(true);
      
      // Add a new particle
      const newParticle = {
        x,
        y,
        size: Math.random() * 15 + 5, // Random size between 5-20px
        opacity: Math.random() * 0.5 + 0.3, // Random opacity between 0.3-0.8
        id: Date.now()
      };
      
      setParticles(prev => [...prev, newParticle]);
    };
    
    const handleMouseLeave = () => {
      setIsActive(false);
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  // Animate and remove particles
  useEffect(() => {
    if (particles.length === 0) return;
    
    const timer = setTimeout(() => {
      setParticles(prev => prev.slice(Math.max(prev.length - 10, 0))); // Keep only last 10 particles
    }, 100);
    
    return () => clearTimeout(timer);
  }, [particles]);
  
  // If mouse isn't moving in container, don't render anything
  if (!isActive) return null;
  
  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full mix-blend-screen pointer-events-none z-10"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            background: `radial-gradient(circle, var(--primary-color) 0%, var(--accent-color) 100%)`,
            filter: 'blur(2px)',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </>
  );
}