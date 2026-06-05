import { useEffect, useRef, useMemo, useState, Component } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

const N = 7000;
const SCALE = 0.042;
const CAM_Z = 6.0;
const TAN_HALF_FOV = Math.tan((40 * Math.PI / 180) / 2);

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

function sampleFromGeometry(geometry, count) {
  const posAttr = geometry.attributes.position;
  const index = geometry.index;
  const triCount = index ? index.count / 3 : posAttr.count / 3;
  const vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3();
  const cross = new THREE.Vector3();
  let totalArea = 0;
  const areas = new Float32Array(triCount);
  for (let t = 0; t < triCount; t++) {
    const ai = index ? index.getX(t * 3)     : t * 3;
    const bi = index ? index.getX(t * 3 + 1) : t * 3 + 1;
    const ci = index ? index.getX(t * 3 + 2) : t * 3 + 2;
    vA.fromBufferAttribute(posAttr, ai);
    vB.fromBufferAttribute(posAttr, bi);
    vC.fromBufferAttribute(posAttr, ci);
    cross.crossVectors(vB.clone().sub(vA), vC.clone().sub(vA));
    const area = cross.length() * 0.5;
    areas[t] = area;
    totalArea += area;
  }
  const cdf = new Float32Array(triCount);
  let acc = 0;
  for (let t = 0; t < triCount; t++) { acc += areas[t] / totalArea; cdf[t] = acc; }
  const result = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    let lo = 0, hi = triCount - 1;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (cdf[mid] < r) lo = mid + 1; else hi = mid; }
    const t = lo;
    const ai = index ? index.getX(t * 3)     : t * 3;
    const bi = index ? index.getX(t * 3 + 1) : t * 3 + 1;
    const ci = index ? index.getX(t * 3 + 2) : t * 3 + 2;
    vA.fromBufferAttribute(posAttr, ai);
    vB.fromBufferAttribute(posAttr, bi);
    vC.fromBufferAttribute(posAttr, ci);
    const u = Math.random(), v = Math.random();
    const su = Math.sqrt(u);
    const bary0 = 1 - su, bary1 = su * (1 - v), bary2 = su * v;
    result[i * 3]     = bary0 * vA.x + bary1 * vB.x + bary2 * vC.x;
    result[i * 3 + 1] = bary0 * vA.y + bary1 * vB.y + bary2 * vC.y;
    result[i * 3 + 2] = bary0 * vA.z + bary1 * vB.z + bary2 * vC.z;
  }
  return result;
}

