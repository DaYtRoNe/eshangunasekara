import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Plus, Trash2, Pencil, Loader2, Code2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [newSkill, setNewSkill] = useState({
    category: '',
    items: '' // comma separated
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const q = query(collection(db, 'skills'), orderBy('createdAt', 'asc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSkills(data);
    } catch (error) {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSkill(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (skillObj) => {
    setEditingId(skillObj.id);
    setNewSkill({
      category: skillObj.category || '',
      items: skillObj.items ? skillObj.items.join(', ') : ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setNewSkill({ category: '', items: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newSkill.category || !newSkill.items) {
      toast.error('Category and items are required');
      return;
    }

    setAdding(true);
    const toastId = toast.loading(editingId ? 'Updating skills...' : 'Adding skills...');

    try {
      const itemsArray = newSkill.items.split(',').map(s => s.trim()).filter(s => s !== '');

      const skillData = {
        category: newSkill.category,
        items: itemsArray,
      };

      if (editingId) {
        await updateDoc(doc(db, 'skills', editingId), skillData);
        setSkills(prev => prev.map(s => s.id === editingId ? { ...s, ...skillData } : s));
        toast.success('Skills updated successfully!', { id: toastId });
      } else {
        skillData.createdAt = new Date().toISOString();
        const docRef = await addDoc(collection(db, 'skills'), skillData);
        setSkills(prev => [...prev, { id: docRef.id, ...skillData }]);
        toast.success('Skills added successfully!', { id: toastId });
      }

      cancelEdit();
    } catch (error) {
      toast.error(editingId ? 'Failed to update skills' : 'Failed to add skills', { id: toastId });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    const toastId = toast.loading('Deleting...');
    try {
      await deleteDoc(doc(db, 'skills', id));
      setSkills(prev => prev.filter(p => p.id !== id));
      toast.success('Deleted successfully', { id: toastId });
    } catch (error) {
      toast.error('Failed to delete', { id: toastId });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-outfit text-white">Skills Manager</h2>
        <p className="text-gray-400 mt-1">Group and display your technical expertise.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <div className="glass-card p-6 rounded-2xl border border-white/5 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
                {editingId ? <Pencil className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                {editingId ? 'Edit Skill Category' : 'Add Skill Category'}
              </h3>
              {editingId && (
                <button onClick={cancelEdit} className="text-gray-400 hover:text-white" title="Cancel Edit">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Category Name*</label>
                <input type="text" name="category" required value={newSkill.category} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" placeholder="e.g. Frontend Development" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Skills (Comma separated)*</label>
                <textarea name="items" required rows="4" value={newSkill.items} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary resize-none" placeholder="React, Vue, Tailwind CSS..."/>
              </div>

              <button type="submit" disabled={adding} className="w-full py-3 mt-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark disabled:opacity-50">
                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />)} 
                {editingId ? 'Update Skills' : 'Add Skills'}
              </button>
            </form>
          </div>
        </div>

        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-xl font-bold font-outfit text-white mb-6">Current Skill Categories</h3>
          
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : skills.length === 0 ? (
            <div className="text-center p-10 glass-card rounded-2xl border border-white/5 text-gray-400">No categories found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map(skill => (
                <div key={skill.id} className="glass-card p-6 rounded-2xl border border-white/5 relative group">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => handleEditClick(skill)}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                      title="Edit Category"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(skill.id)} 
                      className="p-2 bg-red-500/10 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                      <Code2 className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="text-lg font-bold text-white pr-16">{skill.category}</h4>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {skill.items?.map((item, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
                        {item}
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
