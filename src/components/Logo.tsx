import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} bg-primary rounded-lg flex items-center justify-center relative overflow-hidden`}>
        {/* Home icon */}
        <svg className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-7 h-7'} text-white`} viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 2L12 5V13H10V7H6V13H4V5L8 2Z"/>
          <rect x="7" y="9" width="2" height="1.5" rx="0.5"/>
          <path d="M7.5 9V7.5C7.5 7.2 7.7 7 8 7C8.3 7 8.5 7.2 8.5 7.5V9" stroke="currentColor" strokeWidth="0.5" fill="none"/>
        </svg>
        
        {/* Flow indicators */}
        <div className="absolute -left-1 top-1/2 transform -translate-y-1/2">
          <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
          <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        {/* Security glow effect */}
        <div className="absolute inset-0 bg-primary/20 rounded-lg animate-pulse"></div>
      </div>
      
      {showText && (
        <span className={`font-bold text-foreground ${textSizes[size]}`}>
          Secure Homeward Flow
        </span>
      )}
    </div>
  );
};

export default Logo;
