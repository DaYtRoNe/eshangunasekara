import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [hoverBounds, setHoverBounds] = useState(null);
  const [isHidden, setIsHidden] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);

  // Check if device supports hover (desktop)
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.matchMedia('(pointer: fine)').matches);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const cursorWidth = useMotionValue(40);
  const cursorHeight = useMotionValue(40);

  // Smooth spring physics
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  const cWidth = useSpring(cursorWidth, springConfig);
  const cHeight = useSpring(cursorHeight, springConfig);

  const currentHoverRef = useRef(null);

  useEffect(() => {
    if (!isDesktop) return;

    const updateCursor = (clientX, clientY) => {
      // Find element under cursor
      const element = document.elementFromPoint(clientX, clientY);
      const clickable = element?.closest('a, button, .cursor-hover');

      if (clickable) {
        const rect = clickable.getBoundingClientRect();
        
        // Lock cursor position to the center of the hovered element
        mouseX.set(rect.left + rect.width / 2);
        mouseY.set(rect.top + rect.height / 2);
        
        // Stretch cursor dimensions to match the element (plus some padding)
        cursorWidth.set(rect.width + 16);
        cursorHeight.set(rect.height + 16);

        if (currentHoverRef.current !== clickable) {
          currentHoverRef.current = clickable;
          setHoverBounds({ width: rect.width, height: rect.height });
        }
      } else {
        // Track mouse normally
        mouseX.set(clientX);
        mouseY.set(clientY);
        cursorWidth.set(40);
        cursorHeight.set(40);
        
        if (currentHoverRef.current !== null) {
          currentHoverRef.current = null;
          setHoverBounds(null);
        }
      }
    };

    const moveCursor = (e) => {
      if (isHidden) setIsHidden(false);
      updateCursor(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, cursorWidth, cursorHeight, isHidden, isDesktop]);

  if (!isDesktop || isHidden) return null;

  const isHovering = hoverBounds !== null;

  return (
    <>
      {/* Outer Magnetic Wrapper / Hover State */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
        style={{
          x: cursorX,
          y: cursorY,
          width: cWidth,
          height: cHeight,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        {/* Rotating dashed ring when NOT hovering */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '1.5px dashed rgba(255, 255, 255, 0.6)' }}
          animate={{ 
            rotate: 360,
            opacity: isHovering ? 0 : 1,
            scale: isHovering ? 1.5 : 1
          }}
          transition={{ 
            rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 }
          }}
        />

        {/* Target Lock Corners (Visible on Hover) */}
        <motion.div 
          className="absolute inset-0"
          animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.8 }}
          transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
        >
          {/* Top Left */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white pointer-events-none transition-all duration-300" style={{ transform: isHovering ? 'translate(-4px, -4px)' : 'translate(0,0)' }} />
          {/* Top Right */}
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white pointer-events-none transition-all duration-300" style={{ transform: isHovering ? 'translate(4px, -4px)' : 'translate(0,0)' }} />
          {/* Bottom Left */}
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white pointer-events-none transition-all duration-300" style={{ transform: isHovering ? 'translate(-4px, 4px)' : 'translate(0,0)' }} />
          {/* Bottom Right */}
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white pointer-events-none transition-all duration-300" style={{ transform: isHovering ? 'translate(4px, 4px)' : 'translate(0,0)' }} />
        </motion.div>
      </motion.div>

      {/* Inner Solid Dot (Disappears on hover) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference bg-white rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 0 : 8,
          height: isHovering ? 0 : 8,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
};

export default CustomCursor;
