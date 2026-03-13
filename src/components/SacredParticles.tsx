import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GoldParticles = ({ count = 200 }) => {
  const mesh = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sizes[i] = Math.random() * 3 + 1;
      speeds[i] = Math.random() * 0.5 + 0.1;
    }
    return { positions, sizes, speeds };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin(time * particles.speeds[i] + i) * 0.003;
      positions[i3] += Math.cos(time * particles.speeds[i] * 0.7 + i) * 0.002;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = time * 0.02;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#d4a843"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const SacredRing = ({ radius = 3, speed = 0.3, yOffset = 0 }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * speed;
    ref.current.rotation.z = state.clock.elapsedTime * speed * 0.5;
  });

  return (
    <mesh ref={ref} position={[0, yOffset, 0]}>
      <torusGeometry args={[radius, 0.008, 16, 100]} />
      <meshBasicMaterial color="#d4a843" transparent opacity={0.15} />
    </mesh>
  );
};

const FloatingDiamond = ({ position, speed = 1 }: { position: [number, number, number]; speed?: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * speed;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
  });

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.15, 0]} />
      <meshBasicMaterial color="#d4a843" transparent opacity={0.2} wireframe />
    </mesh>
  );
};

const SacredParticles = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`absolute inset-0 ${className}`} style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <GoldParticles count={150} />
        <SacredRing radius={4} speed={0.15} />
        <SacredRing radius={3} speed={-0.1} yOffset={0.5} />
        <SacredRing radius={5} speed={0.08} yOffset={-0.3} />
        <FloatingDiamond position={[-3, 2, -2]} speed={0.8} />
        <FloatingDiamond position={[4, -1, -3]} speed={0.6} />
        <FloatingDiamond position={[-2, -2, -1]} speed={1.2} />
        <FloatingDiamond position={[3, 1.5, -2]} speed={0.9} />
      </Canvas>
    </div>
  );
};

export default SacredParticles;
