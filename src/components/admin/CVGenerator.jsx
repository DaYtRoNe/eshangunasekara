import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { generateCustomCV } from '../../utils/generateCV';
import { Download, FileText, CheckCircle2, Circle } from 'lucide-react';
import toast from 'react-hot-toast';

const CVGenerator = () => {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [data, setData] = useState({
    settings: {},
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  const [selectedItems, setSelectedItems] = useState({
    experience: new Set(),
    projects: new Set()
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsSnap, experienceSnap, educationSnap, skillsSnap, projectsSnap] = await Promise.all([
          getDoc(doc(db, 'settings', 'global')),
          getDocs(query(collection(db, 'experience'), orderBy('createdAt', 'desc'))),
          getDocs(query(collection(db, 'education'), orderBy('createdAt', 'desc'))),
          getDocs(query(collection(db, 'skills'), orderBy('createdAt', 'asc'))),
          getDocs(query(collection(db, 'projects'), orderBy('createdAt', 'desc')))
        ]);

        const expData = experienceSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const projData = projectsSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.isPublished !== false);

        setData({
          settings: settingsSnap.exists() ? settingsSnap.data() : {},
          experience: expData,
          education: educationSnap.docs.map(d => d.data()),
          skills: skillsSnap.docs.map(d => d.data()),
          projects: projData
        });

        // By default, select all
        setSelectedItems({
          experience: new Set(expData.map(e => e.id)),
          projects: new Set(projData.map(p => p.id))
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load CV data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSelection = (type, id) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev[type]);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { ...prev, [type]: newSet };
    });
  };

  const handleGenerate = async () => {
    setGenerating(true);
    toast.loading("Generating customized CV...", { id: 'cv-gen' });
    try {
      const filteredData = {
        ...data,
        experience: data.experience.filter(e => selectedItems.experience.has(e.id)),
        projects: data.projects.filter(p => selectedItems.projects.has(p.id))
      };

      const blob = await generateCustomCV(filteredData);
      
      // Trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Eshan_Gunasekara_CV_Tailored.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("CV Generated Successfully!", { id: 'cv-gen' });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate CV", { id: 'cv-gen' });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-outfit text-white mb-2">Tailored CV Generator</h2>
          <p className="text-gray-400">Select specific projects and experience to include in a custom PDF CV.</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {generating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-5 h-5" />}
          Generate & Download PDF
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Projects Selection */}
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Select Projects
            </h3>
            <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-1 rounded">
              {selectedItems.projects.size} / {data.projects.length}
            </span>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {data.projects.map(project => {
              const isSelected = selectedItems.projects.has(project.id);
              return (
                <div 
                  key={project.id}
                  onClick={() => toggleSelection('projects', project.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                    isSelected ? 'border-primary/50 bg-primary/10' : 'border-white/5 bg-dark-900 hover:border-white/20'
                  }`}
                >
                  <div className="mt-1">
                    {isSelected ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5 text-gray-500" />}
                  </div>
                  <div>
                    <h4 className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>{project.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-1">{project.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Experience Selection */}
        <div className="bg-dark-800 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Select Experience
            </h3>
            <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-1 rounded">
              {selectedItems.experience.size} / {data.experience.length}
            </span>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {data.experience.map(exp => {
              const isSelected = selectedItems.experience.has(exp.id);
              return (
                <div 
                  key={exp.id}
                  onClick={() => toggleSelection('experience', exp.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                    isSelected ? 'border-primary/50 bg-primary/10' : 'border-white/5 bg-dark-900 hover:border-white/20'
                  }`}
                >
                  <div className="mt-1">
                    {isSelected ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5 text-gray-500" />}
                  </div>
                  <div>
                    <h4 className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>{exp.role}</h4>
                    <p className="text-sm text-gray-500">{exp.company} • {exp.period}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVGenerator;
