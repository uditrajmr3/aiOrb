import React, { useState, useEffect, useRef } from "react";
import MiaOrb from "../orb/MiaOrb";
import { ORB_STATES } from "../orb/constants/orbConfig";
import {
  Search,
  Bell,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Mic,
  Send,
  Sparkles,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  ExternalLink,
  ShieldCheck,
  Radio,
  ArrowUpRight,
  Database,
  Layers,
  Terminal,
  Play,
  RotateCw,
  Code,
  Globe,
  Settings,
  Flame,
  CornerDownLeft,
  AlertOctagon,
} from "lucide-react";

export default function MiaDashboard({
  orbState,
  setOrbState,
  activity,
  setActivity,
  audioLevel,
  setAudioLevel,
  isMicActive,
  onToggleMic,
  taskDescription,
  setTaskDescription,
  onOpenStudio,
}) {
  // Chat console messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "user",
      text: "Check the status of neweb.ai and show me recent errors.",
      time: "12:21 PM",
    },
    {
      id: 2,
      sender: "mia",
      text: "neweb.ai is online and healthy. 0 critical errors. Found 2 warnings in the last 24h (rate limit spikes on /api/v1/auth). Would you like me to inspect traffic spikes or open the telemetry dashboard?",
      time: "12:21 PM",
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const chatScrollRef = useRef(null);

  // Today's focus items
  const [tasks, setTasks] = useState([
    { id: 1, text: "Fix SEO module keyword clustering", done: true },
    { id: 2, text: "Deploy neweb 3.0 updates to staging", done: true },
    { id: 3, text: "Verify neural shader framerate on 4K", done: false },
    { id: 4, text: "Inspect Azure VM memory threshold", done: false },
    { id: 5, text: "Review daily autonomous analytics", done: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  // Scroll chat on new messages
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Fault simulation sequence
  const handleTriggerFault = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setOrbState("error");
    setActivity(1.0);
    setTaskDescription("CRITICAL FAULT: Matrix destabilized — high turbulence anomaly!");

    setTimeout(() => {
      setOrbState("thinking");
      setActivity(0.85);
      setTaskDescription("Isolating partition & synthesizing error boundary...");

      setTimeout(() => {
        setOrbState("syncing");
        setActivity(0.7);
        setTaskDescription("Re-synchronizing distributed cluster state...");

        setTimeout(() => {
          setOrbState("speaking");
          setActivity(0.5);
          setAudioLevel(0.65);
          setTaskDescription("Matrix healed. 100% integrity restored.");

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              sender: "mia",
              text: "Critical fault anomaly successfully contained: corrupt memory vectors isolated and neural matrix re-synchronized from cluster replica. All systems 100% nominal.",
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);

          setTimeout(() => {
            setOrbState("idle");
            setActivity(0.25);
            setAudioLevel(0);
            setTaskDescription("Ask anything. Build everything.");
            setIsProcessing(false);
          }, 3200);
        }, 2200);
      }, 2400);
    }, 2800);
  };

  // Handle autonomous command dispatch
  const handleSendCommand = (textToSend) => {
    const text = textToSend || inputVal.trim();
    if (!text || isProcessing) return;

    if (text.toLowerCase().includes("fault") || text.toLowerCase().includes("crash") || text.toLowerCase().includes("simulate error")) {
      setInputVal("");
      handleTriggerFault();
      return;
    }

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsProcessing(true);

    // Sequence the AI Orb state flow:
    // 1. Listening / Ingesting
    setOrbState("listening");
    setActivity(0.7);
    setTaskDescription(`Ingesting: "${text.slice(0, 32)}..."`);

    setTimeout(() => {
      // 2. Thinking / Synthesizing
      setOrbState("thinking");
      setActivity(0.9);
      setTaskDescription("Analyzing neural graphs & service logs...");

      setTimeout(() => {
        // 3. Executing / Action
        setOrbState("executing");
        setActivity(1.0);
        setTaskDescription("Executing cluster telemetry & verification...");

        setTimeout(() => {
          // 4. Speaking / Formulating answer
          setOrbState("speaking");
          setActivity(0.6);
          setAudioLevel(0.75);
          setTaskDescription("Synthesizing response...");

          const replyText = getSmartReply(text);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: "mia",
              text: replyText,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);

          setTimeout(() => {
            // 5. Return to Idle / Ready
            setOrbState("idle");
            setActivity(0.25);
            setAudioLevel(0);
            setTaskDescription("Ask anything. Build everything.");
            setIsProcessing(false);
          }, 3500);
        }, 2200);
      }, 2000);
    }, 1200);
  };

  const getSmartReply = (query) => {
    const q = query.toLowerCase();
    if (q.includes("deploy") || q.includes("neweb")) {
      return "Deployed neweb.ai build v3.0.4 successfully to production edge. Response latency dropped to 38ms. All health checks nominal.";
    }
    if (q.includes("log") || q.includes("error")) {
      return "Scanned 14,820 log lines across 8 nodes. 0 fatal exceptions. 2 non-blocking rate warnings mitigated via cloud cache.";
    }
    if (q.includes("server") || q.includes("status") || q.includes("health")) {
      return "System cluster is 100% operational. CPU at 32%, RAM 58%, Azure VM healthy, Docker daemon running 8/9 containers.";
    }
    return `Analysis complete for "${query}". Context graph updated with 4 new memory vectors. Systems standing by for next directive.`;
  };

  const currentConfig = ORB_STATES[orbState] || ORB_STATES.idle;

  return (
    <div className="mia-dashboard">
      {/* ==================================================================== */}
      {/* TOPBAR */}
      {/* ==================================================================== */}
      <header className="dash-topbar">
        <div className="topbar-left">
          <div className="brand-badge">
            <span className="brand-logo">MIA</span>
            <span className="brand-tag">Personal AI Assistant</span>
          </div>

          {/* Quick Search */}
          <div className="search-bar">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search anything... (files, code, projects, commands)"
              className="search-input"
            />
            <kbd className="search-kbd">⌘ K</kbd>
          </div>
        </div>

        <div className="topbar-right">
          {/* Status Badges */}
          <div className="status-pill status-online">
            <span className="dot-pulse" />
            <span>MIA ONLINE</span>
          </div>

          <div className="status-pill status-secure">
            <ShieldCheck size={14} />
            <span>Local Processing</span>
          </div>

          <div className="status-pill status-conn">
            <Wifi size={14} />
            <span>Connected • 18ms</span>
          </div>

          {/* Studio Toggle Button */}
          <button onClick={onOpenStudio} className="topbar-action-btn" title="Open 3D Shader Studio">
            <SlidersHorizontal size={16} />
            <span>Shader Studio</span>
          </button>

          <button className="topbar-icon-btn" title="Notifications">
            <Bell size={16} />
            <span className="notif-badge">3</span>
          </button>

          <div className="topbar-time">
            <Clock size={14} />
            <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* MAIN 3-COLUMN LAYOUT */}
      {/* ==================================================================== */}
      <main className="dash-main-grid">
        {/* ------------------------------------------------------------------ */}
        {/* LEFT COLUMN: SYSTEM HEALTH & CONVERSATION */}
        {/* ------------------------------------------------------------------ */}
        <div className="grid-col col-left">
          {/* System Health Card */}
          <section className="dash-card">
            <div className="card-header">
              <div className="card-title-group">
                <Cpu size={16} className="card-title-icon text-cyan" />
                <h3 className="card-title">SYSTEM HEALTH</h3>
              </div>
              <span className="badge-pill badge-green">All systems operational</span>
            </div>

            {/* 4 Circular Gauges */}
            <div className="health-gauges">
              {/* CPU */}
              <div className="gauge-item">
                <div className="gauge-circle-wrap">
                  <svg className="gauge-svg" viewBox="0 0 36 36">
                    <path
                      className="gauge-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="gauge-progress stroke-cyan"
                      strokeDasharray="32, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="gauge-num">32%</span>
                </div>
                <div className="gauge-meta">
                  <span className="gauge-label">CPU</span>
                  <span className="gauge-sub">4.2 GHz</span>
                </div>
              </div>

              {/* RAM */}
              <div className="gauge-item">
                <div className="gauge-circle-wrap">
                  <svg className="gauge-svg" viewBox="0 0 36 36">
                    <path
                      className="gauge-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="gauge-progress stroke-amber"
                      strokeDasharray="58, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="gauge-num">58%</span>
                </div>
                <div className="gauge-meta">
                  <span className="gauge-label">RAM</span>
                  <span className="gauge-sub">9.3 / 16 GB</span>
                </div>
              </div>

              {/* Disk */}
              <div className="gauge-item">
                <div className="gauge-circle-wrap">
                  <svg className="gauge-svg" viewBox="0 0 36 36">
                    <path
                      className="gauge-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="gauge-progress stroke-purple"
                      strokeDasharray="41, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="gauge-num">41%</span>
                </div>
                <div className="gauge-meta">
                  <span className="gauge-label">Disk</span>
                  <span className="gauge-sub">312 / 768 GB</span>
                </div>
              </div>

              {/* Network */}
              <div className="gauge-item">
                <div className="gauge-circle-wrap">
                  <svg className="gauge-svg" viewBox="0 0 36 36">
                    <path
                      className="gauge-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="gauge-progress stroke-teal"
                      strokeDasharray="12, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="gauge-num">12%</span>
                </div>
                <div className="gauge-meta">
                  <span className="gauge-label">Network</span>
                  <span className="gauge-sub">↓ 12 MB/s</span>
                </div>
              </div>
            </div>

            {/* Health Info Badges */}
            <div className="health-tags-grid">
              <div className="health-tag">
                <Clock size={12} />
                <span>Uptime: <strong>12d 4h 18m</strong></span>
              </div>
              <div className="health-tag">
                <Layers size={12} />
                <span>Tasks: <strong>2 run • 5 pend</strong></span>
              </div>
              <div className="health-tag">
                <Terminal size={12} />
                <span>Model: <strong>Ollama (Llama 3.1)</strong></span>
              </div>
              <div className="health-tag">
                <Server size={12} />
                <span>Docker: <strong>8/9 running</strong></span>
              </div>
            </div>
          </section>

          {/* Conversation & Commands Box */}
          <section className="dash-card flex-1 flex-col">
            <div className="card-header">
              <div className="card-title-group">
                <Sparkles size={16} className="card-title-icon text-purple" />
                <h3 className="card-title">CONVERSATION / COMMANDS</h3>
              </div>
              <button
                onClick={() => setMessages([])}
                className="card-text-action"
              >
                Clear
              </button>
            </div>

            {/* Message Stream */}
            <div className="chat-stream" ref={chatScrollRef}>
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-bubble-wrap ${msg.sender}`}>
                  <div className="chat-avatar">
                    {msg.sender === "user" ? (
                      <span className="user-initial">U</span>
                    ) : (
                      <span className="mia-initial">M</span>
                    )}
                  </div>
                  <div className="chat-bubble">
                    <div className="bubble-header">
                      <span className="sender-name">
                        {msg.sender === "user" ? "You" : "MIA"}
                      </span>
                      <span className="bubble-time">{msg.time}</span>
                    </div>
                    <div className="bubble-text">{msg.text}</div>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="chat-bubble-wrap mia">
                  <div className="chat-avatar">
                    <span className="mia-initial">M</span>
                  </div>
                  <div className="chat-bubble processing">
                    <div className="typing-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                    <span className="processing-hint">{taskDescription}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Suggestion Chips */}
            <div className="quick-suggestions">
              <button
                onClick={() => handleSendCommand("Show recent logs from production cluster")}
                className="chip-btn"
              >
                Show logs
              </button>
              <button
                onClick={() => handleSendCommand("Analyze performance trends and memory usage")}
                className="chip-btn"
              >
                Analyze
              </button>
              <button
                onClick={() => handleSendCommand("Deploy latest updates for neweb.ai")}
                className="chip-btn"
              >
                Deploy latest
              </button>
              <button
                onClick={() => handleSendCommand("Check status of all microservices")}
                className="chip-btn"
              >
                Status
              </button>
              <button
                onClick={handleTriggerFault}
                className="chip-btn"
                style={{ color: "#fb7185", borderColor: "rgba(225,29,72,0.3)" }}
              >
                Simulate fault
              </button>
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendCommand();
              }}
              className="chat-input-row"
            >
              <button
                type="button"
                onClick={onToggleMic}
                className={`input-mic-btn ${isMicActive ? "active" : ""}`}
                title="Toggle Voice Input"
              >
                <Mic size={16} />
              </button>
              <input
                type="text"
                placeholder={isMicActive ? "Listening to your voice..." : "Ask MIA or dispatch a command..."}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="chat-input"
              />
              <button type="submit" disabled={!inputVal.trim() || isProcessing} className="input-send-btn">
                <Send size={15} />
              </button>
            </form>
          </section>

          {/* Quick Commands Grid */}
          <section className="dash-card">
            <div className="card-header">
              <h3 className="card-title">QUICK COMMANDS</h3>
              <span className="card-badge">Press ⌘ 1-6</span>
            </div>
            <div className="quick-commands-grid">
              <button onClick={() => handleSendCommand("Summarize today's activities")} className="qc-btn">
                <Flame size={13} />
                <span>Summarize today</span>
              </button>
              <button onClick={() => handleSendCommand("Check all servers")} className="qc-btn">
                <Server size={13} />
                <span>Check servers</span>
              </button>
              <button onClick={() => handleSendCommand("Deploy neweb.ai")} className="qc-btn">
                <Play size={13} />
                <span>Deploy latest</span>
              </button>
              <button onClick={() => handleSendCommand("Open project workspace")} className="qc-btn">
                <Code size={13} />
                <span>Open project</span>
              </button>
              <button onClick={() => handleSendCommand("Search indexing files")} className="qc-btn">
                <Search size={13} />
                <span>Search files</span>
              </button>
              <button onClick={() => handleSendCommand("Create scheduled automation")} className="qc-btn">
                <RotateCw size={13} />
                <span>Create task</span>
              </button>
            </div>
          </section>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* CENTER COLUMN: HERO FLUID MEMBRANE ORB & CONTEXT DIAL */}
        {/* ------------------------------------------------------------------ */}
        <div className="grid-col col-center">
          {/* Main Hero Orb Display */}
          <section className="dash-card hero-orb-card">
            <div className="hero-orb-header">
              <span className="hero-eyebrow">YOUR PRIVATE AI ASSISTANT</span>
            </div>

            {/* Interactive HUD Orb Stage */}
            <div className="orb-stage-wrapper">
              {/* Surrounding Tech HUD Nodes */}
              <div className="hud-nodes-overlay">
                <button
                  onClick={() => setOrbState("listening")}
                  className={`hud-node hud-node-tl ${orbState === "listening" ? "active" : ""}`}
                >
                  <div className="hud-node-icon">
                    <Mic size={15} />
                  </div>
                  <span className="hud-node-label">LISTENING</span>
                </button>

                <button
                  onClick={() => setOrbState("thinking")}
                  className={`hud-node hud-node-tr ${orbState === "thinking" ? "active" : ""}`}
                >
                  <div className="hud-node-icon">
                    <Sparkles size={15} />
                  </div>
                  <span className="hud-node-label">THINKING</span>
                </button>

                <button
                  onClick={() => setOrbState("learning")}
                  className={`hud-node hud-node-bl ${orbState === "learning" ? "active" : ""}`}
                >
                  <div className="hud-node-icon">
                    <Database size={15} />
                  </div>
                  <span className="hud-node-label">LEARNING</span>
                </button>

                <button
                  onClick={() => setOrbState("executing")}
                  className={`hud-node hud-node-br ${orbState === "executing" ? "active" : ""}`}
                >
                  <div className="hud-node-icon">
                    <Settings size={15} />
                  </div>
                  <span className="hud-node-label">EXECUTING</span>
                </button>
              </div>

              {/* Central 3D Canvas with Fluid Membrane */}
              <div className="orb-canvas-container">
                <MiaOrb
                  state={orbState}
                  activity={activity}
                  audioLevel={audioLevel}
                  showRings={true}
                  showParticles={true}
                  interactive={true}
                  className="hero-orb"
                />

                {/* Central Status Hologram Overlay */}
                <div className="orb-center-overlay">
                  <h1 className="orb-brand-title">MIA</h1>
                  <div
                    className="orb-live-badge"
                    style={{
                      borderColor: currentConfig.color,
                      boxShadow: `0 0 20px ${currentConfig.color}44`,
                    }}
                  >
                    <span className="badge-bullet" style={{ backgroundColor: currentConfig.color }} />
                    <span className="badge-text">{currentConfig.badge}</span>
                  </div>
                  <p className="orb-sub-text">{taskDescription || currentConfig.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar Under Orb */}
            <div className="orb-telemetry-row">
              <div className="telem-item">
                <span className="telem-label">PROJECTS</span>
                <span className="telem-val">12</span>
              </div>
              <div className="telem-divider" />
              <div className="telem-item">
                <span className="telem-label">WEBSITES</span>
                <span className="telem-val">8</span>
              </div>
              <div className="telem-divider" />
              <div className="telem-item">
                <span className="telem-label">SERVICES</span>
                <span className="telem-val">24</span>
              </div>
              <div className="telem-divider" />
              <div className="telem-item">
                <span className="telem-label">AUTOMATIONS</span>
                <span className="telem-val">18</span>
              </div>
            </div>
          </section>

          {/* Bottom Dual Cards: Memory / Context & Today's Focus */}
          <div className="center-subcards-row">
            {/* Memory / Context Card */}
            <section className="dash-card card-half">
              <div className="card-header">
                <div className="card-title-group">
                  <Database size={15} className="card-title-icon text-cyan" />
                  <h3 className="card-title">MEMORY / CONTEXT</h3>
                </div>
              </div>
              <div className="memory-body">
                <div className="memory-info-list">
                  <div className="memory-info-item">
                    <span className="mem-icon">⚡</span>
                    <div>
                      <div className="mem-title">Active Context</div>
                      <div className="mem-sub">4 active item nodes</div>
                    </div>
                  </div>
                  <div className="memory-info-item">
                    <span className="mem-icon">🧠</span>
                    <div>
                      <div className="mem-title">Long-term Memory</div>
                      <div className="mem-sub">1,248 indexed vectors</div>
                    </div>
                  </div>
                  <div className="memory-info-item">
                    <span className="mem-icon">📚</span>
                    <div>
                      <div className="mem-title">Knowledge Base</div>
                      <div className="mem-sub text-green">Online & Ready</div>
                    </div>
                  </div>
                </div>

                {/* Circular Gauge for Context */}
                <div className="context-dial-wrap">
                  <svg className="context-dial-svg" viewBox="0 0 36 36">
                    <path
                      className="gauge-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="gauge-progress stroke-cyan"
                      strokeDasharray="87, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="dial-label-inner">
                    <span className="dial-val">87%</span>
                    <span className="dial-sub">Context</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Today's Focus Checklist */}
            <section className="dash-card card-half">
              <div className="card-header">
                <div className="card-title-group">
                  <CheckCircle2 size={15} className="card-title-icon text-teal" />
                  <h3 className="card-title">TODAY'S FOCUS</h3>
                </div>
                <span className="badge-pill">
                  {tasks.filter((t) => t.done).length}/{tasks.length} Done
                </span>
              </div>
              <div className="task-list">
                {tasks.map((task) => (
                  <label key={task.id} className="task-item">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(task.id)}
                      className="task-checkbox"
                    />
                    <span className={`task-text ${task.done ? "done" : ""}`}>{task.text}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* RIGHT COLUMN: INFRASTRUCTURE & PROJECTS */}
        {/* ------------------------------------------------------------------ */}
        <div className="grid-col col-right">
          {/* Infrastructure Topology Card */}
          <section className="dash-card">
            <div className="card-header">
              <div className="card-title-group">
                <Server size={16} className="card-title-icon text-cyan" />
                <h3 className="card-title">INFRASTRUCTURE OVERVIEW</h3>
              </div>
              <span className="card-text-action">View all</span>
            </div>
            <div className="infra-sub">8 nodes • 24 services • All systems nominal</div>

            {/* Topology Diagram */}
            <div className="topology-box">
              <div className="topology-column">
                <div className="topo-node">
                  <span className="node-icon">💻</span>
                  <div>
                    <div className="node-name">Local (Dev)</div>
                    <div className="node-desc">Environment</div>
                  </div>
                </div>
                <div className="topo-node">
                  <span className="node-icon">☁️</span>
                  <div>
                    <div className="node-name">Azure VM</div>
                    <div className="node-desc">Production</div>
                  </div>
                </div>
                <div className="topo-node">
                  <span className="node-icon">🖥️</span>
                  <div>
                    <div className="node-name">Home Server</div>
                    <div className="node-desc">Media & Tools</div>
                  </div>
                </div>
              </div>

              <div className="topo-core">
                <div className="core-hub" style={{ borderColor: currentConfig.color }}>
                  <span className="hub-name">MIA</span>
                  <span className="hub-sub">Core</span>
                </div>
              </div>

              <div className="topology-column">
                <div className="topo-node">
                  <span className="node-icon">🌐</span>
                  <div>
                    <div className="node-name">Websites</div>
                    <div className="node-desc">8 active</div>
                  </div>
                </div>
                <div className="topo-node">
                  <span className="node-icon">🔌</span>
                  <div>
                    <div className="node-name">APIs</div>
                    <div className="node-desc">12 services</div>
                  </div>
                </div>
                <div className="topo-node">
                  <span className="node-icon">📦</span>
                  <div>
                    <div className="node-name">Docker</div>
                    <div className="node-desc">24 containers</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Projects / Websites Status */}
          <section className="dash-card">
            <div className="card-header">
              <div className="card-title-group">
                <Globe size={16} className="card-title-icon text-indigo" />
                <h3 className="card-title">PROJECTS / WEBSITES</h3>
              </div>
              <span className="card-text-action">View all</span>
            </div>

            <div className="projects-list">
              <div className="project-item">
                <div className="proj-info">
                  <span className="proj-title">neweb.ai</span>
                  <span className="proj-env">Production</span>
                </div>
                <div className="proj-status">
                  <span className="proj-pct text-green">99.9%</span>
                  <span className="status-indicator online" />
                </div>
              </div>

              <div className="project-item">
                <div className="proj-info">
                  <span className="proj-title">osmo_seo</span>
                  <span className="proj-env">Development</span>
                </div>
                <div className="proj-status">
                  <span className="proj-pct text-green">99.5%</span>
                  <span className="status-indicator online" />
                </div>
              </div>

              <div className="project-item">
                <div className="proj-info">
                  <span className="proj-title">commerciax.com</span>
                  <span className="proj-env">Production</span>
                </div>
                <div className="proj-status">
                  <span className="proj-pct text-green">99.9%</span>
                  <span className="status-indicator online" />
                </div>
              </div>

              <div className="project-item">
                <div className="proj-info">
                  <span className="proj-title">Project North</span>
                  <span className="proj-env">Staging</span>
                </div>
                <div className="proj-status">
                  <span className="proj-pct text-amber">97.8%</span>
                  <span className="status-indicator warn" />
                </div>
              </div>

              <div className="project-item">
                <div className="proj-info">
                  <span className="proj-title">MIA Assistant</span>
                  <span className="proj-env">Local Kernel</span>
                </div>
                <div className="proj-status">
                  <span className="proj-pct text-green">100%</span>
                  <span className="status-indicator online" />
                </div>
              </div>
            </div>
          </section>

          {/* Alerts & Recommendations */}
          <section className="dash-card">
            <div className="card-header">
              <div className="card-title-group">
                <AlertTriangle size={16} className="card-title-icon text-amber" />
                <h3 className="card-title">ALERTS & ADVICE</h3>
              </div>
              <span className="badge-pill badge-amber">3 Attention</span>
            </div>

            <div className="alerts-list">
              <div className="alert-item error" style={{ borderColor: "rgba(225,29,72,0.25)" }}>
                <div className="alert-icon-wrap" style={{ color: "#e11d48", background: "rgba(225,29,72,0.15)" }}>
                  <AlertOctagon size={15} />
                </div>
                <div className="alert-content">
                  <div className="alert-title" style={{ color: "#fb7185" }}>Cluster Node Fault Drill</div>
                  <div className="alert-desc">Simulate erratic matrix recovery sequence</div>
                </div>
                <button
                  onClick={handleTriggerFault}
                  className="alert-btn"
                  style={{ color: "#fb7185", borderColor: "rgba(225,29,72,0.4)" }}
                >
                  Trigger Fault
                </button>
              </div>
              <div className="alert-item warn">
                <div className="alert-icon-wrap">
                  <AlertTriangle size={15} />
                </div>
                <div className="alert-content">
                  <div className="alert-title">High memory usage on Azure VM</div>
                  <div className="alert-desc">82% for the last 30 minutes</div>
                </div>
                <button
                  onClick={() => handleSendCommand("Investigate Azure VM memory consumption")}
                  className="alert-btn"
                >
                  Analyze
                </button>
              </div>

              <div className="alert-item warn">
                <div className="alert-icon-wrap">
                  <AlertTriangle size={15} />
                </div>
                <div className="alert-content">
                  <div className="alert-title">neweb.ai rate limit spikes</div>
                  <div className="alert-desc">2x higher traffic than usual</div>
                </div>
                <button
                  onClick={() => handleSendCommand("Inspect rate limit spikes on neweb.ai")}
                  className="alert-btn"
                >
                  Inspect
                </button>
              </div>

              <div className="alert-item info">
                <div className="alert-icon-wrap">
                  <Info size={15} />
                </div>
                <div className="alert-content">
                  <div className="alert-title">Docker update available</div>
                  <div className="alert-desc">New release 24.0.6</div>
                </div>
                <button
                  onClick={() => handleSendCommand("Update Docker daemon containers")}
                  className="alert-btn"
                >
                  Update
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ==================================================================== */}
      {/* BOTTOM ACTIVITY TIMELINE */}
      {/* ==================================================================== */}
      <footer className="dash-timeline-bar">
        <div className="timeline-header-chip">
          <span className="pulse-dot-green" />
          <span className="timeline-title">ACTIVITY TIMELINE</span>
        </div>

        <div className="timeline-scroll">
          <div className="timeline-event">
            <span className="event-time">12:22 PM</span>
            <span className="event-badge badge-green">Success</span>
            <span className="event-name">Backup Completed (MIA memory DB)</span>
          </div>
          <div className="timeline-event">
            <span className="event-time">11:48 AM</span>
            <span className="event-badge badge-cyan">Deploy</span>
            <span className="event-name">Deploy Successful (neweb.ai v3.0.2)</span>
          </div>
          <div className="timeline-event">
            <span className="event-time">10:31 AM</span>
            <span className="event-badge badge-purple">Git</span>
            <span className="event-name">osmo_seo feat: keyword clustering</span>
          </div>
          <div className="timeline-event">
            <span className="event-time">09:12 AM</span>
            <span className="event-badge badge-teal">Cron</span>
            <span className="event-name">Scheduled Job (Generate SEO reports)</span>
          </div>
          <div className="timeline-event">
            <span className="event-time">08:41 AM</span>
            <span className="event-badge badge-blue">Event</span>
            <span className="event-name">Website Event (New user signup neweb.ai)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
