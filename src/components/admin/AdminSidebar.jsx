import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Settings, Briefcase, GraduationCap, Code2, FolderGit2, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin');
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const menuItems = [
    { id: 'settings', label: 'General Settings', icon: <Settings className="w-5 h-5" /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-5 h-5" /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'skills', label: 'Skills', icon: <Code2 className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-dark-800 border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
            <LayoutDashboard className="w-4 h-4 text-primary" />
          </div>
          <div className="text-lg font-bold font-outfit text-white">Admin<span className="text-primary">.</span></div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar Content */}
      <div className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-dark-800 md:border-r border-white/10 p-6 flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="hidden md:flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
            <LayoutDashboard className="w-5 h-5 text-primary" />
          </div>
          <div className="text-xl font-bold font-outfit text-white">Admin<span className="text-primary">.</span></div>
        </div>

        <nav className="flex-1 space-y-2 mt-4 md:mt-0">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false); // Close on mobile after click
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-primary text-white shadow-[0_0_15px_rgba(170,59,255,0.3)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <p className="text-xs text-gray-500 mb-4 px-2 truncate" title={currentUser?.email}>{currentUser?.email}</p>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
