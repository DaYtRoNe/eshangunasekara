import React, { useState, useEffect } from 'react';
import { db, storage } from '../../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cvDescription: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleEditClick = (project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      cvDescription: project.cvDescription || '',
      techStack: project.tech ? project.tech.join(', ') : '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      imageUrl: project.imageUrl || ''
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', cvDescription: '', techStack: '', githubUrl: '', liveUrl: '', imageUrl: '' });
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    const toastId = toast.loading(editingId ? 'Updating project...' : 'Adding project...');

    try {
      let imageUrl = formData.imageUrl;

      if (imageFile) {
        toast.loading('Uploading image...', { id: toastId });
        const storageRef = ref(storage, `projects/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      } else if (!editingId && !imageUrl) {
        toast.error('Please select an image', { id: toastId });
        setAdding(false);
        return;
      }

      const projectData = {
        title: formData.title,
        description: formData.description,
        cvDescription: formData.cvDescription,
        tech: formData.techStack.split(',').map(t => t.trim()).filter(Boolean),
        githubUrl: formData.githubUrl,
        liveUrl: formData.liveUrl,
        imageUrl: imageUrl,
      };

      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), projectData);
        setProjects(prev => prev.map(p => p.id === editingId ? { ...p, ...projectData } : p));
        toast.success('Project updated successfully!', { id: toastId });
      } else {
        projectData.createdAt = new Date().toISOString();
        const docRef = await addDoc(collection(db, 'projects'), projectData);
        setProjects(prev => [{ id: docRef.id, ...projectData }, ...prev]);
        toast.success('Project added successfully!', { id: toastId });
      }

      cancelEdit();
    } catch (error) {
      toast.error(editingId ? 'Failed to update project' : 'Failed to add project', { id: toastId });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    const toastId = toast.loading('Deleting...');
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success('Deleted successfully', { id: toastId });
    } catch (error) {
      toast.error('Failed to delete', { id: toastId });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit text-white">Projects Manager</h2>
          <p className="text-gray-400 mt-1">Add, edit, or remove projects from your portfolio.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Add/Edit Form */}
        <div className="xl:col-span-1">
          <div className="glass-card p-6 rounded-2xl border border-white/5 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
                {editingId ? <Pencil className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h3>
              {editingId && (
                <button onClick={cancelEdit} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Project Title*</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Short Description (For Portfolio UI)*</label>
                <textarea name="description" required rows="3" value={formData.description} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Detailed CV Description (Optional)</label>
                <textarea name="cvDescription" rows="4" value={formData.cvDescription} onChange={handleChange} placeholder="Use newline for bullet points..." className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary resize-none" />
                <p className="text-xs text-gray-500 mt-1">If provided, this will be used in the generated CV PDF instead of the short description.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tech Stack (Comma separated)*</label>
                <input type="text" name="techStack" required value={formData.techStack} onChange={handleChange} placeholder="React, Node.js, MongoDB" className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">GitHub URL</label>
                  <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Live URL</label>
                  <input type="url" name="liveUrl" value={formData.liveUrl} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Project Image{editingId ? '' : '*'}</label>
                <div className="flex items-center gap-4">
                  {(imageFile || formData.imageUrl) && (
                    <img 
                      src={imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl} 
                      alt="Preview" 
                      className="w-16 h-16 rounded-xl object-cover border border-white/10"
                    />
                  )}
                  <label className="flex-1 cursor-pointer bg-dark-800 border border-white/10 border-dashed rounded-xl p-4 flex flex-col items-center justify-center hover:bg-dark-700 hover:border-primary/50 transition-all">
                    <ImageIcon className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-400">Click to upload image</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              <button type="submit" disabled={adding} className="w-full py-3 mt-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark disabled:opacity-50">
                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />)} 
                {editingId ? 'Update Project' : 'Add Project'}
              </button>
            </form>
          </div>
        </div>

        {/* Projects List */}
        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-xl font-bold font-outfit text-white mb-6">Current Projects</h3>
          
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : projects.length === 0 ? (
            <div className="text-center p-10 glass-card rounded-2xl border border-white/5 text-gray-400">No projects found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(project => (
                <div key={project.id} className="glass-card rounded-2xl border border-white/5 overflow-hidden group">
                  <div className="h-40 overflow-hidden relative">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
                    
                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button 
                        onClick={() => handleEditClick(project)}
                        className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-md"
                        title="Edit Project"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(project.id)} 
                        className="p-2 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 backdrop-blur-md"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-white mb-2">{project.title}</h4>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech?.slice(0, 3).map((t, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-white/5 rounded-md text-gray-300">{t}</span>
                      ))}
                      {project.tech?.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-white/5 rounded-md text-gray-500">+{project.tech.length - 3}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-white transition-colors">
                          <FaGithub className="w-3 h-3" /> Code
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors">
                          <ExternalLink className="w-3 h-3" /> Live Demo
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
