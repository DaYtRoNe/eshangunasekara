import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, Loader2, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const ExperienceManager = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [newExp, setNewExp] = useState({
    role: '',
    company: '',
    duration: '',
    description: '' // will be split by newlines
  });

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'experience'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by a field if we had one, but let's just reverse for now (newest first)
      setExperience(data);
    } catch (error) {
      toast.error('Failed to load experience');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExp(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newExp.role || !newExp.company) {
      toast.error('Role and company are required');
      return;
    }

    setAdding(true);
    const toastId = toast.loading('Adding experience...');

    try {
      const descArray = newExp.description.split('\\n').map(t => t.trim()).filter(t => t !== '');

      const docRef = await addDoc(collection(db, 'experience'), {
        role: newExp.role,
        company: newExp.company,
        duration: newExp.duration,
        description: descArray,
        createdAt: new Date().toISOString()
      });

      setExperience(prev => [...prev, {
        id: docRef.id,
        role: newExp.role,
        company: newExp.company,
        duration: newExp.duration,
        description: descArray,
      }]);

      setNewExp({ role: '', company: '', duration: '', description: '' });
      toast.success('Experience added successfully!', { id: toastId });
    } catch (error) {
      toast.error('Failed to add experience', { id: toastId });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this experience record?")) return;
    const toastId = toast.loading('Deleting...');
    try {
      await deleteDoc(doc(db, 'experience', id));
      setExperience(prev => prev.filter(p => p.id !== id));
      toast.success('Deleted', { id: toastId });
    } catch (error) {
      toast.error('Failed to delete', { id: toastId });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-outfit text-white">Experience Manager</h2>
        <p className="text-gray-400 mt-1">Manage your work history.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <div className="glass-card p-6 rounded-2xl border border-white/5 sticky top-24">
            <h3 className="text-xl font-bold font-outfit text-white mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add Experience
            </h3>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Job Role*</label>
                <input type="text" name="role" required value={newExp.role} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" placeholder="Senior Software Engineer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Company*</label>
                <input type="text" name="company" required value={newExp.company} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" placeholder="Google" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Duration</label>
                <input type="text" name="duration" value={newExp.duration} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" placeholder="2021 - Present" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description (One point per line)</label>
                <textarea name="description" rows="4" value={newExp.description} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary resize-none" placeholder="Led a team of 5...&#10;Reduced latency by 30%..."/>
              </div>

              <button type="submit" disabled={adding} className="w-full py-3 mt-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark disabled:opacity-50">
                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />} Add Experience
              </button>
            </form>
          </div>
        </div>

        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-xl font-bold font-outfit text-white mb-6">Experience History</h3>
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : experience.length === 0 ? (
            <div className="text-center p-10 glass-card rounded-2xl border border-white/5 text-gray-400">No records found.</div>
          ) : (
            <div className="space-y-4">
              {experience.map(exp => (
                <div key={exp.id} className="glass-card p-6 rounded-2xl border border-white/5 relative group">
                  <button onClick={() => handleDelete(exp.id)} className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{exp.role}</h4>
                      <p className="text-primary font-medium">{exp.company} <span className="text-gray-500 mx-2">•</span> <span className="text-gray-400 text-sm">{exp.duration}</span></p>
                      <ul className="mt-4 space-y-2">
                        {exp.description?.map((desc, i) => (
                          <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 shrink-0" />
                            {desc}
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
