import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'avatar' | 'button';
  width?: string;
  height?: string;
  className?: string;
  lines?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  width = 'w-full',
  height = 'h-4',
  className = '',
  lines = 1
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';

  const variants = {
    text: `${height} ${width}`,
    card: 'h-48 w-full rounded-xl',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24 rounded-lg'
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variants[variant]} ${
              index === lines - 1 ? 'w-3/4' : ''
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
};

export default LoadingSkeleton;