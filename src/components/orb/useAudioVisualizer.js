import { useState, useEffect, useRef, useCallback } from "react";

export function useAudioVisualizer({ enabled = false, sensitivity = 1.0, isSpeaking = false, isListening = false }) {
  const [audioLevel, setAudioLevel] = useState(0);
  const [isMicActive, setIsMicActive] = useState(false);
  const [micError, setMicError] = useState(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const dataArrayRef = useRef(null);

  // Start real microphone
  const startMic = useCallback(async () => {
    try {
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      setIsMicActive(true);
    } catch (err) {
      console.warn("Microphone access denied or unavailable:", err);
      setMicError(err.message || "Microphone access denied");
      setIsMicActive(false);
    }
  }, []);

  // Stop microphone
  const stopMic = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    sourceRef.current = null;
    setIsMicActive(false);
  }, []);

  useEffect(() => {
    if (enabled) {
      startMic();
    } else {
      stopMic();
    }
    return () => stopMic();
  }, [enabled, startMic, stopMic]);

  // Audio level loop (real mic OR organic synthetic voice simulation)
  useEffect(() => {
    let phase = 0;

    const updateAudio = () => {
      if (isMicActive && analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

        // Calculate average energy in voice spectrum (bins 2 to 32)
        let sum = 0;
        const count = 30;
        for (let i = 2; i < 2 + count; i++) {
          sum += dataArrayRef.current[i];
        }
        const avg = sum / (count * 255);
        const level = Math.min(1.0, avg * 2.2 * sensitivity);

        setAudioLevel((prev) => prev * 0.7 + level * 0.3);
      } else if (isSpeaking || isListening) {
        // Natural speech modulation simulation (intermittent bursts & cadence)
        phase += 0.08;
        const speechEnvelope = Math.max(0, Math.sin(phase * 0.6) * 0.5 + Math.sin(phase * 1.7) * 0.35 + Math.sin(phase * 4.2) * 0.15);
        const speechFluctuation = (Math.sin(phase * 8.0) * 0.2 + 0.8);
        const simLevel = speechEnvelope * speechFluctuation * 0.85 * sensitivity;

        setAudioLevel((prev) => prev * 0.75 + simLevel * 0.25);
      } else {
        // Subtle ambient resting breath
        setAudioLevel((prev) => prev * 0.88);
      }

      animationFrameRef.current = requestAnimationFrame(updateAudio);
    };

    animationFrameRef.current = requestAnimationFrame(updateAudio);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMicActive, sensitivity, isSpeaking, isListening]);

  return {
    audioLevel,
    isMicActive,
    micError,
    startMic,
    stopMic,
  };
}
