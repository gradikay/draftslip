interface WatercolorLogoProps {
  className?: string;
}

const WatercolorLogo = ({ className = "" }: WatercolorLogoProps) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8fbad1" />
          <stop offset="100%" stopColor="#3978a8" />
        </linearGradient>
        <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8d78b" />
          <stop offset="100%" stopColor="#f8c056" />
        </linearGradient>
      </defs>
      
      {/* Blue flower petals */}
      <path 
        d="M60,35 C65,20 80,25 75,40 C90,35 85,50 70,45 C75,60 60,65 55,50 C40,55 45,35 60,35 Z" 
        fill="url(#blueGradient)" 
        opacity="0.9"
      />
      
      {/* Yellow flower petals */}
      <path 
        d="M30,50 C35,35 45,45 40,55 C55,50 50,65 35,60 C40,75 25,70 30,55 C15,60 25,45 30,50 Z" 
        fill="url(#yellowGradient)" 
        opacity="0.9"
      />
      
      {/* Butterfly accent */}
      <path 
        d="M75,25 C80,20 85,20 85,25 C85,30 75,35 75,25 Z" 
        fill="url(#blueGradient)" 
      />
      <path 
        d="M85,25 C90,20 95,20 95,25 C95,30 85,35 85,25 Z" 
        fill="url(#yellowGradient)" 
      />
      <path d="M85,25 L85,30" stroke="#333" strokeWidth="0.5" />
    </svg>
  );
};

export default WatercolorLogo;
