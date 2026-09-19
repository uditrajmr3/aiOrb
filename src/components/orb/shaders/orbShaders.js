export const orbVertexShader = `
  uniform float uTime;
  uniform float uDistortion;
  uniform float uFrequency;
  uniform float uActivity;
  uniform float uAudio;
  uniform float uHover;
  uniform vec3 uPointer;
  uniform float uTurbulence;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  varying float vDisplacement;
  varying float vNoise;
  varying float vFresnel;

  // Simplex 3D noise functions
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  // Multi-octave fractal noise
  float fbm(vec3 p) {
    float total = 0.0;
    float amplitude = 0.5;
    float freq = uFrequency;
    for (int i = 0; i < 3; i++) {
      total += amplitude * snoise(p * freq);
      freq *= 2.1;
      amplitude *= 0.45;
    }
    return total;
  }

  void main() {
    vUv = uv;
    vec3 p = position;
    vec3 dir = normalize(position);

    float t = uTime * 0.7;

    // Swirling flow field coordinates (folds and streams)
    vec3 flowCoord = p * 1.5;
    flowCoord.x += sin(t * 0.4 + p.y * 2.0) * 0.35;
    flowCoord.y += cos(t * 0.35 + p.z * 1.8) * 0.35;
    flowCoord.z += sin(t * 0.5 + p.x * 2.2) * 0.35;

    // Multi-octave fluid noise
    float noise1 = fbm(flowCoord + vec3(0.0, t * 0.25, 0.0));
    float noise2 = snoise(p * 3.5 - vec3(t * 0.3, -t * 0.2, t * 0.15));

    // Audio acoustic deformation wave
    float audioWave = sin(p.y * 12.0 + t * 4.0) * uAudio * 0.22;
    float audioPulse = cos(p.x * 10.0 - t * 3.0) * uAudio * 0.15;

    // Activity dynamic ripples
    float activityRipples = sin(atan(p.z, p.x) * 6.0 + t * 3.0) * (uActivity * 0.15);

    // Interactive pointer attraction/repulsion
    float distToPointer = length(p - uPointer);
    float hoverInfluence = smoothstep(2.5, 0.2, distToPointer) * uHover * 0.25;

    // Fluid membrane displacement synthesis
    float combinedNoise = (noise1 * 0.7 + noise2 * 0.3);
    float totalDisplacement = combinedNoise * (uDistortion + uActivity * 0.28 + uAudio * 0.35 + hoverInfluence)
                            + audioWave + audioPulse + activityRipples;

    p += dir * totalDisplacement;

    vDisplacement = totalDisplacement;
    vNoise = combinedNoise;

    // Recalculate normal with noise gradient for accurate lighting
    vec3 tangent1 = cross(dir, vec3(0.0, 1.0, 0.0));
    if (length(tangent1) < 0.001) tangent1 = cross(dir, vec3(1.0, 0.0, 0.0));
    tangent1 = normalize(tangent1);
    vec3 tangent2 = normalize(cross(dir, tangent1));

    float eps = 0.03;
    float d1 = fbm(flowCoord + tangent1 * eps);
    float d2 = fbm(flowCoord + tangent2 * eps);
    vec3 grad = (tangent1 * (d1 - noise1) + tangent2 * (d2 - noise1)) / eps;
    vec3 surfaceNormal = normalize(dir - grad * (uDistortion * 1.8));

    vNormal = normalize(normalMatrix * surfaceNormal);
    vPosition = p;

    vec4 worldPos = modelMatrix * vec4(p, 1.0);
    vWorldPosition = worldPos.xyz;

    vec3 viewDir = normalize(cameraPosition - worldPos.xyz);
    vFresnel = pow(1.0 - clamp(dot(vNormal, viewDir), 0.0, 1.0), 2.5);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const orbFragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uColor2;
  uniform vec3 uAccentColor;
  uniform float uTime;
  uniform float uActivity;
  uniform float uAudio;
  uniform float uHover;
  uniform float uGlow;
  uniform float uTurbulence;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  varying float vDisplacement;
  varying float vNoise;
  varying float vFresnel;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);

    // Fresnel rim glow with enhanced edge brilliance
    float fresnel = pow(1.0 - clamp(dot(vNormal, viewDir), 0.0, 1.0), 2.2);
    float sharpFresnel = pow(1.0 - clamp(dot(vNormal, viewDir), 0.0, 1.0), 5.0);

    float t = uTime * 1.2;

    // Fluid energy streams swirling along opposing latitude and longitude lines
    float stream1 = sin(vPosition.x * 5.0 + vPosition.y * 3.5 + t * 1.8) * 0.5 + 0.5;
    float stream2 = cos(vPosition.z * 6.0 - vPosition.x * 4.0 - t * 2.2) * 0.5 + 0.5;
    float stream3 = sin(atan(vPosition.z, vPosition.x) * 8.0 + vPosition.y * 4.0 + t * 2.5) * 0.5 + 0.5;

    // Intricate folding currents
    float fluidMix = mix(stream1, stream2, stream3);
    float energyVeins = pow(fluidMix, 3.2) * 2.0;

    // Chromatic dispersion simulation along the rim
    vec3 rimColor;
    rimColor.r = mix(uColor.r, uAccentColor.r, fresnel * 0.8);
    rimColor.g = mix(uColor.g, uColor2.g, fresnel * 0.5);
    rimColor.b = mix(uColor2.b, uAccentColor.b, fresnel * 0.9);

    // Base liquid body blending
    vec3 membraneColor = mix(uColor, uColor2, fluidMix);
    membraneColor = mix(membraneColor, uAccentColor, energyVeins * 0.45);

    // Dynamic luminescence intensity
    float audioIntensity = uAudio * 1.4;
    float activityBoost = uActivity * 0.7;
    float hoverSparkle = uHover * 0.35;

    float glowFactor = (fresnel * 2.2 + sharpFresnel * 2.0 + energyVeins * 0.8 + audioIntensity + hoverSparkle) * uGlow;

    vec3 finalColor = membraneColor * glowFactor + rimColor * (fresnel * 1.8 * uGlow);

    // Subsurface scattering warmth in internal folds
    vec3 sssColor = uColor * (1.0 - fresnel) * (0.35 + uActivity * 0.25);
    finalColor += sssColor;

    // Alpha transparency tuned for liquid depth
    float alpha = fresnel * 0.85 + 0.22 + (energyVeins * 0.35) + (uActivity * 0.15);
    alpha = clamp(alpha, 0.0, 0.98);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export const coreVertexShader = `
  uniform float uTime;
  uniform float uPulseSpeed;
  uniform float uAudio;
  uniform float uActivity;

  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    // Inner pulsating core breath
    float pulse = sin(uTime * uPulseSpeed) * 0.08 + (uAudio * 0.12) + (uActivity * 0.08);
    vec3 p = position * (1.0 + pulse);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

export const coreFragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uCoreColor;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uActivity;
  uniform float uAudio;

  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - clamp(dot(vNormal, viewDir), 0.0, 1.0), 1.8);
    float center = 1.0 - fresnel;

    // Core plasma gradient
    vec3 color = mix(uColor, uCoreColor, center * 0.7);
    color += vec3(0.3) * (uAudio * 0.8);

    float alpha = (center * 0.65 + fresnel * 0.3) * (uOpacity + uActivity * 0.15 + uAudio * 0.25);

    gl_FragColor = vec4(color * 1.5, alpha);
  }
`;
