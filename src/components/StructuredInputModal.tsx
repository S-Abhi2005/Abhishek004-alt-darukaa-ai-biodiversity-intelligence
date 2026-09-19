/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sliders, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { LandParcelParams } from '../types.js';

interface StructuredInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: LandParcelParams;
  onApply: (updatedParams: LandParcelParams) => void;
}

export const StructuredInputModal: React.FC<StructuredInputModalProps> = ({
  isOpen,
  onClose,
  params,
  onApply,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<LandParcelParams>({ ...params });

  const handleChange = (field: keyof LandParcelParams, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(formData);
    onClose();
  };

  // Qualitative interpretations
  const getPHLabel = (ph?: number) => {
    if (!ph) return 'Unset';
    if (ph < 5.5) return 'Strongly Acidic (Al toxicity risk)';
    if (ph <= 7.2) return 'Optimal Agronomic Range';
    if (ph <= 8.2) return 'Alkaline (Calcareous)';
    return 'Severe Sodic Hazard (Clay dispersion)';
  };

  const getSOCLabel = (soc?: number) => {
    if (!soc) return 'Unset';
    if (soc < 0.6) return 'Critically Depleted (<0.6%)';
    if (soc < 1.5) return 'Moderate (0.6 - 1.5%)';
    return 'Optimal / High Organic (>1.5%)';
  };

  const getSalinityLabel = (ec?: number) => {
    if (!ec) return 'Unset';
    if (ec < 2.0) return 'Non-Saline (<2 dS/m)';
    if (ec < 4.0) return 'Slightly Saline (2-4 dS/m)';
    if (ec < 8.0) return 'Moderately Saline (4-8 dS/m)';
    return 'Severely Saline (>8 dS/m)';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="structured-input-modal"
        className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Land Parcel Agronomic Metrics
              </h2>
              <p className="text-xs text-stone-500">
                Configure soil physics, chemistry, and topographical thresholds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleApply} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Region */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Eco-Region / Climate Zone
              </label>
              <input
                type="text"
                value={formData.region || ''}
                onChange={(e) => handleChange('region', e.target.value)}
                placeholder="e.g. Semi-Arid Drylands, Tropical Highlands"
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
              />
            </div>

            {/* Acreage */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Total Area (Hectares)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                value={formData.acreage || ''}
                onChange={(e) => handleChange('acreage', parseFloat(e.target.value) || undefined)}
                placeholder="e.g. 15.0"
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
              />
            </div>

            {/* Soil pH */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-stone-800">
                  Soil pH: <span className="font-bold text-emerald-800">{formData.soilPH ?? '—'}</span>
                </label>
                <span className="text-[10px] text-stone-500">{getPHLabel(formData.soilPH)}</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="9.5"
                step="0.1"
                value={formData.soilPH ?? 6.5}
                onChange={(e) => handleChange('soilPH', parseFloat(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                <span>4.0 (Acidic)</span>
                <span>6.5 (Neutral)</span>
                <span>9.5 (Sodic)</span>
              </div>
            </div>

            {/* Soil Organic Carbon (SOC) */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-stone-800">
                  SOC: <span className="font-bold text-emerald-800">{formData.socPercent ? formData.socPercent + '%' : '—'}</span>
                </label>
                <span className="text-[10px] text-stone-500">{getSOCLabel(formData.socPercent)}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.5"
                step="0.05"
                value={formData.socPercent ?? 1.0}
                onChange={(e) => handleChange('socPercent', parseFloat(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                <span>0.2% (Depleted)</span>
                <span>1.5% (Moderate)</span>
                <span>3.5% (Rich)</span>
              </div>
            </div>

            {/* Salinity (EC dS/m) */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-stone-800">
                  Salinity (EC): <span className="font-bold text-emerald-800">{formData.salinityEC ? formData.salinityEC + ' dS/m' : '—'}</span>
                </label>
                <span className="text-[10px] text-stone-500">{getSalinityLabel(formData.salinityEC)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="10.0"
                step="0.1"
                value={formData.salinityEC ?? 1.2}
                onChange={(e) => handleChange('salinityEC', parseFloat(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                <span>0.1 (Fresh)</span>
                <span>4.0 (Threshold)</span>
                <span>10.0 (Severe)</span>
              </div>
            </div>

            {/* Slope % */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-stone-800">
                  Slope Gradient: <span className="font-bold text-emerald-800">{formData.slopePercent ? formData.slopePercent + '%' : '—'}</span>
                </label>
                <span className="text-[10px] text-stone-500">
                  {(formData.slopePercent || 0) > 8 ? 'High Erosion Risk' : 'Standard Infiltration'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={formData.slopePercent ?? 3}
                onChange={(e) => handleChange('slopePercent', parseFloat(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                <span>0% (Flat)</span>
                <span>5% (Contour trigger)</span>
                <span>25% (Steep)</span>
              </div>
            </div>

            {/* Annual Rainfall */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Annual Rainfall (mm/year)
              </label>
              <input
                type="number"
                step="10"
                min="100"
                max="4000"
                value={formData.annualRainfallMm || ''}
                onChange={(e) => handleChange('annualRainfallMm', parseInt(e.target.value, 10) || undefined)}
                placeholder="e.g. 650"
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
              />
            </div>

            {/* Soil Texture */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Soil Texture Class
              </label>
              <select
                value={formData.soilTexture || ''}
                onChange={(e) => handleChange('soilTexture', e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 bg-white"
              >
                <option value="">Select Texture...</option>
                <option value="Sandy">Sandy (High Leaching)</option>
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Loam">Loam (Ideal)</option>
                <option value="Silt Loam">Silt Loam</option>
                <option value="Clay Loam">Clay Loam</option>
                <option value="Clay">Clay (Compaction risk)</option>
                <option value="Heavy Clay">Heavy Clay (Drainage risk)</option>
              </select>
            </div>
          </div>

          {/* Primary Ecological Issue */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Primary Ecological Challenge / Degradation
            </label>
            <input
              type="text"
              value={formData.primaryIssue || ''}
              onChange={(e) => handleChange('primaryIssue', e.target.value)}
              placeholder="e.g. Salinization, Topsoil Erosion, Organic Matter Depletion, Water Stress"
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-stone-200 flex justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-medium hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium shadow-xs transition cursor-pointer flex items-center space-x-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply & Re-analyze</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
