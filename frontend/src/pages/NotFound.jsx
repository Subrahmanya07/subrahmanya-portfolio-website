import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';

export default function NotFound() {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-display text-8xl font-bold text-gradient mb-4"
          >
            404
          </motion.div>
          <div className="terminal max-w-md mx-auto mb-8">
            <p className="terminal-line">$ cd /requested-page</p>
            <p className="text-red-400">Error: Page not found in Neural Nexus.</p>
            <p className="terminal-output mt-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <Link to="/" className="btn-primary">
            Return to Home →
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
