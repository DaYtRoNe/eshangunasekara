import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getFetchErrorMessage } from '../utils/fetchError';
import { categoryIcon } from '../utils/categoryIcon';
import ProjectCard from '../components/ProjectCard';
import SectionHeading from '../components/SectionHeading';

const categories = ['All', 'Web', 'Mobile', 'Desktop'];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');

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
          .filter(p => p.isPublished !== false)
          .map(p => {
            const category = p.category || 'Web';
            return { ...p, category, icon: categoryIcon(category) };
          });
        setProjects(data);
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
    <section id="projects" className="py-24 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading
          eyebrow="Projects"
          title="Things I've built"
          intro="A mix of university work, side projects, and things I built to learn a tool. Each card links to the code or the live site where there is one."
        />

        {/* Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-10" role="group" aria-label="Filter projects by type">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              aria-pressed={activeFilter === cat}
              className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                activeFilter === cat
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-white/10 border-t-primary rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="max-w-xl card p-8 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Couldn't load projects</h3>
            <p className="text-gray-400 text-sm mb-6">{error}</p>
            <button
              onClick={retry}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg surface text-sm text-white hover:border-white/25 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Try again
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.slice(0, 6).map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
                className="h-full"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        )}

        {projects.length > 6 && (
          <div className="mt-12">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors font-medium"
            >
              All {projects.length} projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
