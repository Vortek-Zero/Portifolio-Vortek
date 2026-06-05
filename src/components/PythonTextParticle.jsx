import { useEffect, useRef, useMemo, useCallback, Component } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const N = 4000;
const CAM_Z = 5.0;
const LIMITS = { minX: -800, maxX: 800, minY: -600, maxY: 600 };

function makeSprite() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function sampleText(text, count) {
  const offscreen = document.createElement("canvas");
  const w = 800, h = 160;
  offscreen.width = w;
  offscreen.height = h;
  const ctx = offscreen.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 64px JetBrains Mono, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2);
  const imageData = ctx.getImageData(0, 0, w, h);
  const pixels = imageData.data;
  const filled = [];
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const i = (y * w + x) * 4;
      if (pixels[i] > 128) filled.push({ x, y });
    }
  }
  if (filled.length === 0) return new Float32Array(count * 3);
  const arr = new Float32Array(count * 3);
  const cx = w / 2, cy = h / 2;
  for (let i = 0; i < count; i++) {
    const p = filled[Math.floor(Math.random() * filled.length)];
    const px = (p.x - cx) * 0.025;
    const py = -(p.y - cy) * 0.025;
    const pz = (Math.random() - 0.5) * 0.03;
    arr[i * 3]     = px + (Math.random() - 0.5) * 0.004;
    arr[i * 3 + 1] = py + (Math.random() - 0.5) * 0.004;
    arr[i * 3 + 2] = pz;
  }
  return arr;
}

function scatterPositions(count) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 0.02 + Math.random() * 0.04;
    arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
}

const vertexShader = `
  attribute float aEdge;
  uniform float uScale;
  varying float vEdge;
  varying float vAlpha;
  void main() {
    vEdge = aEdge;
    vAlpha = 0.85;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float size = 0.04 * uScale * (280.0 / -mvPosition.z);
    gl_PointSize = size;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying float vEdge;
  varying float vAlpha;
  uniform sampler2D uTexture;
  void main() {
    vec4 tex = texture2D(uTexture, gl_PointCoord);
    float alpha = tex.a * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`;

function Particles({ home, containerRef, dragActiveRef, dragVelRef }) {
  const pointsRef = useRef();
  const groupRef = useRef();
  const materialRef = useRef();

  const initPos = useMemo(() => scatterPositions(N), []);

  const pos = useRef(null);
  const vel = useRef(new Float32Array(N * 3));
  const revealed = useRef(false);
  const springTarget = useRef(null);

  const sprite = useMemo(() => makeSprite(), []);
  const floatPhase = useRef(Math.random() * Math.PI * 2);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    return g;
  }, []);

  useMemo(() => {
    pos.current = initPos.slice();
    vel.current = new Float32Array(N * 3);
    springTarget.current = initPos;

    const attr = geo.attributes.position;
    attr.array.set(initPos);
    attr.needsUpdate = true;

    const edges = new Float32Array(N);
    for (let i = 0; i < N; i++) edges[i] = 1.0;
    geo.setAttribute("aEdge", new THREE.BufferAttribute(edges, 1));
  }, [home, initPos, geo]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let timer = null;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !revealed.current) {
        timer = setTimeout(() => {
          revealed.current = true;
          springTarget.current = home;
        }, 3000);
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    obs.observe(el);
    setTimeout(() => {
      if (!revealed.current) {
        revealed.current = true;
        springTarget.current = home;
      }
    }, 4000);
    return () => {
      obs.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [containerRef, home]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !pos.current) return;
    const p = pos.current, v = vel.current;
    const target = springTarget.current;

    for (let i = 0; i < N; i++) {
      const a = i * 3, b = a + 1, c = a + 2;

      if (target) {
        const spring = revealed.current ? 0.025 : 0.002;
        v[a] += (target[a] - p[a]) * spring;
        v[b] += (target[b] - p[b]) * spring;
        v[c] += (target[c] - p[c]) * spring;

        if (revealed.current) {
          const jitter = 0.00002;
          v[a] += (Math.random() - 0.5) * jitter;
          v[b] += (Math.random() - 0.5) * jitter;
          v[c] += (Math.random() - 0.5) * jitter * 0.6;

          if (dragActiveRef.current && dragVelRef.current) {
            const speed = Math.sqrt(
              dragVelRef.current.x * dragVelRef.current.x +
              dragVelRef.current.y * dragVelRef.current.y
            );
            const shake = Math.min(speed * 0.0008, 0.006);
            v[a] += (Math.random() - 0.5) * shake;
            v[b] += (Math.random() - 0.5) * shake;
            v[c] += (Math.random() - 0.5) * shake * 0.4;
          }
        }

        v[a] *= revealed.current ? 0.90 : 0.98;
        v[b] *= 0.90;
        v[c] *= 0.90;
      }

      p[a] += v[a]; p[b] += v[b]; p[c] += v[c];
    }

    const attr = pointsRef.current.geometry.attributes.position;
    attr.array.set(p);
    attr.needsUpdate = true;

    if (groupRef.current) {
      floatPhase.current += delta * 0.6;
      groupRef.current.position.y = Math.sin(floatPhase.current) * 0.08;
    }
  });

  const uniforms = useMemo(() => ({
    uScale: { value: 0.8 },
    uTexture: { value: sprite },
  }), [sprite]);

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geo}>
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

