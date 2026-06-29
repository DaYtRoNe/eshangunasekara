import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Plus, Trash2, Pencil, Loader2, Briefcase, Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    role: '',
    company: '',
    period: '',
    description: '',
    cvDescription: ''
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
      toast.error('Failed to load experience');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (exp) => {
    setEditingId(exp.id);
    setFormData({
      role: exp.role || '',
      company: exp.company || '',
      period: exp.period || '',
      description: Array.isArray(exp.description) ? exp.description.join('\n') : exp.description || '',
      cvDescription: exp.cvDescription || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ role: '', company: '', period: '', description: '', cvDescription: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    const toastId = toast.loading(editingId ? 'Updating experience...' : 'Adding experience...');

    try {
      const expData = {
        role: formData.role,
        company: formData.company,
        period: formData.period,
        description: formData.description.split('\n').map(d => d.trim()).filter(Boolean),
        cvDescription: formData.cvDescription
      };

      if (editingId) {
        await updateDoc(doc(db, 'experience', editingId), expData);
        setExperiences(prev => prev.map(e => e.id === editingId ? { ...e, ...expData } : e));
        toast.success('Experience updated successfully!', { id: toastId });
      } else {
        expData.createdAt = new Date().toISOString();
        const docRef = await addDoc(collection(db, 'experience'), expData);
        setExperiences(prev => [{ id: docRef.id, ...expData }, ...prev]);
        toast.success('Experience added successfully!', { id: toastId });
      }

      cancelEdit();
    } catch (error) {
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
      setExperiences(prev => prev.filter(e => e.id !== id));
      toast.success('Deleted successfully', { id: toastId });
    } catch (error) {
      toast.error('Failed to delete', { id: toastId });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit text-white">Experience Manager</h2>
          <p className="text-gray-400 mt-1">Manage your work history and professional roles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        <div className="xl:col-span-1">
          <div className="glass-card p-6 rounded-2xl border border-white/5 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
                {editingId ? <Pencil className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                {editingId ? 'Edit Experience' : 'Add New Experience'}
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
                <input type="text" name="role" required value={formData.role} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" placeholder="e.g. Senior Frontend Engineer" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Company Name*</label>
                <input type="text" name="company" required value={formData.company} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" placeholder="e.g. Google" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Period (Duration)*</label>
                <input type="text" name="period" required value={formData.period} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" placeholder="e.g. 2021 - Present" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description (For Portfolio UI - New line for bullet point)*</label>
                <textarea name="description" required rows="4" value={formData.description} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary resize-none" placeholder="Developed core features...&#10;Led a team of 5..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Detailed CV Description (Optional)</label>
                <textarea name="cvDescription" rows="4" value={formData.cvDescription} onChange={handleChange} placeholder="Use newline for bullet points..." className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary resize-none" />
                <p className="text-xs text-gray-500 mt-1">If provided, this will be used in the generated CV PDF instead of the standard description.</p>
              </div>

              <button type="submit" disabled={adding} className="w-full py-3 mt-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark disabled:opacity-50">
                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />)} 
                {editingId ? 'Update Experience' : 'Add Experience'}
              </button>
            </form>
          </div>
        </div>

        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-xl font-bold font-outfit text-white mb-6">Current Experience</h3>
          
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : experiences.length === 0 ? (
            <div className="text-center p-10 glass-card rounded-2xl border border-white/5 text-gray-400">No experience records found.</div>
          ) : (
            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id} className="glass-card p-6 rounded-2xl border border-white/5 relative group">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => handleEditClick(exp)}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(exp.id)} 
                      className="p-2 bg-red-500/10 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h4 className="text-xl font-bold text-white">{exp.role}</h4>
                        <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full w-fit mt-2 md:mt-0">
                          <Calendar className="w-4 h-4" />
                          {exp.period}
                        </div>
                      </div>
                      
                      <h5 className="text-lg text-gray-300 font-medium mb-4">{exp.company}</h5>
                      
                      <ul className="space-y-2">
                        {Array.isArray(exp.description) && exp.description.map((desc, i) => (
                          <li key={i} className="text-sm text-gray-400 flex gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{desc}</span>
                          </li>
                        ))}
                      </ul>
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
