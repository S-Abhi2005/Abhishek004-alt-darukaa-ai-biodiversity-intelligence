/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LandParcelParams {
  region: string;
  soilPH?: number;
  socPercent?: number;
  salinityEC?: number;
  slopePercent?: number;
  annualRainfallMm?: number;
  soilTexture?: 'Sandy' | 'Sandy Loam' | 'Sandy Clay' | 'Loam' | 'Silt Loam' | 'Clay Loam' | 'Clay' | 'Heavy Clay';
  primaryIssue?: string;
  acreage?: number;
  targetGoal?: string;
}

export interface ClarifyingQuestion {
  id: string;
  field: keyof LandParcelParams;
  question: string;
  context: string;
  impactOnConfidence: string;
  options: Array<{
    label: string;
    value: string | number;
    description?: string;
  }>;
  answeredValue?: string | number;
}

export interface CausalNode {
  id: string;
  label: string;
  type: 'intervention' | 'biogeochemical_intermediate' | 'outcome';
}

export interface CausalEdge {
  source: string;
  target: string;
  polarity: '+' | '-';
  confidence: number;
  citation: string;
}

export interface CausalChainStep {
  fromNode: string;
  toNode: string;
  mechanism: string;
  polarity: '+' | '-';
  confidenceScore: number;
  literatureSource: string;
}

export interface EvidenceCitation {
  organization: 'FAO' | 'IPCC' | 'USDA NRCS' | 'IPBES' | 'Nature Finance';
  reportTitle: string;
  year: number;
  keyFinding: string;
  quantitativeThreshold: string;
  sectionOrChapter?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  category: string;
  suitabilityScore: number; // 0 - 100
  summary: string;
  causalPathways: CausalChainStep[];
  citations: EvidenceCitation[];
  implementationSteps: Array<{
    phase: string;
    monthRange: string;
    action: string;
    criticalGuardrail: string;
  }>;
  contraindications: string[];
  coBenefits: {
    carbonSequestrationRate: string; // e.g. "0.65 t C/ha/yr (~2.38 t CO2e/ha/yr)"
    biodiversityGain: string;       // e.g. "+65% pollinator & microfauna index"
    waterInfiltrationRate: string;   // e.g. "+40-60 mm/hr saturated Ksat"
    creditsCompliance: string[];    // e.g. ["TNFD Nature Positive", "Verra VM0042", "BRSR Core"]
  };
}

export interface RetrievedDocumentChunk {
  id: string;
  documentName: string;
  relevanceScore: number; // 0 - 1
  excerpt: string;
  matchedThresholds: string[];
}

export interface AnalysisResult {
  parcel: LandParcelParams;
  completenessScore: number; // 0 - 100
  missingParameters: Array<{
    field: string;
    label: string;
    criticality: 'High' | 'Medium' | 'Low';
  }>;
  clarifyingQuestions: ClarifyingQuestion[];
  recommendations: Recommendation[];
  retrievedDocuments: RetrievedDocumentChunk[];
  causalNodesTraversed: string[];
  synthesisSummary: string;
  timestamp: string;
}

export interface ScenarioPreset {
  id: string;
  label: string;
  tag: string;
  region: string;
  description: string;
  query: string;
  params: LandParcelParams;
}
