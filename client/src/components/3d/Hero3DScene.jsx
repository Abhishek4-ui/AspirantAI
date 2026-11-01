import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

// Floating Futuristic AI Assistant Orb
function AiAssistantOrb() {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t / 4);
      meshRef.current.rotation.y = Math.cos(t / 2);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <Sphere ref={meshRef} args={[1.3, 64, 64]} position={[2.2, 0.2, 0]}>
        <MeshDistortMaterial
          color="#0066FF"
          emissive="#00D4FF"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.8}
          distort={0.4}
          speed={2.5}
        />
      </Sphere>
    </Float>
  );
}

// 3D Glowing Polyhedron / Knowledge Nodes
function KnowledgePolyhedron({ position, color, speed = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.008 * speed;
      meshRef.current.rotation.y += 0.012 * speed;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1.2} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          wireframe
        />
      </mesh>
    </Float>
  );
}

// Floating Particle Field
function ParticleField({ count = 80 }) {
  const pointsRef = useRef();
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 16;
      pos[i + 1] = (Math.random() - 0.5) * 10;
      pos[i + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  });

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0008;
    }
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
        size={0.06}
        color="#00F5D4"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// WebGL Fallback CSS/SVG illustration if WebGL is unavailable or reduced motion is requested
function ProceduralHeroFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      <div className="w-80 h-80 rounded-full bg-gradient-to-tr from-electric-blue via-neon-cyan to-neon-purple opacity-30 blur-3xl animate-pulse-glow" />
      <div className="absolute w-60 h-60 rounded-3xl border border-electric-blue/40 bg-navy-800/40 backdrop-blur-md rotate-12 flex flex-col items-center justify-center p-6 shadow-glow-blue animate-float">
        <span className="text-4xl mb-2">⚡</span>
        <div className="text-xs uppercase font-bold tracking-widest text-neon-cyan">AspirantAI 3D Core</div>
        <div className="text-sm font-semibold text-slate-200 mt-2 text-center">AI Question Engine Active</div>
      </div>
    </div>
  );
}

export default function Hero3DScene() {
  const [supportsWebGL, setSupportsWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setSupportsWebGL(false);
    } catch (e) {
      setSupportsWebGL(false);
    }
  }, []);

  if (!supportsWebGL) {
    return <ProceduralHeroFallback />;
  }

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00D4FF" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#9D4EDD" />

        <Suspense fallback={null}>
          <AiAssistantOrb />
          <KnowledgePolyhedron position={[-2.8, 1.2, -1]} color="#00F5D4" speed={1.2} />
          <KnowledgePolyhedron position={[-2.2, -1.5, 0.5]} color="#9D4EDD" speed={0.9} />
          <KnowledgePolyhedron position={[3.2, 1.8, -1.5]} color="#0066FF" speed={1.4} />
          <ParticleField count={90} />
        </Suspense>
      </Canvas>
    </div>
  );
}
