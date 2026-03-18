import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TerminalText({ lines, speed = 50, onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (currentLine >= lines.length) {
      onComplete?.();
      return;
    }

    const line = lines[currentLine];

    if (currentChar < line.text.length) {
      const timer = setTimeout(() => setCurrentChar((c) => c + 1), speed);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setVisibleLines((prev) => [...prev, line]);
      setCurrentLine((l) => l + 1);
      setCurrentChar(0);
    }, line.delay || 200);

    return () => clearTimeout(timer);
  }, [currentLine, currentChar, lines, speed, onComplete]);

  const activeLine = currentLine < lines.length ? lines[currentLine] : null;

  return (
    <div className="terminal">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-slate-500 light:text-slate-600">neural-nexus</span>
      </div>
      {visibleLines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mb-1 ${line.type === 'prompt' ? 'terminal-prompt' : line.type === 'success' ? 'text-green-400' : 'terminal-output'}`}
        >
          {line.prefix && <span className="terminal-line">{line.prefix} </span>}
          {line.text}
        </motion.div>
      ))}
      {activeLine && (
        <div className={`mb-1 ${activeLine.type === 'prompt' ? 'terminal-prompt' : 'terminal-output'}`}>
          {activeLine.prefix && <span className="terminal-line">{activeLine.prefix} </span>}
          {activeLine.text.substring(0, currentChar)}
          <span className="animate-pulse">▊</span>
        </div>
      )}
    </div>
  );
}
