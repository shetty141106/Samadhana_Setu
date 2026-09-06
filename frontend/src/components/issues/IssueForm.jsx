import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { aiApi } from '../../api/ai.api';
import { ISSUE_CATEGORIES, JHARKHAND_DISTRICTS } from '../../utils/constants';
import { Button } from '../ui/Button';
import { LocationPicker } from '../maps/LocationPicker';
import { Camera, MapPin, CheckCircle, Sparkles, X } from 'lucide-react';

const LIVE_API = import.meta.env.VITE_ENABLE_LIVE_API === 'true';

export const IssueForm = ({ onSuccess, onCancel }) => {
  const { currentUser } = useAuth();
  const { addIssue } = useData();
  const [formData, setFormData] = useState({ title: '', category: 'water', district: currentUser.district || 'Ranchi', locationName: '', description: '', priority: 'High', images: [] });
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [previewImages, setPreviewImages] = useState(['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const sampleForestPhotos = [
    { label: 'River / Wetland issue', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80' },
    { label: 'Forest / Soil erosion', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80' },
    { label: 'Mining / Air quality', url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80' },
    { label: 'Solar / Power failure', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80' }
  ];
  const handleAddSamplePhoto = (url) => { if (!previewImages.includes(url)) setPreviewImages(prev => [...prev, url]); };
  const handleRemovePhoto = (index) => setPreviewImages(prev => prev.filter((_, i) => i !== index));
  const handleDistrictChange = (district) => { setFormData(prev => ({ ...prev, district })); setSelectedCoordinates(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.locationName || !selectedCoordinates) return;
    setIsSubmitting(true); setSubmitError('');
    try {
      const catObj = ISSUE_CATEGORIES.find(c => c.id === formData.category);
      const created = await addIssue({ title: formData.title, description: formData.description, category: formData.category, categoryLabel: catObj?.label || 'Civic Issue', district: formData.district, locationName: formData.locationName, location: formData.locationName, latitude: selectedCoordinates.lat, longitude: selectedCoordinates.lng, coordinates: selectedCoordinates, priority: formData.priority, submittedBy: `${currentUser.name} (Citizen)`, submitterPhone: currentUser.phone || '', images: previewImages });
      if (LIVE_API && created?.id) {
        try { setAiResult(await aiApi.processIssueById(created.id)); } catch { setAiResult(null); }
      }
      setShowSuccessModal(true);
    } catch (error) {
      setSubmitError(error.message || 'Unable to submit the grievance. Please try again.');
    } finally { setIsSubmitting(false); }
  };

  if (showSuccessModal) return <div className="bg-white rounded-2xl border border-jh-green-200 p-8 text-center max-w-lg mx-auto shadow-jh-card animate-in zoom-in-95"><div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8" /></div><h3 className="text-xl font-bold text-jh-green-950 mb-2">Grievance Registered Successfully!</h3><p className="text-xs text-jh-earth-700 leading-relaxed mb-4">Your issue has been routed to the District Nodal Verification Desk for ground inspection and academic solution mapping.</p>{aiResult && <div className="text-left rounded-xl border border-jh-green-200 bg-jh-green-50 p-3 mb-5 text-xs"><div className="flex items-center gap-2 font-bold text-jh-green-900 mb-1"><Sparkles className="w-4 h-4" />AI triage completed</div><p><strong>Category:</strong> {aiResult.categoryTag || '—'} &nbsp; <strong>Priority:</strong> {aiResult.priority || '—'}</p><p><strong>Confidence:</strong> {aiResult.confidence != null ? `${Math.round(aiResult.confidence * 100)}%` : '—'}</p>{aiResult.duplicateMatch?.found && <p className="text-amber-800 mt-1">Possible duplicate detected ({aiResult.duplicateMatch.similarityPercentage}%).</p>}</div>}<Button variant="primary" onClick={() => { setShowSuccessModal(false); onSuccess?.(); }}>Track in My Submissions</Button></div>;

  return <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-jh-earth-200 shadow-jh-soft p-6 md:p-8 space-y-6">
    <div className="border-b border-jh-earth-200 pb-4"><div className="flex items-center gap-2 text-jh-terracotta-700 text-xs font-bold uppercase tracking-wider mb-1"><Sparkles className="w-4 h-4" /><span>Direct Citizen Grievance Portal</span></div><h2 className="text-xl md:text-2xl font-bold text-jh-green-950">Report an Environmental or Civic Issue</h2><p className="text-xs text-jh-earth-600 mt-1">Provide accurate details and photos to help our district nodal officers and university research teams deploy fast interventions.</p></div>
    {submitError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">{submitError}</div>}
    <div><label className="block text-xs font-bold uppercase tracking-wider text-jh-earth-800 mb-1.5">Issue Title *</label><input type="text" required placeholder="e.g. Subarnarekha River industrial runoff near Ghatshila" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2.5 text-sm bg-jh-earth-50 border border-jh-earth-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700 focus:bg-white text-jh-charcoal" /></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-xs font-bold uppercase tracking-wider text-jh-earth-800 mb-1.5">Category / Domain *</label><select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 text-sm bg-jh-earth-50 border border-jh-earth-300 rounded-xl">{ISSUE_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}</select></div><div><label className="block text-xs font-bold uppercase tracking-wider text-jh-earth-800 mb-1.5">Jharkhand District *</label><select value={formData.district} onChange={e => handleDistrictChange(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-jh-earth-50 border border-jh-earth-300 rounded-xl">{JHARKHAND_DISTRICTS.map(dist => <option key={dist} value={dist}>{dist}</option>)}</select></div></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="md:col-span-2"><label className="block text-xs font-bold uppercase tracking-wider text-jh-earth-800 mb-1.5">Specific Landmark / Block / Village *</label><div className="relative"><MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-jh-earth-500" /><input type="text" required placeholder="e.g. Torpa Block, near Subarnarekha Ghat" value={formData.locationName} onChange={e => setFormData({ ...formData, locationName: e.target.value })} className="w-full pl-10 pr-4 py-2.5 text-sm bg-jh-earth-50 border border-jh-earth-300 rounded-xl" /></div></div><div><label className="block text-xs font-bold uppercase tracking-wider text-jh-earth-800 mb-1.5">Estimated Urgency</label><select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className="w-full px-4 py-2.5 text-sm bg-jh-earth-50 border border-jh-earth-300 rounded-xl"><option value="Critical">Critical (Immediate Hazard)</option><option value="High">High (Impacting Community)</option><option value="Medium">Medium</option><option value="Low">Low</option></select></div></div>
    <div><label className="block text-xs font-bold uppercase tracking-wider text-jh-earth-800 mb-1.5">Exact Issue Location *</label><LocationPicker district={formData.district} value={selectedCoordinates} onChange={setSelectedCoordinates} height="320px" />{!selectedCoordinates && <p className="mt-1.5 text-[11px] font-medium text-jh-terracotta-700">Select the exact location on the map before submitting.</p>}</div>
    <div><label className="block text-xs font-bold uppercase tracking-wider text-jh-earth-800 mb-1.5">Detailed Description & Impact on Ground *</label><textarea rows={4} required placeholder="Describe how this issue affects local residents, wildlife, farming, water access or civic safety..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 text-sm bg-jh-earth-50 border border-jh-earth-300 rounded-xl" /></div>
    <div><label className="block text-xs font-bold uppercase tracking-wider text-jh-earth-800 mb-1.5">Photographic Evidence (Geo-Tagged / On-Site)</label><p className="text-[11px] text-jh-earth-600 mb-2">Quick attach sample realistic field photos for demonstration:</p><div className="flex flex-wrap gap-2">{sampleForestPhotos.map((photo, i) => <button key={i} type="button" onClick={() => handleAddSamplePhoto(photo.url)} className="text-[11px] px-2.5 py-1 rounded-lg border border-jh-green-700/40 bg-jh-green-50 text-jh-green-900 hover:bg-jh-green-100 font-medium">+ {photo.label}</button>)}</div>{previewImages.length > 0 && <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">{previewImages.map((imgUrl, index) => <div key={index} className="relative rounded-xl overflow-hidden border border-jh-earth-300 h-24"><img src={imgUrl} alt="Evidence" className="w-full h-full object-cover" /><button type="button" onClick={() => handleRemovePhoto(index)} className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-md"><X className="w-3.5 h-3.5" /></button></div>)}</div>}</div>
    <div className="pt-4 border-t border-jh-earth-200 flex items-center justify-end gap-3">{onCancel && <Button variant="ghost" onClick={onCancel}>Cancel</Button>}<Button type="submit" variant="primary" size="lg" disabled={isSubmitting || !selectedCoordinates} icon={isSubmitting ? null : Camera}>{isSubmitting ? 'Submitting Grievance...' : 'Submit Issue for Nodal Verification'}</Button></div>
  </form>;
};
