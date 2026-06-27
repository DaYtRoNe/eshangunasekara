import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const loadingMessages = [
  "INITIALIZING SYSTEM...",
  "RESOLVING DEPENDENCIES...",
  "COMPILING ASSETS...",
  "RENDERING INTERFACE...",
  "ESTABLISHING CONNECTION...",
  "SYSTEM READY."
];

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Animate progress from 0 to 100 over 2.5 seconds
    const duration = 2500;
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(newProgress);

      // Update messages based on progress
      const msgIdx = Math.min(
        Math.floor((newProgress / 100) * loadingMessages.length),
        loadingMessages.length - 1
      );
      setMessageIndex(msgIdx);

      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 800); // Wait a bit at 100% before firing complete
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark-900 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.1,
        filter: "blur(10px)",
        transition: { duration: 0.8, ease: "easeInOut" } 
      }}
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Massive Background Percentage */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
        <motion.span 
          className="text-[25vw] font-outfit font-black text-white/[0.02] select-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          {progress}
        </motion.span>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Geometric Shape */}
        <div className="w-32 h-32 relative mb-12">
          {/* Outer glowing ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-t border-r border-primary drop-shadow-[0_0_15px_rgba(170,59,255,0.8)]"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner Hexagon SVG Drawing */}
          <svg className="absolute inset-0 w-full h-full text-white p-6" viewBox="0 0 100 100">
            <motion.path
              d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: progress / 100, 
                opacity: 1,
                fill: progress === 100 ? "rgba(255,255,255,0.1)" : "transparent"
              }}
              transition={{ duration: 0.1 }}
            />
          </svg>

          {/* Center glowing core */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_20px_#fff]"
            animate={{ 
              scale: progress === 100 ? [1, 5, 0] : [1, 1.5, 1],
              opacity: progress === 100 ? [1, 0] : 1
            }}
            transition={{ 
              duration: progress === 100 ? 0.5 : 1, 
              repeat: progress === 100 ? 0 : Infinity 
            }}
          />
        </div>

        {/* Text Area */}
        <div className="h-10 mb-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.2 }}
              className="font-mono text-sm tracking-widest text-primary uppercase text-center"
            >
              {loadingMessages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress Bar Container */}
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
        
        {/* Progress Text */}
        <div className="w-64 flex justify-between mt-2 font-mono text-xs text-gray-500">
          <span>SYS.BOOT</span>
          <span>{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
