import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Plus, Trash2, Pencil, Loader2, Briefcase, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [newExperience, setNewExperience] = useState({
    role: '',
    company: '',
    period: '',
    description: '' // Will be split by newlines for bullets
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const q = query(collection(db, 'experience'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExperiences(data);
    } catch (error) {
      toast.error('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExperience(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (exp) => {
    setEditingId(exp.id);
    setNewExperience({
      role: exp.role || '',
      company: exp.company || '',
      period: exp.period || '',
      description: exp.description ? exp.description.join('\n') : ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setNewExperience({ role: '', company: '', period: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newExperience.role || !newExperience.company || !newExperience.period) {
      toast.error('Please fill required fields');
      return;
    }

    setAdding(true);
    const toastId = toast.loading(editingId ? 'Updating experience...' : 'Adding experience...');

    try {
      const descArray = newExperience.description.split('\n').map(d => d.trim()).filter(d => d !== '');

      const expData = {
        role: newExperience.role,
        company: newExperience.company,
        period: newExperience.period,
        description: descArray,
      };

      if (editingId) {
        await updateDoc(doc(db, 'experience', editingId), expData);
        setExperiences(prev => prev.map(exp => exp.id === editingId ? { ...exp, ...expData } : exp));
        toast.success('Experience updated successfully!', { id: toastId });
      } else {
        expData.createdAt = new Date().toISOString();
        const docRef = await addDoc(collection(db, 'experience'), expData);
        setExperiences(prev => [{ id: docRef.id, ...expData }, ...prev]);
        toast.success('Experience added successfully!', { id: toastId });
      }

      cancelEdit();
    } catch (error) {
      console.error(error);
      toast.error(editingId ? 'Failed to update experience' : 'Failed to add experience', { id: toastId });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) return;
    
    const toastId = toast.loading('Deleting...');
    try {
      await deleteDoc(doc(db, 'experience', id));
      setExperiences(prev => prev.filter(p => p.id !== id));
      toast.success('Experience deleted', { id: toastId });
    } catch (error) {
      toast.error('Failed to delete', { id: toastId });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-outfit text-white">Experience Manager</h2>
        <p className="text-gray-400 mt-1">Manage your professional journey and work history.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <div className="glass-card p-6 rounded-2xl border border-white/5 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
                {editingId ? <Pencil className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                {editingId ? 'Edit Experience' : 'Add Experience'}
              </h3>
              {editingId && (
                <button onClick={cancelEdit} className="text-gray-400 hover:text-white" title="Cancel Edit">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Job Role / Title*</label>
                <input
                  type="text" name="role" required
                  value={newExperience.role} onChange={handleChange}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Company / Organization*</label>
                <input
                  type="text" name="company" required
                  value={newExperience.company} onChange={handleChange}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                  placeholder="e.g. Google"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Time Period*</label>
                <input
                  type="text" name="period" required
                  value={newExperience.period} onChange={handleChange}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                  placeholder="e.g. Jan 2022 - Present"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Responsibilities (One per line)</label>
                <textarea
                  name="description" rows="5"
                  value={newExperience.description} onChange={handleChange}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary resize-none"
                  placeholder="Led the frontend team...&#10;Improved performance by 40%..."
                />
              </div>

              <button
                type="submit" disabled={adding}
                className="w-full py-3 mt-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50"
              >
                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />)}
                {editingId ? 'Update Experience' : 'Add Experience'}
              </button>
            </form>
          </div>
        </div>

        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-xl font-bold font-outfit text-white mb-6">Experience History</h3>
          
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : experiences.length === 0 ? (
            <div className="text-center p-10 glass-card rounded-2xl border border-white/5 text-gray-400">
              No experience added yet.
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id} className="glass-card p-6 rounded-2xl border border-white/5 relative group">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => handleEditClick(exp)}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                      title="Edit Experience"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(exp.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Experience"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-dark-800 rounded-full flex items-center justify-center shrink-0 border border-white/10">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{exp.role}</h4>
                      <p className="text-primary font-medium">{exp.company}</p>
                      <span className="inline-block mt-1 px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300 border border-white/10">
                        {exp.period}
                      </span>
                      
                      {exp.description && exp.description.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {exp.description.map((item, i) => (
                            <li key={i} className="text-gray-400 text-sm flex gap-2">
                              <span className="text-primary mt-1">•</span> {item}
                            </li>
                          ))}
                        </ul>
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

export default ExperienceManager;
