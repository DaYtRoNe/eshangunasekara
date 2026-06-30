import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Globe, Smartphone, Monitor, ArrowLeft, Search, Filter, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import CustomCursor from '../components/CustomCursor';
import SEO from '../components/SEO';

const categories = ['All', 'Web', 'Mobile', 'Desktop'];

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

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(p => p.isPublished !== false);
        
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

  // Filter & Sort Logic
  const filteredProjects = projects.filter(p => {
    const matchesFilter = activeFilter === 'All' || p.category === activeFilter;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.tech && p.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  return (
    <div className="min-h-screen bg-dark-900 text-white font-inter selection:bg-primary/30 selection:text-white relative overflow-hidden">
      <SEO 
        title="All Projects | Eshan Gunasekara"
        description="Browse through the complete portfolio of Eshan Gunasekara's software engineering projects. Web apps, Mobile apps, and Desktop applications."
        url="https://eshangunasekara.vercel.app/projects"
      />
      <CustomCursor />
      <AnimatedBackground />

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-12 py-12 relative z-10 max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group cursor-hover">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-6xl font-bold font-outfit mb-4">
              All <span className="text-primary">Projects</span>
            </h1>
            <p className="text-gray-400 max-w-2xl text-lg">
              Browse through my complete portfolio of {projects.length} projects, ranging from full-stack web applications to mobile apps and custom management systems.
            </p>
          </motion.div>
        </div>

        {/* Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-2xl p-4 flex flex-col lg:flex-row items-center gap-6 mb-12 border border-white/5"
        >
          {/* Search */}
          <div className="relative w-full lg:w-1/3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or tech..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-800 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary/50 text-white cursor-hover"
            />
          </div>

          {/* Categories */}
          <div className="flex-1 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors cursor-hover ${
                  activeFilter === cat ? 'bg-primary text-white shadow-[0_0_15px_rgba(170,59,255,0.4)]' : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="w-full lg:w-auto flex justify-end">
            <div className="relative group cursor-hover">
              <div className="flex items-center gap-2 bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-sm">
                <Filter className="w-4 h-4 text-gray-400" />
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-transparent text-white focus:outline-none cursor-hover appearance-none pr-6"
                >
                  <option value="newest" className="bg-dark-900 text-white">Date (Newest)</option>
                  <option value="oldest" className="bg-dark-900 text-white">Date (Oldest)</option>
                </select>
                <div className="absolute right-4 pointer-events-none text-gray-400 text-xs">▼</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 text-gray-400 glass rounded-3xl border border-white/5">
            No projects found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => {
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
                    className={`glass-card p-8 flex flex-col h-full relative cursor-hover transition-all duration-300 ${
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
                      <div className="flex gap-3">
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-primary/50 transition-colors cursor-hover hover:shadow-[0_0_10px_rgba(170,59,255,0.2)]">
                          <FaGithub className="w-5 h-5" />
                        </a>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-primary/50 transition-colors cursor-hover hover:shadow-[0_0_10px_rgba(170,59,255,0.2)]">
                          <ExternalLink className="w-5 h-5" />
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
          </div>
        )}

      </div>
    </div>
  );
};

export default AllProjects;
