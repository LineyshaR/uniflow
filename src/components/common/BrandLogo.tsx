import React from 'react';
import { CollegeEmblem } from './CollegeEmblem';

export interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  themeOverride?: 'light' | 'dark' | 'auto';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  subtitle = 'CKPCET • Surat',
  className = '',
  orientation = 'horizontal',
  themeOverride = 'auto'
}) => {
  const emblemSizes = {
    xs: 'xs' as const,
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const,
    xl: 'xl' as const
  };

  const titleSizes = {
    xs: 'text-sm font-semibold tracking-tight',
    sm: 'text-base font-bold tracking-tight',
    md: 'text-lg font-bold tracking-tight',
    lg: 'text-2xl sm:text-3xl font-extrabold tracking-tight',
    xl: 'text-3xl sm:text-4xl font-extrabold tracking-tight'
  }[size];

  const subSizes = {
    xs: 'text-[8px]',
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm'
  }[size];

  const textColorClass = themeOverride === 'light'
    ? 'text-[#047857]'
    : themeOverride === 'dark'
    ? 'text-[#FFFFFF]'
    : 'text-[#047857] dark:text-[#F3F7F5]';

  const subColorClass = themeOverride === 'light'
    ? 'text-[#526059]'
    : themeOverride === 'dark'
    ? 'text-[#A7F3D0]'
    : 'text-[#526059] dark:text-[#94A3B8]';

  return (
    <div 
      className={`inline-flex ${
        orientation === 'vertical' 
          ? 'flex-col items-center text-center gap-2.5' 
          : 'items-center gap-2.5 sm:gap-3 text-left'
      } ${className}`}
    >
      {/* Provided Image next to brand name */}
      <CollegeEmblem 
        size={emblemSizes[size]} 
        className="shrink-0 ring-1.5 ring-[#047857]/20 dark:ring-white/20 shadow-xs transition-transform duration-300 hover:scale-105" 
      />
      
      {/* Apple-style Brand Name Typography */}
      <div className="min-w-0 flex flex-col justify-center">
        <div className={`font-apple leading-none ${titleSizes} ${textColorClass}`}>
          UniFlow
        </div>
        {showSubtitle && (
          <div className={`tracking-normal font-medium truncate mt-0.5 ${subSizes} ${subColorClass}`}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
