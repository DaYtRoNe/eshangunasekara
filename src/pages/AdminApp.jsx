import React, { useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import toast, { Toaster } from 'react-hot-toast';

const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      toast.error('Session expired due to inactivity. Please log in again.');
      navigate('/admin');
    } catch (error) {
      console.error('Error auto-logging out:', error);
    }
  }, [navigate]);

  useEffect(() => {
    if (!currentUser) return;

    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleLogout, TIMEOUT_DURATION);
    };

    // Events that denote user activity
    const events = ['mousemove', 'keydown', 'scroll', 'click'];

    // Attach listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initialize timer
    resetTimer();

    // Cleanup listeners and timer on unmount
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [currentUser, handleLogout]);

  if (!currentUser) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

const AdminRoutes = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
};

const AdminApp = () => {
  return (
    <AuthProvider>
      <AdminRoutes />
    </AuthProvider>
  );
};

export default AdminApp;
