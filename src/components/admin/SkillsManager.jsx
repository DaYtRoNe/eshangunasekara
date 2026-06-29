import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Trash2, Loader2, Code2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [newCategory, setNewCategory] = useState({
    title: '',
    items: '' // Comma separated
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'skills'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSkills(data);
    } catch (error) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.title || !newCategory.items) {
      toast.error('Title and skills are required');
      return;
    }
    setAdding(true);
    const toastId = toast.loading('Adding skill category...');
    try {
      const itemsArray = newCategory.items.split(',').map(s => s.trim()).filter(s => s !== '');
      const docRef = await addDoc(collection(db, 'skills'), {
        title: newCategory.title,
        items: itemsArray,
        createdAt: new Date().toISOString()
      });
      setSkills(prev => [...prev, { id: docRef.id, title: newCategory.title, items: itemsArray }]);
      setNewCategory({ title: '', items: '' });
      toast.success('Category added!', { id: toastId });
    } catch (error) {
      toast.error('Failed to add skills', { id: toastId });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill category?")) return;
    const toastId = toast.loading('Deleting...');
    try {
      await deleteDoc(doc(db, 'skills', id));
      setSkills(prev => prev.filter(p => p.id !== id));
      toast.success('Deleted', { id: toastId });
    } catch (error) {
      toast.error('Failed to delete', { id: toastId });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-outfit text-white">Skills Manager</h2>
        <p className="text-gray-400 mt-1">Group your technical skills into categories.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <div className="glass-card p-6 rounded-2xl border border-white/5 sticky top-24">
            <h3 className="text-xl font-bold font-outfit text-white mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" /> Add Skill Category
            </h3>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Category Title*</label>
                <input type="text" name="title" required value={newCategory.title} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" placeholder="e.g. Frontend Development" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Skills (comma separated)*</label>
                <textarea name="items" rows="3" required value={newCategory.items} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary resize-none" placeholder="React, Vue, Tailwind CSS..."/>
              </div>

              <button type="submit" disabled={adding} className="w-full py-3 mt-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark disabled:opacity-50">
                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />} Add Category
              </button>
            </form>
          </div>
        </div>

        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-xl font-bold font-outfit text-white mb-6">Current Skills</h3>
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : skills.length === 0 ? (
            <div className="text-center p-10 glass-card rounded-2xl border border-white/5 text-gray-400">No records found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map(cat => (
                <div key={cat.id} className="glass-card p-6 rounded-2xl border border-white/5 relative group">
                  <button onClick={() => handleDelete(cat.id)} className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                      <Code2 className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="text-lg font-bold text-white">{cat.title}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.items?.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-dark-800 border border-white/10 rounded-lg text-sm text-gray-300">
                        {s}
                      </span>
                    ))}
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

export default SkillsManager;
