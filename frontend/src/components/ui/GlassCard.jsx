import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, glow = false, ...props }) {
  return (
    <motion.div
      className={`glass-card p-6 ${glow ? 'glow-border' : ''} ${
        hover ? 'hover:bg-white/10 light:hover:bg-white/80 transition-all duration-300' : ''
      } ${className}`}
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
