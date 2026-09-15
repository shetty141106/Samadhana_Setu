import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Globe } from 'lucide-react';

export const GovtBanner = () => {
  const { language, toggleLanguage } = useAuth();

  return (
    <header className="bg-jh-green-950 text-jh-earth-100 text-[11px] py-1 px-4 sm:px-8 border-b border-jh-green-900 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-end">
        {/* Accessibility & language controls */}
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
        </div>
      </div>
    </header>
  );
};
