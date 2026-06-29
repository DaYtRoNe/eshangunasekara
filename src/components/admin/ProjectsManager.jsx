import React, { useState, useEffect } from 'react';
import { db, storage } from '../../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Plus, Trash2, Pencil, Image as ImageIcon, Loader2, ExternalLink, X } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  
  const [editingId, setEditingId] = useState(null);

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    techStack: '', // Will be split by comma
    githubLink: '',
    demoLink: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  
  const handleEditClick = (project) => {
    setEditingId(project.id);
    setNewProject({
      title: project.title || '',
      description: project.description || '',
      techStack: project.tech ? project.tech.join(', ') : '',
      githubLink: project.github || '',
      demoLink: project.demo || ''
    });
    setImageFile(null); // Optional to change image
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setNewProject({ title: '', description: '', techStack: '', githubLink: '', demoLink: '' });
    setImageFile(null);
    document.getElementById('project-image-upload').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description) {
      toast.error('Title and description are required');
      return;
    }
    
    if (!editingId && !imageFile) {
      toast.error('Image is required for new projects');
      return;
    }

    setAdding(true);
    const toastId = toast.loading(editingId ? 'Updating project...' : 'Adding project...');

    try {
      let imageUrl = null;

      // 1. Upload Image if new one is selected
      if (imageFile) {
        toast.loading('Uploading new image...', { id: toastId });
        const storageRef = ref(storage, `projects/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      // 2. Format tech stack
      const techArray = newProject.techStack.split(',').map(t => t.trim()).filter(t => t !== '');

      // 3. Save or Update in Firestore
      toast.loading('Saving to database...', { id: toastId });
      
      const projectData = {
        title: newProject.title,
        description: newProject.description,
        tech: techArray,
        github: newProject.githubLink,
        demo: newProject.demoLink,
      };
      
      if (imageUrl) {
        projectData.image = imageUrl;
      }
      
      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), projectData);
        // Update UI
        setProjects(prev => prev.map(p => p.id === editingId ? { ...p, ...projectData } : p));
        toast.success('Project updated successfully!', { id: toastId });
      } else {
        projectData.createdAt = new Date().toISOString();
        const docRef = await addDoc(collection(db, 'projects'), projectData);
        // Update UI
        setProjects(prev => [...prev, { id: docRef.id, ...projectData }]);
        toast.success('Project added successfully!', { id: toastId });
      }

      // Reset form
      cancelEdit();
    } catch (error) {
      console.error(error);
      toast.error(editingId ? 'Failed to update project' : 'Failed to add project', { id: toastId });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    const toastId = toast.loading('Deleting project...');
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success('Project deleted', { id: toastId });
    } catch (error) {
      toast.error('Failed to delete project', { id: toastId });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-outfit text-white">Projects Manager</h2>
        <p className="text-gray-400 mt-1">Add, update, or remove projects from your portfolio.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Add/Edit Project Form */}
        <div className="xl:col-span-1">
          <div className="glass-card p-6 rounded-2xl border border-white/5 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
                {editingId ? <Pencil className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h3>
              {editingId && (
                <button onClick={cancelEdit} className="text-gray-400 hover:text-white" title="Cancel Edit">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Project Title*</label>
                <input
                  type="text" name="title" required
                  value={newProject.title} onChange={handleChange}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g. AI Content Generator"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description*</label>
                <textarea
                  name="description" required rows="3"
                  value={newProject.description} onChange={handleChange}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="A brief description of the project..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text" name="techStack"
                  value={newProject.techStack} onChange={handleChange}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g. React, Node.js, MongoDB"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">GitHub Link</label>
                  <input
                    type="text" name="githubLink"
                    value={newProject.githubLink} onChange={handleChange}
                    className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Live Demo</label>
                  <input
                    type="text" name="demoLink"
                    value={newProject.demoLink} onChange={handleChange}
                    className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Project Image {editingId ? '(Optional to change)' : '*'}
                </label>
                <input
                  type="file" accept="image/*" id="project-image-upload"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
                />
              </div>

              <button
                type="submit" disabled={adding}
                className="w-full py-3 mt-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50"
              >
                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />)}
                {editingId ? 'Update Project' : 'Add Project'}
              </button>
            </form>
          </div>
        </div>

        {/* Existing Projects List */}
        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-xl font-bold font-outfit text-white mb-6">Existing Projects</h3>
          
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : projects.length === 0 ? (
            <div className="text-center p-10 glass-card rounded-2xl border border-white/5 text-gray-400">
              No projects found. Add one!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(project => (
                <div key={project.id} className="glass-card rounded-2xl border border-white/5 overflow-hidden group">
                  <div className="h-40 overflow-hidden relative">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
                  </div>
                  <div className="p-5 relative">
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        onClick={() => handleEditClick(project)}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors shadow-lg backdrop-blur-md"
                        title="Edit Project"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(project.id)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors shadow-lg backdrop-blur-md"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <h4 className="text-lg font-bold text-white mb-2 pr-20">{project.title}</h4>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech?.map((t, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded-md text-gray-300">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 text-gray-400 hover:text-white">
                          <FaGithub className="w-3 h-3" /> GitHub
                        </a>
                      )}
                      {project.demo && (
                        <a href={project.demo} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 text-gray-400 hover:text-white">
                          <ExternalLink className="w-3 h-3" /> Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsManager;
