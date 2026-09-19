import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Download, Loader2 } from 'lucide-react';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-scroll';
import toast from 'react-hot-toast';
import { generateCV } from '../utils/generateCV';

const Hero = ({ globalSettings }) => {
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);
  
  // Use globalSettings directly or fallback to empty strings to avoid FOUC
  const settings = globalSettings || {
    aboutMe: "Software engineering student. I build web and Android apps.",
    linkedinUrl: "",
    whatsappUrl: "",
    githubUrl: ""
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-950 pt-20">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        {/* Tech Grid */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full blur-[150px] mix-blend-screen" 
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-white/10 bg-dark-900/60 backdrop-blur-md shadow-lg mb-10 hover:border-white/20 transition-colors"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-dark-900"></span>
          </span>
          <span className="text-sm font-semibold text-gray-300 tracking-wide uppercase">Open to internships &amp; freelance work</span>
        </motion.div>

        {/* Central Typography */}
        <div className="relative w-full max-w-5xl mx-auto flex justify-center py-12">
          {/* Main Name */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="relative z-10"
          >
            <h2 className="text-xl md:text-3xl font-medium text-gray-400 tracking-[0.3em] uppercase mb-6 drop-shadow-md">
              Hello, I'm
            </h2>
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] font-black font-outfit leading-[0.9] tracking-tighter mb-8 text-white drop-shadow-2xl">
              ESHAN <br/>
              <span className="animated-gradient-text break-words">
                GUNASEKARA
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed px-4">
              {settings.aboutMe}
            </p>
          </motion.div>
        </div>

        {/* Action Core */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="projects"
              smooth={true}
              duration={500}
              className="group relative px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg transition-all flex items-center gap-3 cursor-pointer overflow-hidden shadow-[0_0_20px_rgba(170,59,255,0.4)] hover:shadow-[0_0_35px_rgba(170,59,255,0.6)] hover:-translate-y-1"
            >
              <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] group-hover:animate-shimmer" />
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="relative z-10">View Projects</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform relative z-10" />
            </Link>

            <button
              disabled={isGeneratingCV}
              onClick={async (e) => {
                e.preventDefault();
                setIsGeneratingCV(true);
                const toastId = toast.loading('Generating your CV on the fly...');
                try {
                  const blob = await generateCV();
                  const blobUrl = window.URL.createObjectURL(blob);
                  
                  const link = document.createElement('a');
                  link.href = blobUrl;
                  link.download = 'Eshan_Gunasekara_CV.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(blobUrl);
                  toast.success('CV Generated successfully!', { id: toastId });
                } catch (error) {
                  console.error("Failed to generate CV", error);
                  toast.error('Failed to generate CV', { id: toastId });
                } finally {
                  setIsGeneratingCV(false);
                }
              }}
              className="group relative px-8 py-4 glass text-white rounded-2xl font-bold text-lg border border-white/10 hover:border-primary/50 transition-all flex items-center gap-3 shadow-lg hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(170,59,255,0.2)] disabled:opacity-50 disabled:cursor-wait"
            >
              {isGeneratingCV ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <Download className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:-translate-y-1 transition-all" />
              )}
              <span className="text-gray-200 group-hover:text-white transition-colors">
                {isGeneratingCV ? 'Generating...' : 'Download CV'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-5">
            {settings.linkedinUrl && (
              <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="p-5 glass rounded-2xl border border-white/10 hover:border-primary/50 text-gray-400 hover:text-white transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(170,59,255,0.3)] group">
                <FaLinkedin className="w-7 h-7 group-hover:scale-110 transition-transform" />
              </a>
            )}
            {settings.whatsappUrl && (
              <a href={settings.whatsappUrl} target="_blank" rel="noreferrer" className="p-5 glass rounded-2xl border border-white/10 hover:border-primary/50 text-gray-400 hover:text-white transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(170,59,255,0.3)] group">
                <FaWhatsapp className="w-7 h-7 group-hover:scale-110 transition-transform" />
              </a>
            )}
            {settings.githubUrl && (
              <a href={settings.githubUrl} target="_blank" rel="noreferrer" className="p-5 glass rounded-2xl border border-white/10 hover:border-primary/50 text-gray-400 hover:text-white transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(170,59,255,0.3)] group">
                <FaGithub className="w-7 h-7 group-hover:scale-110 transition-transform" />
              </a>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
