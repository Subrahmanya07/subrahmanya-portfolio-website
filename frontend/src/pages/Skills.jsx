import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import SectionHeading from '../components/ui/SectionHeading';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import SkillOrbit from '../components/three/SkillOrbit';
import { skillCategories, techRadar } from '../data/skills';

function ProficiencyRing({ level, name, size = 80 }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="4"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-mono font-bold text-white light:text-slate-900">
            {level}%
          </span>
        </div>
      </div>
      <span className="text-xs text-slate-400 light:text-slate-700 text-center font-mono max-w-[80px] leading-tight">
        {name}
      </span>
    </div>
  );
}

const radarQuadrants = [
  { key: 'adopt', label: 'Adopt', color: 'text-green-400', desc: 'Production-ready, actively using' },
  { key: 'trial', label: 'Trial', color: 'text-accent-cyan', desc: 'Evaluating for production use' },
  { key: 'assess', label: 'Assess', color: 'text-yellow-400', desc: 'Exploring and learning' },
  { key: 'hold', label: 'Hold', color: 'text-slate-500 light:text-slate-700', desc: 'Monitoring, not active priority' },
];

export default function Skills() {
  const [activeTab, setActiveTab] = useState('aiml');

  const activeCategory = useMemo(
    () => skillCategories.find((c) => c.id === activeTab),
    [activeTab]
  );

  const allSkills = useMemo(
    () => activeCategory?.skills || [],
    [activeCategory]
  );

  return (
    <PageTransition>
      <div className="section-container pt-28">
        <SectionHeading
          title="Skill Galaxy"
          subtitle="Explore my technical skills across domains."
        />

        {/* 3D Orbit */}
        <div className="h-[400px] w-full mb-12 rounded-card overflow-hidden glass-card">
          <SkillOrbit skills={allSkills} />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {skillCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2 rounded-pill text-sm font-medium transition-all duration-300 ${
                activeTab === cat.id
                  ? 'bg-accent-indigo text-white shadow-lg shadow-indigo-500/25'
                  : 'glass-card text-slate-400 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Proficiency Rings */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <GlassCard className="p-8">
            <h3 className="font-display text-xl font-bold text-white light:text-slate-900 mb-6 text-center">
              {activeCategory?.label} Proficiency
            </h3>
            <div className="flex flex-wrap justify-center gap-8">
              {allSkills.map((skill) => (
                <ProficiencyRing
                  key={skill.name}
                  level={skill.level}
                  name={skill.name}
                />
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Tech Radar */}
        <div className="mt-16">
          <SectionHeading title="Tech Radar" subtitle="My technology adoption strategy." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {radarQuadrants.map(({ key, label, color, desc }) => (
              <GlassCard key={key} hover={false}>
                <h4 className={`font-display font-bold text-lg ${color} mb-1`}>
                  {label}
                </h4>
                <p className="text-xs text-slate-500 light:text-slate-600 mb-4">{desc}</p>
                <div className="space-y-2">
                  {techRadar
                    .filter((t) => t.quadrant === key)
                    .map((t) => (
                      <Badge key={t.name} variant={key === 'adopt' ? 'success' : key === 'trial' ? 'cyan' : key === 'assess' ? 'warning' : 'default'}>
                        {t.name}
                      </Badge>
                    ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
