import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './config/firebase';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import AnimatedBackground from './components/AnimatedBackground';
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
import AdminApp from './pages/AdminApp';
import NotFound from './pages/NotFound';
import AllProjects from './pages/AllProjects';

const Portfolio = () => {
  const [loading, setLoading] = useState(true);
  const [globalSettings, setGlobalSettings] = useState(null);

  const handleLoadingComplete = React.useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    // Fetch global settings while the loading screen is playing
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
    <div className="min-h-screen bg-dark-900 text-gray-300 font-inter overflow-hidden relative">
      <SEO 
        title="Eshan Gunasekara | Software Engineering Undergraduate & Full-Stack Developer"
        description="Portfolio of Eshan Gunasekara, a Software Engineering Undergraduate at SLIIT specializing in Full-Stack Development and AI. Explore my projects and skills."
        keywords="Eshan Gunasekara, eshan gunasekara, Software Engineer Sri Lanka, Full-Stack Developer, SLIIT, React Developer, Node.js"
        url="https://eshangunasekara.vercel.app/"
      />
      <AnimatedBackground />
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full"
          >
            <Navbar />
            <main>
              <Hero globalSettings={globalSettings} />
              <About globalSettings={globalSettings} />
              <Skills />
              <Experience />
              <Projects />
              <Contact />
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="selection:bg-primary/30 selection:text-white">
        <CustomCursor />
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