class SafeBoundary extends Component {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() {
    if (this.state.err) return null;
    return this.props.children;
  }
}

export default function PythonTextParticle() {
  const elRef = useRef(null);
  const wrapRef = useRef(null);
  const dragRef = useRef(null);
  const dragActiveRef = useRef(false);
  const dragVelRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  const home = useMemo(() => sampleText("Python Fullstack", N), []);

  const animate = useCallback(() => {
    const p = posRef.current;
    const t = targetRef.current;
    const dx = (t.x - p.x) * 0.1;
    const dy = (t.y - p.y) * 0.1;
    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
      p.x = t.x;
      p.y = t.y;
      rafRef.current = null;
      return;
    }
    p.x += dx;
    p.y += dy;
    const el = elRef.current;
    if (el) {
      el.style.transform = `translate(${p.x}px, ${p.y}px)`;
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handlePointerDown = useCallback((e) => {
    if (!elRef.current) return;
    elRef.current.setPointerCapture(e.pointerId);
    const p = posRef.current;
    dragRef.current = { startX: e.clientX, startY: e.clientY, lastX: e.clientX, lastY: e.clientY, ox: p.x, oy: p.y };
    targetRef.current = { x: p.x, y: p.y };
    dragActiveRef.current = true;
    dragVelRef.current = { x: 0, y: 0 };
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!dragRef.current) return;
    const dx = (e.clientX - dragRef.current.startX) * 0.25;
    const dy = (e.clientY - dragRef.current.startY) * 0.25;
    dragVelRef.current = {
      x: e.clientX - dragRef.current.lastX,
      y: e.clientY - dragRef.current.lastY,
    };
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
    targetRef.current = {
      x: Math.max(LIMITS.minX, Math.min(LIMITS.maxX, dragRef.current.ox + dx)),
      y: Math.max(LIMITS.minY, Math.min(LIMITS.maxY, dragRef.current.oy + dy)),
    };
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
    dragActiveRef.current = false;
    dragVelRef.current = { x: 0, y: 0 };
  }, []);

  return (
    <div
      ref={elRef}
      className="python-text-window"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ cursor: "grab", touchAction: "none" }}
    >
      <div className="python-text-header">
        <span className="python-text-dot dot-red" />
        <span className="python-text-dot dot-yellow" />
        <span className="python-text-dot dot-green" />
        <span className="python-text-title">particle_text.py</span>
      </div>
      <div ref={wrapRef} className="python-text-canvas-wrap">
        <Canvas camera={{ position: [0, 0, CAM_Z], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <SafeBoundary>
            <Particles home={home} containerRef={wrapRef} dragActiveRef={dragActiveRef} dragVelRef={dragVelRef} />
          </SafeBoundary>
        </Canvas>
      </div>
    </div>
  );
}
