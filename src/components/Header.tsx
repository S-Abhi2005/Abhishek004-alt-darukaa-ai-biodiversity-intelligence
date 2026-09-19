/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sprout, SlidersHorizontal, Download, Sparkles, Database, CheckCircle2 } from 'lucide-react';
import { ScenarioPreset } from '../types.js';

interface HeaderProps {
  scenarios: ScenarioPreset[];
  activeScenarioId: string | null;
  onSelectScenario: (scenario: ScenarioPreset) => void;
  onOpenModal: () => void;
  onExportReport: () => void;
  completenessScore: number;
  isAnalyzing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  scenarios,
  activeScenarioId,
  onSelectScenario,
  onOpenModal,
  onExportReport,
  completenessScore,
  isAnalyzing,
}) => {
  return (
    <header className="border-b border-stone-200 bg-stone-50/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-emerald-400 shadow-sm ring-1 ring-emerald-950/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl font-bold tracking-tight text-stone-900 font-sans">
                  Darukaa Earth
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Agro-Ecological Intelligence
                </span>
              </div>
              <p className="text-xs text-stone-500 font-normal">
                Evidence-grounded land restoration, causal modeling & agronomic thresholds
              </p>
            </div>
          </div>

          {/* Actions & Metrics */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Completeness Badge */}
            <div
              id="completeness-indicator"
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200 text-xs text-stone-700"
              title="Metric Completeness for current parcel"
            >
              <Database className="w-3.5 h-3.5 text-stone-500" />
              <span className="font-medium text-stone-600">Completeness:</span>
              <span
                className={`font-bold ${
                  completenessScore >= 80
                    ? 'text-emerald-700'
                    : completenessScore >= 50
                    ? 'text-amber-700'
                    : 'text-rose-700'
                }`}
              >
                {completenessScore}%
              </span>
            </div>

            {/* Custom Metrics Modal trigger */}
            <button
              id="btn-open-metrics-modal"
              onClick={onOpenModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-medium transition shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-600" />
              <span>Parcel Parameters</span>
            </button>

            {/* Export Report */}
            <button
              id="btn-export-report"
              onClick={onExportReport}
              disabled={isAnalyzing}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Scientific Brief</span>
            </button>
          </div>
        </div>

        {/* Quick Scenario Preset Strip */}
        <div className="mt-3 pt-3 border-t border-stone-200/70 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-stone-500 font-medium whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-700" />
            Field Scenarios:
          </span>
          {scenarios.map((sc) => {
            const isActive = activeScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                id={`scenario-tab-${sc.id}`}
                onClick={() => onSelectScenario(sc)}
                className={`px-2.5 py-1 rounded-md transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 border ${
                  isActive
                    ? 'bg-emerald-900 text-white border-emerald-900 font-medium'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                }`}
              >
                <span>{sc.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-emerald-800 text-emerald-200' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {sc.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
