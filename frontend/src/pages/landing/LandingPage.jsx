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
      <section className="relative w-full bg-[#0E3523] text-white">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=85" alt="Jharkhand forest canopy" className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.78] contrast-[1.08]" />
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
              <Button variant="primary" size="lg" icon={Camera} onClick={handleReportIssue} className="bg-[#0B3D2E] hover:bg-[#072B20] text-[#FAF8F5] border border-emerald-700/60 shadow-lg font-semibold text-sm sm:text-base px-6 py-3">
                Report an Issue
              </Button>
              <Button variant="glass" size="lg" icon={Search} onClick={() => onNavigate('browse-projects')} className="text-white bg-white/15 hover:bg-white/25 border-white/40 shadow-md font-semibold text-sm sm:text-base px-6 py-3 backdrop-blur-sm">
                Explore Projects
              </Button>
            </div>
          </div>

          <div className="w-full pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
              <div className="group relative bg-[#F4EFE6]/95 text-jh-charcoal rounded-2xl p-5 sm:p-6 shadow-xl border border-white/20 backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-jh-green-100 text-jh-green-800 flex items-center justify-center"><Camera className="w-5 h-5" /></div><h3 className="font-bold text-jh-green-950 text-sm">Citizen Reporting</h3></div>
                <p className="text-xs text-jh-earth-700 leading-relaxed">Report local issues with photos, location and supporting details so they can be verified and routed to the right stakeholders.</p>
              </div>
              <div className="group relative bg-[#F4EFE6]/95 text-jh-charcoal rounded-2xl p-5 sm:p-6 shadow-xl border border-white/20 backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-jh-green-100 text-jh-green-800 flex items-center justify-center"><GraduationCap className="w-5 h-5" /></div><h3 className="font-bold text-jh-green-950 text-sm">University R&D Workspace</h3></div>
                <p className="text-xs text-jh-earth-700 leading-relaxed">Turn verified problems into research projects, track milestones and collaborate through a shared workspace.</p>
              </div>
              <div className="group relative bg-[#F4EFE6]/95 text-jh-charcoal rounded-2xl p-5 sm:p-6 shadow-xl border border-white/20 backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-jh-terracotta-100 text-jh-terracotta-800 flex items-center justify-center"><Handshake className="w-5 h-5" /></div><h3 className="font-bold text-jh-green-950 text-sm">Industry CSR Impact</h3></div>
                <p className="text-xs text-jh-earth-700 leading-relaxed">Discover research projects that can receive corporate support and track funding and implementation progress.</p>
              </div>
            </div>
          </div>
        </div>
        <SohraiTribalRibbon />
      </section>

      <section id="how-it-works" className="py-14 sm:py-18 bg-jh-earth-50 relative overflow-hidden">
        <SohraiSideBorder side="left" />
        <SohraiSideBorder side="right" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-jh-terracotta-700">How It Works</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-jh-green-950 mt-2">From Local Problem to Lasting Solution</h2>
            <p className="text-sm text-jh-earth-700 mt-3 leading-relaxed">A simple loop connecting citizen reporting, verification, university research and implementation support.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-jh-earth-200 shadow-jh-soft"><div className="text-2xl font-serif font-bold text-jh-terracotta-700">01</div><h3 className="font-bold text-jh-green-950 mt-3">Report & Verify</h3><p className="text-xs text-jh-earth-700 mt-2 leading-relaxed">Citizens submit an issue with evidence. Authorized stakeholders review and verify the report.</p></div>
            <div className="bg-white rounded-2xl p-6 border border-jh-earth-200 shadow-jh-soft"><div className="text-2xl font-serif font-bold text-jh-terracotta-700">02</div><h3 className="font-bold text-jh-green-950 mt-3">Research & Build</h3><p className="text-xs text-jh-earth-700 mt-2 leading-relaxed">Universities can turn verified issues into research projects and track their progress.</p></div>
            <div className="bg-white rounded-2xl p-6 border border-jh-earth-200 shadow-jh-soft"><div className="text-2xl font-serif font-bold text-jh-terracotta-700">03</div><h3 className="font-bold text-jh-green-950 mt-3">Fund & Implement</h3><p className="text-xs text-jh-earth-700 mt-2 leading-relaxed">Industry partners can discover projects and support implementation through the platform.</p></div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-jh-green-900 text-white border-b border-jh-green-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div><span className="block text-2xl sm:text-3xl font-extrabold font-mono">{stats.totalIssuesVerified || 0}</span><span className="text-[10px] sm:text-xs uppercase tracking-widest text-jh-earth-200">Issues Verified</span></div>
          <div><span className="block text-2xl sm:text-3xl font-extrabold font-mono">{stats.activeUniversityProjects || 0}</span><span className="text-[10px] sm:text-xs uppercase tracking-widest text-jh-earth-200">Active University Projects</span></div>
          <div><span className="block text-2xl sm:text-3xl font-extrabold font-mono">₹ {(stats.totalCSRFundingSanctioned || 0).toLocaleString('en-IN')}</span><span className="text-[10px] sm:text-xs uppercase tracking-widest text-jh-earth-200">CSR Funding Recorded</span></div>
          <div><span className="block text-2xl sm:text-3xl font-extrabold font-mono">{stats.forestWaterAreaRestoredSqKm || 0} km²</span><span className="text-[10px] sm:text-xs uppercase tracking-widest text-jh-earth-200">Ecology Restored</span></div>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-[#F4EFE6] text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <Leaf className="w-8 h-8 text-jh-terracotta-600 mx-auto mb-5" />
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-jh-green-950">Ready to Make an Impact?</h2>
          <p className="text-sm text-jh-earth-700 mt-3 max-w-xl mx-auto">Join the platform as a citizen, university participant or industry partner.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3"><Button variant="primary" size="lg" icon={ArrowRight} onClick={() => onNavigate('register')}>Create an Account</Button><Button variant="outline" size="lg" onClick={() => onNavigate('login')}>Sign In</Button></div>
        </div>
      </section>
    </div>
  );
};
