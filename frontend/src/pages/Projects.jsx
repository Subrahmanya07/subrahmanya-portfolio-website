import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCubeTransparent, HiViewColumns, HiXMark, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import { FaGithub } from 'react-icons/fa';
import PageTransition from '../components/layout/PageTransition';
import SectionHeading from '../components/ui/SectionHeading';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import SemanticSearch from '../components/ai/SemanticSearch';
import LatentSpaceGlobe from '../components/three/LatentSpaceGlobe';
import { projects, projectCategories } from '../data/projects';

function ProjectDetailPanel({ project, onClose }) {
  if (!project) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 bottom-0 w-full max-w-md z-40 glass-card border-l border-white/10 overflow-y-auto"
    >
      <div className="p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-slate-400 light:text-slate-700 hover:text-white light:hover:text-slate-900 transition-colors"
        >
          <HiXMark className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 mt-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
          <Badge variant={project.status === 'Active' ? 'success' : project.status === 'In Development' ? 'warning' : 'cyan'}>
            {project.status}
          </Badge>
        </div>

        <h2 className="font-display text-2xl font-bold text-white light:text-slate-900 mb-1">
          {project.title}
        </h2>
        <p className="text-accent-indigo text-sm font-medium mb-2">{project.subtitle}</p>
        <p className="text-xs text-slate-500 light:text-slate-600 font-mono mb-6">{project.period}</p>

        <p className="text-slate-300 light:text-slate-600 leading-relaxed mb-6">
          {project.description}
        </p>

        {project.highlight && (
          <div className="glass-card p-3 border-accent-cyan/30 glow-border mb-6">
            <p className="text-accent-cyan text-sm font-mono">🏆 {project.highlight}</p>
          </div>
        )}

        <div className="mb-6">
          <h4 className="text-sm font-display font-bold text-slate-400 light:text-slate-700 mb-3">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <Badge key={t} variant="purple">{t}</Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <FaGithub /> View on GitHub
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [view, setView] = useState('3d');
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = searchQuery
    ? projects.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tech.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : projects;

  return (
    <PageTransition>
      <div className="pt-28">
        <div className="section-container pb-0">
          <SectionHeading
            title="Projects"
            subtitle="Navigate through my work in 3D space — or switch to grid view."
          />

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <div className="flex-1 w-full sm:max-w-md">
              <SemanticSearch onSearch={setSearchQuery} />
            </div>

            <div className="flex items-center gap-2">
              {Object.entries(projectCategories).map(([key, { label, color }]) => (
                <div key={key} className="flex items-center gap-1.5 text-xs text-slate-400 light:text-slate-700">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  {label}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1 glass-card p-1">
              <button
                onClick={() => setView('3d')}
                className={`p-2 rounded-lg transition-all ${view === '3d' ? 'bg-accent-indigo text-white' : 'text-slate-400 light:text-slate-700 hover:text-white light:hover:text-slate-900'}`}
                aria-label="3D View"
              >
                <HiCubeTransparent className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-accent-indigo text-white' : 'text-slate-400 light:text-slate-700 hover:text-white light:hover:text-slate-900'}`}
                aria-label="Grid View"
              >
                <HiViewColumns className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3D View */}
        {view === '3d' && (
          <div className="h-[70vh] w-full relative">
            <LatentSpaceGlobe
              projects={filteredProjects}
              onSelect={setSelected}
              selectedId={selected?.id}
            />
            <div className="absolute bottom-4 left-4 text-xs text-slate-500 light:text-slate-600 font-mono">
              Click a node to view details • Drag to rotate • Scroll to zoom
            </div>
          </div>
        )}

        {/* Grid View */}
        {view === 'grid' && (
          <div className="section-container pt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelected(project)}
                  className="cursor-pointer"
                >
                  <GlassCard glow className="h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                      <Badge variant={project.status === 'Active' ? 'success' : 'cyan'}>
                        {project.status}
                      </Badge>
                      <span className="text-xs text-slate-500 light:text-slate-600 font-mono ml-auto">{project.period}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-white light:text-slate-900 mb-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-400 light:text-slate-700 mb-3">{project.subtitle}</p>
                    <p className="text-sm text-slate-300 light:text-slate-600 line-clamp-3 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.slice(0, 4).map((t) => (
                        <Badge key={t} variant="purple">{t}</Badge>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Detail panel */}
        <AnimatePresence>
          {selected && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-30"
                onClick={() => setSelected(null)}
              />
              <ProjectDetailPanel project={selected} onClose={() => setSelected(null)} />
            </>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
