import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, ExternalLink, Monitor, Smartphone, Globe, ArrowRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';

const categories = ['All', 'Web', 'Mobile', 'Desktop'];

// Define colors for tech badges to make them "Neon Cyber-Badges"
const techColors = {
  'React.js': 'border-blue-500/50 text-blue-400',
  'React': 'border-blue-500/50 text-blue-400',
  'React Native': 'border-blue-400/50 text-blue-300',
  'Node.js': 'border-green-500/50 text-green-400',
  'Firebase': 'border-yellow-500/50 text-yellow-400',
  'Tailwind CSS': 'border-cyan-500/50 text-cyan-400',
  'Java': 'border-orange-500/50 text-orange-400',
  'PHP': 'border-indigo-400/50 text-indigo-300',
  'MySQL': 'border-blue-300/50 text-blue-200',
  'TypeScript': 'border-blue-600/50 text-blue-500',
  'Android Studio': 'border-green-400/50 text-green-300',
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(p => p.isPublished !== false);
        
        // Add dynamic icon based on category for the UI
        const mappedData = data.map(p => {
          const category = p.category || 'Web';
          let icon = <Globe className="w-5 h-5" />;
          if (category === 'Mobile') icon = <Smartphone className="w-5 h-5" />;
          if (category === 'Desktop') icon = <Monitor className="w-5 h-5" />;
          return { ...p, category, icon };
        });

        setProjects(mappedData);
      } catch (error) {
        console.error("Error fetching projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(p => activeFilter === 'All' || p.category === activeFilter);

  return (
    <section id="projects" className="py-24 relative bg-dark-900/40 min-h-screen">
      {/* Background Neon Elements */}
      <div className="absolute top-[20%] left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="flex flex-col items-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 glass rounded-2xl mb-4 cursor-hover border border-white/10 shadow-[0_0_15px_rgba(170,59,255,0.2)]">
            <Code2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-4 text-white tracking-wide">Featured <span className="text-primary">Projects</span></h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-transparent rounded-full mb-10" />
          
          {/* Filter Bar with Count */}
          <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap justify-center gap-2 p-1.5 glass rounded-full border border-white/10 shadow-lg">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors cursor-hover ${
                    activeFilter === cat ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {activeFilter === cat && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-primary/20 border border-primary/50 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>
            
            <div className="text-gray-400 text-sm font-mono tracking-wider">
              {projects.length} projects
            </div>
          </div>
        </motion.div>

        <motion.div 
          layout
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.slice(0, 6).map((project, idx) => {
              // We check hover by title to maintain stable state across filtering
              const isHovered = hoveredIndex === project.title;
              const isAnotherHovered = hoveredIndex !== null && hoveredIndex !== project.title;

              return (
                <motion.div
                  layout
                  key={project.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: isAnotherHovered ? 0.3 : 1, 
                    scale: isAnotherHovered ? 0.96 : 1,
                    filter: isAnotherHovered ? "blur(3px)" : "blur(0px)",
                  }}
                  exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                  transition={{ duration: 0.4 }}
                  onMouseEnter={() => setHoveredIndex(project.title)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`glass-card p-8 flex flex-col h-full relative transition-all duration-300 ${
                    isHovered ? 'shadow-[0_0_30px_rgba(170,59,255,0.15)] border-primary/40 -translate-y-2' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Subtle Grid Background for Tech feel */}
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-2xl" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
                  
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={`p-3 bg-dark-800 border rounded-xl shadow-lg transition-colors duration-300 ${isHovered ? 'border-primary/50 text-primary shadow-[0_0_15px_rgba(170,59,255,0.3)]' : 'border-white/10 text-gray-400'}`}>
                      {project.icon}
                    </div>
                    <div className="flex gap-3 relative z-50">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-primary/50 transition-colors cursor-hover hover:shadow-[0_0_10px_rgba(170,59,255,0.2)] flex items-center justify-center relative z-50">
                        <FaGithub className="w-5 h-5 pointer-events-none" />
                      </a>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-primary/50 transition-colors cursor-hover hover:shadow-[0_0_10px_rgba(170,59,255,0.2)] flex items-center justify-center relative z-50">
                        <ExternalLink className="w-5 h-5 pointer-events-none" />
                      </a>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="relative z-10 flex-1">
                    <h3 className={`text-2xl font-bold mb-3 transition-colors ${isHovered ? 'text-primary' : 'text-white'}`}>
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Stack Cyber-Badges */}
                  <div className="relative z-10 mt-auto pt-6 border-t border-white/5">
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, tIdx) => {
                        const colorClass = techColors[tech] || 'border-primary/30 text-primary/80';
                        return (
                          <span 
                            key={tIdx} 
                            className={`text-[11px] font-mono tracking-wider px-2.5 py-1 bg-dark-950/80 rounded-md border ${colorClass} shadow-sm backdrop-blur-md`}
                          >
                            {tech}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {projects.length > 6 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mt-16"
          >
            <Link 
              to="/projects"
              className="group flex items-center gap-3 px-8 py-4 glass rounded-full font-bold text-white border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all cursor-hover"
            >
              View All Projects
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;
