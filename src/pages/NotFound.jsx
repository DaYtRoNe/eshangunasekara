import React from 'react';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <SEO title="Page Not Found" description="404 Error - Page not found." noindex={true} />
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        <h1 className="text-[12rem] font-black font-outfit leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 select-none">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-6 tracking-wide">
          Page Not Found
        </h2>
        <p className="text-gray-400 max-w-md mx-auto mb-10 text-lg">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <button 
          onClick={() => navigate('/')}
          className="group relative px-8 py-4 glass text-white rounded-2xl font-bold text-lg border border-white/10 hover:border-primary/50 transition-all flex items-center justify-center gap-3 shadow-lg mx-auto cursor-hover hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(170,59,255,0.2)]"
        >
          <Home className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
          <span className="text-gray-200 group-hover:text-white transition-colors">Return Home</span>
        </button>
      </motion.div>
    </div>
  );
};

export default NotFound;
