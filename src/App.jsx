import React, { useState, useEffect, lazy, Suspense } from 'react';
import { MotionConfig } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './config/firebase';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import SEO from './components/SEO';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Only the home page ships in the main bundle. The admin panel (with its
// image cropper and PDF generator) and the full projects page load on demand.
const AdminApp = lazy(() => import('./pages/AdminApp'));
const AllProjects = lazy(() => import('./pages/AllProjects'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Portfolio = () => {
  const [globalSettings, setGlobalSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'global'));
        if (docSnap.exists()) {
          setGlobalSettings(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 text-gray-300">
      <SEO
        title="Eshan Gunasekara | Software Engineering Undergraduate & Full-Stack Developer"
        description="Eshan Gunasekara is a software engineering undergraduate at Birmingham City University, based in Sri Lanka. He builds web and Android apps with React, Java and Firebase."
        keywords="Eshan Gunasekara, eshan gunasekara, Software Engineer Sri Lanka, Full-Stack Developer, Birmingham City University, React Developer, Android Developer"
        url="https://eshangunasekara.vercel.app/"
      />
      <Navbar />
      <main>
        <Hero globalSettings={globalSettings} />
        <About globalSettings={globalSettings} />
        <Skills />
        <Experience />
        <Projects />
        <Contact globalSettings={globalSettings} />
      </main>
      <Footer globalSettings={globalSettings} />
    </div>
  );
};

const PageFallback = () => (
  <div className="min-h-screen bg-dark-900 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-white/10 border-t-primary rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <Toaster
          position="bottom-center"
          toastOptions={{ style: { background: '#1a1a1a', color: '#e5e7eb', border: '1px solid rgba(255,255,255,0.1)' } }}
        />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/projects" element={<AllProjects />} />
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </MotionConfig>
  );
}

export default App;
