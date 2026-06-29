import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useInView } from 'framer-motion';
import { User, Terminal, Code, Coffee } from 'lucide-react';

const TypewriterText = ({ text, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!isInView) return;
    
    let i = 0;
    const timer = setTimeout(() => {
      const intervalId = setInterval(() => {
        setDisplayText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(intervalId);
      }, 15); // Fast typing speed
      return () => clearInterval(intervalId);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [isInView, text, delay]);

  return (
    <span ref={ref}>
      {displayText}
      {isInView && displayText.length < text.length && (
        <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
      )}
    </span>
  );
};

const About = () => {
  // 3D Card Physics
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x / rect.width - 0.5);
    mouseY.set(y / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-dark-800/30">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="flex flex-col items-center mb-16 text-center"
        >
          <div className="inline-flex items-center justify-center p-3 glass rounded-2xl mb-4 cursor-hover">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-4 text-white">About Me</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-transparent rounded-full mb-6" />
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Holographic ID Card (Left Side) */}
          <motion.div 
            className="lg:col-span-5 relative z-20"
            style={{ perspective: "1000px" }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative w-full max-w-[280px] md:max-w-sm mx-auto aspect-[3/4] rounded-3xl cursor-hover group"
            >
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-indigo-500/20 to-transparent rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
              
              {/* Glass Card Body */}
              <div className="absolute inset-0 bg-dark-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center p-6 md:p-8">
                {/* Hologram Grid Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                
                {/* Status Indicator */}
                <div className="w-full flex justify-between items-center mb-6 md:mb-8 relative z-10" style={{ transform: "translateZ(20px)" }}>
                  <div className="text-xs font-mono text-gray-400">ID: 8472-A9</div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-green-400">Online</span>
                  </div>
                </div>

                {/* Avatar Placeholder */}
                <div 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-primary/50 mb-6 relative z-10 overflow-hidden bg-dark-800 flex items-center justify-center shadow-[0_0_30px_rgba(170,59,255,0.3)] transition-transform duration-300 group-hover:scale-105"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <img src="https://placehold.co/400x400/1a1a1a/aa3bff?text=Avatar" alt="Eshan" className="w-full h-full object-cover pointer-events-none" />
                </div>

                <div className="text-center relative z-10" style={{ transform: "translateZ(30px)" }}>
                  <h3 className="text-xl md:text-2xl font-bold font-outfit text-white mb-2 tracking-wide">Eshan<span className="text-primary">.</span></h3>
                  <p className="text-primary font-medium text-xs md:text-sm tracking-widest uppercase mb-6">Full Stack Developer</p>
                </div>

                {/* Scan Bar Animation */}
                <motion.div 
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                  animate={{ top: ['-10%', '110%', '-10%'] }}
                  transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Floating Metric 1 */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-2 md:-left-8 glass px-3 md:px-4 py-2 rounded-xl flex items-center gap-2 md:gap-3 cursor-hover border border-white/10 shadow-lg shadow-black/50 z-30"
            >
              <div className="p-1.5 md:p-2 bg-primary/20 rounded-lg text-primary"><Code className="w-3 h-3 md:w-4 md:h-4" /></div>
              <span className="text-xs md:text-sm font-bold text-white">10K+ Lines</span>
            </motion.div>
          </motion.div>

          {/* Glass Terminal (Right Side) */}
          <motion.div 
            className="lg:col-span-7 relative z-10"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
          >
            <div className="glass-card rounded-2xl overflow-hidden shadow-2xl shadow-primary/5 border border-white/10 h-full min-h-[400px] flex flex-col">
              {/* Terminal Header */}
              <div className="bg-dark-950/80 px-4 py-3 flex items-center border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-hover hover:bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80 cursor-hover hover:bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80 cursor-hover hover:bg-green-500" />
                </div>
                <div className="mx-auto flex items-center gap-2 text-gray-500 text-xs font-mono">
                  <Terminal className="w-3 h-3" /> guest@eshan-portfolio:~
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-6 md:p-8 font-mono text-sm md:text-base leading-relaxed text-gray-300 flex-1">
                <div className="mb-4">
                  <span className="text-primary font-bold">guest@eshan-portfolio:~$</span> cat about_me.txt
                </div>
                
                <div className="text-gray-300 space-y-4">
                  <p>
                    <TypewriterText text="Hello, World! I am a Software Engineering undergraduate with an intense passion for building innovative, modern software solutions." delay={0.5} />
                  </p>
                  <p>
                    <TypewriterText text="I thrive on turning complex problems into elegant, user-friendly applications that make a difference. My journey in tech is driven by curiosity and a constant desire to learn the bleeding edge of the web and mobile ecosystems." delay={2.5} />
                  </p>
                  <p>
                    <TypewriterText text="Whether it's crafting a pixel-perfect, highly animated frontend or architecting a robust, scalable backend database, I am dedicated to writing clean, maintainable code." delay={6.0} />
                  </p>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 9.0 }}
                    className="pt-4 text-green-400 flex items-center gap-2"
                  >
                    <span className="text-primary font-bold">guest@eshan-portfolio:~$</span> <span className="w-2 h-4 bg-primary inline-block animate-pulse" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Floating Metric 2 */}
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-4 md:-right-8 glass px-4 py-2 rounded-xl flex items-center gap-3 cursor-hover border border-white/10 shadow-lg shadow-black/50 z-30"
            >
              <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400"><Coffee className="w-4 h-4" /></div>
              <span className="text-sm font-bold text-white">Infinite Coffee</span>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
