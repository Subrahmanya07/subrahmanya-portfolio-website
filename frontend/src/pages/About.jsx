import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiArrowDownTray } from 'react-icons/hi2';
import { FaXTwitter } from 'react-icons/fa6';
import PageTransition from '../components/layout/PageTransition';
import SectionHeading from '../components/ui/SectionHeading';
import TerminalText from '../components/ui/TerminalText';
import PromptHacker from '../components/ai/PromptHacker';
import { personalInfo } from '../data/resume';

const terminalLines = [
  { text: 'whoami', prefix: '$', type: 'prompt', delay: 300 },
  { text: 'Subrahmanya Shivaram Hegde', type: 'output', delay: 200 },
  { text: 'role --current', prefix: '$', type: 'prompt', delay: 300 },
  { text: 'Junior Edge AI Engineer @ Kruthak', type: 'output', delay: 200 },
  { text: 'location', prefix: '$', type: 'prompt', delay: 300 },
  { text: 'Bengaluru, Karnataka, India', type: 'output', delay: 200 },
  { text: 'cat passion.txt', prefix: '$', type: 'prompt', delay: 300 },
  { text: 'Building intelligent systems at the edge — from Agentic RAG to Computer Vision.', type: 'output', delay: 200 },
  { text: 'echo $STATUS', prefix: '$', type: 'prompt', delay: 300 },
  { text: '🟢 Open to opportunities in Edge AI, MLOps & Agentic Systems', type: 'success', delay: 100 },
];

const socialLinks = [
  { icon: FaGithub, href: personalInfo.github, label: 'GitHub' },
  { icon: FaLinkedin, href: personalInfo.linkedin, label: 'LinkedIn' },
  { icon: FaXTwitter, href: 'https://x.com/Subrahmanya07', label: 'X / Twitter' },
];

export default function About() {
  return (
    <PageTransition>
      <div className="section-container pt-28">
        <SectionHeading
          title="About Me"
          subtitle="Edge AI engineer passionate about building intelligent systems."
        />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — Terminal + Photo */}
          <div className="space-y-8">
            <TerminalText lines={terminalLines} speed={30} />

            {/* Profile photo placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative w-48 h-48 mx-auto"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-accent-indigo via-accent-cyan to-accent-purple p-1 animate-glow-pulse">
                <div className="w-full h-full rounded-full bg-dark light:bg-light overflow-hidden flex items-center justify-center">
                  <img
                    src="/profile.jpg"
                    alt="Subrahmanya Shivaram Hegde"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML =
                        '<span class="font-display text-4xl font-bold text-gradient">SSH</span>';
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — Narrative */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-4 text-slate-300 light:text-slate-700 leading-relaxed text-justify">
              <p>
                I'm <strong className="text-white light:text-slate-900">Subrahmanya Shivaram Hegde</strong>,
                a Junior Edge AI Engineer at <strong className="text-accent-indigo">Kruthak</strong> in
                Bengaluru. I specialize in building Agentic RAG systems, optimizing on-device LLMs,
                and architecting microservices on Google Cloud Platform.
              </p>
              <p>
                My journey started at Vivekananda College of Engineering & Technology, where I
                pursued AI & Machine Learning (CGPA: 8.83/10). From building an AI-powered
                plantation management system (KALPA) that earned ₹1,00,000 in seed funding to
                engineering dynamic RAG workflows — I'm driven by the vision of making AI
                accessible, efficient, and impactful.
              </p>
              <p>
                At Kruthak, I've refactored monolithic backends into scalable microservices,
                engineered hybrid search systems with Vector DBs, and am currently optimizing
                local LLMs (Gemma) for offline-first educational tools. Previously, I worked
                with IBM Watson at Rooman Technologies and contributed to research at IEEE
                and CoRE Club.
              </p>
              <p>
                When I'm not coding, you'll find me exploring new AI research papers,
                contributing to open-source, or organizing technical events. I believe in
                building technology that empowers and uplifts communities.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-slate-400 light:text-slate-700 hover:text-accent-cyan hover:glow-border transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Resume Download */}
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 btn-primary mt-2"
            >
              <HiArrowDownTray className="w-5 h-5" />
              Download Resume
            </a>
          </motion.div>
        </div>

        {/* Prompt Hacker Mini-Game */}
        <div className="mt-20">
          <PromptHacker />
        </div>
      </div>
    </PageTransition>
  );
}
