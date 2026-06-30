import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import SettingsManager from '../components/admin/SettingsManager';
import ProjectsManager from '../components/admin/ProjectsManager';
import ExperienceManager from '../components/admin/ExperienceManager';
import EducationManager from '../components/admin/EducationManager';
import SkillsManager from '../components/admin/SkillsManager';
import MessagesManager from '../components/admin/MessagesManager';
import CVGenerator from '../components/admin/CVGenerator';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('settings');

  const renderContent = () => {
    switch (activeTab) {
      case 'settings':
        return <SettingsManager />;
      case 'projects':
        return <ProjectsManager />;
      case 'experience':
        return <ExperienceManager />;
      case 'education':
        return <EducationManager />;
      case 'skills':
        return <SkillsManager />;
      case 'messages':
        return <MessagesManager />;
      case 'cvgenerator':
        return <CVGenerator />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col md:flex-row">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 p-6 md:p-12 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto pb-20">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
