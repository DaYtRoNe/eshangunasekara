import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Monitor, Smartphone, Globe, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getFetchErrorMessage } from '../utils/fetchError';
import ProjectCard from '../components/ProjectCard';

const categories = ['All', 'Web', 'Mobile', 'Desktop'];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const retry = () => setReloadKey(k => k + 1);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
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
      } catch (err) {
        console.error("Error fetching projects", err);
        setError(getFetchErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [reloadKey]);

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
          <div className="inline-flex items-center justify-center p-3 glass rounded-2xl mb-4 border border-white/10 shadow-[0_0_15px_rgba(170,59,255,0.2)]">
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
                  className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors ${
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

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="max-w-xl mx-auto glass rounded-3xl border border-red-500/20 p-8 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Couldn't load projects</h3>
            <p className="text-gray-400 text-sm mb-6">{error}</p>
            <button
              onClick={retry}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass border border-white/10 text-sm text-white hover:border-primary/50 hover:bg-primary/10 transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Try again
            </button>
          </div>
        ) : (
        <motion.div 
          layout
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.slice(0, 6).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isHovered={hoveredIndex === project.id}
                isAnotherHovered={hoveredIndex !== null && hoveredIndex !== project.id}
                onHoverStart={() => setHoveredIndex(project.id)}
                onHoverEnd={() => setHoveredIndex(null)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
        )}

        {projects.length > 6 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mt-16"
          >
            <Link 
              to="/projects"
              className="group flex items-center gap-3 px-8 py-4 glass rounded-full font-bold text-white border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all"
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
