import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useStudentStore } from "@/store/useStudentStore";
import { motion } from "framer-motion";
import * as THREE from "three";

function PowerSun({ intensity, size }: { intensity: number; size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const color = useMemo(() => {
    if (intensity > 0.7) return new THREE.Color(1, 0.85, 0.2);
    if (intensity > 0.4) return new THREE.Color(1, 0.6, 0.1);
    return new THREE.Color(1, 0.35, 0.1);
  }, [intensity]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.3;
      meshRef.current.scale.setScalar(size + Math.sin(t * 2) * 0.05);
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(size * 1.3 + Math.sin(t * 1.5) * 0.1);
    }
  });

  return (
    <group>
      <pointLight color={color} intensity={intensity * 5} distance={10} />
      <ambientLight intensity={0.15} />
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity * 2}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

export default function MyPowerPage() {
  const { profile, getReadinessScore } = useStudentStore();
  const score = getReadinessScore();
  const skillsAvg = profile.skills.length > 0 ? profile.skills.reduce((a, s) => a + s.level, 0) / profile.skills.length : 0;

  const intensity = score / 100;
  const size = 0.6 + (score / 100) * 0.6;

  const factors = [
    { label: "Skills Power", value: Math.round(skillsAvg), emoji: "⚡" },
    { label: "Knowledge Depth", value: Math.round((profile.cgpa / 10) * 100), emoji: "📚" },
    { label: "Practical Experience", value: Math.min(profile.projects.length * 25 + profile.internships.length * 25, 100), emoji: "🔧" },
    { label: "Overall Readiness", value: score, emoji: "🌟" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">☀️ MyPower Visualization</h1>
        <p className="text-muted-foreground mt-1">Your career power visualized as a living sun — brightness reflects your readiness</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card overflow-hidden" style={{ height: 400 }}>
          <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
            <PowerSun intensity={intensity} size={size} />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
          </Canvas>
        </motion.div>

        <div className="space-y-4">
          {factors.map((f, i) => (
            <motion.div key={f.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="glass-card-hover p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="font-display font-semibold text-sm">{f.emoji} {f.label}</span>
                <span className="font-display font-bold text-lg">{f.value}%</span>
              </div>
              <div className="progress-track">
                <motion.div
                  className="progress-fill"
                  style={{ background: f.value >= 70 ? "hsl(var(--score-excellent))" : f.value >= 40 ? "hsl(var(--score-good))" : "hsl(var(--score-low))" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${f.value}%` }}
                  transition={{ duration: 1, delay: i * 0.15 }}
                />
              </div>
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="gradient-hero rounded-xl p-5 text-primary-foreground">
            <p className="text-sm leading-relaxed">
              {score >= 70 ? "🔥 Your sun burns bright! You have strong career readiness — keep refining your edge." :
               score >= 40 ? "🌤️ Your sun is growing! Continue building skills and gaining experience to shine brighter." :
               "🌅 Your sun is rising! Focus on adding projects, skills, and internships to fuel your power."}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
