import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layout, Server, Database, Wrench } from 'lucide-react';
import { 
  SiReact, SiNextdotjs, SiTailwindcss, SiJavascript, SiTypescript, SiHtml5, SiCss, SiFramer,
  SiNodedotjs, SiExpress, SiPython, SiPhp,
  SiMysql, SiMongodb, SiFirebase, SiPostgresql,
  SiGit, SiDocker, SiPostman, SiFigma, SiAndroidstudio, SiVite
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';

const bentoData = [
  {
    id: 'frontend',
    title: 'Frontend Ecosystem',
    icon: <Layout className="w-5 h-5 text-gray-400" />,
    spanClass: 'md:col-span-2 md:row-span-2 min-h-[350px]',
    skills: [
      { name: 'React.js', icon: <SiReact className="text-[#61DAFB]" /> },
      { name: 'Next.js', icon: <SiNextdotjs className="text-white" /> },
      { name: 'Tailwind CSS', icon: <SiTailwindcss className="text-[#06B6D4]" /> },
      { name: 'JavaScript', icon: <SiJavascript className="text-[#F7DF1E]" /> },
      { name: 'TypeScript', icon: <SiTypescript className="text-[#3178C6]" /> },
      { name: 'Framer Motion', icon: <SiFramer className="text-white" /> },
      { name: 'HTML5', icon: <SiHtml5 className="text-[#E34F26]" /> },
      { name: 'CSS3', icon: <SiCss className="text-[#1572B6]" /> },
    ]
  },
  {
    id: 'backend',
    title: 'Backend & APIs',
    icon: <Server className="w-5 h-5 text-gray-400" />,
    spanClass: 'md:col-span-1 md:row-span-2 min-h-[350px]',
    skills: [
      { name: 'Node.js', icon: <SiNodedotjs className="text-[#339933]" /> },
      { name: 'Express.js', icon: <SiExpress className="text-white" /> },
      { name: 'Java', icon: <FaJava className="text-[#007396]" /> },
      { name: 'Python', icon: <SiPython className="text-[#3776AB]" /> },
      { name: 'PHP', icon: <SiPhp className="text-[#777BB4]" /> },
    ]
  },
  {
    id: 'database',
    title: 'Databases',
    icon: <Database className="w-5 h-5 text-gray-400" />,
    spanClass: 'md:col-span-1 md:row-span-1 min-h-[180px]',
    skills: [
      { name: 'MySQL', icon: <SiMysql className="text-[#4479A1]" /> },
      { name: 'MongoDB', icon: <SiMongodb className="text-[#47A248]" /> },
      { name: 'Firebase', icon: <SiFirebase className="text-[#FFCA28]" /> },
      { name: 'PostgreSQL', icon: <SiPostgresql className="text-[#4169E1]" /> },
    ]
  },
  {
    id: 'tools',
    title: 'Tools & DevOps',
    icon: <Wrench className="w-5 h-5 text-gray-400" />,
    spanClass: 'md:col-span-2 md:row-span-1 min-h-[180px]',
    skills: [
      { name: 'Git', icon: <SiGit className="text-[#F05032]" /> },
      { name: 'Docker', icon: <SiDocker className="text-[#2496ED]" /> },
      { name: 'Postman', icon: <SiPostman className="text-[#FF6C37]" /> },
      { name: 'Figma', icon: <SiFigma className="text-[#F24E1E]" /> },
      { name: 'Android Studio', icon: <SiAndroidstudio className="text-[#3DDC84]" /> },
      { name: 'Vite', icon: <SiVite className="text-[#646CFF]" /> },
    ]
  }
];

// Spotlight Card wrapper for the mouse target effect
const SpotlightCard = ({ children, className, delay }) => {
  const divRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    divRef.current.style.setProperty('--mouse-x', `${x}px`);
    divRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: delay, type: "spring", bounce: 0.3 }}
      className={`relative group bg-[#121212] rounded-2xl p-8 flex flex-col border border-white/5 transition-all duration-300 hover:border-white/15 overflow-hidden shadow-xl ${className}`}
    >
      {/* The Spotlight Gradient */}
      <div 
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(170, 59, 255, 0.08), transparent 40%)`
        }}
      />
      {/* Content wrapper to keep it above the spotlight */}
      <div className="relative z-10 flex flex-col h-full">
        {children}
      </div>
    </motion.div>
  );
};

const SkillsProfessional = () => {
  const allSkills = bentoData.flatMap(c => c.skills);

  return (
    <section id="skills" className="py-24 relative bg-[#0a0a0a] overflow-hidden font-inter">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Clean, minimalist header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-16 text-center"
        >
          <div className="inline-flex items-center justify-center p-2 bg-dark-800 rounded-lg mb-4 border border-white/5 cursor-hover">
            <Sparkles className="w-5 h-5 text-gray-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-4 text-white tracking-tight">Technical Skills</h2>
          <p className="text-gray-400 max-w-2xl text-lg font-light">
            A comprehensive suite of modern technologies and tools I use to build scalable, high-performance applications.
          </p>
        </motion.div>

        {/* Professional Bento Grid with Spotlight Effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20 cursor-hover">
          {bentoData.map((category, idx) => (
            <SpotlightCard key={category.id} className={category.spanClass} delay={idx * 0.15}>
              <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                {category.icon}
                <h3 className="text-xl font-semibold font-outfit text-gray-200 tracking-wide">
                  {category.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-3 mt-auto">
                {category.skills.map((skill) => (
                  <div 
                    key={skill.name} 
                    className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a]/80 backdrop-blur-sm border border-white/5 rounded-lg text-sm font-medium text-gray-300 transition-all duration-300 hover:text-white hover:bg-[#222] hover:scale-[1.03] hover:shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:border-white/10 cursor-pointer group/skill"
                  >
                    <span className="text-lg opacity-80 group-hover/skill:opacity-100 group-hover/skill:scale-110 transition-all">
                      {skill.icon}
                    </span>
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          ))}
        </div>

        {/* Clean Marquee */}
        <div className="max-w-6xl mx-auto border-t border-white/5 pt-12 cursor-hover">
          <div className="overflow-hidden relative bg-[#0f0f0f] rounded-2xl border border-white/5 py-6">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0f0f0f] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0f0f0f] to-transparent z-10 pointer-events-none" />
            
            <div className="flex items-center whitespace-nowrap">
              <motion.div 
                className="flex items-center gap-8 px-4 w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              >
                {[...allSkills, ...allSkills].map((skill, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group/marq"
                  >
                    <span className="text-xl opacity-60 grayscale group-hover/marq:grayscale-0 group-hover/marq:opacity-100 transition-all duration-300">{skill.icon}</span>
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-gray-800 ml-4">•</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SkillsProfessional;
