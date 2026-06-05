/* =========================================================
 * !!! AVISO CRÍTICO DE DESENVOLVIMENTO: NÃO MUDAR NADA !!!
 *  ESTE COMPONENTE 3D FOI CONFIGURADO, AJUSTADO E HOMOLOGADO
 *  PELO CLIENTE. QUALQUER ALTERAÇÃO EM MATERIAIS, EIXO DE
 *  ROTAÇÃO, VETORIZAÇÃO OU ESCALA DEVE SER EVITADA.
 * ========================================================= */
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Center } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";

function LogoMesh({ shapes }) {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * 0.5;

    // Rotação perfeita no próprio eixo, pois o conteúdo já está centralizado dentro
    ref.current.rotation.y = t;
    ref.current.position.y = Math.sin(t * 0.8) * 0.08;
  });

  const extrudeSettings = {
    depth: 55,
    bevelEnabled: true,
    bevelSegments: 8,
    steps: 1,
    bevelSize: 3.5,
    bevelThickness: 4,
  };

  return (
    <group ref={ref}>
      {/* ========================================== */}
      {/* !!! AVISO CRÍTICO: NÃO MUDAR NADA AQUI !!! */}
      {/*   ESTA CONFIGURAÇÃO ESTÁ 100% HOMOLOGADA   */}
      {/* ========================================== */}
      <Center scale={[0.0058, -0.0058, 0.0058]}>
        {shapes.map((shape, i) => (
          <mesh key={i} castShadow receiveShadow>
            <extrudeGeometry args={[shape, extrudeSettings]} />
            <meshPhysicalMaterial
              color="#d4d4d8"
              metalness={1}
              roughness={0.12}
              envMapIntensity={2.2}
              clearcoat={0.3}
              clearcoatRoughness={0.15}
              reflectivity={1}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </Center>
    </group>
  );
}

export default function Logo3D() {
  const [shapes, setShapes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loader = new SVGLoader();
    loader.load(
      "/logo.svg?v=" + Date.now(),
      (data) => {
        const allShapes = [];
        for (const path of data.paths) {
          allShapes.push(...SVGLoader.createShapes(path));
        }
        setShapes(allShapes);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error("SVG load error:", err);
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="logo-3d-container-outer" style={{ position: 'relative' }}>
      {/* Logo Glow Backlight */}
      <div 
        className="logo-backlight"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(20px)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
      
      <div
        className="logo-3d-scene"
        style={{ width: 360, height: 360, margin: "0 auto", cursor: "grab", position: 'relative', zIndex: 1 }}
      >
        <Canvas
          camera={{ position: [0, 0, 4.2], fov: 38 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <directionalLight position={[-3, -2, -4]} intensity={0.3} />

          {!loading && shapes.length > 0 && (
            <LogoMesh shapes={shapes} />
          )}

          <Environment preset="city" resolution={256} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.3}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Canvas>
      </div>
      {loading && (
        <div className="logo-3d-loader">
          <div className="spinner" />
        </div>
      )}
      <p className="logo-3d-hint">arraste para rotacionar</p>
    </div>
  );
}
