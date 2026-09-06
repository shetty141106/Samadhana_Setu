import React, { useMemo, useState } from 'react';
import { AlertCircle, BrainCircuit, CheckCircle2, Copy, Languages, Loader2, Tag, Target, XCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { processIssue, processIssueById } from '../../api/ai.api';
import { Button } from '../ui/Button';

const normalizePriority = (value) => String(value || '').trim().toUpperCase();
const priorityLabel = (value) => normalizePriority(value) || 'Not provided';
const priorityClasses = (value) => {
  switch (normalizePriority(value)) {
    case 'CRITICAL': return 'bg-red-50 text-red-800 border-red-200';
    case 'HIGH': return 'bg-orange-50 text-orange-800 border-orange-200';
    case 'MEDIUM': return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'LOW': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    default: return 'bg-jh-earth-50 text-jh-earth-700 border-jh-earth-200';
  }
};
const confidencePercent = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return Math.max(0, Math.min(100, numeric <= 1 ? numeric * 100 : numeric));
};
const numericId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

export const AIIntelligencePanel = ({ issue }) => {
  const { issues } = useData();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const candidateIssues = useMemo(() => issues
    .filter((candidate) => candidate?.id && candidate.id !== issue?.id && numericId(candidate.id))
    .slice(0, 20)
    .map((candidate) => ({
      issueId: numericId(candidate.id),
      title: candidate.title,
      description: candidate.description,
      location: candidate.location || candidate.locationName || '',
      latitude: candidate.latitude ?? candidate.coordinates?.lat ?? null,
      longitude: candidate.longitude ?? candidate.coordinates?.lng ?? null
    })), [issues, issue?.id]);

  if (!issue) return null;

  const runAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const id = numericId(issue.id);
      const response = id
        ? await processIssueById(id)
        : await processIssue({
            issueId: null,
            title: issue.title || '',
            description: issue.description || '',
            location: issue.location || issue.locationName || '',
            latitude: issue.latitude ?? issue.coordinates?.lat ?? null,
            longitude: issue.longitude ?? issue.coordinates?.lng ?? null,
            candidates: candidateIssues
          });
      setAnalysis(response);
    } catch (requestError) {
      setAnalysis(null);
      setError(requestError?.message || 'AI analysis could not be completed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const confidence = confidencePercent(analysis?.confidence);
  const duplicate = analysis?.duplicateMatch;
  const keywords = Array.isArray(analysis?.keywords) ? analysis.keywords : [];
  const priorityReasons = Array.isArray(analysis?.priorityReasons) ? analysis.priorityReasons : [];

  return (
    <section className="rounded-2xl border border-jh-green-200 bg-gradient-to-br from-jh-green-50 via-white to-jh-earth-50 overflow-hidden" aria-labelledby={`ai-intelligence-${issue.id}`}>
      <div className="px-4 py-4 border-b border-jh-green-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-jh-green-900 text-white flex items-center justify-center shrink-0"><BrainCircuit className="w-5 h-5" aria-hidden="true" /></div>
          <div>
            <h5 id={`ai-intelligence-${issue.id}`} className="text-sm font-bold text-jh-green-950">AI Issue Intelligence</h5>
            <p className="text-[11px] text-jh-earth-600 mt-0.5">Backend-mediated analysis using the available SamadhanSetu AI workflow.</p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={runAnalysis} disabled={loading} icon={loading ? Loader2 : BrainCircuit} className={loading ? '[&>svg]:animate-spin' : ''}>
          {loading ? 'Analyzing...' : analysis ? 'Re-analyze Issue' : 'Analyze Issue'}
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {error && <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-800" role="alert"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" /><span>{error}</span></div>}
        {!analysis && !error && <div className="rounded-xl border border-dashed border-jh-green-200 bg-white/70 p-5 text-center"><BrainCircuit className="w-7 h-7 mx-auto text-jh-green-700 mb-2" aria-hidden="true" /><p className="text-xs font-semibold text-jh-green-950">Run AI analysis for this issue</p><p className="text-[11px] text-jh-earth-600 mt-1 max-w-lg mx-auto">The analysis can identify language, generate a summary, classify the issue, estimate confidence, recommend priority, explain that recommendation, and check for duplicate issues when the backend returns that information.</p></div>}

        {analysis && <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-xl border border-jh-earth-200 bg-white p-3"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-jh-earth-600"><Languages className="w-3.5 h-3.5" aria-hidden="true" />Language</div><p className="mt-2 text-sm font-bold text-jh-green-950 break-words">{analysis.language || 'Not provided'}</p></div>
            <div className="rounded-xl border border-jh-earth-200 bg-white p-3"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-jh-earth-600"><Tag className="w-3.5 h-3.5" aria-hidden="true" />Category</div><p className="mt-2 text-sm font-bold text-jh-green-950 break-words">{analysis.categoryTag || 'Not provided'}</p></div>
            <div className="rounded-xl border border-jh-earth-200 bg-white p-3"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-jh-earth-600"><Target className="w-3.5 h-3.5" aria-hidden="true" />AI Priority</div><span className={`inline-flex mt-2 px-2.5 py-1 rounded-lg border text-xs font-bold ${priorityClasses(analysis.priority)}`}>{priorityLabel(analysis.priority)}</span></div>
            <div className="rounded-xl border border-jh-earth-200 bg-white p-3"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-jh-earth-600"><CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />Confidence</div><p className="mt-2 text-sm font-bold text-jh-green-950">{confidence === null ? 'Not provided' : `${confidence.toFixed(0)}%`}</p>{confidence !== null && <div className="h-1.5 rounded-full bg-jh-earth-100 mt-2 overflow-hidden"><div className="h-full bg-jh-green-700 rounded-full" style={{ width: `${confidence}%` }} /></div>}</div>
          </div>

          {(analysis.summary || analysis.translatedDescription) && <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {analysis.summary && <div className="rounded-xl border border-jh-earth-200 bg-white p-4"><h6 className="text-[10px] font-bold uppercase tracking-wider text-jh-earth-600 mb-2">AI Summary</h6><p className="text-xs text-jh-charcoal leading-relaxed">{analysis.summary}</p></div>}
            {analysis.translatedDescription && <div className="rounded-xl border border-jh-earth-200 bg-white p-4"><h6 className="text-[10px] font-bold uppercase tracking-wider text-jh-earth-600 mb-2">Translated Description</h6><p className="text-xs text-jh-charcoal leading-relaxed">{analysis.translatedDescription}</p></div>}
          </div>}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="rounded-xl border border-jh-earth-200 bg-white p-4"><div className="flex items-center justify-between gap-3 mb-2"><h6 className="text-[10px] font-bold uppercase tracking-wider text-jh-earth-600">Priority Assessment</h6>{analysis.priorityScore !== undefined && analysis.priorityScore !== null && <span className="text-[11px] font-bold text-jh-green-800">Score: {analysis.priorityScore}</span>}</div>{priorityReasons.length > 0 ? <ul className="space-y-1.5 text-xs text-jh-charcoal">{priorityReasons.map((reason, index) => <li key={`${reason}-${index}`} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-jh-green-700 mt-1.5 shrink-0" /><span>{reason}</span></li>)}</ul> : <p className="text-xs text-jh-earth-600">No priority reasons were returned by the backend.</p>}</div>
            <div className="rounded-xl border border-jh-earth-200 bg-white p-4"><h6 className="text-[10px] font-bold uppercase tracking-wider text-jh-earth-600 mb-2">Keywords</h6>{keywords.length > 0 ? <div className="flex flex-wrap gap-2">{keywords.map((keyword, index) => <span key={`${keyword}-${index}`} className="px-2 py-1 rounded-lg bg-jh-earth-100 text-jh-earth-800 border border-jh-earth-200 text-[11px] font-semibold">{keyword}</span>)}</div> : <p className="text-xs text-jh-earth-600">No keywords were returned by the backend.</p>}</div>
          </div>

          <div className={`rounded-xl border p-4 ${duplicate?.found ? 'border-orange-200 bg-orange-50' : 'border-emerald-200 bg-emerald-50'}`}><div className="flex items-start gap-3">{duplicate?.found ? <Copy className="w-5 h-5 text-orange-700 mt-0.5 shrink-0" aria-hidden="true" /> : <XCircle className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" aria-hidden="true" />}<div className="min-w-0"><h6 className="text-xs font-bold text-jh-green-950">{duplicate?.found ? 'Potential Duplicate Issue Detected' : 'No Duplicate Issue Detected'}</h6>{duplicate?.found ? <div className="mt-1.5 space-y-1 text-[11px] text-jh-earth-800">{duplicate.similarityPercentage !== undefined && duplicate.similarityPercentage !== null && <p>Similarity: <strong>{duplicate.similarityPercentage}%</strong></p>}{duplicate.candidateIssueId !== undefined && duplicate.candidateIssueId !== null && <p>Matching issue ID: <strong>{duplicate.candidateIssueId}</strong></p>}{duplicate.distanceKm !== undefined && duplicate.distanceKm !== null && <p>Distance: <strong>{duplicate.distanceKm} km</strong></p>}</div> : <p className="mt-1.5 text-[11px] text-jh-earth-700">The backend did not identify a matching duplicate in this analysis.</p>}</div></div></div>
          {analysis.source && <p className="text-[10px] text-jh-earth-500 text-right">Analysis source: {analysis.source}</p>}
        </>}
      </div>
    </section>
  );
};
