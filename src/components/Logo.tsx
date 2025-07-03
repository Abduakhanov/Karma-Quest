import React from 'react';
import { Star } from 'lucide-react';

interface LogoProps {
  onClick?: () => void;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ 
  onClick, 
  className = '', 
  showText = true, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const baseClasses = `flex items-center space-x-2 ${className}`;
  const interactiveClasses = onClick 
    ? 'cursor-pointer hover:opacity-80 transition-opacity p-2 -m-2 rounded-lg hover:bg-gray-50' 
    : '';

  const content = (
    <>
      <div className={`${iconSizes[size]} text-purple-600`}>
        <Star className="w-full h-full" />
      </div>
      {showText && (
        <span className={`${sizeClasses[size]} font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent tracking-wide`}>
          KarmaQuest
        </span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${interactiveClasses}`}
        aria-label="KarmaQuest - Home"
        type="button"
      >
        {content}
      </button>
    );
  }

  return (
    <div className={baseClasses}>
      {content}
    </div>
  );
};

export default Logo;