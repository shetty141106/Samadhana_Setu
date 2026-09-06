import React from 'react';

export const SamadhanLogo = ({ className = '', size = 'md', isDark = false }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-14'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Brand Icon */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 44 44"
          className={`${sizeClasses[size] || 'h-10'} w-auto aspect-square flex-shrink-0 drop-shadow-sm`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="44" height="44" rx="10" fill={isDark ? '#1B5E3B' : '#0B3D2E'} />
          {/* Bridge arch */}
          <path d="M8 32C14 20 30 20 36 32" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M11 32C17 23 27 23 33 32" stroke="#E07A3D" strokeWidth="1.75" strokeLinecap="round" />
          {/* Leaf representing green Jharkhand */}
          <path d="M22 10C22 10 31 16 31 24C31 28.5 27 32 22 32C17 32 13 28.5 13 24C13 16 22 10 22 10Z" fill="#2E935E" />
          <path d="M22 13V29" stroke={isDark ? '#F8F5EE' : '#0B3D2E'} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M18 20L22 23L26 20" stroke={isDark ? '#F8F5EE' : '#0B3D2E'} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-bold tracking-tight text-lg md:text-xl ${isDark ? 'text-jh-earth-100' : 'text-jh-green-900'}`}>
            Samadhan<span className="text-jh-terracotta-500 font-extrabold">Setu</span>
          </span>
        </div>
        <span className={`text-[10px] md:text-[11px] font-medium tracking-wide uppercase ${isDark ? 'text-jh-earth-300' : 'text-jh-green-700'}`}>
          Citizen to Solution Bridge
        </span>
      </div>
    </div>
  );
};

export const JharkhandGovBadge = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 text-xs text-jh-green-950 opacity-90 ${className}`}>
      {/* Ashoka Pillar / Elephant State Emblem Symbol */}
      <div className="w-5 h-5 rounded-full border border-jh-green-800 flex items-center justify-center bg-jh-cream text-[10px] font-bold text-jh-green-900 shadow-xs">
        🏛️
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-semibold text-[11px] text-jh-green-950">झारखण्ड सरकार | Govt. of Jharkhand</span>
        <span className="text-[9.5px] text-jh-green-800 font-medium">Higher Education & Environment Mission</span>
      </div>
    </div>
  );
};
