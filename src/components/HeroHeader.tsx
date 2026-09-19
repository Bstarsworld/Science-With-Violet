import React from 'react';
import { AnimatedScienceTitle } from './AnimatedScienceTitle';

interface HeroHeaderProps {
  onRibbonClick?: () => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = () => {
  return (
    <div className="relative z-20 flex flex-col items-center justify-center text-center pointer-events-none select-none px-2 sm:px-4 pt-0.5 sm:pt-1">
      {/* Handcrafted Animated Science Letter Artwork Title based on illustration */}
      <AnimatedScienceTitle />
    </div>
  );
};

