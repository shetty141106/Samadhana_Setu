import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ISSUE_CATEGORIES, JHARKHAND_DISTRICTS } from '../../utils/constants';
import { DISTRICT_COORDINATES } from '../../utils/geoData';
import { Button } from '../ui/Button';
import { 
  Camera, 
  MapPin, 
  UploadCloud, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  X,
  FileText
} from 'lucide-react';

export const IssueForm = ({ onSuccess, onCancel }) => {
  const { currentUser } = useAuth();
  const { addIssue } = useData();

  const [formData, setFormData] = useState({
    title: '',
    category: 'water',
    district: currentUser.district || 'Ranchi',
    locationName: '',
    description: '',
    priority: 'High',
    images: []
  });

  const [previewImages, setPreviewImages] = useState([
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const sampleForestPhotos = [
    { label: 'River / Wetland issue', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80' },
    { label: 'Forest / Soil erosion', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80' },
    { label: 'Mining / Air quality', url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80' },
    { label: 'Solar / Power failure', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleAddSamplePhoto = (url) => {
    if (!previewImages.includes(url)) {
      setPreviewImages([...previewImages, url]);
    }
  };

  const handleRemovePhoto = (index) => {
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    setIsSubmitting(true);
    
    // Lookup default district coordinates
    const defaultCoords = DISTRICT_COORDINATES[formData.district] || { lat: 23.3441, lng: 85.3096 };
    const catObj = ISSUE_CATEGORIES.find(c => c.id === formData.category);

    setTimeout(() => {
      const created = addIssue({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        categoryLabel: catObj ? catObj.label : 'Civic Issue',
        district: formData.district,
        locationName: formData.locationName || `${formData.district} Central`,
        coordinates: {
          lat: defaultCoords.lat + (Math.random() - 0.5) * 0.05,
          lng: defaultCoords.lng + (Math.random() - 0.5) * 0.05
        },
        priority: formData.priority,
        submittedBy: `${currentUser.name} (Citizen)`,
        submitterPhone: currentUser.phone || '+91 98351 XXXXX',
        images: previewImages
      });

      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 600);
  };

  if (showSuccessModal) {
    return (
      <div className="bg-white rounded-2xl border border-jh-green-200 p-8 text-center max-w-lg mx-auto shadow-jh-card animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-jh-green-950 mb-2">Grievance Registered Successfully!</h3>
        <p className="text-xs text-jh-earth-700 leading-relaxed mb-6">
          Your issue has been routed to the District Nodal Verification Desk for ground inspection and academic solution mapping.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => {
              setShowSuccessModal(false);
              if (onSuccess) onSuccess();
            }}
          >
            Track in My Submissions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-jh-earth-200 shadow-jh-soft p-6 md:p-8 space-y-6">
      
      {/* Form Header */}
      <div className="border-b border-jh-earth-200 pb-4">
        <div className="flex items-center gap-2 text-jh-terracotta-700 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Direct Citizen Grievance Portal</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-jh-green-950">
          Report an Environmental or Civic Issue
        </h2>
        <p className="text-xs text-jh-earth-600 mt-1">
          Provide accurate details and photos to help our district nodal officers and university research teams deploy fast interventions.
        </p>
      </div>

      {/* Row 1: Issue Title */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-jh-earth-800 mb-1.5">
          Issue Title *
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Subarnarekha River industrial runoff near Ghatshila"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2.5 text-sm bg-jh-earth-50 border border-jh-earth-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700 focus:bg-white text-jh-charcoal"
        />
      </div>

      {/* Row 2: Category & District */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-jh-earth-800 mb-1.5">
            Category / Domain *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2.5 text-sm bg-jh-earth-50 border border-jh-earth-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700 focus:bg-white text-jh-charcoal"
          >
            {ISSUE_CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-jh-earth-800 mb-1.5">
            Jharkhand District *
          </label>
          <select
            value={formData.district}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            className="w-full px-4 py-2.5 text-sm bg-jh-earth-50 border border-jh-earth-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700 focus:bg-white text-jh-charcoal"
          >
            {JHARKHAND_DISTRICTS.map(dist => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3: Location Name / Landmark & Priority */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-jh-earth-800 mb-1.5">
            Specific Landmark / Block / Village *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-jh-earth-500" />
            <input
              type="text"
              required
              placeholder="e.g. Torpa Block, near Subarnarekha Ghat"
              value={formData.locationName}
              onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-jh-earth-50 border border-jh-earth-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700 focus:bg-white text-jh-charcoal"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-jh-earth-800 mb-1.5">
            Estimated Urgency
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-4 py-2.5 text-sm bg-jh-earth-50 border border-jh-earth-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700 focus:bg-white text-jh-charcoal"
          >
            <option value="Critical">Critical (Immediate Hazard)</option>
            <option value="High">High (Impacting Community)</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Row 4: Detailed Description */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-jh-earth-800 mb-1.5">
          Detailed Description & Impact on Ground *
        </label>
        <textarea
          rows={4}
          required
          placeholder="Describe how this issue affects local residents, wildlife, farming, water access or civic safety..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2.5 text-sm bg-jh-earth-50 border border-jh-earth-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700 focus:bg-white text-jh-charcoal"
        />
      </div>

      {/* Row 5: Photographic Evidence Upload */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-jh-earth-800 mb-1.5">
          Photographic Evidence (Geo-Tagged / On-Site)
        </label>
        
        {/* Quick sample photo selector */}
        <div className="mb-3">
          <p className="text-[11px] text-jh-earth-600 mb-2">Quick attach sample realistic field photos for demonstration:</p>
          <div className="flex flex-wrap gap-2">
            {sampleForestPhotos.map((photo, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAddSamplePhoto(photo.url)}
                className="text-[11px] px-2.5 py-1 rounded-lg border border-jh-green-700/40 bg-jh-green-50 text-jh-green-900 hover:bg-jh-green-100 font-medium transition-colors"
              >
                + {photo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Photos Preview */}
        {previewImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {previewImages.map((imgUrl, index) => (
              <div key={index} className="relative group rounded-xl overflow-hidden border border-jh-earth-300 h-24">
                <img src={imgUrl} alt="Evidence" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-jh-earth-200 flex items-center justify-end gap-3">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          icon={isSubmitting ? null : Camera}
        >
          {isSubmitting ? 'Submitting Grievance...' : 'Submit Issue for Nodal Verification'}
        </Button>
      </div>

    </form>
  );
};
