import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function OrbitRing({ radius, color, speed, skills }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  const ringGeo = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius]);

  return (
    <group ref={groupRef}>
      <line geometry={ringGeo}>
        <lineBasicMaterial color={color} transparent opacity={0.2} />
      </line>
      {skills.map((skill, i) => {
        const angle = (i / skills.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={skill.name} position={[x, 0, z]}>
            <Sphere args={[0.12, 12, 12]}>
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.5}
              />
            </Sphere>
            <Html distanceFactor={10} className="pointer-events-none">
              <div className="whitespace-nowrap text-xs font-mono text-white bg-dark/80 px-2 py-1 rounded">
                {skill.name}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

function CenterAvatar() {
  return (
    <Sphere args={[0.3, 32, 32]}>
      <meshStandardMaterial
        color="#6366F1"
        emissive="#6366F1"
        emissiveIntensity={0.8}
        transparent
        opacity={0.9}
      />
    </Sphere>
  );
}

export default function SkillOrbit({ skills }) {
  const coreSkills = skills.filter((s) => s.orbit === 'core');
  const secondarySkills = skills.filter((s) => s.orbit === 'secondary');
  const emergingSkills = skills.filter((s) => s.orbit === 'emerging');

  return (
    <Canvas
      camera={{ position: [0, 3, 6], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <CenterAvatar />
      <OrbitRing radius={1.5} color="#6366F1" speed={0.3} skills={coreSkills} />
      <OrbitRing radius={2.5} color="#22D3EE" speed={-0.2} skills={secondarySkills} />
      <OrbitRing radius={3.5} color="#A855F7" speed={0.15} skills={emergingSkills} />
      <OrbitControls enablePan={false} enableZoom={true} minDistance={3} maxDistance={12} />
    </Canvas>
  );
}
