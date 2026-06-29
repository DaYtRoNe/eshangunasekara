import React, { useState, useEffect } from 'react';
import { db, storage } from '../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Save, Upload, Loader2, Link as LinkIcon, FileText, User } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  
  const [formData, setFormData] = useState({
    aboutMe: '',
    cvProfile: '',
    cvUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    whatsappUrl: '',
    twitterUrl: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'global');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(prev => ({ ...prev, ...docSnap.data() }));
      }
    } catch (error) {
      toast.error('Failed to fetch settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setCvFile(file);
      } else {
        toast.error('Please upload a PDF file');
        e.target.value = null;
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setCvFile(file);
      } else {
        toast.error('Please drop a PDF file');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading('Saving changes...');

    try {
      let finalCvUrl = formData.cvUrl;

      // If a new CV was selected, upload it first
      if (cvFile) {
        toast.loading('Uploading CV...', { id: toastId });
        const storageRef = ref(storage, `cv/${cvFile.name}`);
        await uploadBytes(storageRef, cvFile);
        finalCvUrl = await getDownloadURL(storageRef);
      }

      const updatedData = { ...formData, cvUrl: finalCvUrl };

      // Save to Firestore
      toast.loading('Updating database...', { id: toastId });
      await setDoc(doc(db, 'settings', 'global'), updatedData);
      
      setFormData(updatedData);
      setCvFile(null); // Clear file input state
      
      toast.success('Settings saved successfully!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to save settings: ' + error.message, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold font-outfit text-white">General Settings</h2>
          <p className="text-gray-400 mt-1">Update your personal information, CV, and social links.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-8">
          {/* About Me Section */}
          <div className="glass-card p-6 rounded-2xl border border-white/5">
            <h3 className="text-xl font-bold font-outfit text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              About Me
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Short Description (Used in Hero/About)</label>
                <textarea
                  name="aboutMe"
                  value={formData.aboutMe}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-dark-800 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="I build scalable applications with clean architecture..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">CV Profile / Summary (For CV Only)</label>
                <textarea
                  name="cvProfile"
                  value={formData.cvProfile}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-dark-800 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="A dedicated software engineer with a passion for..."
                />
              </div>
            </div>
          </div>

          {/* CV Upload Section */}
          <div className="glass-card p-6 rounded-2xl border border-white/5">
            <h3 className="text-xl font-bold font-outfit text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Curriculum Vitae (CV)
            </h3>
            <div className="space-y-4">
              <div 
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors relative ${isDragging ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-primary/50'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2">
                  {cvFile ? (
                    <>
                      <FileText className="w-8 h-8 text-green-400" />
                      <p className="text-sm text-green-400 font-medium">Selected: {cvFile.name}</p>
                      <p className="text-xs text-gray-400">Click to change</p>
                    </>
                  ) : (
                    <>
                      <Upload className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-gray-500'}`} />
                      <p className="text-sm text-gray-300 font-medium">
                        Click or drag to upload new PDF
                      </p>
                      <p className="text-xs text-gray-500">Only PDF files are supported</p>
                    </>
                  )}
                </div>
              </div>
              
              {formData.cvUrl && !cvFile && (
                <div className="flex items-center gap-2 text-sm text-gray-400 bg-dark-800 p-3 rounded-lg border border-white/5">
                  <FileText className="w-4 h-4 text-green-400" />
                  <span>Current CV is active</span>
                  <a href={formData.cvUrl} target="_blank" rel="noreferrer" className="ml-auto text-primary hover:underline">View</a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Social Links) */}
        <div className="glass-card p-6 rounded-2xl border border-white/5 h-fit">
          <h3 className="text-xl font-bold font-outfit text-white mb-6 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-primary" />
            Social Links
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">LinkedIn URL</label>
              <input
                type="text"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">GitHub URL</label>
              <input
                type="text"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">WhatsApp Number / Link</label>
              <input
                type="text"
                name="whatsappUrl"
                value={formData.whatsappUrl}
                onChange={handleChange}
                className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="https://wa.me/9477..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Twitter (X) URL</label>
              <input
                type="text"
                name="twitterUrl"
                value={formData.twitterUrl}
                onChange={handleChange}
                className="w-full bg-dark-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsManager;
