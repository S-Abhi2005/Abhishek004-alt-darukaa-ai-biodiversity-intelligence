/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GitBranch,
  BookOpen,
  Calendar,
  AlertTriangle,
  Award,
  ChevronRight,
  TrendingUp,
  Droplets,
  TreeDeciduous,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Recommendation } from '../types.js';

interface RecommendationCardProps {
  recommendation: Recommendation;
  rank: number;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  rank,
}) => {
  const [activeTab, setActiveTab] = useState<'causal' | 'implementation' | 'citations' | 'cobenefits'>('causal');

  return (
    <div
      id={`recommendation-card-${recommendation.id}`}
      className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden transition hover:shadow-md hover:border-stone-300"
    >
      {/* Header Banner */}
      <div className="p-5 border-b border-stone-100 bg-stone-50/50">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-emerald-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                {rank}
              </span>
              <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-sm bg-emerald-100/70 text-emerald-900 border border-emerald-200">
                {recommendation.category}
              </span>
            </div>
            <h3 className="text-base font-bold text-stone-900 leading-snug pt-1">
              {recommendation.title}
            </h3>
          </div>

          {/* Suitability Score */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-900 text-white shrink-0 self-start">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold">Suitability Match:</span>
            <span className="text-xs font-black text-emerald-300">
              {recommendation.suitabilityScore}%
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <p className="text-xs text-stone-600 mt-3 leading-relaxed">
          {recommendation.summary}
        </p>

        {/* Tab Controls */}
        <div className="flex items-center space-x-1 mt-4 pt-3 border-t border-stone-200/60 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('causal')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'causal'
                ? 'bg-emerald-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Causal Biogeochemical Pathways</span>
          </button>
          <button
            onClick={() => setActiveTab('implementation')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'implementation'
                ? 'bg-emerald-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Implementation Timeline</span>
          </button>
          <button
            onClick={() => setActiveTab('citations')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'citations'
                ? 'bg-emerald-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Scientific Evidence ({recommendation.citations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('cobenefits')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'cobenefits'
                ? 'bg-emerald-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Co-Benefits & TNFD Credits</span>
          </button>
        </div>
      </div>

      {/* Tab Body */}
      <div className="p-5">
        {/* Tab 1: Causal Pathways */}
        {activeTab === 'causal' && (
          <div className="space-y-3">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Verified Biogeochemical Transmission Chains
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {recommendation.causalPathways.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 hover:border-emerald-200 transition"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center space-x-2 text-xs font-bold text-stone-900">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">
                        {step.fromNode}
                      </span>
                      <span className="text-stone-400">→</span>
                      <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px]">
                        {step.toNode}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          step.polarity === '+'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {step.polarity === '+' ? 'Positive (+)' : 'Mitigating (-)'}
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium">
                        Conf: {Math.round(step.confidenceScore * 100)}%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed pl-1">
                    {step.mechanism}
                  </p>
                  <div className="text-[10px] text-stone-400 mt-1 pl-1 italic">
                    Source: {step.literatureSource}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Implementation Timeline */}
        {activeTab === 'implementation' && (
          <div className="space-y-3">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Phase-Gated Deployment Architecture
            </div>
            <div className="space-y-3">
              {recommendation.implementationSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-stone-200 bg-white relative pl-4 border-l-4 border-l-emerald-800"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-xs font-bold text-stone-900">
                      {step.phase}
                    </h5>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                      {step.monthRange}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {step.action}
                  </p>
                  <div className="mt-2 flex items-start space-x-1.5 p-2 rounded-lg bg-amber-50 border border-amber-200/70 text-[11px] text-amber-900">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Critical Guardrail:</strong> {step.criticalGuardrail}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Scientific Evidence & Citations */}
        {activeTab === 'citations' && (
          <div className="space-y-3">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Peer-Reviewed Guidelines & Multilateral Reports
            </div>
            <div className="space-y-2.5">
              {recommendation.citations.map((cite, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-stone-50 border border-stone-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-800 text-[10px] font-bold">
                        {cite.organization}
                      </span>
                      <span className="text-xs font-bold text-stone-900">
                        {cite.reportTitle}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-500 font-semibold">
                      {cite.year}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 mt-1 italic leading-relaxed">
                    "{cite.keyFinding}"
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-200/60">
                    <span>
                      <strong>Quantitative Threshold:</strong> {cite.quantitativeThreshold}
                    </span>
                    {cite.sectionOrChapter && <span>{cite.sectionOrChapter}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Co-Benefits & Carbon Credits */}
        {activeTab === 'cobenefits' && (
          <div className="space-y-4">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Quantified Co-Benefits & Environmental Disclosures
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Carbon Sequestration</span>
                </div>
                <div className="text-xs font-bold mt-1">
                  {recommendation.coBenefits.carbonSequestrationRate}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-800 mb-1">
                  <TreeDeciduous className="w-4 h-4" />
                  <span>Biodiversity Acceleration</span>
                </div>
                <div className="text-xs font-bold mt-1">
                  {recommendation.coBenefits.biodiversityGain}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-950">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-sky-800 mb-1">
                  <Droplets className="w-4 h-4" />
                  <span>Hydrological Retention</span>
                </div>
                <div className="text-xs font-bold mt-1">
                  {recommendation.coBenefits.waterInfiltrationRate}
                </div>
              </div>
            </div>

            {/* Compliance Standards */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-stone-700 block mb-1.5">
                Eligible Registry & Compliance Frameworks:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recommendation.coBenefits.creditsCompliance.map((std, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 text-[11px] font-medium border border-stone-200"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    <span>{std}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contraindications Callout */}
        {recommendation.contraindications && recommendation.contraindications.length > 0 && (
          <div className="mt-4 pt-3 border-t border-stone-200/70 flex items-start space-x-2 text-[11px] text-rose-800 bg-rose-50/60 p-2.5 rounded-lg border border-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Agronomic Contraindications: </span>
              <span>{recommendation.contraindications.join('; ')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
