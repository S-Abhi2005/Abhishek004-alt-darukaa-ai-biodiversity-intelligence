/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  Compass,
  FileCheck,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  MapPin,
  Layers,
  Leaf,
  Info
} from 'lucide-react';
import { Header } from './components/Header.js';
import { StructuredInputModal } from './components/StructuredInputModal.js';
import { ClarifyingQuestionCard } from './components/ClarifyingQuestionCard.js';
import { RecommendationCard } from './components/RecommendationCard.js';
import { DebugRetrievalPane } from './components/DebugRetrievalPane.js';
import { LandParcelParams, AnalysisResult, ScenarioPreset } from './types.js';

export default function App() {
  const [query, setQuery] = useState('');
  const [params, setParams] = useState<LandParcelParams>({
    region: 'Semi-Arid Drylands',
    soilPH: 8.2,
    socPercent: 0.52,
    salinityEC: 5.4,
    slopePercent: 1.8,
    annualRainfallMm: 420,
    soilTexture: 'Clay Loam',
    primaryIssue: 'Salinization and High Water Table',
    acreage: 22,
    targetGoal: 'Salinity Reclamation & Halophytic Fodder',
  });
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [scenarios, setScenarios] = useState<ScenarioPreset[]>([]);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>('scenario_saline_pasture');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch preconfigured scenarios on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const res = await fetch('/api/scenarios');
        if (res.ok) {
          const data = await res.json();
          if (data.scenarios && data.scenarios.length > 0) {
            setScenarios(data.scenarios);
            const first = data.scenarios[0];
            setActiveScenarioId(first.id);
            setQuery(first.query);
            setParams(first.params);
            runAnalysis(first.query, first.params, {});
          }
        }
      } catch (err: any) {
        console.error('Failed to load initial scenarios:', err);
        // Run fallback
        runAnalysis('', params, {});
      }
    }
    loadInitialData();
  }, []);

  // Run analysis API
  const runAnalysis = async (
    q: string,
    p: LandParcelParams,
    ans: Record<string, any> = answers
  ) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, params: p, answers: ans }),
      });
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      const data: AnalysisResult = await res.json();
      setAnalysis(data);
      if (data.parcel) {
        setParams(data.parcel);
      }
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setError(err.message || 'Failed to complete agro-ecological analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectScenario = (scenario: ScenarioPreset) => {
    setActiveScenarioId(scenario.id);
    setQuery(scenario.query);
    setParams(scenario.params);
    setAnswers({});
    runAnalysis(scenario.query, scenario.params, {});
  };

  const handleAnswerQuestion = (field: string, value: string | number) => {
    const updatedAnswers = { ...answers, [field]: value };
    const updatedParams = { ...params, [field]: value };
    setAnswers(updatedAnswers);
    setParams(updatedParams);
    runAnalysis(query, updatedParams, updatedAnswers);
  };

  const handleApplyParamsFromModal = (updated: LandParcelParams) => {
    setParams(updated);
    runAnalysis(query, updated, answers);
  };

  const handleExportReport = async () => {
    if (!analysis) return;
    try {
      const res = await fetch('/api/export-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis }),
      });
      if (!res.ok) throw new Error('Failed to export report');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Darukaa_Earth_${(params.region || 'Report').replace(/\s+/g, '_')}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Report export failed:', err);
    }
  };

  const handleReset = () => {
    const defaultParams: LandParcelParams = {
      region: 'Custom Land Parcel',
      soilPH: 6.8,
      socPercent: 1.1,
      salinityEC: 1.2,
      slopePercent: 3.5,
      annualRainfallMm: 650,
      soilTexture: 'Loam',
      primaryIssue: 'General Land Restoration',
      acreage: 10,
    };
    setActiveScenarioId(null);
    setQuery('');
    setParams(defaultParams);
    setAnswers({});
    runAnalysis('', defaultParams, {});
  };

  const unansweredQuestions = analysis?.clarifyingQuestions?.filter(
    (q) => q.answeredValue === undefined
  ) || [];

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans antialiased selection:bg-emerald-200">
      {/* Top Header */}
      <Header
        scenarios={scenarios}
        activeScenarioId={activeScenarioId}
        onSelectScenario={handleSelectScenario}
        onOpenModal={() => setIsModalOpen(true)}
        onExportReport={handleExportReport}
        completenessScore={analysis?.completenessScore || 0}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Natural Language Query & Parameter Control Section */}
        <section
          aria-label="Query and Parameters"
          id="query-section"
          className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-emerald-800" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700">
                Land Restoration Inquiry & Parcel Specifications
              </h2>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center space-x-1 transition cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Blank Template</span>
            </button>
          </div>

          {/* Search/Query Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runAnalysis(query, params, answers);
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="inquiry-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. 20ha farm in Rajasthan with rising groundwater, EC 5.2 dS/m, low organic carbon, what biodrainage works?"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 bg-stone-50/50"
              />
            </div>
            <button
              id="btn-run-analysis"
              type="submit"
              disabled={isAnalyzing}
              className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Evaluating Causal Graph...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Run Agro-Ecological Analysis</span>
                </>
              )}
            </button>
          </form>

          {/* Parcel Active Parameters Pill Strip */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-stone-500 uppercase mr-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-stone-400" />
              Active Metrics:
            </span>

            <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 text-xs border border-stone-200">
              Region: <strong className="text-stone-900">{params.region}</strong>
            </span>

            {params.soilPH !== undefined && (
              <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 text-xs border border-stone-200">
                pH: <strong className="text-emerald-800">{params.soilPH}</strong>
              </span>
            )}

            {params.socPercent !== undefined && (
              <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 text-xs border border-stone-200">
                SOC: <strong className="text-emerald-800">{params.socPercent}%</strong>
              </span>
            )}

            {params.salinityEC !== undefined && (
              <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 text-xs border border-stone-200">
                Salinity: <strong className="text-emerald-800">{params.salinityEC} dS/m</strong>
              </span>
            )}

            {params.slopePercent !== undefined && (
              <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 text-xs border border-stone-200">
                Slope: <strong className="text-emerald-800">{params.slopePercent}%</strong>
              </span>
            )}

            {params.annualRainfallMm !== undefined && (
              <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 text-xs border border-stone-200">
                Rainfall: <strong className="text-emerald-800">{params.annualRainfallMm} mm</strong>
              </span>
            )}

            {params.soilTexture && (
              <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 text-xs border border-stone-200">
                Texture: <strong className="text-emerald-800">{params.soilTexture}</strong>
              </span>
            )}

            {params.acreage && (
              <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 text-xs border border-stone-200">
                Area: <strong className="text-emerald-800">{params.acreage} ha</strong>
              </span>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="text-[11px] font-medium text-emerald-800 hover:text-emerald-950 underline ml-auto cursor-pointer flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Tune Parameters</span>
            </button>
          </div>
        </section>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-3 text-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Analysis Execution Error</div>
              <div className="mt-0.5">{error}</div>
            </div>
          </div>
        )}

        {/* Scientific Synthesis Summary Box */}
        {analysis?.synthesisSummary && (
          <section
            aria-label="Scientific Synthesis"
            id="synthesis-summary-section"
            className="bg-emerald-950 text-white rounded-2xl p-5 shadow-sm border border-emerald-900 relative overflow-hidden"
          >
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center space-x-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Agro-Ecological Scientific Synthesis
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-800">
                Evidence-Grounded
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-normal">
              {analysis.synthesisSummary}
            </p>
          </section>
        )}

        {/* Missing Metrics & Clarifying Questions Section */}
        {unansweredQuestions.length > 0 && (
          <section
            aria-label="Clarifying Questions"
            id="clarifying-questions-section"
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Missing Field Data ({unansweredQuestions.length}) — Click to Resolve Ambiguity
                </h3>
              </div>
              <span className="text-[11px] text-stone-500">
                Supplying missing values increases recommendation precision & confidence
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {unansweredQuestions.slice(0, 4).map((q) => (
                <ClarifyingQuestionCard
                  key={q.id}
                  question={q}
                  onAnswer={handleAnswerQuestion}
                />
              ))}
            </div>
          </section>
        )}

        {/* Prioritized Recommendations Feed */}
        <section
          aria-label="Prioritized Recommendations"
          id="recommendations-section"
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-emerald-800" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Scientifically Ranked Agro-Ecological Interventions ({analysis?.recommendations?.length || 0})
              </h3>
            </div>
            <div className="text-[11px] text-stone-500">
              Evaluated against FAO, IPCC AR6, USDA NRCS, and IPBES Thresholds
            </div>
          </div>

          {analysis?.recommendations && analysis.recommendations.length > 0 ? (
            <div className="space-y-4">
              {analysis.recommendations.map((rec, index) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  rank={index + 1}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
              <p className="text-sm text-stone-500">
                No matching recommendations. Please refine your inquiry or adjust parcel parameters.
              </p>
            </div>
          )}
        </section>

        {/* Causal Graph Architecture Overview Card */}
        <section
          aria-label="Causal Architecture"
          id="causal-overview-section"
          className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-800" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Underlying Agro-Ecological Causal Graph Architecture
              </h3>
            </div>
            <span className="text-[11px] text-stone-500">
              Biogeochemical State Transformations
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            The decision engine does not rely on black-box heuristics. Every recommendation is traced through directional causal edges: 
            <span className="font-semibold text-emerald-900"> Intervention </span> → 
            <span className="font-semibold text-sky-900"> Intermediate Biogeochemical Variable </span> → 
            <span className="font-semibold text-amber-900"> Measurable Ecological Outcome</span>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
              <div className="font-bold text-emerald-950 mb-1">1. Targeted Interventions</div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Zero Tillage, Multi-tier Riparian Strips, Contour Hedgerows, Halophytic Silvopasture, Biochar.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200 text-xs">
              <div className="font-bold text-sky-950 mb-1">2. Intermediate Biogeochemical States</div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Macro-Aggregate Stability, Saturated Infiltration (Ksat), Water Table Phreatic Surface, Mycorrhizae & CEC.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
              <div className="font-bold text-amber-950 mb-1">3. Ecological & Economic Outcomes</div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                SOC Stock Accrual (t C/ha/yr), Runoff Soil Retention, Drought Buffer, TNFD & BRSR Market Eligibility.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Structured Parameter Modal */}
      <StructuredInputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        params={params}
        onApply={handleApplyParamsFromModal}
      />

      {/* Bottom Scientific Transparency Inspector */}
      <DebugRetrievalPane analysis={analysis} />
    </div>
  );
}
