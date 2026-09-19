import * as THREE from 'three';
import { ORB_STATES } from '../components/orb/constants/orbConfig.js';
import {
  orbVertexShader,
  orbFragmentShader,
  coreVertexShader,
  coreFragmentShader,
} from '../components/orb/shaders/orbShaders.js';

export class MiaOrbEngine {
  constructor(container = document.body, options = {}) {
    this.container = container;
    this.options = {
      state: 'idle',
      activity: 0.3,
      audioLevel: 0,
      showRings: true,
      showParticles: true,
      interactive: true,
      ...options,
    };

    this.stateName = this.options.state;
    this.targetConfig = ORB_STATES[this.stateName] || ORB_STATES.idle;
    this.activity = this.options.activity;
    this.audioLevel = this.options.audioLevel;
    this.showRings = this.options.showRings;
    this.showParticles = this.options.showParticles;
    this.interactive = this.options.interactive;
    this.hovered = false;

    this.pointerPos = new THREE.Vector3(0, 0, 0);
    this.mouseNormalized = new THREE.Vector2(0, 0);

    this.currentValues = {
      color: new THREE.Color(this.targetConfig.color),
      color2: new THREE.Color(this.targetConfig.color2),
      accentColor: new THREE.Color(this.targetConfig.accentColor),
      coreColor: new THREE.Color(this.targetConfig.coreColor),
      distortion: this.targetConfig.distortion,
      frequency: this.targetConfig.frequency,
      speed: this.targetConfig.speed,
      flowSpeed: this.targetConfig.flowSpeed,
      glow: this.targetConfig.glow,
      turbulence: this.targetConfig.energyTurbulence,
      activity: this.activity,
      audio: this.audioLevel,
      hover: 0,
      pointer: new THREE.Vector3(0, 0, 0),
    };

    this.clock = new THREE.Clock();
    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 4.6);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0); // Transparent background
    this.container.appendChild(this.renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(5, 5, 5);
    this.scene.add(pointLight);

    // 4. Main Orb Group
    this.orbGroup = new THREE.Group();
    this.scene.add(this.orbGroup);

    // Build Orb Elements
    this.initCorePlasma();
    this.initFluidMembrane();
    this.initQuantumParticles();
    this.initOrbitalRings();

    // Event Listeners
    this.setupEvents();

    // Start render loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    // Notify Flutter bridge ready
    this.emitToFlutter('orbReady', { state: this.stateName });
  }

  initFluidMembrane() {
    this.membraneUniforms = {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(this.targetConfig.color) },
      uColor2: { value: new THREE.Color(this.targetConfig.color2) },
      uAccentColor: { value: new THREE.Color(this.targetConfig.accentColor) },
      uDistortion: { value: this.targetConfig.distortion },
      uFrequency: { value: this.targetConfig.frequency },
      uActivity: { value: this.activity },
      uAudio: { value: this.audioLevel },
      uHover: { value: 0 },
      uGlow: { value: this.targetConfig.glow },
      uTurbulence: { value: this.targetConfig.energyTurbulence },
      uPointer: { value: new THREE.Vector3(0, 0, 0) },
    };

    const geometry = new THREE.SphereGeometry(1.42, 128, 128);
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: this.membraneUniforms,
      vertexShader: orbVertexShader,
      fragmentShader: orbFragmentShader,
    });

    this.membraneMesh = new THREE.Mesh(geometry, material);
    this.orbGroup.add(this.membraneMesh);
  }

  initCorePlasma() {
    this.coreUniforms = {
      uTime: { value: 0 },
      uPulseSpeed: { value: 2.0 },
      uColor: { value: new THREE.Color(this.targetConfig.color) },
      uCoreColor: { value: new THREE.Color(this.targetConfig.coreColor) },
      uOpacity: { value: 0.75 },
      uActivity: { value: this.activity },
      uAudio: { value: this.audioLevel },
    };

    const geometry = new THREE.SphereGeometry(0.78, 64, 64);
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: this.coreUniforms,
      vertexShader: coreVertexShader,
      fragmentShader: coreFragmentShader,
    });

    this.coreMesh = new THREE.Mesh(geometry, material);
    this.orbGroup.add(this.coreMesh);
  }

  initQuantumParticles() {
    const count = 700;
    const positions = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 1.55 + Math.random() * 0.85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      spd[i] = 0.5 + Math.random() * 1.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    this.particleColor = new THREE.Color(this.targetConfig.accentColor);
    this.particleMaterial = new THREE.PointsMaterial({
      color: this.particleColor,
      size: this.targetConfig.particleSize,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.particleSystem = new THREE.Points(geometry, this.particleMaterial);
    this.particleSystem.visible = this.showParticles;
    this.orbGroup.add(this.particleSystem);
  }

  initOrbitalRings() {
    this.ringGroup = new THREE.Group();
    this.ringGroup.visible = this.showRings;

    // Ring 1: Equatorial
    const r1Geo = new THREE.TorusGeometry(1.56, 0.007, 16, 120);
    this.ring1Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.targetConfig.color),
      transparent: true,
      opacity: this.targetConfig.ringOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.ring1 = new THREE.Mesh(r1Geo, this.ring1Mat);
    this.ring1.scale.set(1.12, 1.12, 1.12);
    this.ring1.rotation.set(0.4, 0.2, 0);
    this.ringGroup.add(this.ring1);

    // Ring 2: Inclined Gyro
    const r2Geo = new THREE.TorusGeometry(1.56, 0.005, 16, 120);
    this.ring2Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.targetConfig.color2),
      transparent: true,
      opacity: this.targetConfig.ringOpacity * 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.ring2 = new THREE.Mesh(r2Geo, this.ring2Mat);
    this.ring2.scale.set(1.28, 1.28, 1.28);
    this.ring2.rotation.set(-0.6, 0.5, 0.3);
    this.ringGroup.add(this.ring2);

    // Ring 3: Outer Halo
    const r3Geo = new THREE.TorusGeometry(1.56, 0.004, 16, 120);
    this.ring3Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.targetConfig.color),
      transparent: true,
      opacity: this.targetConfig.ringOpacity * 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.ring3 = new THREE.Mesh(r3Geo, this.ring3Mat);
    this.ring3.scale.set(1.45, 1.45, 1.45);
    this.ring3.rotation.set(0.8, -0.4, 0.6);
    this.ringGroup.add(this.ring3);

    this.orbGroup.add(this.ringGroup);
  }

  setupEvents() {
    const handleMove = (clientX, clientY) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;
      this.mouseNormalized.set(x, y);

      // Raycast to unproject pointer position
      const vector = new THREE.Vector3(x, y, 0.5);
      vector.unproject(this.camera);
      const dir = vector.sub(this.camera.position).normalize();
      const distance = -this.camera.position.z / dir.z;
      const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
      this.pointerPos.copy(pos);
    };

    window.addEventListener('resize', () => {
      const w = this.container.clientWidth || window.innerWidth;
      const h = this.container.clientHeight || window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    this.renderer.domElement.addEventListener('pointermove', (e) => {
      this.hovered = true;
      handleMove(e.clientX, e.clientY);
    });

    this.renderer.domElement.addEventListener('pointerleave', () => {
      this.hovered = false;
      this.mouseNormalized.set(0, 0);
    });

    this.renderer.domElement.addEventListener('pointerdown', () => {
      this.emitToFlutter('orbTap', { state: this.stateName });
    });

    // Touch support
    this.renderer.domElement.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.hovered = true;
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    this.renderer.domElement.addEventListener('touchend', () => {
      this.hovered = false;
      this.mouseNormalized.set(0, 0);
    });
  }

  setState(name) {
    if (ORB_STATES[name]) {
      this.stateName = name;
      this.targetConfig = ORB_STATES[name];
      this.emitToFlutter('orbStateChanged', { state: name });
    }
  }

  setAudioLevel(level) {
    this.audioLevel = Math.max(0, Math.min(1, Number(level) || 0));
  }

  setActivity(activity) {
    this.activity = Math.max(0, Math.min(1, Number(activity) || 0));
  }

  setShowRings(show) {
    this.showRings = !!show;
    if (this.ringGroup) this.ringGroup.visible = this.showRings;
  }

  setShowParticles(show) {
    this.showParticles = !!show;
    if (this.particleSystem) this.particleSystem.visible = this.showParticles;
  }

  setInteractive(interactive) {
    this.interactive = !!interactive;
  }

  emitToFlutter(type, data = {}) {
    const payload = JSON.stringify({ type, ...data });

    // 1. Flutter InAppWebView JavaScript Handler
    if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
      window.flutter_inappwebview.callHandler('MiaOrbChannel', payload);
    }
    // 2. Flutter standard WebView JavascriptChannel
    if (window.MiaOrbChannel && window.MiaOrbChannel.postMessage) {
      window.MiaOrbChannel.postMessage(payload);
    }
    // 3. Flutter Web / iframe postMessage
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(payload, '*');
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();
    const cv = this.currentValues;
    const cfg = this.targetConfig;

    // 1. Lerp speeds and temporal progress
    const stepSpeed = THREE.MathUtils.lerp(cv.speed, cfg.speed, 0.08);
    cv.speed = stepSpeed;
    this.membraneUniforms.uTime.value += delta * (stepSpeed * 1.2 + cv.activity * 0.4);

    // 2. Lerp colors
    cv.color.lerp(new THREE.Color(cfg.color), 0.08);
    cv.color2.lerp(new THREE.Color(cfg.color2), 0.08);
    cv.accentColor.lerp(new THREE.Color(cfg.accentColor), 0.08);
    cv.coreColor.lerp(new THREE.Color(cfg.coreColor), 0.08);

    this.membraneUniforms.uColor.value.copy(cv.color);
    this.membraneUniforms.uColor2.value.copy(cv.color2);
    this.membraneUniforms.uAccentColor.value.copy(cv.accentColor);

    // 3. Lerp scalar parameters
    cv.distortion = THREE.MathUtils.lerp(cv.distortion, cfg.distortion, 0.06);
    cv.frequency = THREE.MathUtils.lerp(cv.frequency, cfg.frequency, 0.06);
    cv.glow = THREE.MathUtils.lerp(cv.glow, cfg.glow, 0.07);
    cv.turbulence = THREE.MathUtils.lerp(cv.turbulence, cfg.energyTurbulence, 0.06);
    cv.activity = THREE.MathUtils.lerp(cv.activity, this.activity, 0.1);
    cv.audio = THREE.MathUtils.lerp(cv.audio, this.audioLevel * cfg.audioMultiplier, 0.2);
    cv.hover = THREE.MathUtils.lerp(cv.hover, this.hovered ? 1 : 0, 0.12);

    this.membraneUniforms.uDistortion.value = cv.distortion;
    this.membraneUniforms.uFrequency.value = cv.frequency;
    this.membraneUniforms.uGlow.value = cv.glow;
    this.membraneUniforms.uTurbulence.value = cv.turbulence;
    this.membraneUniforms.uActivity.value = cv.activity;
    this.membraneUniforms.uAudio.value = cv.audio;
    this.membraneUniforms.uHover.value = cv.hover;

    cv.pointer.lerp(this.pointerPos, 0.15);
    this.membraneUniforms.uPointer.value.copy(cv.pointer);

    // Membrane subtle wobble
    this.membraneMesh.rotation.y += delta * (0.08 + cv.activity * 0.12);
    this.membraneMesh.rotation.z = Math.sin(this.membraneUniforms.uTime.value * 0.3) * 0.05;

    // 4. Update Core Plasma
    this.coreUniforms.uTime.value += delta * (1.5 + this.activity);
    this.coreUniforms.uColor.value.lerp(cv.color, 0.08);
    this.coreUniforms.uCoreColor.value.lerp(cv.coreColor, 0.08);
    this.coreUniforms.uActivity.value = cv.activity;
    this.coreUniforms.uAudio.value = cv.audio;

    this.coreMesh.rotation.x += delta * 0.1;
    this.coreMesh.rotation.y += delta * 0.18;
    const coreScale = 0.72 + Math.sin(elapsedTime * 1.5) * 0.03 + (this.activity * 0.1) + (this.audioLevel * 0.12);
    this.coreMesh.scale.set(coreScale, coreScale, coreScale);

    // 5. Update Quantum Particles
    if (this.showParticles && this.particleSystem) {
      this.particleColor.lerp(cv.accentColor, 0.08);
      this.particleMaterial.color = this.particleColor;

      const pTime = elapsedTime * (cfg.particleSpeed * 0.8 + this.activity * 0.5);
      this.particleSystem.rotation.y = pTime * 0.2;
      this.particleSystem.rotation.x = Math.sin(pTime * 0.15) * 0.1;

      this.particleMaterial.size = THREE.MathUtils.lerp(
        this.particleMaterial.size,
        cfg.particleSize * (1.0 + this.audioLevel * 0.8 + this.activity * 0.4),
        0.15
      );
      this.particleMaterial.opacity = THREE.MathUtils.lerp(
        this.particleMaterial.opacity,
        0.35 + this.activity * 0.45 + this.audioLevel * 0.3,
        0.1
      );
    }

    // 6. Update Orbital Rings
    if (this.showRings && this.ringGroup) {
      const ringSpeedMul = cfg.ringSpeed + this.activity * 0.4;
      this.ring1.rotation.x += delta * ringSpeedMul * 0.4;
      this.ring1.rotation.y += delta * ringSpeedMul * 0.5;
      this.ring1Mat.color.lerp(cv.color, 0.08);
      this.ring1Mat.opacity = cfg.ringOpacity * (0.8 + this.audioLevel * 0.5);

      this.ring2.rotation.x -= delta * ringSpeedMul * 0.5;
      this.ring2.rotation.z += delta * ringSpeedMul * 0.35;
      this.ring2Mat.color.lerp(cv.color2, 0.08);
      this.ring2Mat.opacity = cfg.ringOpacity * (0.9 + this.audioLevel * 0.6);

      this.ring3.rotation.y += delta * ringSpeedMul * 0.3;
      this.ring3.rotation.z -= delta * ringSpeedMul * 0.45;
      this.ring3Mat.color.lerp(cv.color, 0.08);
      this.ring3Mat.opacity = cfg.ringOpacity * (0.7 + this.audioLevel * 0.4);
    }

    // 7. Interactive Camera Tilt Parallax
    if (this.interactive) {
      this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, this.mouseNormalized.x * 0.7, 0.05);
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, this.mouseNormalized.y * 0.7, 0.05);
      this.camera.lookAt(0, 0, 0);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Global hook for WebView execution
if (typeof window !== 'undefined') {
  window.MiaOrbEngine = MiaOrbEngine;
  window.initMiaOrb = (containerId = 'orb-canvas-container', options = {}) => {
    const el = document.getElementById(containerId) || document.body;
    window.miaOrbInstance = new MiaOrbEngine(el, options);
    return window.miaOrbInstance;
  };
}
