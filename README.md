# Darukaa.Earth AI Environmental Scientist System
### Evidence-Backed Agroecological & Biodiversity Intelligence Reasoning Engine

[![Hackathon Target](https://img.shields.io/badge/Darukaa.Earth-Hackathon%20Submission-059669.svg)](#)
[![Reasoning](https://img.shields.io/badge/Engine-Causal%20Graph%20%2B%20Hybrid%20RAG-10b981.svg)](#)
[![Validation](https://img.shields.io/badge/Scientific%20Validation-FAO%20%7C%20IPCC%20%7C%20USDA-34d399.svg)](#)
[![Tests](https://img.shields.io/badge/Automated%20Tests-7%2F7%20Passing-emerald.svg)](#)

---

## 🌍 Executive Summary

The **Darukaa.Earth AI Environmental Scientist System** is an evidence-backed conversational intelligence platform engineered specifically to reject shallow, single-variable, generic LLM responses (e.g. *"practice sustainable farming"*).

Built for the Darukaa.Earth Biodiversity Intelligence hackathon, every recommendation generated:
1. Traces **at least 3 interconnected environmental variables** through an explicit ecological causal graph.
2. Formulates recommendations strictly grounded in **retrievable peer-reviewed scientific literature** (FAO Conservation Agriculture, IPCC AR6 WGIII AFOLU, USDA NRCS, IPBES Global Pollinator Assessment).
3. Enforces **quantitative measurable estimates** (SOC % increases, AWC water retention gallons/acre, pollinator visitation rates).
4. Employs a **Completeness Checker** that triggers targeted clarifying questions when core baseline indicators (Soil, Land Use, Climate) are missing, instead of hallucinating.
5. Maintains **multi-turn session memory** with SQLite-backed state tracking across follow-ups and counterfactual refinements.

---

## 🏛️ System Architecture

```
                                 USER INPUT
             (Natural Language Chat OR Structured JSON Payload)
                                     │
                                     ▼
                    ┌─────────────────────────────────┐
                    │      COMPLETENESS CHECKER       │
                    │  (Soil, Land Use, Climate/Rain) │
                    └────────────────┬────────────────┘
                                     │
               Is input incomplete?  │
                   ┌─────────────────┴─────────────────┐
                   │ YES                               │ NO
                   ▼                                   ▼
        ┌──────────────────────┐           ┌──────────────────────┐
        │ CLARIFYING QUESTION  │           │   HYBRID RETRIEVAL   │
        │  (Targeted Prompts)  │           │  Vector TF-IDF +     │
        └──────────────────────┘           │ Structured Thresholds│
                                           └──────────┬───────────┘
                                                      │
                                                      ▼
                                           ┌──────────────────────┐
                                           │ MULTI-METRIC CAUSAL  │
                                           │   REASONING GRAPH    │
                                           │  (Traces >= 3 Vars)  │
                                           └──────────┬───────────┘
                                                      │
                                                      ▼
                                           ┌──────────────────────┐
                                           │   SCIENTIFIC ENGINE  │
                                           │  Evidence Synthesis  │
                                           │ (Dual Grounded Mode) │
                                           └──────────┬───────────┘
                                                      │
                                                      ▼
                                           ┌──────────────────────┐
                                           │   PHASE 6 VALIDATOR  │
                                           │  (Rejects Boilerplate│
                                           │   Verifies Numbers)  │
                                           └──────────┬───────────┘
                                                      │
                                                      ▼
                                             STRUCTURED OUTPUT
                                     (Recommendation, Mechanism,
                                      Metrics, Horizon, Citations)
```

---

## 🧪 Benchmark Scenario Walkthrough (Brief Evaluation Case)

### The Brief Test Query:
> *"My farm has 0.3% soil organic carbon, low rainfall, monoculture wheat in a semi-arid region."*

### Why Generic Chatbots Fail:
Standard LLM wrappers say: *"Rotate crops, use drip irrigation, and apply compost to improve sustainability."*
- ❌ No quantification.
- ❌ No biological mechanism.
- ❌ Single-variable reasoning ignoring the semi-arid hydrologic deficit.
- ❌ Zero scientific citations.

### How Darukaa.Earth Resolves It:
1. **Completeness Check**: Detects Soil (SOC = 0.3%), Climate (Semi-Arid Low Rainfall), and Land Use (Monoculture Wheat) are all present (`is_complete = True`).
2. **Empirical Threshold Check**:
   - `SOC 0.3%` < 0.6% critical threshold (FAO World Soil Charter).
   - `Monoculture Wheat`: High wind erosion (18.5 t/ha/yr), low biodiversity score (0.2).
   - `Semi-Arid`: High hydraulic deficit, evaporation > precipitation.
3. **Causal Graph Trace (4 variables traced)**:
   - `Land use (monoculture)` ➔ limits carbon inputs.
   - `SOC (0.3%)` ➔ sub-critical collapse of mycorrhizal networks & aggregate stability.
   - `Water retention` ➔ loss of Available Water Capacity (~20,000 gal/acre).
   - `Rainfall (<500mm)` ➔ soil crusting & lack of perennial floral forage for pollinators.
4. **Structured Scientific Recommendation Generated**:
   - **Recommendation**: Transition to agroforestry alley cropping (8–12m rows) with *Faidherbia albida* and drought-hardy legume cover crops (*Vicia villosa*) under zero-tillage.
   - **Why It Works**: *Faidherbia albida* taproots (2–4m) perform nocturnal hydraulic lift, transferring deep moisture to the wheat rooting zone. *Vicia villosa* biomass stimulates glomalin synthesis, cementing macro-aggregates and reducing erosion from 18.5 t/ha/yr to <2.5 t/ha/yr.
   - **Impacted Metrics**: SOC +15% to +25% (+0.20% to +0.35% absolute) over 24–36 months; Available Water Capacity expands by ~22,000 gal/acre; wild pollinator visits surge from <5 to >45 visits/100m²/hr.
   - **Time Horizon**: Medium-term (microclimate cooling in Season 1; full recovery in 24–36 months).
   - **Sources**: FAO Conservation Agriculture Technical Manual (2020); IPCC AR6 WGIII Chapter 7 (AFOLU); USDA NRCS Note 19; IPBES Pollinators Assessment.

---

## 🚀 Quick Start & Local Execution

### 1. Prerequisites
- Node.js 18+
- Python 3.10+

### 2. Install & Build
```bash
# Clone repository
git clone https://github.com/darukaa-earth/biodiversity-scientist.git
cd biodiversity-scientist

# Install frontend and server dependencies
npm install

# (Optional) Rebuild the RAG vector index from markdown sources
python3 backend/ingestion/ingest.py

# Run the 7 automated evaluation tests
python3 backend/tests/test_api.py
# (or npm run test:python)
```

### 3. Launch Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 📡 API Reference

### 1. Chat & Conversational Reasoning (`POST /api/chat`)
Stateful conversational endpoint supporting natural language and multi-turn context retention.

**Request:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "evaluator_session_1",
    "message": "My farm has 0.3% soil organic carbon, low rainfall, monoculture wheat in a semi-arid region."
  }'
```

**Response Format:**
```json
{
  "is_clarifying_question": false,
  "recommendation": "Transition from continuous wheat monoculture to agroforestry alley cropping...",
  "why_it_works": "In semi-arid climes, monoculture bare fallow oxidizes soil organic matter...",
  "impacted_metrics": "Soil organic carbon increases by +15% to +25% over 2–3 years; microbial biomass carbon +45%...",
  "time_horizon": "Medium-term (microclimate cooling in Season 1; full recovery in 24–36 months)",
  "confidence_level": "High (backed by 4 convergent peer-reviewed FAO and IPCC field trials)",
  "source": "FAO Conservation Agriculture Technical Manual (2020); IPCC AR6 WGIII Chapter 7 (AFOLU)",
  "variables_traced": ["land_use", "soil_organic_carbon", "rainfall", "pollinator_activity", "water_retention"],
  "causal_chain": [
    "Continuous monoculture wheat without crop residues limits carbon inputs -> SOC suppressed at 0.3%",
    "Sub-critical SOC (<0.6%) starves arbuscular mycorrhizal fungi -> microbial biomass carbon collapses by >50%",
    "Lack of organic matter collapses soil aggregate stability -> Available Water Capacity drops by ~20,000 gal/acre",
    "Semi-arid low rainfall (<500mm) causes rapid crusting -> floral nectar void for wild pollinators",
    "Intervention: Agroforestry alley cropping with Faidherbia albida + Vicia villosa reverses all 4 variables simultaneously."
  ],
  "session_context": {
    "soil_organic_carbon_pct": 0.3,
    "rainfall": "low",
    "land_use": "monoculture_wheat",
    "region_climate": "semi-arid"
  }
}
```

---

### 2. Structured Input (`POST /api/structured-input`)
Submits structured JSON parameters directly matching Pydantic validation rules.

**Request:**
```bash
curl -X POST http://localhost:3000/api/structured-input \
  -H "Content-Type: application/json" \
  -d '{
    "soil_organic_carbon_pct": 0.8,
    "rainfall": "moderate",
    "land_use": "cropland",
    "pesticide_intensity_kg_ha": 4.2,
    "lat": 31.5,
    "lon": 74.3
  }'
```

---

### 3. Evaluator Knowledge Inspector (`POST /debug/retrieve`)
Exposes the internal RAG retrieval pipeline and causal graph activations for evaluation transparency.

**Request:**
```bash
curl -X POST http://localhost:3000/debug/retrieve \
  -H "Content-Type: application/json" \
  -d '{
    "query": "monoculture wheat soil organic carbon semi-arid",
    "top_k": 4,
    "structured_metrics": {
      "soil_organic_carbon_pct": 0.3,
      "land_use": "monoculture_wheat",
      "lat": 31.5,
      "lon": 74.3
    }
  }'
```

---

## 🔬 Hackathon Evaluator Checklist

| Evaluation Criterion | Implementation Verification |
|---|---|
| **No Generic Answers** | Output validator (`engine.py` / `scientistEngine.ts`) rejects boilerplate like *"use sustainable practices"*; enforces numbers (`%`, `kg/ha`, `gal/acre`). |
| **Scientific Literature Citations** | Minimum 1 peer-reviewed / institutional source (FAO, IPCC, USDA, IPBES) strictly cited in every recommendation. |
| **Multi-Metric Causal Reasoning** | Causal graph explicitly traces $\ge 3$ interconnected environmental variables per intervention. |
| **Completeness & Clarifying Questions** | Incomplete queries (`"Biodiversity is declining on my land"`) return structured clarifying questions instead of guessing. |
| **Multi-Turn Memory** | Context merges across turns (`Turn 1: SOC 0.3%` + `Turn 2: Semi-arid wheat` = Complete synthesis). |
| **Inspectable RAG Pipeline** | `/debug/retrieve` endpoint and UI Inspector tab visualize vector scores and threshold matches. |
