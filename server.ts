/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { runAnalysisPipeline } from './server/scientistEngine.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Darukaa Earth Environmental Intelligence',
      version: '2.4.0',
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // API Route: Run Scientific Agro-Ecological Analysis
  app.post('/api/analyze', async (req, res) => {
    try {
      const { query = '', params = {}, answers = {} } = req.body;
      const result = await runAnalysisPipeline(query, params, answers);
      res.json(result);
    } catch (error: any) {
      console.error('Error in /api/analyze:', error);
      res.status(500).json({
        error: 'Failed to complete agro-ecological analysis',
        message: error.message,
      });
    }
  });

  // API Route: Get Pre-Configured Agro-Ecological Scenarios
  app.get('/api/scenarios', (req, res) => {
    try {
      const kbPath = path.join(process.cwd(), 'data', 'knowledge_base.json');
      if (fs.existsSync(kbPath)) {
        const kb = JSON.parse(fs.readFileSync(kbPath, 'utf-8'));
        res.json({ scenarios: kb.scenarios || [] });
      } else {
        res.json({ scenarios: [] });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Get Knowledge Base & Causal Graph Topology
  app.get('/api/knowledge', (req, res) => {
    try {
      const kbPath = path.join(process.cwd(), 'data', 'knowledge_base.json');
      const thresholdsPath = path.join(process.cwd(), 'data', 'structured_thresholds.json');

      const kb = fs.existsSync(kbPath) ? JSON.parse(fs.readFileSync(kbPath, 'utf-8')) : {};
      const thresholds = fs.existsSync(thresholdsPath) ? JSON.parse(fs.readFileSync(thresholdsPath, 'utf-8')) : {};

      res.json({
        causalGraph: kb.causal_graph || { nodes: [], edges: [] },
        thresholds: thresholds.parameters || {},
        interventions: thresholds.interventions || [],
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Export Scientific Brief
  app.post('/api/export-report', (req, res) => {
    try {
      const { analysis } = req.body;
      if (!analysis) {
        return res.status(400).json({ error: 'Missing analysis payload' });
      }

      const markdown = `# Darukaa Earth: Scientific Agro-Ecological Intelligence Report
Generated: ${analysis.timestamp || new Date().toISOString()}
Target Eco-Zone: ${analysis.parcel?.region || 'Global'}
Primary Ecological Focus: ${analysis.parcel?.primaryIssue || 'Land Restoration'}

## 1. Parcel Agronomic Profile & Completeness
- Completeness Score: ${analysis.completenessScore}%
- Soil pH: ${analysis.parcel?.soilPH ?? 'Not specified'}
- Soil Organic Carbon (SOC): ${analysis.parcel?.socPercent ? analysis.parcel.socPercent + '%' : 'Not specified'}
- Salinity (EC): ${analysis.parcel?.salinityEC ? analysis.parcel.salinityEC + ' dS/m' : 'Not specified'}
- Topographical Slope: ${analysis.parcel?.slopePercent ? analysis.parcel.slopePercent + '%' : 'Not specified'}
- Annual Rainfall: ${analysis.parcel?.annualRainfallMm ? analysis.parcel.annualRainfallMm + ' mm' : 'Not specified'}
- Soil Texture: ${analysis.parcel?.soilTexture ?? 'Not specified'}
- Parcel Area: ${analysis.parcel?.acreage ? analysis.parcel.acreage + ' Hectares' : 'Not specified'}

## 2. Scientific Synthesis
${analysis.synthesisSummary}

## 3. Prioritized Ecological Interventions
${analysis.recommendations?.map((r: any, idx: number) => `
### ${idx + 1}. ${r.title} (Suitability Match: ${r.suitabilityScore}%)
**Category:** ${r.category}
**Description:** ${r.summary}

#### Causal Biogeochemical Mechanisms
${r.causalPathways?.map((p: any) => `- **${p.fromNode}** → **${p.toNode}** [${p.polarity} impact, confidence ${Math.round(p.confidenceScore * 100)}%]: ${p.mechanism} *(Source: ${p.literatureSource})*`).join('\n')}

#### Scientific Citations & Grounded Thresholds
${r.citations?.map((c: any) => `- **${c.organization} (${c.year})** - ${c.reportTitle}: "${c.keyFinding}" [Threshold: ${c.quantitativeThreshold}]`).join('\n')}

#### Co-Benefits & Market Readiness
- Carbon Sequestration: ${r.coBenefits?.carbonSequestrationRate}
- Biodiversity Acceleration: ${r.coBenefits?.biodiversityGain}
- Water Permeability Gain: ${r.coBenefits?.waterInfiltrationRate}
- ESG / Credit Alignment: ${r.coBenefits?.creditsCompliance?.join(', ')}

#### Implementation Timeline & Phasing
${r.implementationSteps?.map((s: any) => `- **${s.phase} (${s.monthRange}):** ${s.action}\n  *Guardrail:* ${s.criticalGuardrail}`).join('\n')}
`).join('\n---')}

---
*Report certified by Darukaa Earth Decision Intelligence Engine.*
`;

      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader('Content-Disposition', 'attachment; filename="darukaa_earth_report.md"');
      res.send(markdown);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Darukaa Earth Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
