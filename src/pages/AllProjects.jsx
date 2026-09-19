import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ArrowLeft, Search, AlertTriangle, RefreshCw } from 'lucide-react';
import { getFetchErrorMessage } from '../utils/fetchError';
import { categoryIcon } from '../utils/categoryIcon';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ProjectCard from '../components/ProjectCard';

const categories = ['All', 'Web', 'Mobile', 'Desktop'];

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const retry = () => setReloadKey(k => k + 1);

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const search = searchQuery.trim().toLowerCase();
  const filteredProjects = projects
    .filter(p => activeFilter === 'All' || p.category === activeFilter)
    .filter(p => !search || p.title.toLowerCase().includes(search) || (p.tech || []).some(t => t.toLowerCase().includes(search)))
    .sort((a, b) => sortOrder === 'newest'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="min-h-screen bg-dark-900 text-gray-300">
      <SEO
        title="Projects | Eshan Gunasekara"
        description="All of Eshan Gunasekara's projects: web apps, Android apps and Java desktop apps."
        url="https://eshangunasekara.vercel.app/projects"
      />

      <div className="container mx-auto px-6 md:px-12 py-12 max-w-7xl">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="mb-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">All projects</h1>
          <p className="text-gray-400 text-lg">
            {projects.length > 0 ? `${projects.length} projects. ` : ''}Search by name or by a technology, or filter by type.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-10">
          <label className="relative w-full lg:w-80">
            <span className="sr-only">Search projects</span>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search by name or tech"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-800 border border-white/10 rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects by type">
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

          <label className="lg:ml-auto flex items-center gap-2 text-sm text-gray-400">
            Sort
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-dark-800 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-white/10 border-t-primary rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="max-w-xl card p-8 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-4" />
            <h2 className="text-white font-semibold mb-2">Couldn't load projects</h2>
            <p className="text-gray-400 text-sm mb-6">{error}</p>
            <button
              onClick={retry}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg surface text-sm text-white hover:border-white/25 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Try again
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <p className="py-20 text-center text-gray-500">Nothing matches that search.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects;
