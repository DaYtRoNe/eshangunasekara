import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Code2, Database, Smartphone, Globe } from 'lucide-react';

const coreSkills = ['React.js', 'Node.js', 'TypeScript', 'Java', 'Next.js', 'Express'];
const marqueeSkills = ['HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'JavaScript', 'PHP', 'Git', 'GitHub', 'Firebase', 'Vercel', 'Netlify', 'VS Code', 'IntelliJ IDEA'];

const Skills = () => {
  return (
    <section id="skills" className="py-24 relative bg-dark-900/50 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="flex flex-col items-center mb-16 text-center"
        >
          <div className="inline-flex items-center justify-center p-3 glass rounded-2xl mb-4 cursor-hover">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-4 text-white">Technical Arsenal</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-transparent rounded-full mb-6" />
          <p className="text-gray-400 max-w-2xl text-lg">
            A comprehensive suite of modern technologies and tools I use to build scalable, high-performance applications.
          </p>
        </motion.div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* 1. Core Orbit (Spans 2 cols, 2 rows on large screens) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
            className="lg:col-span-2 lg:row-span-2 glass-card p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[450px] group cursor-hover hover:border-primary/40 transition-colors shadow-xl shadow-black/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <h3 className="text-2xl font-bold text-white mb-8 absolute top-8 left-8 flex items-center gap-2">
              <Code2 className="text-primary w-6 h-6" /> Core Stack
            </h3>

            {/* Orbit Animation Container */}
            <div className="relative w-72 h-72 mt-12 flex items-center justify-center">
              {/* Center Core */}
              <motion.div 
                animate={{ boxShadow: ['0 0 20px rgba(170,59,255,0.2)', '0 0 60px rgba(170,59,255,0.6)', '0 0 20px rgba(170,59,255,0.2)'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 bg-dark-800 rounded-full border border-primary/50 flex items-center justify-center z-10 shadow-lg"
              >
                <Globe className="w-10 h-10 text-primary" />
              </motion.div>

              {/* Orbit Rings */}
              <div className="absolute inset-0 border border-white/5 rounded-full pointer-events-none" />
              <div className="absolute inset-[-40px] border border-white/5 rounded-full pointer-events-none" />
              <div className="absolute inset-[-80px] border border-white/5 rounded-full dashed-spin pointer-events-none" style={{ borderStyle: 'dashed' }} />

              {/* Orbiting Elements */}
              {coreSkills.map((skill, index) => {
                const angle = (index / coreSkills.length) * 360;
                const radius = index % 2 === 0 ? 110 : 160;
                const duration = index % 2 === 0 ? 15 : 22;
                const direction = index % 2 === 0 ? 1 : -1;

                return (
                  <motion.div
                    key={skill}
                    className="absolute top-1/2 left-1/2 w-0 h-0 flex items-center justify-center pointer-events-none"
                    animate={{ rotate: [angle, angle + 360 * direction] }}
                    transition={{ duration, repeat: Infinity, ease: "linear" }}
                  >
                    <div style={{ transform: `translateX(${radius}px)` }}>
                      <motion.div
                        className="w-max px-4 py-2 bg-dark-900/80 backdrop-blur-md border border-white/10 rounded-full text-sm font-medium text-gray-200 shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-hover pointer-events-auto hover:bg-primary/20 hover:text-white hover:border-primary/50 transition-colors"
                        animate={{ rotate: [-angle, -(angle + 360 * direction)] }}
                        transition={{ duration, repeat: Infinity, ease: "linear" }}
                      >
                        {skill}
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* 2. Database Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3, delay: 0.1 }}
            className="glass-card p-6 flex flex-col group cursor-hover hover:border-blue-500/40 transition-colors relative overflow-hidden h-[215px]"
          >
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700 pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Database</h3>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto relative z-10">
              {['MySQL', 'MongoDB', 'Firebase Firestore'].map((s) => (
                <span key={s} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-blue-500/20 hover:border-blue-500/50 transition-colors shadow-sm">{s}</span>
              ))}
            </div>
          </motion.div>

          {/* 3. Mobile Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3, delay: 0.2 }}
            className="glass-card p-6 flex flex-col group cursor-hover hover:border-purple-500/40 transition-colors relative overflow-hidden h-[215px]"
          >
            <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700 pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Mobile</h3>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto relative z-10">
              {['Android Java', 'Kotlin', 'React Native'].map((s) => (
                <span key={s} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-purple-500/20 hover:border-purple-500/50 transition-colors shadow-sm">{s}</span>
              ))}
            </div>
          </motion.div>

          {/* 4. Infinite 3D Marquee (Spans all cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3, delay: 0.3 }}
            className="col-span-1 md:col-span-2 lg:col-span-3 glass-card py-8 overflow-hidden relative cursor-hover bg-dark-900/40"
            style={{ perspective: '1000px' }}
          >
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-dark-900 via-dark-900/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-dark-900 via-dark-900/80 to-transparent z-10 pointer-events-none" />
            
            <div className="flex items-center gap-4 whitespace-nowrap" style={{ transform: 'rotateX(15deg)' }}>
              <motion.div 
                className="flex items-center gap-4 px-4 w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                {/* Double the array for seamless loop */}
                {[...marqueeSkills, ...marqueeSkills].map((skill, idx) => (
                  <div 
                    key={idx} 
                    className="px-6 py-3 bg-dark-800 border border-white/10 rounded-xl text-gray-300 font-medium hover:text-white hover:border-primary/50 transition-colors cursor-hover shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:-translate-y-1 transform duration-300"
                  >
                    {skill}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
      
      <style>{`
        .dashed-spin {
          animation: spin 30s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default Skills;
