import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Globe, Smartphone, Monitor, ArrowLeft, Search, Filter, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import CustomCursor from '../components/CustomCursor';

const categories = ['All', 'Web', 'Mobile', 'Desktop'];

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

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
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={project.id}
                  className="group relative glass rounded-3xl p-6 border border-white/10 cursor-hover overflow-hidden hover:border-primary/50 transition-colors"
                >
                  {/* Top Bar (Icon + Links) */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-dark-800/80 rounded-2xl text-primary border border-white/5 group-hover:scale-110 transition-transform">
                      {project.icon}
                    </div>
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="p-2 bg-dark-800/80 text-gray-400 hover:text-white rounded-full transition-colors border border-white/5 hover:border-white/20">
                          <FaGithub className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="p-2 bg-dark-800/80 text-gray-400 hover:text-primary rounded-full transition-colors border border-white/5 hover:border-primary/30">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3 font-outfit leading-tight group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tech?.slice(0, 4).map((tech, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-md bg-dark-800 border border-white/5 text-gray-300">
                        {tech}
                      </span>
                    ))}
                    {project.tech?.length > 4 && (
                      <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-dark-800 border border-white/5 text-gray-500">
                        +{project.tech.length - 4}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
};

export default AllProjects;
