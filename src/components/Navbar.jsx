import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { Menu, X, Code2 } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';

const navLinks = [
  { name: 'Home', to: 'home' },
  { name: 'About', to: 'about' },
  { name: 'Skills', to: 'skills' },
  { name: 'Projects', to: 'projects' },
  { name: 'Contact', to: 'contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(navLinks[0].name);
  const [hoveredTab, setHoveredTab] = useState(null);

  // Scroll Progress
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const progressBarWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      <header className="fixed top-6 left-0 w-full z-50 px-4 md:px-0 flex justify-center pointer-events-none">
        {/* Floating Island Container */}
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="glass pointer-events-auto rounded-full py-2 px-4 md:px-6 flex items-center justify-between gap-8 shadow-2xl shadow-primary/10 border-b-0 relative overflow-hidden"
          style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          {/* Scroll Progress Border */}
          <motion.div 
            className="absolute bottom-0 left-0 h-[2px] bg-primary z-20"
            style={{ width: progressBarWidth }}
          />

          {/* Logo */}
          <Link 
            to="home" 
            smooth={true} 
            duration={500} 
            className="flex items-center gap-2 cursor-hover group"
            onClick={() => setActiveTab('Home')}
          >
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }}>
              <Code2 className="text-primary w-6 h-6" />
            </motion.div>
            <span className="font-outfit font-bold text-lg tracking-wide text-white group-hover:text-primary transition-colors">
              Eshan<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2 relative">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                smooth={true}
                duration={500}
                spy={true}
                onSetActive={() => setActiveTab(link.name)}
                onMouseEnter={() => setHoveredTab(link.name)}
                onMouseLeave={() => setHoveredTab(null)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors cursor-hover rounded-full z-10 ${
                  activeTab === link.name || hoveredTab === link.name ? 'text-white' : 'text-gray-400'
                }`}
              >
                {link.name}
                
                {/* Sliding Background */}
                {hoveredTab === link.name && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                
                {activeTab === link.name && !hoveredTab && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary/20 rounded-full border border-primary/30 -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Hire Me Button */}
          <Link
            to="contact"
            smooth={true}
            duration={500}
            className="hidden md:block px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-full transition-all duration-300 cursor-hover font-medium text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:scale-105"
          >
            Hire Me
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white cursor-hover p-2 z-50 relative"
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </button>
        </motion.div>
      </header>

      {/* Premium Full-Screen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at top right)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at top right)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-dark-900/95 backdrop-blur-xl flex flex-col justify-center items-center"
          >
            <div className="absolute top-8 left-8">
               <div className="flex items-center gap-2">
                <Code2 className="text-primary w-8 h-8" />
                <span className="font-outfit font-bold text-2xl tracking-wide text-white">
                  Eshan<span className="text-primary">.</span>
                </span>
              </div>
            </div>

            <nav className="flex flex-col items-center gap-6">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                >
                  <Link
                    to={link.to}
                    smooth={true}
                    duration={500}
                    onClick={() => {
                      setIsOpen(false);
                      setActiveTab(link.name);
                    }}
                    className={`text-3xl font-bold font-outfit tracking-wider transition-colors cursor-hover ${
                      activeTab === link.name ? 'text-primary' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + navLinks.length * 0.1 }}
                className="mt-8"
              >
                <Link
                  to="contact"
                  smooth={true}
                  duration={500}
                  onClick={() => setIsOpen(false)}
                  className="px-8 py-3 bg-primary hover:bg-primary-dark transition-colors text-white rounded-full text-lg font-medium shadow-lg shadow-primary/25 cursor-hover"
                >
                  Let's Talk
                </Link>
              </motion.div>
            </nav>
            
            {/* Ambient Background Glow for mobile menu */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
