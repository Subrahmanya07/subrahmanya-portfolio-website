export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-accent-indigo/20 text-accent-indigo border-accent-indigo/30',
    cyan: 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30',
    purple: 'bg-accent-purple/20 text-accent-purple border-accent-purple/30',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-mono font-medium border rounded-pill ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
