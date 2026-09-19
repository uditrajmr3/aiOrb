# Mia AI Orb Studio 🔮

> **Interactive 3D Procedural AI Living Orb Studio & Engine.**  
> Built with React, Three.js / React Three Fiber, custom GLSL displacement shaders, and real-time audio visualizer reactivity.

---

## 🌟 Overview

Mia AI Orb is a procedural, living AI entity designed to provide an organic, non-mechanical visual presence for AI agents. It responds dynamically to state changes (thinking, listening, executing, speaking, etc.) and real-time audio input.

### Key Visual Elements
1. **Fluid Deforming Membrane**: 16,000+ vertices displaced along normals via 3D Simplex noise and multi-octave FBM, with analytical normal recalculation and Fresnel rim lighting.
2. **Inner Pulsating Plasma Core**: Organic glowing energy sphere that breathes and expands with voice amplitude.
3. **Quantum Particle Swarm**: 700 additive-blended 3D particles that organize and scatter based on computational activity.
4. **Holographic Gyro Rings**: 3 inclined orbital rings rotating across multi-axis trajectories.
5. **Acoustic Waveform Deformations**: Ripples and surface waves driven by live microphone or synthetic speech waveforms.

---

## 🏗️ Architecture & Project Structure

```
aiOrb/
├── src/
│   ├── components/
│   │   ├── orb/
│   │   │   ├── MiaOrb.jsx                 # React Three Fiber 3D Orb component
│   │   │   ├── useAudioVisualizer.js      # Web Audio API hook (live mic + synthesizer)
│   │   │   ├── shaders/
│   │   │   │   └── orbShaders.js          # Custom GLSL vertex & fragment shaders
│   │   │   └── constants/
│   │   │       └── orbConfig.js           # 8 AI intelligence states and color definitions
│   │   ├── dashboard/
│   │   │   └── MiaDashboard.jsx           # Agent activity & telemetry HUD
│   │   └── studio/
│   │       └── OrbStudioControls.jsx      # Real-time state, audio, and visual parameter controls
│   ├── engine/
│   │   └── orbEngine.js                   # Pure Three.js standalone engine (zero React dependencies)
│   ├── App.jsx                            # Main studio container (Dashboard & Studio modes)
│   ├── main.jsx                           # Application entry point
│   └── index.css                          # Futuristic dark-mode glassmorphism design system
├── scripts/
│   └── build_inline.cjs                   # HTML asset bundling script for Flutter
├── packages/
│   └── mia_orb/                           # Standalone Flutter Package / SDK
├── docs/
│   └── references/                        # Design reference mockups
├── vite.config.js                         # Web app bundler config
└── vite.engine.config.js                  # Standalone engine bundler config
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Interactive 3D Studio
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build Production Web Application
```bash
npm run build
```

### 4. Compile Standalone Engine for Flutter
To compile the Three.js engine and procedural shaders into a self-contained offline asset bundle for the `mia_orb` Flutter package:
```bash
npm run build:engine
```
This produces `orb_engine.bundle.js` and `orb_engine_inline.html` inside `packages/mia_orb/assets/`.

---

## 🧠 Supported AI Intelligence States

| State | Status | Primary Color | Visual Behavior |
| :--- | :--- | :--- | :--- |
| **`idle`** | Calm presence | Cyan (`#38bdf8`) | Gentle breathing, soft surface ripple, low turbulence |
| **`listening`** | Focused attention | Luminous Cyan (`#00f2fe`) | High sensitivity, acoustic deformation waves |
| **`thinking`** | Neural processing | Electric Violet (`#b072ff`) | High frequency swirl, organized particle rotation |
| **`executing`** | Action in motion | Solar Amber (`#f59e0b`) | High speed flow, intense plasma distortion |
| **`speaking`** | Voice synthesis | Vivid Cyan (`#22d3ee`) | Rhythmic breathing synchronized with voice audio |
| **`waiting`** | Standby sync | Slate Sky (`#38bdf8`) | Slow ambient drift, minimal energy consumption |
| **`attention`** | Requires input | Crimson Rose (`#f43f5e`) | High luminescence glow, alert pulsing |
| **`offline`** | Dormant resting | Slate (`#334155`) | Low contrast, dim core, resting baseline |

---

## 🔄 Adding New Orb Versions & Presets

The codebase is designed to support multiple versioned orb architectures (e.g., `v1-fluid-membrane`, `v2-volumetric-hologram`, etc.):
- State configurations are centralized in `src/components/orb/constants/orbConfig.js`.
- Shaders are modularized in `src/components/orb/shaders/orbShaders.js`.
- Standalone engine exports in `src/engine/orbEngine.js` can be tagged or branched for versioned releases.

---

## 📄 License
MIT © Mia AI
