import React from "react";
import { ORB_STATES } from "../orb/constants/orbConfig";
import { Mic, MicOff, Play, Sparkles, Sliders, Activity, Radio, Cpu, RotateCcw, Brain, AlertOctagon } from "lucide-react";

export default function OrbStudioControls({
  state,
  setState,
  activity,
  setActivity,
  audioLevel,
  setAudioLevel,
  isMicActive,
  onToggleMic,
  showRings,
  setShowRings,
  showParticles,
  setShowParticles,
  interactive,
  setInteractive,
  onRunScenario,
  isScenarioRunning,
}) {
  const activeConfig = ORB_STATES[state] || ORB_STATES.idle;

  return (
    <div className="orb-studio-panel">
      {/* Header */}
      <div className="studio-header">
        <div className="studio-title-wrap">
          <Sparkles className="icon-glow" size={18} />
          <h2 className="studio-title">Orb Membrane Inspector</h2>
        </div>
        <div className="studio-badge" style={{ borderColor: activeConfig.color, color: activeConfig.color }}>
          {activeConfig.badge}
        </div>
      </div>

      <p className="studio-subtitle">{activeConfig.subtitle}</p>

      {/* State Selector Grid */}
      <div className="studio-section">
        <label className="studio-label">Active State Preset</label>
        <div className="state-grid">
          {Object.keys(ORB_STATES).map((stKey) => {
            const cfg = ORB_STATES[stKey];
            const isActive = state === stKey;
            return (
              <button
                key={stKey}
                onClick={() => setState(stKey)}
                className={`state-btn ${isActive ? "active" : ""}`}
                style={{
                  "--state-color": cfg.color,
                  borderColor: isActive ? cfg.color : "rgba(255,255,255,0.08)",
                  boxShadow: isActive ? `0 0 16px ${cfg.color}44, inset 0 0 12px ${cfg.color}22` : "none",
                }}
              >
                <span className="state-dot" style={{ backgroundColor: cfg.color }} />
                <span className="state-name">{cfg.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Automated Scenario Pipelines */}
      <div className="studio-section">
        <label className="studio-label">Automated Scenarios</label>
        <div className="scenario-buttons">
          <button
            onClick={() => onRunScenario("deploy")}
            disabled={isScenarioRunning}
            className="scenario-btn"
          >
            <Play size={13} />
            <span>Deploy neweb.ai</span>
          </button>
          <button
            onClick={() => onRunScenario("voiceQuery")}
            disabled={isScenarioRunning}
            className="scenario-btn"
          >
            <Radio size={13} />
            <span>Voice Command</span>
          </button>
          <button
            onClick={() => onRunScenario("alertResolve")}
            disabled={isScenarioRunning}
            className="scenario-btn"
          >
            <Cpu size={13} />
            <span>Anomaly Pulse</span>
          </button>
          <button
            onClick={() => onRunScenario("neuralIngest")}
            disabled={isScenarioRunning}
            className="scenario-btn"
          >
            <Brain size={13} />
            <span>Neural Ingest</span>
          </button>
          <button
            onClick={() => onRunScenario("faultRecovery")}
            disabled={isScenarioRunning}
            className="scenario-btn"
            style={{ color: "#fb7185" }}
          >
            <AlertOctagon size={13} />
            <span>Critical Fault</span>
          </button>
        </div>
      </div>

      {/* Dynamic Activity & Audio Controls */}
      <div className="studio-section">
        <div className="slider-group">
          <div className="slider-header">
            <span className="slider-name">Activity Turbulence</span>
            <span className="slider-val">{(activity * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={activity}
            onChange={(e) => setActivity(parseFloat(e.target.value))}
            className="styled-range"
            style={{ "--accent": activeConfig.color }}
          />
        </div>

        <div className="slider-group">
          <div className="slider-header">
            <span className="slider-name">Audio Waveform Level</span>
            <span className="slider-val">{(audioLevel * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audioLevel}
            onChange={(e) => setAudioLevel(parseFloat(e.target.value))}
            className="styled-range"
            style={{ "--accent": activeConfig.color2 }}
          />
          {/* Audio Visualizer Level Bar */}
          <div className="audio-meter">
            <div
              className="audio-meter-fill"
              style={{
                width: `${Math.min(100, audioLevel * 100)}%`,
                backgroundColor: activeConfig.color,
                boxShadow: `0 0 10px ${activeConfig.color}`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Microphone Toggle */}
      <div className="studio-section">
        <button
          onClick={onToggleMic}
          className={`mic-toggle-btn ${isMicActive ? "mic-active" : ""}`}
        >
          {isMicActive ? (
            <>
              <Mic size={16} className="mic-icon-pulse" />
              <span>Live Mic Active — Speak now</span>
            </>
          ) : (
            <>
              <MicOff size={16} />
              <span>Enable Microphone Input</span>
            </>
          )}
        </button>
      </div>

      {/* Layer Visibility Toggles */}
      <div className="studio-section layer-toggles">
        <label className="toggle-chip">
          <input
            type="checkbox"
            checked={showRings}
            onChange={(e) => setShowRings(e.target.checked)}
          />
          <span>Orbital Rings</span>
        </label>
        <label className="toggle-chip">
          <input
            type="checkbox"
            checked={showParticles}
            onChange={(e) => setShowParticles(e.target.checked)}
          />
          <span>Quantum Particles</span>
        </label>
        <label className="toggle-chip">
          <input
            type="checkbox"
            checked={interactive}
            onChange={(e) => setInteractive(e.target.checked)}
          />
          <span>Parallax Camera</span>
        </label>
      </div>

      {/* Real-time Shader Uniforms Inspector */}
      <div className="uniforms-panel">
        <div className="uniforms-title">Active Shader Uniforms</div>
        <div className="uniforms-grid">
          <div className="uniform-item">
            <span>uDistortion:</span>
            <strong>{activeConfig.distortion.toFixed(2)}</strong>
          </div>
          <div className="uniform-item">
            <span>uSpeed:</span>
            <strong>{activeConfig.speed.toFixed(2)}</strong>
          </div>
          <div className="uniform-item">
            <span>uGlow:</span>
            <strong>{activeConfig.glow.toFixed(2)}</strong>
          </div>
          <div className="uniform-item">
            <span>uTurbulence:</span>
            <strong>{activeConfig.energyTurbulence.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
