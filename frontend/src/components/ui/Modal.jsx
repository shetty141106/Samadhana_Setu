import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl'
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`relative bg-white rounded-2xl shadow-2xl border border-jh-earth-200 w-full ${maxWidth} overflow-hidden z-10 my-8 transition-all transform`}>
        {/* Header with Jharkhand Forest accent */}
        <div className="px-6 py-4 border-b border-jh-earth-200 bg-jh-earth-50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-jh-green-950">{title}</h3>
            {subtitle && <p className="text-xs text-jh-earth-700 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-jh-earth-700 hover:text-jh-green-900 hover:bg-jh-earth-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
