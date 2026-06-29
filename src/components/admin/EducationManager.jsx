import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Plus, Trash2, Pencil, Loader2, GraduationCap, X } from 'lucide-react';
import toast from 'react-hot-toast';

const EducationManager = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [newEdu, setNewEdu] = useState({
    degree: '',
    institution: '',
    period: ''
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const q = query(collection(db, 'education'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEducation(data);
    } catch (error) {
      toast.error('Failed to load education');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEdu(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (edu) => {
    setEditingId(edu.id);
    setNewEdu({
      degree: edu.degree || '',
      institution: edu.institution || '',
      period: edu.period || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setNewEdu({ degree: '', institution: '', period: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEdu.degree || !newEdu.institution) {
      toast.error('Degree and institution are required');
      return;
    }

    setAdding(true);
    const toastId = toast.loading(editingId ? 'Updating education...' : 'Adding education...');

    try {
      const eduData = {
        degree: newEdu.degree,
        institution: newEdu.institution,
        period: newEdu.period,
      };

      if (editingId) {
        await updateDoc(doc(db, 'education', editingId), eduData);
        setEducation(prev => prev.map(edu => edu.id === editingId ? { ...edu, ...eduData } : edu));
        toast.success('Education updated successfully!', { id: toastId });
      } else {
        eduData.createdAt = new Date().toISOString();
        const docRef = await addDoc(collection(db, 'education'), eduData);
        setEducation(prev => [{ id: docRef.id, ...eduData }, ...prev]);
        toast.success('Education added successfully!', { id: toastId });
      }

      cancelEdit();
    } catch (error) {
      toast.error(editingId ? 'Failed to update education' : 'Failed to add education', { id: toastId });
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this education record?")) return;
    
    const toastId = toast.loading('Deleting...');
    try {
      await deleteDoc(doc(db, 'education', id));
      setEducation(prev => prev.filter(p => p.id !== id));
      toast.success('Deleted successfully', { id: toastId });
    } catch (error) {
      toast.error('Failed to delete', { id: toastId });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-outfit text-white">Education Manager</h2>
        <p className="text-gray-400 mt-1">Manage your academic background and qualifications.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <div className="glass-card p-6 rounded-2xl border border-white/5 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
                {editingId ? <Pencil className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                {editingId ? 'Edit Education' : 'Add Education'}
              </h3>
              {editingId && (
                <button onClick={cancelEdit} className="text-gray-400 hover:text-white" title="Cancel Edit">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Degree / Qualification*</label>
                <input type="text" name="degree" required value={newEdu.degree} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" placeholder="BSc Software Engineering" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Institution*</label>
                <input type="text" name="institution" required value={newEdu.institution} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" placeholder="University Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Period</label>
                <input type="text" name="period" value={newEdu.period} onChange={handleChange} className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary" placeholder="2023 - 2027" />
              </div>

              <button type="submit" disabled={adding} className="w-full py-3 mt-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark disabled:opacity-50">
                {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />)} 
                {editingId ? 'Update Education' : 'Add Education'}
              </button>
            </form>
          </div>
        </div>

        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-xl font-bold font-outfit text-white mb-6">Education History</h3>
          
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : education.length === 0 ? (
            <div className="text-center p-10 glass-card rounded-2xl border border-white/5 text-gray-400">No records found.</div>
          ) : (
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id} className="glass-card p-6 rounded-2xl border border-white/5 relative group">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => handleEditClick(edu)}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                      title="Edit Education"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(edu.id)} 
                      className="p-2 bg-red-500/10 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                      title="Delete Education"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white pr-20">{edu.degree}</h4>
                      <p className="text-primary font-medium">{edu.institution}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300 border border-white/10">
                        {edu.period}
                      </span>
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

export default EducationManager;
