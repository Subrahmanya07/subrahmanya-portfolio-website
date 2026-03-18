import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiEnvelope, HiMapPin } from 'react-icons/hi2';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import PageTransition from '../components/layout/PageTransition';
import SectionHeading from '../components/ui/SectionHeading';
import GlassCard from '../components/ui/GlassCard';
import Badge from '../components/ui/Badge';
import { personalInfo } from '../data/resume';

const subjects = ['Job Opportunity', 'Collaboration', 'General'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General', message: '' });
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed');

      setStatus('success');
      setForm({ name: '', email: '', subject: 'General', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="section-container pt-28">
        <SectionHeading
          title="Get In Touch"
          subtitle="Let's build something remarkable together."
        />

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Left — Info */}
          <div className="space-y-6">
            <GlassCard hover={false}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-indigo/20 flex items-center justify-center">
                    <HiMapPin className="w-5 h-5 text-accent-indigo" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 light:text-slate-700">Location</p>
                    <p className="text-white light:text-slate-900 font-medium">{personalInfo.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-cyan/20 flex items-center justify-center">
                    <HiEnvelope className="w-5 h-5 text-accent-cyan" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 light:text-slate-700">Email</p>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="text-accent-cyan hover:underline font-medium"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                </div>

              </div>
            </GlassCard>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { icon: FaGithub, href: personalInfo.github },
                { icon: FaLinkedin, href: personalInfo.linkedin },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 glass-card flex items-center justify-center text-slate-400 light:text-slate-700 hover:text-accent-cyan hover:glow-border transition-all duration-300 rounded-full"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Terminal status */}
            <div className="terminal">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-xs text-slate-500 light:text-slate-600">status</span>
              </div>
              <p className="terminal-line">
                {'>'} open_to_work --status=active
              </p>
              <p className="text-green-400 text-sm mt-1">
                Available for Edge AI, MLOps & Agentic Systems roles.
              </p>
            </div>
          </div>

          {/* Right — Form */}
          <GlassCard hover={false}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-slate-400 light:text-slate-700 mb-1.5 font-mono">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 light:bg-gray-50 border border-white/10 light:border-gray-300 rounded-card px-4 py-3 text-white light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-accent-indigo transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 light:text-slate-700 mb-1.5 font-mono">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 light:bg-gray-50 border border-white/10 light:border-gray-300 rounded-card px-4 py-3 text-white light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-accent-indigo transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 light:text-slate-700 mb-1.5 font-mono">Subject</label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full bg-white/5 light:bg-gray-50 border border-white/10 light:border-gray-300 rounded-card px-4 py-3 text-white light:text-slate-900 focus:outline-none focus:border-accent-indigo transition-colors"
                >
                  {subjects.map((s) => (
                    <option key={s} value={s} className="bg-dark light:bg-white light:text-slate-900">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 light:text-slate-700 mb-1.5 font-mono">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-white/5 light:bg-gray-50 border border-white/10 light:border-gray-300 rounded-card px-4 py-3 text-white light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-accent-indigo transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-green-500/10 border border-green-500/30 rounded-card text-center"
                >
                  <p className="text-green-400 text-sm font-mono">
                    Message sent successfully! I'll get back to you soon.
                  </p>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/30 rounded-card text-center"
                >
                  <p className="text-red-400 text-sm font-mono">
                    Failed to send. Please try again or email directly.
                  </p>
                </motion.div>
              )}
            </form>
          </GlassCard>
        </div>

        {/* Availability Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <GlassCard hover={false} glow className="inline-block">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <p className="text-white light:text-slate-900 font-display font-bold">
                Currently open to opportunities
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <Badge variant="default">Edge AI</Badge>
              <Badge variant="cyan">MLOps</Badge>
              <Badge variant="purple">Agentic Systems</Badge>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </PageTransition>
  );
}
