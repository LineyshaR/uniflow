import React, { useState } from 'react';
import emblemImg from '../../assets/images/ckpcet_emblem_1791016044460.jpg';

interface CollegeEmblemProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const CollegeEmblem: React.FC<CollegeEmblemProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  }[size];

  if (hasError) {
    // Pure vector SVG fallback of C.K. Pithawala College Emblem
    return (
      <div 
        className={`${sizeClasses} ${className} rounded-full bg-white p-0.5 ring-1.5 ring-[#047857]/30 dark:ring-white/30 shadow-xs shrink-0 flex items-center justify-center overflow-hidden`}
        title="C.K. Pithawala College of Engineering & Technology"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="47" fill="#fff" stroke="#047857" strokeWidth="3" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="#047857" strokeWidth="1.5" />
          {/* Diya */}
          <ellipse cx="50" cy="54" rx="8" ry="4" fill="#047857" />
          <path d="M50 44 Q52 48 50 51 Q48 48 50 44 Z" fill="#10B981" />
          {/* Cog teeth indication */}
          <path d="M50 15 L50 22 M50 78 L50 85 M15 50 L22 50 M78 50 L85 50" stroke="#047857" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={emblemImg}
      alt="C.K. Pithawala College of Engineering and Technology Emblem"
      onError={() => setHasError(true)}
      className={`${sizeClasses} ${className} rounded-full object-cover bg-white ring-1.5 ring-[#047857]/30 dark:ring-white/30 shadow-xs shrink-0`}
    />
  );
};
