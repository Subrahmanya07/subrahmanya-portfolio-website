import { useState, useEffect, createContext, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    localStorage.setItem('theme', theme);

    let isLight;
    if (theme === 'system') {
      isLight = !window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isLight = theme === 'light';
    }

    root.classList.toggle('light', isLight);
    root.classList.toggle('dark', !isLight);
    body.classList.toggle('light', isLight);
    body.classList.toggle('dark', !isLight);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      document.documentElement.classList.toggle('light', !e.matches);
      document.documentElement.classList.toggle('dark', e.matches);
      document.body.classList.toggle('light', !e.matches);
      document.body.classList.toggle('dark', e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
