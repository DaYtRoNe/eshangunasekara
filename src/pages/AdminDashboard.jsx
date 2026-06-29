import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
// import SettingsManager from '../components/admin/SettingsManager';
// import ProjectsManager from '../components/admin/ProjectsManager';
// import ExperienceManager from '../components/admin/ExperienceManager';
// import EducationManager from '../components/admin/EducationManager';
// import SkillsManager from '../components/admin/SkillsManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('settings');

  const renderContent = () => {
    switch (activeTab) {
      case 'settings':
        return <div className="text-gray-400">Settings Manager (Coming Soon)</div>;
      case 'projects':
        return <div className="text-gray-400">Projects Manager (Coming Soon)</div>;
      case 'experience':
        return <div className="text-gray-400">Experience Manager (Coming Soon)</div>;
      case 'education':
        return <div className="text-gray-400">Education Manager (Coming Soon)</div>;
      case 'skills':
        return <div className="text-gray-400">Skills Manager (Coming Soon)</div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white flex">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 p-8 md:p-12 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