function buildHome(shapes) {
  const extrudeSettings = { depth: 0.5, bevelEnabled: false };
  const geos = [];
  for (const shape of shapes) {
    try { geos.push(new THREE.ExtrudeGeometry(shape, extrudeSettings)); } catch (_) {}
  }
  if (geos.length === 0) return new Float32Array(N * 3);
  let totalVerts = 0, totalIdx = 0;
  for (const g of geos) {
    g.computeBoundingBox();
    totalVerts += g.attributes.position.count;
    if (g.index) totalIdx += g.index.count;
  }
  const merged = new THREE.BufferGeometry();
  const positions = new Float32Array(totalVerts * 3);
  const indices = totalIdx > 0 ? [] : null;
  let vOffset = 0;
  for (const g of geos) {
    const pa = g.attributes.position;
    positions.set(new Float32Array(pa.array), vOffset * 3);
    if (indices && g.index) {
      for (let k = 0; k < g.index.count; k++) indices.push(g.index.getX(k) + vOffset);
    }
    vOffset += pa.count;
  }
  merged.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  if (indices) merged.setIndex(indices);
  merged.computeBoundingBox();
  const box = merged.boundingBox;
  const cx = (box.min.x + box.max.x) / 2;
  const cy = (box.min.y + box.max.y) / 2;
  const cz = (box.min.z + box.max.z) / 2;
  const pa = merged.attributes.position;
  for (let i = 0; i < pa.count; i++) {
    pa.setXYZ(i,
      (pa.getX(i) - cx) * SCALE,
      -(pa.getY(i) - cy) * SCALE,
      (pa.getZ(i) - cz) * SCALE
    );
  }
  pa.needsUpdate = true;
  return sampleFromGeometry(merged, N);
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

// ── Shader: edge glow ────────────────────────────────────────────────
const vertexShader = `
  attribute float aEdge;
  uniform float uScale;
  varying float vEdge;
  varying float vAlpha;
  void main() {
    vEdge = aEdge;
    vAlpha = 0.15 + aEdge * 0.7;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float size = (0.015 + aEdge * 0.025) * uScale * (280.0 / -mvPosition.z);
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

// ── Compute edge factor array from home positions ────────────────────
function computeEdges(home) {
  let cx = 0, cy = 0, cz = 0;
  for (let i = 0; i < N; i++) { cx += home[i*3]; cy += home[i*3+1]; cz += home[i*3+2]; }
  cx /= N; cy /= N; cz /= N;
  let maxDist = 0;
  const dists = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const dx = home[i*3] - cx, dy = home[i*3+1] - cy, dz = home[i*3+2] - cz;
    dists[i] = Math.sqrt(dx*dx + dy*dy + dz*dz);
    if (dists[i] > maxDist) maxDist = dists[i];
  }
  const edges = new Float32Array(N);
  for (let i = 0; i < N; i++) edges[i] = Math.min(1, dists[i] / (maxDist * 0.7));
  return edges;
}

// ── Particle component ───────────────────────────────────────────────
function Particles({ shapes, mouseRef, containerRef }) {
  const pointsRef = useRef();
  const groupRef = useRef();
  const materialRef = useRef();

  const home = useMemo(() => {
    try { return buildHome(shapes); } catch (e) { console.error(e); return new Float32Array(N * 3); }
  }, [shapes]);

  const initPos = useMemo(() => scatterPositions(N), []);

  const pos = useRef(null);
  const vel = useRef(new Float32Array(N * 3));
  const edges = useRef(new Float32Array(N));
  const revealed = useRef(false);
  const phase = useRef(null); // null | 'suck' | 'burst'
  const phaseStart = useRef(0);
  const singularity = useRef({ x: 0, y: 0 });
  const springTarget = useRef(null);

  const sprite = useMemo(() => makeSprite(), []);
  const floatPhase = useRef(Math.random() * Math.PI * 2);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    return g;
  }, []);

  // Observe container for reveal with delay
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
    return () => {
      obs.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [containerRef, home]);

  // Initialize
  useEffect(() => {
    pos.current = initPos.slice();
    vel.current = new Float32Array(N * 3);
    edges.current = computeEdges(home);
    springTarget.current = initPos;

    const attr = geo.attributes.position;
    attr.array.set(initPos);
    attr.needsUpdate = true;

    // Set edge attribute
    geo.setAttribute("aEdge", new THREE.BufferAttribute(edges.current, 1));
  }, [home, initPos, geo]);

  // Handle container clicks for explosion
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e) => {
      if (e.button !== 0) return;
      if (!revealed.current || phase.current) return;

      // Black hole → supernova
      singularity.current = { x: mouseRef.current.x3d, y: mouseRef.current.y3d };
      phase.current = 'suck';
      phaseStart.current = performance.now();

      setTimeout(() => {
        if (phase.current === 'suck') {
          phase.current = 'burst';
          phaseStart.current = performance.now();
        }
        setTimeout(() => {
          phase.current = null;
          springTarget.current = home;
        }, 2000);
      }, 500);
    };
    el.addEventListener("pointerdown", handler);
    return () => el.removeEventListener("pointerdown", handler);
  }, [containerRef, home]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !pos.current) return;
    const p = pos.current, v = vel.current;
    const target = springTarget.current;
    const ms = mouseRef.current;
    const spd = Math.sqrt(ms.vx * ms.vx + ms.vy * ms.vy);
    const now = performance.now();

    for (let i = 0; i < N; i++) {
      const a = i * 3, b = a + 1, c = a + 2;

      if (phase.current === 'suck') {
        // Black hole: strong pull toward cursor
        const sx = singularity.current.x, sy = singularity.current.y;
        const dx = sx - p[a], dy = sy - p[b], dz = -p[c];
        const d = Math.sqrt(dx*dx + dy*dy + dz*dz) || 0.001;
        const pull = 0.012 + (1 / (d + 0.05)) * 0.008;
        v[a] += (dx / d) * pull;
        v[b] += (dy / d) * pull;
        v[c] += (dz / d) * pull * 0.5;
        v[a] *= 0.91;
        v[b] *= 0.91;
        v[c] *= 0.91;
      } else if (phase.current === 'burst') {
        // Supernova: strong outward blast, no box limit
        const sx = singularity.current.x, sy = singularity.current.y;
        const dx = p[a] - sx, dy = p[b] - sy, dz = p[c];
        const d = Math.sqrt(dx*dx + dy*dy + dz*dz) || 0.001;
        const elapsed = (now - phaseStart.current) / 1000;
        const decay = Math.max(0, 1 - elapsed / 2.5);
        const push = 0.04 * decay;
        v[a] += (dx / d) * push + (Math.random() - 0.5) * 0.015 * decay;
        v[b] += (dy / d) * push + (Math.random() - 0.5) * 0.015 * decay;
        v[c] += (dz / d) * push * 0.4 + (Math.random() - 0.5) * 0.008 * decay;

        // Soft elastic limit: gently pull back if too far from origin
        const distFromCenter = Math.sqrt(p[a]*p[a] + p[b]*p[b] + p[c]*p[c]);
        const maxDist = 3.5;
        if (distFromCenter > maxDist) {
          const pullBack = (distFromCenter - maxDist) * 0.02;
          v[a] -= (p[a] / distFromCenter) * pullBack;
          v[b] -= (p[b] / distFromCenter) * pullBack;
          v[c] -= (p[c] / distFromCenter) * pullBack;
        }

        // Also spring weakly back toward home so they eventually reform
        if (target) {
          v[a] += (target[a] - p[a]) * 0.003;
          v[b] += (target[b] - p[b]) * 0.003;
          v[c] += (target[c] - p[c]) * 0.004;
        }

        v[a] *= 0.96;
        v[b] *= 0.96;
        v[c] *= 0.96;
      } else if (target) {
        // Spring toward target (home or initPos)
        const spring = revealed.current ? 0.025 : 0.002;
        v[a] += (target[a] - p[a]) * spring;
        v[b] += (target[b] - p[b]) * spring;
        v[c] += (target[c] - p[c]) * spring;

        if (revealed.current) {
          // Visible thermal jitter — hot molecule shake
          v[a] += (Math.random() - 0.5) * 0.003;
          v[b] += (Math.random() - 0.5) * 0.003;
          v[c] += (Math.random() - 0.5) * 0.0015;

          if (ms.active) {
            const dx = p[a] - ms.x3d;
            const dy = p[b] - ms.y3d;
            const d2 = dx * dx + dy * dy;
            const R = 0.55;
            if (d2 < R * R) {
              const d = Math.sqrt(d2) || 0.001;
              const strength = 1 - d / R;
              const force = (0.015 + spd * 0.4) * strength;
              v[a] += (dx / d) * force;
              v[b] += (dy / d) * force;
              v[c] += (0.012 + spd * 0.12) * strength;
            }
          }
        }

        v[a] *= revealed.current ? 0.89 : 0.98;
        v[b] *= 0.89;
        v[c] *= 0.89;
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
    uScale: { value: 1 },
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
    if (this.state.err) return <div className="python-3d-loader">python_art.py</div>;
    return this.props.children;
  }
}

export default function Python3D() {
  const [shapes, setShapes] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x3d: 0, y3d: 0, vx: 0, vy: 0, active: false });

  useEffect(() => {
    const loader = new SVGLoader();
    loader.load(
      "/python.svg?v=" + Date.now(),
      (data) => {
        const all = [];
        for (const path of data.paths) {
          try { all.push(...SVGLoader.createShapes(path)); } catch (_) {}
        }
        setShapes(all);
        setLoading(false);
      },
      undefined,
      () => setLoading(false)
    );
  }, []);

  const handleMouseMove = (e) => {
    const ms = mouseRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx  = ((e.clientX - rect.left)  / rect.width)  * 2 - 1;
    const ny  = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    const nx3d = nx * TAN_HALF_FOV * CAM_Z;
    const ny3d = ny * TAN_HALF_FOV * CAM_Z;
    ms.vx = nx3d - ms.x3d;
    ms.vy = ny3d - ms.y3d;
    ms.x3d = nx3d;
    ms.y3d = ny3d;
    ms.active = true;
  };

  return (
    <div
      ref={containerRef}
      className="python-canvas-wrap"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseRef.current.active = false;
        mouseRef.current.vx = 0;
        mouseRef.current.vy = 0;
      }}
    >
      {loading && <div className="python-3d-loader">loading...</div>}
      {!loading && shapes.length > 0 && (
        <SafeBoundary>
          <Canvas
            camera={{ position: [0, 0, CAM_Z], fov: 40 }}
            dpr={[1, 1.5]}
            gl={{ antialias: false, alpha: true }}
            style={{ width: "100%", height: "100%" }}
          >
            <Particles shapes={shapes} mouseRef={mouseRef} containerRef={containerRef} />
          </Canvas>
        </SafeBoundary>
      )}
    </div>
  );
}
