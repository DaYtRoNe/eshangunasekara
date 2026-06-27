import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Code2, Cpu, MapPin, Sparkles } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-scroll';

const FloatingNode = ({ icon, text, delay, className, mouseX, mouseY, depth }) => {
  // Parallax effect based on mouse movement
  const x = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [depth * 25, -depth * 25]);
  const y = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [depth * 25, -depth * 25]);

  return (
    <motion.div
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, delay, type: "spring", bounce: 0.4 }}
      className={`absolute hidden lg:flex items-center gap-4 px-6 py-3.5 glass rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md cursor-hover hover:border-primary/50 transition-colors z-20 ${className}`}
    >
      <motion.div 
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
        className="p-2.5 bg-dark-800/80 rounded-xl text-primary shadow-[0_0_15px_rgba(170,59,255,0.3)] border border-white/5"
      >
        {icon}
      </motion.div>
      <span className="font-semibold text-gray-200 tracking-wide text-sm whitespace-nowrap">{text}</span>
    </motion.div>
  );
};

const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse values for buttery parallax
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

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
          className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-white/10 bg-dark-900/60 backdrop-blur-md shadow-lg mb-10 cursor-hover hover:border-white/20 transition-colors"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-dark-900"></span>
          </span>
          <span className="text-sm font-semibold text-gray-300 tracking-wide uppercase">Available for New Projects</span>
        </motion.div>

        {/* Central Typography and Nodes */}
        <div className="relative w-full max-w-5xl mx-auto flex justify-center py-12">
          
          {/* Floating Nodes (Desktop Parallax) */}
          <FloatingNode 
            icon={<Code2 className="w-5 h-5" />} 
            text="Full Stack Engineer" 
            delay={0.2}
            mouseX={smoothMouseX} mouseY={smoothMouseY} depth={1.2}
            className="-top-8 -left-10 xl:-left-24"
          />
          <FloatingNode 
            icon={<Cpu className="w-5 h-5" />} 
            text="AI & Emerging Tech" 
            delay={0.4}
            mouseX={smoothMouseX} mouseY={smoothMouseY} depth={-0.8}
            className="-bottom-12 -right-4 xl:-right-16"
          />
          <FloatingNode 
            icon={<MapPin className="w-5 h-5" />} 
            text="Based in Sri Lanka" 
            delay={0.6}
            mouseX={smoothMouseX} mouseY={smoothMouseY} depth={0.6}
            className="top-12 -right-12 xl:-right-32"
          />

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
              I build scalable applications with clean architecture and highly modern user experiences.
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
          <Link
            to="projects"
            smooth={true}
            duration={500}
            className="group relative px-10 py-5 bg-primary text-white rounded-2xl font-bold text-lg md:text-xl transition-all flex items-center gap-4 cursor-pointer overflow-hidden shadow-[0_0_20px_rgba(170,59,255,0.4)] hover:shadow-[0_0_35px_rgba(170,59,255,0.6)] cursor-hover hover:-translate-y-1"
          >
            <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] group-hover:animate-shimmer" />
            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span className="relative z-10">Explore Universe</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform relative z-10" />
          </Link>

          <div className="flex items-center gap-5">
            <a href="https://linkedin.com/in/eshangunasekara" target="_blank" rel="noreferrer" className="p-5 glass rounded-2xl border border-white/10 hover:border-primary/50 text-gray-400 hover:text-white transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(170,59,255,0.3)] cursor-hover group">
              <FaLinkedin className="w-7 h-7 group-hover:scale-110 transition-transform" />
            </a>
            <a href="https://github.com/DaYtRoNe" target="_blank" rel="noreferrer" className="p-5 glass rounded-2xl border border-white/10 hover:border-primary/50 text-gray-400 hover:text-white transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(170,59,255,0.3)] cursor-hover group">
              <FaGithub className="w-7 h-7 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </motion.div>

        {/* Mobile only Nodes Stack */}
        <div className="lg:hidden flex flex-col gap-4 mt-20 w-full max-w-sm px-4">
          {[
            { icon: <Code2 className="w-5 h-5"/>, text: "Full Stack Engineer" },
            { icon: <Cpu className="w-5 h-5"/>, text: "AI & Emerging Tech" },
            { icon: <MapPin className="w-5 h-5"/>, text: "Based in Sri Lanka" }
          ].map((node, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 + (i * 0.1), type: "spring" }}
               className="flex items-center gap-5 px-6 py-4 glass rounded-2xl border border-white/5 shadow-lg"
             >
               <div className="text-primary p-3 bg-dark-800 rounded-xl shadow-inner border border-white/5">{node.icon}</div>
               <span className="text-base text-gray-300 font-semibold tracking-wide">{node.text}</span>
             </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Hero;
