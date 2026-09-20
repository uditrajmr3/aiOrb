import * as THREE from "three";

export const ORB_STATES = {
  idle: {
    id: "idle",
    name: "IDLE",
    status: "Calm presence",
    subtitle: "A soft living core. Always with you.",
    badge: "READY",
    color: "#38bdf8",       // Electric Sky Cyan
    color2: "#6366f1",      // Indigo / Deep Blue
    accentColor: "#a5f3fc", // Bright white-cyan highlight
    coreColor: "#0284c7",
    distortion: 0.18,
    frequency: 2.2,
    speed: 0.35,
    flowSpeed: 0.45,
    glow: 1.25,
    roughness: 0.25,
    particleSpeed: 0.2,
    particleSize: 0.022,
    ringSpeed: 0.12,
    ringOpacity: 0.25,
    energyTurbulence: 0.3,
    audioMultiplier: 0.5,
  },

  listening: {
    id: "listening",
    name: "LISTENING",
    status: "Focused attention",
    subtitle: "Reacts to your voice. Real-time waveform shapes the orb.",
    badge: "LISTENING",
    color: "#00f2fe",       // Pure luminous cyan
    color2: "#4facfe",       // Vibrant blue wave
    accentColor: "#ffffff",
    coreColor: "#0284c7",
    distortion: 0.32,
    frequency: 3.4,
    speed: 0.75,
    flowSpeed: 0.9,
    glow: 1.6,
    roughness: 0.18,
    particleSpeed: 0.45,
    particleSize: 0.028,
    ringSpeed: 0.35,
    ringOpacity: 0.45,
    energyTurbulence: 0.65,
    audioMultiplier: 1.4,
  },

  thinking: {
    id: "thinking",
    name: "THINKING",
    status: "Neural processing",
    subtitle: "Internal particles organize and explore possibilities.",
    badge: "PROCESSING",
    color: "#b072ff",       // Electric violet
    color2: "#5170ff",       // Deep neon blue-indigo
    accentColor: "#f0abfc", // Light neon purple
    coreColor: "#7c3aed",
    distortion: 0.42,
    frequency: 4.8,
    speed: 1.1,
    flowSpeed: 1.35,
    glow: 1.8,
    roughness: 0.35,
    particleSpeed: 0.95,
    particleSize: 0.032,
    ringSpeed: 0.65,
    ringOpacity: 0.4,
    energyTurbulence: 0.95,
    audioMultiplier: 0.3,
  },

  executing: {
    id: "executing",
    name: "EXECUTING",
    status: "Action in motion",
    subtitle: "Energy flows with purpose. Shows progress and direction.",
    badge: "WORKING",
    color: "#f59e0b",       // Radiant solar amber
    color2: "#ef4444",       // High-energy coral red
    accentColor: "#fde68a", // Bright golden highlight
    coreColor: "#d97706",
    distortion: 0.48,
    frequency: 3.8,
    speed: 1.3,
    flowSpeed: 1.6,
    glow: 1.9,
    roughness: 0.28,
    particleSpeed: 1.4,
    particleSize: 0.035,
    ringSpeed: 0.9,
    ringOpacity: 0.55,
    energyTurbulence: 1.1,
    audioMultiplier: 0.6,
  },

  speaking: {
    id: "speaking",
    name: "SPEAKING",
    status: "Voice synthesis",
    subtitle: "Orb breathes with voice. Natural, expressive, not distracting.",
    badge: "RESPONDING",
    color: "#22d3ee",       // Vivid cyan
    color2: "#818cf8",       // Soft periwinkle
    accentColor: "#e0f2fe",
    coreColor: "#0ea5e9",
    distortion: 0.28,
    frequency: 2.8,
    speed: 0.65,
    flowSpeed: 0.8,
    glow: 1.45,
    roughness: 0.2,
    particleSpeed: 0.5,
    particleSize: 0.026,
    ringSpeed: 0.28,
    ringOpacity: 0.35,
    energyTurbulence: 0.5,
    audioMultiplier: 1.2,
  },

  learning: {
    id: "learning",
    name: "LEARNING",
    status: "Neural assimilation",
    subtitle: "Absorbing contextual data, indexing memory, and evolving neural patterns.",
    badge: "LEARNING",
    color: "#10b981",       // Cyber Emerald
    color2: "#06b6d4",       // Electric Cyan / Teal
    accentColor: "#a7f3d0", // Crystalline Mint Highlight
    coreColor: "#047857",   // Deep Emerald Core
    distortion: 0.36,
    frequency: 4.2,
    speed: 0.85,
    flowSpeed: 1.15,
    glow: 1.7,
    roughness: 0.22,
    particleSpeed: 0.65,
    particleSize: 0.03,
    ringSpeed: 0.5,
    ringOpacity: 0.45,
    energyTurbulence: 0.75,
    audioMultiplier: 0.7,
  },

  syncing: {
    id: "syncing",
    name: "SYNCING",
    status: "Swarm telemetry sync",
    subtitle: "Synchronizing state, memory vector stores, and peer nodes.",
    badge: "SYNCING",
    color: "#06b6d4",       // Vivid Teal Cyan
    color2: "#f59e0b",       // Solar Amber Flow
    accentColor: "#cffafe", // Ice Cyan Highlight
    coreColor: "#0891b2",   // Deep Cyan Core
    distortion: 0.3,
    frequency: 3.8,
    speed: 0.95,
    flowSpeed: 1.25,
    glow: 1.65,
    roughness: 0.22,
    particleSpeed: 0.75,
    particleSize: 0.028,
    ringSpeed: 0.65,
    ringOpacity: 0.48,
    energyTurbulence: 0.8,
    audioMultiplier: 0.5,
  },

  sleeping: {
    id: "sleeping",
    name: "SLEEPING",
    status: "Dormant rest cycle",
    subtitle: "Deep neural regeneration. Soft rhythmic vital pulse.",
    badge: "RESTING",
    color: "#6366f1",       // Deep Indigo
    color2: "#312e81",       // Midnight Violet
    accentColor: "#c7d2fe", // Soft Lavender Highlight
    coreColor: "#1e1b4b",   // Cosmic Obsidian Core
    distortion: 0.08,
    frequency: 1.4,
    speed: 0.12,
    flowSpeed: 0.15,
    glow: 0.65,
    roughness: 0.35,
    particleSpeed: 0.06,
    particleSize: 0.015,
    ringSpeed: 0.05,
    ringOpacity: 0.14,
    energyTurbulence: 0.1,
    audioMultiplier: 0.1,
  },

  waiting: {
    id: "waiting",
    name: "WAITING",
    status: "Standby sync",
    subtitle: "Awaiting your command or system telemetry trigger.",
    badge: "STANDBY",
    color: "#38bdf8",       // Soft sky blue
    color2: "#64748b",       // Slate blue
    accentColor: "#93c5fd",
    coreColor: "#0369a1",
    distortion: 0.14,
    frequency: 1.8,
    speed: 0.25,
    flowSpeed: 0.3,
    glow: 0.95,
    roughness: 0.22,
    particleSpeed: 0.15,
    particleSize: 0.018,
    ringSpeed: 0.1,
    ringOpacity: 0.2,
    energyTurbulence: 0.2,
    audioMultiplier: 0.3,
  },

  attention: {
    id: "attention",
    name: "ATTENTION",
    status: "Requires input",
    subtitle: "Important updates, system anomaly, or approval needed.",
    badge: "ALERT",
    color: "#f43f5e",       // Crimson rose
    color2: "#f97316",       // Warning orange
    accentColor: "#fecdd3",
    coreColor: "#be123c",
    distortion: 0.38,
    frequency: 3.2,
    speed: 0.9,
    flowSpeed: 1.1,
    glow: 1.95,
    roughness: 0.3,
    particleSpeed: 0.8,
    particleSize: 0.03,
    ringSpeed: 0.55,
    ringOpacity: 0.6,
    energyTurbulence: 0.85,
    audioMultiplier: 0.8,
  },

  offline: {
    id: "offline",
    name: "OFFLINE",
    status: "Dormant resting",
    subtitle: "Minimal state. Still there, just resting.",
    badge: "DORMANT",
    color: "#334155",       // Slate graphite
    color2: "#1e293b",       // Dark slate
    accentColor: "#64748b",
    coreColor: "#0f172a",
    distortion: 0.05,
    frequency: 1.2,
    speed: 0.08,
    flowSpeed: 0.08,
    glow: 0.35,
    roughness: 0.6,
    particleSpeed: 0.03,
    particleSize: 0.012,
    ringSpeed: 0.03,
    ringOpacity: 0.08,
    energyTurbulence: 0.05,
    audioMultiplier: 0.05,
  },
};

export function hexToVec3(hex) {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}
