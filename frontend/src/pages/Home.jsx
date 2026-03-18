import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import ParticleField from '../components/three/ParticleField';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import Badge from '../components/ui/Badge';
import { useTypewriter } from '../hooks/useTypewriter';
import { HiArrowDownTray } from 'react-icons/hi2';
import { personalInfo } from '../data/resume';
import { projects } from '../data/projects';

const bootLines = [
  '> Connecting to Neural Nexus...',
  '> Loading: Edge AI Systems.............. [OK]',
  '> Loading: Computer Vision.............. [OK]',
  '> Loading: Agentic RAG Pipeline......... [OK]',
  "> Welcome. Let's build something remarkable.",
];

function BootSequence({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    bootLines.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
        if (i === bootLines.length - 1) {
          setTimeout(() => {
            setDone(true);
            setTimeout(onComplete, 500);
          }, 800);
        }
      }, (i + 1) * 500);
    });
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-dark light:bg-light flex items-center justify-center"
      animate={done ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="font-mono text-sm max-w-lg w-full px-6">
        {visibleLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`mb-2 ${
              line.includes('[OK]')
                ? 'text-green-400'
                : line.includes('Welcome')
                ? 'text-accent-cyan'
                : 'text-accent-indigo'
            }`}
          >
            {line}
          </motion.div>
        ))}
        <motion.div
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="text-accent-cyan mt-2"
        >
          ▊
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [showBoot, setShowBoot] = useState(() => {
    return !sessionStorage.getItem('booted');
  });
  const subtitle = useTypewriter(personalInfo.taglines);
  const featured = projects.filter((p) => p.featured);

  const handleBootComplete = () => {
    setBooted(true);
    setShowBoot(false);
    sessionStorage.setItem('booted', 'true');
  };

  return (
    <PageTransition>
      <AnimatePresence>
        {showBoot && !booted && <BootSequence onComplete={handleBootComplete} />}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticleField />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: showBoot ? 3 : 0.2 }}
            className="font-mono text-accent-cyan text-sm mb-4"
          >
            {'>'} Initializing Neural Nexus...
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: showBoot ? 3.2 : 0.4 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold mb-4"
          >
            <span className="text-white light:text-slate-900">
              {personalInfo.name.split(' ')[0]}
            </span>
            <br />
            <span className="text-gradient">
              {personalInfo.name.split(' ').slice(1).join(' ')}
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: showBoot ? 3.5 : 0.7 }}
            className="h-8 mb-8"
          >
            <span className="font-mono text-xl text-accent-cyan">
              {subtitle}
              <span className="animate-pulse">|</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: showBoot ? 3.8 : 1 }}
            className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4"
          >
            <Link to="/projects" className="btn-primary">
              Explore My Work →
            </Link>
            <button
              onClick={() => document.querySelector('[aria-label="Toggle AI Assistant"]')?.click()}
              className="btn-outline"
            >
              Talk to My AI Agent →
            </button>
            <a href="/resume.pdf" download className="btn-outline inline-flex items-center gap-2">
              <HiArrowDownTray className="w-4 h-4" />
              Download Resume
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/10 light:border-gray-200/30">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-4 sm:gap-8 text-center">
          <div>
            <AnimatedCounter end={5} suffix="+" />
            <p className="text-slate-400 light:text-slate-700 mt-2 text-sm font-mono">Projects</p>
          </div>
          <div>
            <AnimatedCounter end={1} suffix="+" />
            <p className="text-slate-400 light:text-slate-700 mt-2 text-sm font-mono">Years Experience</p>
          </div>
          <div>
            <AnimatedCounter end={10} suffix="+" />
            <p className="text-slate-400 light:text-slate-700 mt-2 text-sm font-mono">Technologies</p>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-container">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl font-bold text-center text-gradient mb-12"
        >
          Featured Projects
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <GlassCard className="h-full" glow>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <Badge variant={project.status === 'Active' ? 'success' : 'cyan'}>
                    {project.status}
                  </Badge>
                </div>
                <h3 className="font-display text-xl font-bold text-white light:text-slate-900 mb-1">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-400 light:text-slate-700 mb-3">{project.subtitle}</p>
                <p className="text-sm text-slate-300 light:text-slate-600 mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.slice(0, 4).map((t) => (
                    <Badge key={t} variant="purple">
                      {t}
                    </Badge>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/projects" className="btn-outline">
            View All Projects →
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
