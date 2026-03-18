import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

function ProjectNode({ project, position, onClick, isSelected }) {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.scale.setScalar(
      hovered || isSelected ? 1.4 : 1 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1
    );
  });

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onClick={(e) => { e.stopPropagation(); onClick(project); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'none'; }}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={hovered || isSelected ? 1.5 : 0.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial
          color={project.color}
          transparent
          opacity={hovered || isSelected ? 0.2 : 0.05}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {(hovered || isSelected) && (
        <Html distanceFactor={8} className="pointer-events-none">
          <div className="bg-dark/90 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 whitespace-nowrap">
            <p className="text-white text-sm font-display font-bold">{project.title}</p>
            <p className="text-slate-400 text-xs">{project.subtitle}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

function ConnectionLines({ projects, positions }) {
  const lineGeometry = useMemo(() => {
    const points = [];
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (projects[i].category === projects[j].category) {
          points.push(new THREE.Vector3(...positions[i]));
          points.push(new THREE.Vector3(...positions[j]));
        }
      }
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [projects, positions]);

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial color="#6366F1" transparent opacity={0.1} />
    </lineSegments>
  );
}

function Scene({ projects, onSelect, selectedId }) {
  const groupRef = useRef();

  const positions = useMemo(() => {
    return projects.map((p, i) => {
      const angle = (i / projects.length) * Math.PI * 2;
      const radius = 2 + (p.category === 'vision' ? 0.5 : p.category === 'rag' ? -0.3 : 0);
      const y = (Math.random() - 0.5) * 2;
      return [Math.cos(angle) * radius, y, Math.sin(angle) * radius];
    });
  }, [projects]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <ConnectionLines projects={projects} positions={positions} />
      {projects.map((project, i) => (
        <ProjectNode
          key={project.id}
          project={project}
          position={positions[i]}
          onClick={onSelect}
          isSelected={selectedId === project.id}
        />
      ))}
    </group>
  );
}

export default function LatentSpaceGlobe({ projects, onSelect, selectedId }) {
  return (
    <Canvas
      camera={{ position: [0, 2, 6], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <Scene projects={projects} onSelect={onSelect} selectedId={selectedId} />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={12}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
