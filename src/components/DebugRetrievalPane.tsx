/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Terminal, Database, FileText, ChevronDown, ChevronUp, Layers, Check, ExternalLink } from 'lucide-react';
import { AnalysisResult } from '../types.js';

interface DebugRetrievalPaneProps {
  analysis: AnalysisResult | null;
}

export const DebugRetrievalPane: React.FC<DebugRetrievalPaneProps> = ({ analysis }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'rag' | 'causal' | 'params'>('rag');

  if (!analysis) return null;

  return (
    <aside
      aria-label="Scientific Transparency"
      id="debug-retrieval-pane"
      className="border-t border-stone-200 bg-stone-900 text-stone-200 text-xs transition-all duration-200"
    >
      {/* Bar Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-mono font-semibold">
            <Terminal className="w-4 h-4" />
            <span>Scientific Transparency Engine</span>
          </div>
          <span className="text-stone-500">|</span>
          <span className="text-stone-400">
            {analysis.retrievedDocuments.length} RAG Documents Retrieved
          </span>
          <span className="text-stone-500">|</span>
          <span className="text-stone-400">
            {analysis.causalNodesTraversed.length} Causal Nodes Active
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer font-mono text-[11px]"
        >
          <span>{isExpanded ? 'Collapse Engine Inspector' : 'Inspect RAG & Causal Graph'}</span>
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Pane Body */}
      {isExpanded && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-stone-800">
          {/* Sub-tab navigation */}
          <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-stone-800 text-xs font-mono">
            <button
              onClick={() => setActiveSubTab('rag')}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                activeSubTab === 'rag' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-stone-400 hover:text-white'
              }`}
            >
              RAG Corpus Snippets ({analysis.retrievedDocuments.length})
            </button>
            <button
              onClick={() => setActiveSubTab('causal')}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                activeSubTab === 'causal' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-stone-400 hover:text-white'
              }`}
            >
              Active Causal Nodes ({analysis.causalNodesTraversed.length})
            </button>
            <button
              onClick={() => setActiveSubTab('params')}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                activeSubTab === 'params' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-stone-400 hover:text-white'
              }`}
            >
              Parcel State Matrix
            </button>
          </div>

          {/* Sub-Tab 1: RAG Corpus */}
          {activeSubTab === 'rag' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1 font-mono text-[11px]">
              {analysis.retrievedDocuments.map((doc) => (
                <div key={doc.id} className="p-3 rounded-lg bg-stone-950 border border-stone-800">
                  <div className="flex items-center justify-between mb-1 text-emerald-400">
                    <span className="font-bold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      {doc.documentName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-900 border border-stone-700 text-stone-300">
                      Score: {doc.relevanceScore}
                    </span>
                  </div>
                  <p className="text-stone-400 text-[10px] leading-relaxed mt-1.5">
                    {doc.excerpt}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {doc.matchedThresholds.map((th, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-stone-900 text-amber-300 text-[9px] border border-stone-800">
                        {th}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sub-Tab 2: Causal Nodes */}
          {activeSubTab === 'causal' && (
            <div className="space-y-3 font-mono">
              <p className="text-stone-400 text-xs">
                Nodes currently stimulated in the knowledge base graph based on parcel conditions:
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.causalNodesTraversed.map((nodeId) => (
                  <div
                    key={nodeId}
                    className="px-2.5 py-1 rounded bg-stone-950 border border-emerald-900/60 text-emerald-300 flex items-center space-x-1.5 text-xs"
                  >
                    <Layers className="w-3 h-3 text-emerald-400" />
                    <span>{nodeId}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Parcel State Matrix */}
          {activeSubTab === 'params' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px] text-stone-300 border-collapse">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-500">
                    <th className="py-1.5 pr-4">Parameter</th>
                    <th className="py-1.5 pr-4">Active Value</th>
                    <th className="py-1.5 pr-4">Status</th>
                    <th className="py-1.5">Scientific Implication</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  <tr>
                    <td className="py-1.5 pr-4 font-semibold text-stone-400">Soil pH</td>
                    <td className="py-1.5 pr-4 text-emerald-400">{analysis.parcel.soilPH ?? 'Not configured'}</td>
                    <td className="py-1.5 pr-4">
                      {analysis.parcel.soilPH ? (
                        <span className="text-emerald-400">Passed</span>
                      ) : (
                        <span className="text-amber-400">Missing</span>
                      )}
                    </td>
                    <td className="py-1.5 text-stone-400">Phosphorus and aluminum chemical equilibria</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 pr-4 font-semibold text-stone-400">Soil Organic Carbon (SOC)</td>
                    <td className="py-1.5 pr-4 text-emerald-400">
                      {analysis.parcel.socPercent ? analysis.parcel.socPercent + '%' : 'Not configured'}
                    </td>
                    <td className="py-1.5 pr-4">
                      {analysis.parcel.socPercent ? (
                        <span className="text-emerald-400">Passed</span>
                      ) : (
                        <span className="text-amber-400">Missing</span>
                      )}
                    </td>
                    <td className="py-1.5 text-stone-400">Aggregate stability and water holding reserve</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 pr-4 font-semibold text-stone-400">Salinity (EC)</td>
                    <td className="py-1.5 pr-4 text-emerald-400">
                      {analysis.parcel.salinityEC ? analysis.parcel.salinityEC + ' dS/m' : 'Not configured'}
                    </td>
                    <td className="py-1.5 pr-4">
                      {analysis.parcel.salinityEC ? (
                        <span className="text-emerald-400">Passed</span>
                      ) : (
                        <span className="text-amber-400">Missing</span>
                      )}
                    </td>
                    <td className="py-1.5 text-stone-400">Root-zone osmotic tension and ionic toxicity</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 pr-4 font-semibold text-stone-400">Topographical Slope</td>
                    <td className="py-1.5 pr-4 text-emerald-400">
                      {analysis.parcel.slopePercent ? analysis.parcel.slopePercent + '%' : 'Not configured'}
                    </td>
                    <td className="py-1.5 pr-4">
                      {analysis.parcel.slopePercent ? (
                        <span className="text-emerald-400">Passed</span>
                      ) : (
                        <span className="text-amber-400">Missing</span>
                      )}
                    </td>
                    <td className="py-1.5 text-stone-400">Runoff kinetic energy and terrace spacing</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 pr-4 font-semibold text-stone-400">Annual Rainfall</td>
                    <td className="py-1.5 pr-4 text-emerald-400">
                      {analysis.parcel.annualRainfallMm ? analysis.parcel.annualRainfallMm + ' mm' : 'Not configured'}
                    </td>
                    <td className="py-1.5 pr-4">
                      {analysis.parcel.annualRainfallMm ? (
                        <span className="text-emerald-400">Passed</span>
                      ) : (
                        <span className="text-amber-400">Missing</span>
                      )}
                    </td>
                    <td className="py-1.5 text-stone-400">Climatic water surplus vs deficit</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
