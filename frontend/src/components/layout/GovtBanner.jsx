import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Globe } from 'lucide-react';

export const GovtBanner = () => {
  const { language, toggleLanguage } = useAuth();

  return (
    <header className="bg-jh-green-950 text-jh-earth-100 text-[11px] py-1 px-4 sm:px-8 border-b border-jh-green-900 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Official Indian / State identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-1.5 bg-[#FF9933] rounded-[1px]"></div>
            <div className="w-2.5 h-1.5 bg-white rounded-[1px]"></div>
            <div className="w-2.5 h-1.5 bg-[#138808] rounded-[1px]"></div>
          </div>
          <span className="font-medium text-jh-earth-200">
            झारखण्ड सरकार | Government of Jharkhand
          </span>
          <span className="hidden md:inline text-jh-green-400 font-mono text-[10px] bg-jh-green-900/80 px-1.5 py-0.5 rounded border border-jh-green-800">
            samadhansetu.jharkhand.gov.in
          </span>
        </div>

        {/* Right: Accessibility & Quick Lang Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 hover:text-jh-terracotta-400 font-medium transition-colors cursor-pointer"
          >
            <Globe className="w-3 h-3" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-jh-earth-300">
            <span className="cursor-pointer hover:text-white" title="Standard text">A-</span>
            <span className="cursor-pointer hover:text-white font-bold" title="Medium text">A</span>
            <span className="cursor-pointer hover:text-white" title="Large text">A+</span>
          </div>
          <span className="hidden lg:inline text-jh-earth-300">|</span>
          <span className="hidden lg:inline text-jh-gold-400 font-medium">
            Toll-Free: 1800-345-6571
          </span>
        </div>
      </div>
    </header>
  );
};
