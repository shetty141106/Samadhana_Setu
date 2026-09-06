import React from 'react';

export const SohraiTribalRibbon = ({ className = '' }) => {
  return (
    <div className={`w-full overflow-hidden flex items-center justify-center opacity-75 select-none ${className}`}>
      <svg width="100%" height="16" viewBox="0 0 1200 16" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <pattern id="sohrai-pat" width="40" height="16" patternUnits="userSpaceOnUse">
          <polygon points="20,1 38,8 20,15 2,8" fill="none" stroke="#C45C26" strokeWidth="1.5" />
          <polygon points="20,4 32,8 20,12 8,8" fill="#1B5E3B" opacity="0.6" />
          <circle cx="20" cy="8" r="2" fill="#D4AF37" />
          <line x1="0" y1="8" x2="4" y2="8" stroke="#0B3D2E" strokeWidth="1.5" />
          <line x1="36" y1="8" x2="40" y2="8" stroke="#0B3D2E" strokeWidth="1.5" />
        </pattern>
        <rect width="100%" height="16" fill="url(#sohrai-pat)" />
      </svg>
    </div>
  );
};

export const SohraiSideBorder = ({ orientation = 'left', className = '' }) => {
  return (
    <div className={`w-8 h-full flex flex-col items-center select-none ${className}`}>
      <svg width="24" height="100%" viewBox="0 0 24 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <pattern id={`sohrai-vert-${orientation}`} width="24" height="48" patternUnits="userSpaceOnUse">
          <polyline points="2,0 12,12 22,0" stroke="#0B3D2E" strokeWidth="1.5" fill="none" />
          <polyline points="2,12 12,24 22,12" stroke="#C45C26" strokeWidth="1.5" fill="none" />
          <polyline points="2,24 12,36 22,24" stroke="#0B3D2E" strokeWidth="1.5" fill="none" />
          <polyline points="2,36 12,48 22,36" stroke="#C45C26" strokeWidth="1.5" fill="none" />
          <circle cx="12" cy="12" r="2" fill="#D4AF37" />
          <circle cx="12" cy="36" r="2" fill="#D4AF37" />
        </pattern>
        <rect width="24" height="100%" fill={`url(#sohrai-vert-${orientation})`} />
      </svg>
    </div>
  );
};
