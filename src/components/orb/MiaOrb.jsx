import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ORB_STATES } from "./constants/orbConfig";
import {
  orbVertexShader,
  orbFragmentShader,
  coreVertexShader,
  coreFragmentShader,
} from "./shaders/orbShaders";

// ---------------------------------------------------------------------------
// Upgraded Fluid Membrane Mesh
// ---------------------------------------------------------------------------
function FluidMembrane({
  targetConfig,
  activity,
  audioLevel,
  hovered,
  pointerPos,
}) {
  const meshRef = useRef();

  // Current interpolated state values
  const currentValues = useRef({
    color: new THREE.Color(targetConfig.color),
    color2: new THREE.Color(targetConfig.color2),
    accentColor: new THREE.Color(targetConfig.accentColor),
    distortion: targetConfig.distortion,
    frequency: targetConfig.frequency,
    speed: targetConfig.speed,
    flowSpeed: targetConfig.flowSpeed,
    glow: targetConfig.glow,
    turbulence: targetConfig.energyTurbulence,
    activity: activity,
    audio: audioLevel,
    hover: hovered ? 1 : 0,
    pointer: new THREE.Vector3(0, 0, 0),
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(targetConfig.color) },
      uColor2: { value: new THREE.Color(targetConfig.color2) },
      uAccentColor: { value: new THREE.Color(targetConfig.accentColor) },
      uDistortion: { value: targetConfig.distortion },
      uFrequency: { value: targetConfig.frequency },
      uActivity: { value: activity },
      uAudio: { value: audioLevel },
      uHover: { value: 0 },
      uGlow: { value: targetConfig.glow },
      uTurbulence: { value: targetConfig.energyTurbulence },
      uPointer: { value: new THREE.Vector3(0, 0, 0) },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material;
    const cv = currentValues.current;

    // Smooth temporal increment scaled by active state speed
    const stepSpeed = THREE.MathUtils.lerp(cv.speed, targetConfig.speed, 0.08);
    cv.speed = stepSpeed;
    mat.uniforms.uTime.value += delta * (stepSpeed * 1.2 + cv.activity * 0.4);

    // Smooth color morphing
    cv.color.lerp(new THREE.Color(targetConfig.color), 0.08);
    cv.color2.lerp(new THREE.Color(targetConfig.color2), 0.08);
    cv.accentColor.lerp(new THREE.Color(targetConfig.accentColor), 0.08);

    mat.uniforms.uColor.value.copy(cv.color);
    mat.uniforms.uColor2.value.copy(cv.color2);
    mat.uniforms.uAccentColor.value.copy(cv.accentColor);

    // Smooth scalar morphing
    cv.distortion = THREE.MathUtils.lerp(cv.distortion, targetConfig.distortion, 0.06);
    cv.frequency = THREE.MathUtils.lerp(cv.frequency, targetConfig.frequency, 0.06);
    cv.glow = THREE.MathUtils.lerp(cv.glow, targetConfig.glow, 0.07);
    cv.turbulence = THREE.MathUtils.lerp(cv.turbulence, targetConfig.energyTurbulence, 0.06);

    cv.activity = THREE.MathUtils.lerp(cv.activity, activity, 0.1);
    cv.audio = THREE.MathUtils.lerp(cv.audio, audioLevel * targetConfig.audioMultiplier, 0.2);
    cv.hover = THREE.MathUtils.lerp(cv.hover, hovered ? 1 : 0, 0.12);

    if (pointerPos) {
      cv.pointer.lerp(pointerPos, 0.15);
      mat.uniforms.uPointer.value.copy(cv.pointer);
    }

    mat.uniforms.uDistortion.value = cv.distortion;
    mat.uniforms.uFrequency.value = cv.frequency;
    mat.uniforms.uGlow.value = cv.glow;
    mat.uniforms.uTurbulence.value = cv.turbulence;
    mat.uniforms.uActivity.value = cv.activity;
    mat.uniforms.uAudio.value = cv.audio;
    mat.uniforms.uHover.value = cv.hover;

    // Subtle gentle 3D wobbling rotation
    meshRef.current.rotation.y += delta * (0.08 + cv.activity * 0.12);
    meshRef.current.rotation.z = Math.sin(mat.uniforms.uTime.value * 0.3) * 0.05;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.42, 128, 128]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={orbVertexShader}
        fragmentShader={orbFragmentShader}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Inner Core Plasma
// ---------------------------------------------------------------------------
function CorePlasma({ targetConfig, activity, audioLevel }) {
  const coreRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulseSpeed: { value: 2.0 },
      uColor: { value: new THREE.Color(targetConfig.color) },
      uCoreColor: { value: new THREE.Color(targetConfig.coreColor) },
      uOpacity: { value: 0.75 },
      uActivity: { value: activity },
      uAudio: { value: audioLevel },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!coreRef.current) return;
    const mat = coreRef.current.material;

    mat.uniforms.uTime.value += delta * (1.5 + activity);
    mat.uniforms.uColor.value.lerp(new THREE.Color(targetConfig.color), 0.08);
    mat.uniforms.uCoreColor.value.lerp(new THREE.Color(targetConfig.coreColor), 0.08);
    mat.uniforms.uActivity.value = THREE.MathUtils.lerp(mat.uniforms.uActivity.value, activity, 0.1);
    mat.uniforms.uAudio.value = THREE.MathUtils.lerp(mat.uniforms.uAudio.value, audioLevel, 0.2);

    coreRef.current.rotation.x += delta * 0.1;
    coreRef.current.rotation.y += delta * 0.18;

    const scale = 0.72 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03 + (activity * 0.1) + (audioLevel * 0.12);
    coreRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={coreRef}>
      <sphereGeometry args={[0.78, 64, 64]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={coreVertexShader}
        fragmentShader={coreFragmentShader}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Quantum Particle Field
// ---------------------------------------------------------------------------
function QuantumParticles({ targetConfig, activity, audioLevel }) {
  const pointsRef = useRef();
  const count = 700;

  const [positions, initialPositions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initial = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 1.55 + Math.random() * 0.85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      initial[i * 3] = x;
      initial[i * 3 + 1] = y;
      initial[i * 3 + 2] = z;

      spd[i] = 0.5 + Math.random() * 1.5;
    }

    return [pos, initial, spd];
  }, []);

  const currentColor = useRef(new THREE.Color(targetConfig.color));

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    currentColor.current.lerp(new THREE.Color(targetConfig.accentColor), 0.08);
    pointsRef.current.material.color = currentColor.current;

    const time = state.clock.elapsedTime * (targetConfig.particleSpeed * 0.8 + activity * 0.5);
    pointsRef.current.rotation.y = time * 0.2;
    pointsRef.current.rotation.x = Math.sin(time * 0.15) * 0.1;

    // Particle size expansion on audio / activity
    pointsRef.current.material.size = THREE.MathUtils.lerp(
      pointsRef.current.material.size,
      targetConfig.particleSize * (1.0 + audioLevel * 0.8 + activity * 0.4),
      0.15
    );

    pointsRef.current.material.opacity = THREE.MathUtils.lerp(
      pointsRef.current.material.opacity,
      0.35 + activity * 0.45 + audioLevel * 0.3,
      0.1
    );
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={targetConfig.accentColor}
        size={targetConfig.particleSize}
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// Holographic Orbital Rings
// ---------------------------------------------------------------------------
function OrbitalRings({ targetConfig, activity, audioLevel }) {
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();

  const color1 = useRef(new THREE.Color(targetConfig.color));
  const color2 = useRef(new THREE.Color(targetConfig.color2));

  useFrame((state, delta) => {
    color1.current.lerp(new THREE.Color(targetConfig.color), 0.08);
    color2.current.lerp(new THREE.Color(targetConfig.color2), 0.08);

    const speedMul = targetConfig.ringSpeed + activity * 0.4;

    if (ring1.current) {
      ring1.current.rotation.x += delta * speedMul * 0.4;
      ring1.current.rotation.y += delta * speedMul * 0.5;
      ring1.current.material.color = color1.current;
      ring1.current.material.opacity = targetConfig.ringOpacity * (0.8 + audioLevel * 0.5);
    }
    if (ring2.current) {
      ring2.current.rotation.x -= delta * speedMul * 0.5;
      ring2.current.rotation.z += delta * speedMul * 0.35;
      ring2.current.material.color = color2.current;
      ring2.current.material.opacity = targetConfig.ringOpacity * (0.9 + audioLevel * 0.6);
    }
    if (ring3.current) {
      ring3.current.rotation.y += delta * speedMul * 0.3;
      ring3.current.rotation.z -= delta * speedMul * 0.45;
      ring3.current.material.color = color1.current;
      ring3.current.material.opacity = targetConfig.ringOpacity * (0.7 + audioLevel * 0.4);
    }
  });

  return (
    <group>
      {/* Primary Equatorial Ring */}
      <mesh ref={ring1} scale={[1.12, 1.12, 1.12]} rotation={[0.4, 0.2, 0]}>
        <torusGeometry args={[1.56, 0.007 + activity * 0.004, 16, 120]} />
        <meshBasicMaterial
          color={targetConfig.color}
          transparent
          opacity={targetConfig.ringOpacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Secondary Inclined Gyro Ring */}
      <mesh ref={ring2} scale={[1.28, 1.28, 1.28]} rotation={[-0.6, 0.5, 0.3]}>
        <torusGeometry args={[1.56, 0.005 + activity * 0.003, 16, 120]} />
        <meshBasicMaterial
          color={targetConfig.color2}
          transparent
          opacity={targetConfig.ringOpacity * 0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer Halo Ring */}
      <mesh ref={ring3} scale={[1.45, 1.45, 1.45]} rotation={[0.8, -0.4, 0.6]}>
        <torusGeometry args={[1.56, 0.004 + activity * 0.002, 16, 120]} />
        <meshBasicMaterial
          color={targetConfig.color}
          transparent
          opacity={targetConfig.ringOpacity * 0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Scene Controller with Mouse Raycasting
// ---------------------------------------------------------------------------
function SceneContent({
  stateName,
  activity,
  audioLevel,
  hovered,
  showRings = true,
  showParticles = true,
}) {
  const { camera } = useThree();
  const [pointerPos, setPointerPos] = useState(new THREE.Vector3(0, 0, 0));

  const targetConfig = ORB_STATES[stateName] || ORB_STATES.idle;

  // Pointer tracking in 3D sphere space
  const handlePointerMove = (e) => {
    if (e.point) {
      setPointerPos(e.point);
    }
  };

  return (
    <group onPointerMove={handlePointerMove}>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />

      {/* Inner Core */}
      <CorePlasma
        targetConfig={targetConfig}
        activity={activity}
        audioLevel={audioLevel}
      />

      {/* Fluid Membrane */}
      <FluidMembrane
        targetConfig={targetConfig}
        activity={activity}
        audioLevel={audioLevel}
        hovered={hovered}
        pointerPos={pointerPos}
      />

      {/* Particles */}
      {showParticles && (
        <QuantumParticles
          targetConfig={targetConfig}
          activity={activity}
          audioLevel={audioLevel}
        />
      )}

      {/* Rings */}
      {showRings && (
        <OrbitalRings
          targetConfig={targetConfig}
          activity={activity}
          audioLevel={audioLevel}
        />
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Camera Rig for Drag-to-Tilt
// ---------------------------------------------------------------------------
function CameraRig({ interactive = true }) {
  useFrame((state) => {
    if (!interactive) return;
    const { pointer } = state;
    // Smooth camera subtle parallax with pointer
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, pointer.x * 0.7, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, pointer.y * 0.7, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

// ---------------------------------------------------------------------------
// Public MiaOrb Component
// ---------------------------------------------------------------------------
export default function MiaOrb({
  state = "idle",
  activity = 0.3,
  audioLevel = 0,
  hovered = false,
  showRings = true,
  showParticles = true,
  interactive = true,
  onClick,
  className = "",
  style = {},
}) {
  const [internalHover, setInternalHover] = useState(false);
  const isHovered = hovered || internalHover;

  return (
    <div
      className={`mia-orb-container ${className}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 280,
        ...style,
      }}
      onMouseEnter={() => setInternalHover(true)}
      onMouseLeave={() => setInternalHover(false)}
      onClick={onClick}
    >
      <Canvas
        camera={{
          position: [0, 0, 4.6],
          fov: 44,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ width: "100%", height: "100%", cursor: onClick ? "pointer" : "grab" }}
      >
        <CameraRig interactive={interactive} />
        <SceneContent
          stateName={state}
          activity={activity}
          audioLevel={audioLevel}
          hovered={isHovered}
          showRings={showRings}
          showParticles={showParticles}
        />
      </Canvas>
    </div>
  );
}
