import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ROLES } from '../../utils/constants';
import { SohraiTribalRibbon, SohraiSideBorder } from '../../components/common/SohraiBorder';
import { Button } from '../../components/ui/Button';
import { Camera, Search, GraduationCap, Handshake, ArrowRight, Leaf } from 'lucide-react';

export const LandingPage = ({ onNavigate }) => {
  const { switchRole, isAuthenticated } = useAuth();
  const { stats } = useData();

  const handleLaunchRole = (roleKey, targetPath) => {
    switchRole(roleKey);
    onNavigate(targetPath || roleKey);
  };

  const handleReportIssue = () => {
    if (!isAuthenticated) {
      onNavigate('login');
      return;
    }
    onNavigate('report-issue');
  };

  return (
    <div className="w-full flex flex-col bg-jh-earth-50 text-jh-charcoal selection:bg-jh-green-100 selection:text-jh-green-900 overflow-x-hidden">
      {/* HERO */}
      <section className="relative w-full bg-[#0E3523] text-white">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=85"
            alt="Jharkhand forest canopy"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.78] contrast-[1.08]"
          />
          <div className="absolute inset-0 bg-[#082819]/65 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#082819]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 md:pt-16 pb-12 sm:pb-16">
          <div className="max-w-3xl space-y-4 mb-8 sm:mb-12">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-white drop-shadow-md">
              Report. Resolve.<br />
              Rebuild Jharkhand.
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-[#E8E2D6] leading-relaxed drop-shadow-sm max-w-2xl">
              A citizen–university–industry collaboration for a greener, stronger and sustainable Jharkhand.
            </p>
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                icon={Camera}
                onClick={handleReportIssue}
                className="bg-[#0B3D2E] hover:bg-[#072B20] text-[#FAF8F5] border border-emerald-700/60 shadow-lg font-semibold text-sm sm:text-base px-6 py-3"
              >
                Report an Issue
              </Button>
              <Button
                variant="glass"
                size="lg"
                icon={Search}
                onClick={() => handleLaunchRole(ROLES.INDUSTRY, 'browse-projects')}
                className="text-white bg-white/15 hover:bg-white/25 border-white/40 shadow-md font-semibold text-sm sm:text-base px-6 py-3 backdrop-blur-sm"
              >
                Explore Projects
              </Button>
            </div>
          </div>

          <div className="w-full pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
              <div
                onClick={() => handleLaunchRole(ROLES.CITIZEN, 'citizen')}
                className="bg-white rounded-2xl p-6 sm:p-7 shadow-xl border border-jh-earth-200/90 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-center group-hover:bg-[#0B3D2E] group-hover:text-white transition-colors">
                      <Camera className="w-6 h-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-jh-green-950">Citizen Reporting</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5C5449] leading-relaxed">
                    Report local environmental and civic issues with photos, location and details. Your voice drives change.
                  </p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-jh-earth-100 flex items-center gap-1.5 text-xs font-bold text-[#0B3D2E]">
                  <span>Enter Citizen Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div
                onClick={() => handleLaunchRole(ROLES.STUDENT, 'student')}
                className="bg-white rounded-2xl p-6 sm:p-7 shadow-xl border border-jh-earth-200/90 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-center group-hover:bg-[#0B3D2E] group-hover:text-white transition-colors">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-jh-green-950">University R&D Workspace</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5C5449] leading-relaxed">
                    Access verified issues, conduct research, propose solutions and develop sustainable interventions.
                  </p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-jh-earth-100 flex items-center gap-1.5 text-xs font-bold text-[#0B3D2E]">
                  <span>Open Student/Faculty Lab</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div
                onClick={() => handleLaunchRole(ROLES.INDUSTRY, 'industry')}
                className="bg-white rounded-2xl p-6 sm:p-7 shadow-xl border border-jh-earth-200/90 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-center group-hover:bg-[#0B3D2E] group-hover:text-white transition-colors">
                      <Handshake className="w-6 h-6" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-jh-green-950">Industry CSR Impact</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5C5449] leading-relaxed">
                    Discover projects, partner with institutions and implement CSR initiatives with measurable impact.
                  </p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-jh-earth-100 flex items-center gap-1.5 text-xs font-bold text-[#0B3D2E]">
                  <span>Access CSR Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-12 md:py-16 bg-[#F5F0E6] border-y border-jh-earth-200 relative overflow-hidden">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-jh-green-800/40 z-0" />

            {[
              [Camera, 'Report an Issue', 'Capture and submit the issue with location and details.'],
              [GraduationCap, 'Research & Solution', 'Verified issues are analysed by universities and experts.'],
              [Handshake, 'Partner & Implement', 'Industry partners adopt and implement solutions on ground.'],
              [Leaf, 'Impact & Rebuild', 'Sustainable change is created, tracked and scaled across Jharkhand.'],
            ].map(([Icon, title, description], index) => (
              <div key={title} className="relative z-10 flex flex-col items-center group">
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-jh-green-900 flex items-center justify-center text-jh-green-900 shadow-sm group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-jh-green-900 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                    {index + 1}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-jh-green-950 mb-1">{title}</h4>
                <p className="text-xs text-jh-earth-700 max-w-[200px] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE DATABASE IMPACT STATS */}
      <section className="py-10 bg-jh-green-900 text-white border-b border-jh-green-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-jh-gold-400 font-mono">
                {stats.totalIssuesVerified || 0}
              </span>
              <p className="text-xs uppercase tracking-wider text-jh-earth-200 mt-1 font-semibold">Verified Issues Triaged</p>
            </div>
            <div className="p-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                {stats.activeUniversityProjects || 0}
              </span>
              <p className="text-xs uppercase tracking-wider text-jh-earth-200 mt-1 font-semibold">Active University Labs</p>
            </div>
            <div className="p-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-jh-terracotta-400 font-mono">
                {stats.totalCSRFundingSanctioned || 0}
              </span>
              <p className="text-xs uppercase tracking-wider text-jh-earth-200 mt-1 font-semibold">CSR Pledged & Allocated</p>
            </div>
            <div className="p-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
                {stats.forestWaterAreaRestoredSqKm || 0}
              </span>
              <p className="text-xs uppercase tracking-wider text-jh-earth-200 mt-1 font-semibold">Ecology Restored on Ground</p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
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
            <Button variant="secondary" size="lg" onClick={() => handleLaunchRole(ROLES.CITIZEN, 'report-issue')}>
              Report an Issue Now
            </Button>
            <Button variant="glass" size="lg" onClick={() => handleLaunchRole(ROLES.ADMIN, 'admin')}>
              State Admin Dashboard
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
