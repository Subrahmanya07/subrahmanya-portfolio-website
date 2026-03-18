import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { personalInfo } from '../../data/resume';

const socialLinks = [
  { icon: FaGithub, href: personalInfo.github, label: 'GitHub' },
  { icon: FaLinkedin, href: personalInfo.linkedin, label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 light:border-gray-200/50 bg-dark/50 light:bg-light/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="font-display font-bold text-lg text-gradient">
              &lt;SSH /&gt;
            </Link>
            <span className="text-sm text-slate-500 light:text-slate-600 font-mono">
              // Neural Nexus v1.0
            </span>
          </div>

          <div className="flex items-center gap-4 md:justify-center md:flex-1">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-slate-400 light:text-slate-700 hover:text-accent-cyan transition-colors duration-300"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          <p className="text-sm text-slate-500 light:text-slate-600 font-mono">
            &copy; {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
