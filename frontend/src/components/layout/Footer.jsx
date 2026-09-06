import React from 'react';
import { SamadhanLogo } from '../common/Emblem';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-jh-green-950 text-jh-earth-100 border-t border-jh-green-900 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 pb-12 border-b border-jh-green-900/80">
          
          {/* Column 1: Brand & Mission (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <SamadhanLogo size="lg" isDark={true} />
            <p className="text-xs text-jh-earth-300 leading-relaxed max-w-sm">
              Building a collaborative platform where citizens, universities and industries work together for a greener, stronger and prosperous Jharkhand.
            </p>
            {/* Social Links (Matching Mockup with X, Instagram, YouTube, LinkedIn) */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#twitter" className="w-8 h-8 rounded-lg bg-jh-green-900 flex items-center justify-center text-jh-earth-200 hover:bg-jh-terracotta-600 hover:text-white transition-all shadow-xs" title="X (Twitter)">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#instagram" className="w-8 h-8 rounded-lg bg-jh-green-900 flex items-center justify-center text-jh-earth-200 hover:bg-jh-terracotta-600 hover:text-white transition-all shadow-xs" title="Instagram">
                <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#youtube" className="w-8 h-8 rounded-lg bg-jh-green-900 flex items-center justify-center text-jh-earth-200 hover:bg-jh-terracotta-600 hover:text-white transition-all shadow-xs" title="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#linkedin" className="w-8 h-8 rounded-lg bg-jh-green-900 flex items-center justify-center text-jh-earth-200 hover:bg-jh-terracotta-600 hover:text-white transition-all shadow-xs" title="LinkedIn">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-jh-gold-400">Quick Links</h4>
            <ul className="space-y-2 text-xs text-jh-earth-300">
              <li>
                <button onClick={() => onNavigate && onNavigate('landing')} className="hover:text-jh-terracotta-400 transition-colors">Home</button>
              </li>
              <li>
                <a href="#about" className="hover:text-jh-terracotta-400 transition-colors">About</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-jh-terracotta-400 transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#universities" className="hover:text-jh-terracotta-400 transition-colors">For Universities</a>
              </li>
              <li>
                <a href="#industry" className="hover:text-jh-terracotta-400 transition-colors">For Industry</a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-jh-terracotta-400 transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-jh-gold-400">Resources</h4>
            <ul className="space-y-2 text-xs text-jh-earth-300">
              <li>
                <button onClick={() => onNavigate && onNavigate('report-issue')} className="hover:text-jh-terracotta-400 transition-colors">Report an Issue</button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('browse-projects')} className="hover:text-jh-terracotta-400 transition-colors">Browse Projects</button>
              </li>
              <li>
                <a href="#success" className="hover:text-jh-terracotta-400 transition-colors">Success Stories</a>
              </li>
              <li>
                <a href="#guidelines" className="hover:text-jh-terracotta-400 transition-colors">Guidelines</a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-jh-terracotta-400 transition-colors">FAQs</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Jharkhand Map Outline (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-jh-gold-400">Contact Us</h4>
            <div className="space-y-2.5 text-xs text-jh-earth-300">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-jh-gold-400 flex-shrink-0" />
                <span className="truncate">support@samadhansetu.jharkhand.gov.in</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-jh-gold-400 flex-shrink-0" />
                <span>1800-345-6571 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-jh-gold-400 flex-shrink-0" />
                <span>Project Building, Dhurwa, Ranchi, Jharkhand 834004</span>
              </div>
            </div>

            {/* Authentic Jharkhand State Outline SVG */}
            <div className="pt-2 flex items-center justify-end opacity-85">
              <svg width="140" height="90" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-md">
                <path
                  d="M40 25 C60 15, 110 10, 140 20 C170 30, 185 50, 180 80 C175 105, 150 125, 110 120 C70 115, 30 100, 20 70 C15 45, 25 35, 40 25 Z"
                  fill="none"
                  stroke="#2E935E"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                />
                <circle cx="105" cy="65" r="5" fill="#E07A3D" />
                <circle cx="105" cy="65" r="10" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6" />
                <path d="M105 60 C108 55, 112 55, 115 58 C115 62, 110 65, 105 65 Z" fill="#2E935E" />
                <text x="120" y="70" fill="#E8DFD0" fontSize="10" fontWeight="bold">Ranchi (HQ)</text>
              </svg>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-jh-earth-400">
          <p>© 2025 SamadhanSetu | An initiative for Jharkhand by the Government of Jharkhand</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-jh-earth-200 cursor-pointer">NIC Hosted</span>
            <span>•</span>
            <span className="hover:text-jh-earth-200 cursor-pointer">Security Audited</span>
            <span>•</span>
            <span className="hover:text-jh-earth-200 cursor-pointer">Terms of Use</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
