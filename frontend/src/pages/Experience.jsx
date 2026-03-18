import { motion } from 'framer-motion';
import { HiArrowTopRightOnSquare } from 'react-icons/hi2';
import PageTransition from '../components/layout/PageTransition';
import SectionHeading from '../components/ui/SectionHeading';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import { experience, education, certifications, activities, achievements } from '../data/resume';

function TimelineItem({ item, index, isLeft }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`flex items-start gap-6 mb-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Timeline dot */}
      <div className="hidden md:flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-accent-indigo border-4 border-dark light:border-light z-10" />
        <div className="w-0.5 h-full bg-white/10 light:bg-gray-300" />
      </div>

      <GlassCard className="flex-1" glow>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant={item.type === 'full-time' ? 'default' : 'cyan'}>
            {item.type === 'full-time' ? 'Full-time' : 'Internship'}
          </Badge>
          <span className="text-xs text-slate-500 light:text-slate-600 font-mono">{item.period}</span>
        </div>

        <h3 className="font-display text-xl font-bold text-white light:text-slate-900">
          {item.role}
        </h3>
        <p className="text-accent-indigo font-medium text-sm mb-1">
          {item.company} • {item.location}
        </p>

        <ul className="space-y-2 mt-3">
          {item.points.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300 light:text-slate-600">
              <span className="text-accent-cyan mt-1 shrink-0">▹</span>
              {point}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {item.tech.map((t) => (
            <Badge key={t} variant="purple">{t}</Badge>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <PageTransition>
      <div className="section-container pt-28">
        {/* Work Experience */}
        <SectionHeading
          title="Experience"
          subtitle="My professional journey in AI and software engineering."
        />

        <div className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/10 light:bg-gray-300 -translate-x-1/2" />

          {experience.map((item, i) => (
            <TimelineItem key={item.id} item={item} index={i} isLeft={i % 2 === 0} />
          ))}
        </div>

        {/* Education */}
        <div className="mt-20">
          <SectionHeading title="Education" />
          <div className="max-w-3xl mx-auto space-y-6">
            {education.map((edu, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard>
                  <h3 className="font-display text-lg font-bold text-white light:text-slate-900">
                    {edu.institution}
                  </h3>
                  <p className="text-accent-indigo text-sm font-medium">
                    {edu.degree} — {edu.field}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-slate-400 light:text-slate-700">
                    <span className="font-mono">{edu.period}</span>
                    <Badge variant="success">{edu.grade}</Badge>
                  </div>
                  {edu.coursework && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {edu.coursework.map((c) => (
                        <Badge key={c} variant="purple">{c}</Badge>
                      ))}
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-20">
          <SectionHeading title="Certifications & Activities" />
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
            <GlassCard>
              <h3 className="font-display text-lg font-bold text-white light:text-slate-900 mb-4">
                Certifications
              </h3>
              <div className="space-y-2">
                {certifications.map((cert, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-300 light:text-slate-600">
                    <span className="text-accent-cyan shrink-0">✦</span>
                    <span className="flex-1">{cert.name}</span>
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-cyan hover:text-accent-indigo transition-colors shrink-0"
                        aria-label={`View ${cert.name} certificate`}
                      >
                        <HiArrowTopRightOnSquare className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="space-y-6">
              {activities.map((act, i) => (
                <GlassCard key={i}>
                  <h4 className="font-display font-bold text-white light:text-slate-900">{act.org}</h4>
                  <p className="text-accent-indigo text-sm">{act.role} • {act.period}</p>
                  <p className="text-sm text-slate-400 light:text-slate-700 mt-2">{act.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-12 max-w-3xl mx-auto">
          {achievements.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card p-4 border-accent-cyan/30 glow-border"
            >
              <p className="text-accent-cyan font-mono text-sm flex items-center gap-2">
                <span>🏆</span> {a}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </PageTransition>
  );
}
