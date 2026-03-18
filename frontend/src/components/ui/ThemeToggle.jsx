import { useTheme } from '../../hooks/useTheme';
import { HiSun, HiMoon, HiComputerDesktop } from 'react-icons/hi2';

const modes = [
  { key: 'light', icon: HiSun, label: 'Light' },
  { key: 'dark', icon: HiMoon, label: 'Dark' },
  { key: 'system', icon: HiComputerDesktop, label: 'System' },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 glass-card p-1">
      {modes.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          aria-label={`Switch to ${label} mode`}
          className={`p-2 rounded-lg transition-all duration-300 ${
            theme === key
              ? 'bg-accent-indigo text-white shadow-lg shadow-indigo-500/25'
              : 'text-slate-400 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:bg-white/10'
          }`}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
