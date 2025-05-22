import React, { useEffect, useRef } from 'react';
import { TemplateCard } from './TemplateCard';

export default function TemplatesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    const trail = trailRef.current;
    
    if (!container || !trail) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      
      // Calculate position relative to container
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update trail position
      trail.style.left = `${x}px`;
      trail.style.top = `${y}px`;
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-primary mb-4 animated-title">
        <span className="title-letter" style={{"--letter-index": 1} as React.CSSProperties}>I</span>
        <span className="title-letter" style={{"--letter-index": 2} as React.CSSProperties}>n</span>
        <span className="title-letter" style={{"--letter-index": 3} as React.CSSProperties}>v</span>
        <span className="title-letter" style={{"--letter-index": 4} as React.CSSProperties}>o</span>
        <span className="title-letter" style={{"--letter-index": 5} as React.CSSProperties}>i</span>
        <span className="title-letter" style={{"--letter-index": 6} as React.CSSProperties}>c</span>
        <span className="title-letter" style={{"--letter-index": 7} as React.CSSProperties}>e</span>
        <span className="title-letter" style={{"--letter-index": 8} as React.CSSProperties}>&nbsp;</span>
        <span className="title-letter" style={{"--letter-index": 9} as React.CSSProperties}>T</span>
        <span className="title-letter" style={{"--letter-index": 10} as React.CSSProperties}>e</span>
        <span className="title-letter" style={{"--letter-index": 11} as React.CSSProperties}>m</span>
        <span className="title-letter" style={{"--letter-index": 12} as React.CSSProperties}>p</span>
        <span className="title-letter" style={{"--letter-index": 13} as React.CSSProperties}>l</span>
        <span className="title-letter" style={{"--letter-index": 14} as React.CSSProperties}>a</span>
        <span className="title-letter" style={{"--letter-index": 15} as React.CSSProperties}>t</span>
        <span className="title-letter" style={{"--letter-index": 16} as React.CSSProperties}>e</span>
        <span className="floating-letter">s</span>
      </h1>
      
      <p className="text-gray-600 mb-6 text-sm">
        Choose from our specialized templates designed for different business needs.
        Each template comes with fields tailored to specific industries.
      </p>
      
      <div 
        ref={containerRef} 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 templates-container relative"
      >
        <div ref={trailRef} className="cursor-trail"></div>
        
        <TemplateCard 
          title="Freelance Invoice" 
          description="Perfect for freelancers, with project-based billing and payment terms."
          href="/templates/freelance"
          color="primary"
        />
        
        <TemplateCard 
          title="Consulting Services" 
          description="Detailed invoice for consultants with hourly rates and service descriptions."
          href="/templates/consulting"
          color="secondary"
        />
        
        <TemplateCard 
          title="Retail Business" 
          description="Retail-focused invoice with product details, quantities, and customer information."
          href="/templates/retail"
          color="accent"
        />

        <TemplateCard 
          title="Agency Services" 
          description="For marketing and creative agencies with project details and service categories."
          href="/templates/agency"
          color="primary"
        />
        
        <TemplateCard 
          title="Construction & Contracting" 
          description="For builders and contractors with materials, labor, and project phases."
          href="/templates/construction"
          color="secondary"
        />
        
        <TemplateCard 
          title="Medical & Healthcare" 
          description="For healthcare providers with patient details, insurance, and procedure codes."
          href="/templates/medical"
          color="accent"
        />
        
        <TemplateCard 
          title="Legal Services" 
          description="For attorneys and legal professionals with matter details and billing time entries."
          href="/templates/legal"
          color="primary"
        />
        
        <TemplateCard 
          title="Event Planning" 
          description="For event planners with venue, catering, and entertainment service details."
          href="/templates/event"
          color="secondary"
        />
        
        <TemplateCard 
          title="Photography/Videography" 
          description="For photographers with session details, deliverables, and usage rights."
          href="/templates/photography"
          color="accent"
        />
      </div>
    </div>
  );
}