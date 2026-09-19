import React, { useState, useCallback } from "react";
import MiaOrb from "./components/orb/MiaOrb";
import MiaDashboard from "./components/dashboard/MiaDashboard";
import OrbStudioControls from "./components/studio/OrbStudioControls";
import { useAudioVisualizer } from "./components/orb/useAudioVisualizer";
import { ORB_STATES } from "./components/orb/constants/orbConfig";
import { LayoutDashboard, Sparkles, Monitor, ArrowLeft } from "lucide-react";

export default function App() {
  const [viewMode, setViewMode] = useState("dashboard"); // "dashboard" | "studio"
  const [orbState, setOrbState] = useState("idle");
  const [activity, setActivity] = useState(0.25);
  const [manualAudio, setManualAudio] = useState(0);
  const [micEnabled, setMicEnabled] = useState(false);
  const [taskDescription, setTaskDescription] = useState("Ready when you are.");

  const [showRings, setShowRings] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [interactive, setInteractive] = useState(true);
  const [isScenarioRunning, setIsScenarioRunning] = useState(false);

  // Audio Hook (Real mic OR state-based vocal simulation)
  const isSpeaking = orbState === "speaking";
  const isListening = orbState === "listening";

  const { audioLevel: hookAudio, isMicActive, startMic, stopMic } = useAudioVisualizer({
    enabled: micEnabled,
    sensitivity: 1.2,
    isSpeaking,
    isListening,
  });

  // Effective audio level
  const effectiveAudio = micEnabled ? hookAudio : Math.max(manualAudio, hookAudio);

  const toggleMic = useCallback(() => {
    setMicEnabled((prev) => !prev);
  }, []);

  // Automated Scenario Runner
  const handleRunScenario = (scenario) => {
    if (isScenarioRunning) return;
    setIsScenarioRunning(true);

    if (scenario === "deploy") {
      setOrbState("listening");
      setActivity(0.65);
      setTaskDescription("Received: 'Deploy neweb.ai to production edge'");

      setTimeout(() => {
        setOrbState("thinking");
        setActivity(0.85);
        setTaskDescription("Checking Git diffs & building containers...");

        setTimeout(() => {
          setOrbState("executing");
          setActivity(1.0);
          setTaskDescription("Deploying to Kubernetes cluster (68%)...");

          setTimeout(() => {
            setOrbState("speaking");
            setActivity(0.55);
            setTaskDescription("Deployment successful! neweb.ai is 100% healthy.");

            setTimeout(() => {
              setOrbState("idle");
              setActivity(0.25);
              setTaskDescription("Ready when you are.");
              setIsScenarioRunning(false);
            }, 3500);
          }, 2800);
        }, 2200);
      }, 1500);
    } else if (scenario === "voiceQuery") {
      setOrbState("listening");
      setActivity(0.7);
      setTaskDescription("Listening to speech input...");

      setTimeout(() => {
        setOrbState("thinking");
        setActivity(0.9);
        setTaskDescription("Consulting local contextual memory...");

        setTimeout(() => {
          setOrbState("speaking");
          setActivity(0.6);
          setTaskDescription("Responding to user query...");

          setTimeout(() => {
            setOrbState("idle");
            setActivity(0.25);
            setTaskDescription("Ready when you are.");
            setIsScenarioRunning(false);
          }, 3500);
        }, 2000);
      }, 1800);
    } else if (scenario === "alertResolve") {
      setOrbState("attention");
      setActivity(0.95);
      setTaskDescription("ANOMALY: High memory spike on Azure VM (84%)");

      setTimeout(() => {
        setOrbState("thinking");
        setActivity(0.8);
        setTaskDescription("Synthesizing cache flush & auto-restart routine...");

        setTimeout(() => {
          setOrbState("executing");
          setActivity(1.0);
          setTaskDescription("Flushing Redis buffers & rebalancing nodes...");

          setTimeout(() => {
            setOrbState("speaking");
            setActivity(0.5);
            setTaskDescription("Memory stabilized at 42%. Incident closed.");

            setTimeout(() => {
              setOrbState("idle");
              setActivity(0.25);
              setTaskDescription("Ready when you are.");
              setIsScenarioRunning(false);
            }, 3000);
          }, 2200);
        }, 2000);
      }, 2500);
    }
  };

  const currentCfg = ORB_STATES[orbState] || ORB_STATES.idle;

  return (
    <div className="app-root">
      {/* Persistent Mode Switcher Tab */}
      <div className="view-mode-toggle">
        <button
          onClick={() => setViewMode("dashboard")}
          className={`mode-btn ${viewMode === "dashboard" ? "active" : ""}`}
        >
          <LayoutDashboard size={15} />
          <span>MIA Companion Dashboard</span>
        </button>
        <button
          onClick={() => setViewMode("studio")}
          className={`mode-btn ${viewMode === "studio" ? "active" : ""}`}
        >
          <Sparkles size={15} />
          <span>Orb Shader Studio</span>
        </button>
      </div>

      {viewMode === "dashboard" ? (
        <MiaDashboard
          orbState={orbState}
          setOrbState={setOrbState}
          activity={activity}
          setActivity={setActivity}
          audioLevel={effectiveAudio}
          setAudioLevel={setManualAudio}
          isMicActive={isMicActive}
          onToggleMic={toggleMic}
          taskDescription={taskDescription}
          setTaskDescription={setTaskDescription}
          onOpenStudio={() => setViewMode("studio")}
        />
      ) : (
        /* Full-Screen Interactive 3D Orb Studio */
        <div className="studio-fullview">
          {/* Studio Stage */}
          <div className="studio-canvas-stage">
            <MiaOrb
              state={orbState}
              activity={activity}
              audioLevel={effectiveAudio}
              showRings={showRings}
              showParticles={showParticles}
              interactive={interactive}
              className="studio-hero-orb"
            />

            {/* In-canvas floating HUD info */}
            <div className="studio-center-caption">
              <span className="caption-state" style={{ color: currentCfg.color }}>
                {currentCfg.name}
              </span>
              <span className="caption-desc">{currentCfg.subtitle}</span>
            </div>
          </div>

          {/* Floating Glassmorphism Inspector */}
          <OrbStudioControls
            state={orbState}
            setState={setOrbState}
            activity={activity}
            setActivity={setActivity}
            audioLevel={manualAudio}
            setAudioLevel={setManualAudio}
            isMicActive={isMicActive}
            onToggleMic={toggleMic}
            showRings={showRings}
            setShowRings={setShowRings}
            showParticles={showParticles}
            setShowParticles={setShowParticles}
            interactive={interactive}
            setInteractive={setInteractive}
            onRunScenario={handleRunScenario}
            isScenarioRunning={isScenarioRunning}
          />
        </div>
      )}
    </div>
  );
}
