import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/ui/Card';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { industryApi } from '../../api/industry.api';
import { Building2, Coins, CheckCircle, Award, TreeDeciduous, Droplets } from 'lucide-react';

export const IndustryDashboard = ({ currentPath, onNavigate }) => {
  const { currentUser } = useAuth();
  const { projects, sponsors, sponsorProject, liveApi } = useData();
  const [organizations, setOrganizations] = useState([]);
  const [selectedProjectToFund, setSelectedProjectToFund] = useState(null);
  const [pledgeAmount, setPledgeAmount] = useState('500000');
  const [domainFilter, setDomainFilter] = useState('all');
  const [pledgeSuccess, setPledgeSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!liveApi) return;
    industryApi.listOrganizations().then(setOrganizations).catch(() => setOrganizations([]));
  }, [liveApi]);

  const filteredProjects = projects.filter(p => domainFilter === 'all' || String(p.domain || '').toLowerCase().includes(domainFilter.toLowerCase()));

  const handlePledgeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProjectToFund || !pledgeAmount) return;
    setError('');
    try {
      const orgName = currentUser.organization || 'Tata Steel Foundation';
      const org = organizations.find(o => String(o.name || '').toLowerCase() === orgName.toLowerCase()) || organizations[0];
      await sponsorProject(selectedProjectToFund.id, pledgeAmount, orgName, org?.id);
      setPledgeSuccess(true);
      setTimeout(() => { setPledgeSuccess(false); setSelectedProjectToFund(null); }, 2000);
    } catch (err) {
      setError(err.message || 'Unable to create CSR sponsorship.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-jh-earth-200 shadow-jh-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5"><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-semibold"><Building2 className="w-3.5 h-3.5" /><span>Corporate CSR & ESG Command Desk • {currentUser.organization || 'Tata Steel Foundation'}</span></div><h1 className="text-2xl sm:text-3xl font-bold text-jh-green-950">{currentUser.name}</h1><p className="text-xs text-jh-earth-600 max-w-xl">{currentUser.title || 'Chief CSR & Sustainability Officer'} — Direct corporate capital toward vetted university R&D solutions that deliver high-impact ESG compliance across Jharkhand.</p></div>
        <div className="bg-jh-earth-50 p-3.5 rounded-2xl border border-jh-earth-200 text-right"><span className="text-[10px] uppercase font-bold text-jh-earth-600 block">Total CSR Budget</span><span className="text-xl font-extrabold text-jh-terracotta-700">₹ 15.00 Cr</span></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Pledges" value={`₹ ${(sponsors.reduce((sum, s) => sum + Number(s.amount || 0), 0) / 10000000).toFixed(2)} Cr`} subtitle="Live sponsorship records" icon={Coins} color="terracotta" />
        <StatCard title="Water Cleaned" value="4.2M Litres" subtitle="Subarnarekha & Ghatshila" icon={Droplets} color="blue" />
        <StatCard title="Mine Land Restored" value="84 Hectares" subtitle="Vetiver phytoremediation" icon={TreeDeciduous} color="forest" />
        <StatCard title="ESG Audit Rating" value="A+ Compliant" subtitle="Govt. of Jharkhand verified" icon={Award} color="gold" />
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-jh-earth-200"><div><h3 className="text-base font-bold text-jh-green-950">Vetted University R&D Marketplace</h3><p className="text-xs text-jh-earth-600">Browse scientifically validated prototypes awaiting corporate funding tranches</p></div><div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-jh-earth-200 text-xs">{['all','water','mining','renewable'].map(filter => <button key={filter} onClick={() => setDomainFilter(filter)} className={`px-3 py-1 rounded-lg font-bold transition-all ${domainFilter === filter ? 'bg-jh-green-900 text-white' : 'text-jh-earth-700 hover:bg-jh-earth-100'}`}>{filter === 'all' ? 'All Domains' : filter}</button>)}</div></div>
        {projects.length === 0 ? <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-jh-earth-300 text-sm text-jh-earth-600">No R&D projects are available for CSR sponsorship yet.</div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{filteredProjects.map(project => <ProjectCard key={project.id} project={project} onSponsorClick={setSelectedProjectToFund} />)}</div>}
      </div>

      {selectedProjectToFund && <Modal isOpen={!!selectedProjectToFund} onClose={() => setSelectedProjectToFund(null)} title="Pledge CSR Sponsorship" subtitle={selectedProjectToFund.title}>
        {pledgeSuccess ? <div className="text-center py-6 space-y-3"><div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto"><CheckCircle className="w-8 h-8" /></div><h3 className="text-lg font-bold text-jh-green-950">CSR Grant Sanctioned!</h3><p className="text-xs text-jh-earth-700">The sponsorship has been recorded and mapped to the selected project.</p></div> : <form onSubmit={handlePledgeSubmit} className="space-y-4 text-xs">
          {error && <div role="alert" className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-800">{error}</div>}
          <div className="p-3 bg-jh-earth-50 rounded-xl border border-jh-earth-200"><span className="text-[10px] uppercase font-bold text-jh-earth-500">Academic Host:</span><p className="font-bold text-jh-green-950">{selectedProjectToFund.university}</p><p className="text-jh-earth-600">Total Budget: ₹ {(selectedProjectToFund.budgetTotal / 100000).toFixed(2)} Lakh</p></div>
          <div><label className="block font-bold text-jh-charcoal mb-1">Pledge Grant Amount (in INR) *</label><input type="number" required min="50000" step="50000" value={pledgeAmount} onChange={e => setPledgeAmount(e.target.value)} className="w-full p-2.5 bg-jh-earth-50 border border-jh-earth-300 rounded-xl font-mono text-sm font-bold text-jh-green-950" /></div>
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-orange-950"><span className="font-bold flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-orange-700" /> Section 135 CSR Compliance</span><p className="text-[11px] mt-1">Contribution records remain subject to backend approval and applicable CSR compliance.</p></div>
          <div className="flex justify-end gap-2 pt-2"><Button variant="ghost" size="sm" onClick={() => setSelectedProjectToFund(null)}>Cancel</Button><Button variant="secondary" size="sm" type="submit" icon={Coins}>Confirm CSR Grant</Button></div>
        </form>}
      </Modal>}
    </div>
  );
};
