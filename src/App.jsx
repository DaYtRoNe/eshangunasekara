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

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminApp from './pages/AdminApp';
import NotFound from './pages/NotFound';

const Portfolio = () => {
  const [loading, setLoading] = useState(true);
  const [globalSettings, setGlobalSettings] = useState(null);

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
      <AnimatedBackground />
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loading" onComplete={() => setLoading(false)} />
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
              <About />
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
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
