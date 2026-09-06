import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ROLES } from '../../utils/constants';
import { SohraiTribalRibbon, SohraiSideBorder } from '../../components/common/SohraiBorder';
import { Button } from '../../components/ui/Button';
import { 
  Camera, 
  Search, 
  GraduationCap, 
  Handshake, 
  Trees, 
  Droplets, 
  Mountain, 
  SunMedium, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Sparkles,
  Award,
  Globe2,
  Building2,
  Leaf
} from 'lucide-react';

export const LandingPage = ({ onNavigate }) => {
  const { switchRole } = useAuth();
  const { stats, issues, projects } = useData();

  const handleLaunchRole = (roleKey, targetPath) => {
    switchRole(roleKey);
    onNavigate(targetPath || roleKey);
  };

  return (
    <div className="w-full flex flex-col bg-jh-earth-50 text-jh-charcoal selection:bg-jh-green-100 selection:text-jh-green-900 overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH REAL LUSH FOREST PHOTOGRAPHY & 3 CARDS              */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[620px] lg:min-h-[680px] flex flex-col justify-between overflow-hidden">
        
        {/* Real Lush Forest Canopy Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=85"
            alt="Jharkhand Lush Forest Canopy"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.82] contrast-[1.05]"
          />
          {/* Subtle Jharkhand Forest Green Gradient Overlay */}
          <div className="absolute inset-0 bg-forest-overlay-light mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-jh-earth-50 via-transparent to-black/40"></div>
        </div>

        {/* Hero Top Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-8 text-white">
          <div className="max-w-3xl space-y-4">
            
            {/* Stately Hero Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white drop-shadow-md">
              Report. Resolve.<br />
              Rebuild Jharkhand.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg lg:text-xl text-jh-earth-100/90 font-sans font-normal leading-relaxed drop-shadow-sm max-w-2xl">
              A citizen–university–industry collaboration for a greener, stronger and sustainable Jharkhand.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-3.5">
              <Button
                variant="primary"
                size="lg"
                icon={Camera}
                onClick={() => handleLaunchRole(ROLES.CITIZEN, 'report-issue')}
                className="bg-jh-green-900 hover:bg-jh-green-950 text-jh-earth-50 border border-jh-green-700 shadow-md font-semibold text-sm sm:text-base px-6 py-3"
              >
                Report an Issue
              </Button>

              <Button
                variant="glass"
                size="lg"
                icon={Search}
                onClick={() => handleLaunchRole(ROLES.INDUSTRY, 'browse-projects')}
                className="text-white hover:bg-white/20 border-white/40 shadow-sm font-semibold text-sm sm:text-base px-6 py-3"
              >
                Explore Projects
              </Button>
            </div>

          </div>
        </div>

        {/* 3 Persona Feature Cards Overlaying the Bottom of Hero (Exact Mockup Match) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mb-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            
            {/* Card 1: Citizen Reporting */}
            <div
              onClick={() => handleLaunchRole(ROLES.CITIZEN, 'citizen')}
              className="bg-white rounded-2xl p-6 shadow-jh-card border border-jh-earth-200/80 hover:-translate-y-1 hover:border-jh-green-700/50 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-jh-green-50 border border-jh-green-200 text-jh-green-900 flex items-center justify-center group-hover:bg-jh-green-900 group-hover:text-white transition-colors shadow-2xs">
                    <Camera className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-jh-green-950 group-hover:text-jh-terracotta-700 transition-colors">
                    Citizen Reporting
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-jh-earth-700 leading-relaxed">
                  Report local environmental and civic issues with photos, location and details. Your voice drives change.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-jh-earth-100 flex items-center gap-1 text-xs font-bold text-jh-green-900 group-hover:text-jh-terracotta-700">
                <span>Enter Citizen Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 2: University R&D Workspace */}
            <div
              onClick={() => handleLaunchRole(ROLES.STUDENT, 'student')}
              className="bg-white rounded-2xl p-6 shadow-jh-card border border-jh-earth-200/80 hover:-translate-y-1 hover:border-jh-green-700/50 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-jh-green-50 border border-jh-green-200 text-jh-green-900 flex items-center justify-center group-hover:bg-jh-green-900 group-hover:text-white transition-colors shadow-2xs">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-jh-green-950 group-hover:text-jh-terracotta-700 transition-colors">
                    University R&D Workspace
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-jh-earth-700 leading-relaxed">
                  Access verified issues, conduct research, propose solutions and develop sustainable interventions.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-jh-earth-100 flex items-center gap-1 text-xs font-bold text-jh-green-900 group-hover:text-jh-terracotta-700">
                <span>Open Student/Faculty Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 3: Industry CSR Impact */}
            <div
              onClick={() => handleLaunchRole(ROLES.INDUSTRY, 'industry')}
              className="bg-white rounded-2xl p-6 shadow-jh-card border border-jh-earth-200/80 hover:-translate-y-1 hover:border-jh-green-700/50 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-jh-green-50 border border-jh-green-200 text-jh-green-900 flex items-center justify-center group-hover:bg-jh-green-900 group-hover:text-white transition-colors shadow-2xs">
                    <Handshake className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-jh-green-950 group-hover:text-jh-terracotta-700 transition-colors">
                    Industry CSR Impact
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-jh-earth-700 leading-relaxed">
                  Discover projects, partner with institutions and implement CSR initiatives with measurable impact.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-jh-earth-100 flex items-center gap-1 text-xs font-bold text-jh-green-900 group-hover:text-jh-terracotta-700">
                <span>Access CSR Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Spacing below overlapping hero cards */}
      <div className="h-16 md:h-20"></div>

      {/* ========================================================================= */}
      {/* 2. HOW IT WORKS SECTION (WITH SOHRAI TRIBAL FLANK BORDERS)                */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-12 md:py-16 bg-[#F5F0E6] border-y border-jh-earth-200 relative overflow-hidden">
        
        {/* Sohrai Motif Flanking Left & Right */}
        <div className="hidden lg:block absolute left-4 top-0 bottom-0">
          <SohraiSideBorder orientation="left" />
        </div>
        <div className="hidden lg:block absolute right-4 top-0 bottom-0">
          <SohraiSideBorder orientation="right" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-jh-green-950 tracking-tight mb-2">
            How it Works
          </h2>
          <p className="text-xs sm:text-sm text-jh-earth-700 max-w-xl mx-auto mb-10">
            A seamless four-stage bridge uniting civic awareness with academic R&D and corporate CSR funding.
          </p>

          {/* 4 Connected Process Nodes (Matching mockup) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            
            {/* Connecting line (Desktop) */}
            <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-jh-green-800/40 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center group">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-jh-green-900 flex items-center justify-center text-jh-green-900 shadow-sm group-hover:scale-110 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-jh-green-900 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  1
                </span>
              </div>
              <h4 className="text-sm font-bold text-jh-green-950 mb-1">
                Report an Issue
              </h4>
              <p className="text-xs text-jh-earth-700 max-w-[200px] leading-relaxed">
                Capture and submit the issue with location and details.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center group">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-jh-green-900 flex items-center justify-center text-jh-green-900 shadow-sm group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-jh-green-900 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  2
                </span>
              </div>
              <h4 className="text-sm font-bold text-jh-green-950 mb-1">
                Research & Solution
              </h4>
              <p className="text-xs text-jh-earth-700 max-w-[200px] leading-relaxed">
                Verified issues are analysed by universities and experts.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center group">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-jh-green-900 flex items-center justify-center text-jh-green-900 shadow-sm group-hover:scale-110 transition-transform">
                  <Handshake className="w-7 h-7" />
                </div>
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-jh-green-900 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  3
                </span>
              </div>
              <h4 className="text-sm font-bold text-jh-green-950 mb-1">
                Partner & Implement
              </h4>
              <p className="text-xs text-jh-earth-700 max-w-[200px] leading-relaxed">
                Industry partners adopt and implement solutions on ground.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center group">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-jh-green-900 flex items-center justify-center text-jh-green-900 shadow-sm group-hover:scale-110 transition-transform">
                  <Leaf className="w-7 h-7 text-jh-green-700" />
                </div>
                <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-jh-green-900 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  4
                </span>
              </div>
              <h4 className="text-sm font-bold text-jh-green-950 mb-1">
                Impact & Rebuild
              </h4>
              <p className="text-xs text-jh-earth-700 max-w-[200px] leading-relaxed">
                Sustainable change is created, tracked and scaled across Jharkhand.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LIVE STATE-WIDE IMPACT STATS TICKER                                     */}
      {/* ========================================================================= */}
      <section className="py-10 bg-jh-green-900 text-white border-b border-jh-green-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-jh-gold-400 font-mono">
                {stats.totalIssuesVerified}+
              </span>
              <p className="text-xs uppercase tracking-wider text-jh-earth-200 mt-1 font-semibold">
                Verified Issues Triaged
              </p>
            </div>

            <div className="p-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                {stats.activeUniversityProjects}
              </span>
              <p className="text-xs uppercase tracking-wider text-jh-earth-200 mt-1 font-semibold">
                Active University Labs
              </p>
            </div>

            <div className="p-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-jh-terracotta-400 font-mono">
                {stats.totalCSRFundingSanctioned}
              </span>
              <p className="text-xs uppercase tracking-wider text-jh-earth-200 mt-1 font-semibold">
                CSR Pledged & Allocated
              </p>
            </div>

            <div className="p-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
                {stats.forestWaterAreaRestoredSqKm}
              </span>
              <p className="text-xs uppercase tracking-wider text-jh-earth-200 mt-1 font-semibold">
                Ecology Restored on Ground
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. KEY FOCUS INITIATIVES (JHARKHAND PRIORITY DOMAINS)                     */}
      {/* ========================================================================= */}
      <section id="initiatives" className="py-14 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-jh-terracotta-700 bg-jh-terracotta-100 px-3 py-1 rounded-full border border-jh-terracotta-200">
            Priority Action Sectors
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-jh-green-950 mt-3 mb-3">
            Targeting Jharkhand's Most Critical Environmental Challenges
          </h2>
          <p className="text-xs sm:text-sm text-jh-earth-700 leading-relaxed">
            From the Subarnarekha and Damodar river catchments to the dense Sal canopies of Saranda, SamadhanSetu channels academic research into tangible grassroots interventions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Domain 1 */}
          <div className="bg-white rounded-2xl p-6 border border-jh-earth-200 shadow-jh-soft hover:shadow-jh-card transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mb-4">
              <Droplets className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-jh-green-950 mb-2">
              River & Water Catchment Revival
            </h4>
            <p className="text-xs text-jh-earth-700 leading-relaxed mb-4">
              Constructed wetlands, bio-filtration beds, and automated IoT water quality monitoring across Subarnarekha, Koel, and Damodar basins.
            </p>
            <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md">
              18 Active Projects
            </span>
          </div>

          {/* Domain 2 */}
          <div className="bg-white rounded-2xl p-6 border border-jh-earth-200 shadow-jh-soft hover:shadow-jh-card transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4">
              <Mountain className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-jh-green-950 mb-2">
              Mine Reclamation & Dust Control
            </h4>
            <p className="text-xs text-jh-earth-700 leading-relaxed mb-4">
              Phytoremediation using native deep-root Vetiver cultivars, ultrasonic fogging canopies, and overburden bio-char stabilization.
            </p>
            <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md">
              24 Active Projects
            </span>
          </div>

          {/* Domain 3 */}
          <div className="bg-white rounded-2xl p-6 border border-jh-earth-200 shadow-jh-soft hover:shadow-jh-card transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <Trees className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-jh-green-950 mb-2">
              Saranda Forest & Biodiversity Protection
            </h4>
            <p className="text-xs text-jh-earth-700 leading-relaxed mb-4">
              Acoustic wildlife tracking, elephant corridor erosion arrest, and indigenous Sal canopy drone surveillance.
            </p>
            <span className="text-[11px] font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md">
              14 Active Projects
            </span>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ACADEMIC & INDUSTRY ALLIANCE STRIP                                     */}
      {/* ========================================================================= */}
      <section id="universities" className="py-12 bg-white border-y border-jh-earth-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-jh-earth-600 mb-6">
            Empowered by Jharkhand’s Premier Technical Institutions & CSR Foundations
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 opacity-80 grayscale hover:grayscale-0 transition-all">
            <span className="font-bold text-sm sm:text-base text-jh-green-950">IIT (ISM) Dhanbad</span>
            <span className="font-bold text-sm sm:text-base text-jh-green-950">BIT Mesra, Ranchi</span>
            <span className="font-bold text-sm sm:text-base text-jh-green-950">NIT Jamshedpur</span>
            <span className="font-bold text-sm sm:text-base text-jh-green-950">Birsa Agricultural University</span>
            <span className="font-bold text-sm sm:text-base text-jh-green-950">Tata Steel Foundation</span>
            <span className="font-bold text-sm sm:text-base text-jh-green-950">Coal India Green CSR</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BOTTOM BANNER CTA                                                      */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#0B3D2E] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <SohraiTribalRibbon />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            Be the Catalyst for a Greener Jharkhand
          </h2>
          <p className="text-xs sm:text-sm text-jh-earth-200 leading-relaxed">
            Whether you are a concerned citizen, student innovator, faculty researcher, or industry partner, your involvement shapes Jharkhand’s sustainable future.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleLaunchRole(ROLES.CITIZEN, 'report-issue')}
            >
              Report an Issue Now
            </Button>
            <Button
              variant="glass"
              size="lg"
              onClick={() => handleLaunchRole(ROLES.ADMIN, 'admin')}
            >
              State Admin Dashboard
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};
