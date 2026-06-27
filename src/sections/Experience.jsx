import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Briefcase, Building2, GraduationCap } from 'lucide-react';

const experiences = [
  {
    role: 'IT & Digital Operations Assistant',
    company: 'RIO Online School',
    period: '2024 - 2026',
    icon: <Building2 className="w-5 h-5 text-gray-400" />,
    responsibilities: [
      'Managed official Facebook page and digital presence',
      'Published content and handled customer inquiries',
      'Managed Zoom classes and supported digital learning operations',
      'Solved technical issues for staff and students',
      'Improved workflow efficiency across digital platforms'
    ]
  },
  {
    role: 'BSc (Hons) Software Engineering',
    company: 'UK University (Currently Studying)',
    period: '2023 - Present',
    icon: <GraduationCap className="w-5 h-5 text-gray-400" />,
    responsibilities: [
      'Studying core software engineering principles and modern architectures',
      'Developing full-stack web applications for academic projects',
      'Learning advanced algorithms and data structures',
      'Collaborating on team-based agile software development'
    ]
  }
];

const ExperienceItem = ({ exp, isLast }) => {
  const ref = useRef(null);
  
  // Track scroll progress for this specific item's section of the page
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"]
  });

  // Animate the timeline dot when the item comes into view
  const dotColor = useTransform(scrollYProgress, [0, 0.2], ["rgba(255,255,255,0.1)", "rgba(170,59,255,1)"]);
  const dotScale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1.2]);
  const dotShadow = useTransform(scrollYProgress, [0, 0.2], ["0px 0px 0px rgba(170,59,255,0)", "0px 0px 20px rgba(170,59,255,0.8)"]);
  
  return (
    <div ref={ref} className="relative pl-8 md:pl-0 mb-16 last:mb-0">
      <div className="md:grid md:grid-cols-5 md:gap-8 items-start relative">
        
        {/* Timeline Background Line (Mobile) */}
        {!isLast && (
          <div className="md:hidden absolute left-[7px] top-6 bottom-[-64px] w-[2px] bg-white/5 rounded-full" />
        )}
        {/* Animated Fill Line (Mobile) */}
        {!isLast && (
          <motion.div 
            className="md:hidden absolute left-[7px] top-6 bottom-[-64px] w-[2px] bg-gradient-to-b from-primary via-indigo-500 to-primary origin-top shadow-[0_0_10px_rgba(170,59,255,0.5)] rounded-full z-0"
            style={{ scaleY: scrollYProgress }}
          />
        )}
        
        {/* Timeline Dot (Mobile) */}
        <motion.div 
          style={{ backgroundColor: dotColor, scale: dotScale, boxShadow: dotShadow }}
          className="md:hidden absolute left-0 top-2 w-4 h-4 rounded-full ring-4 ring-primary/20 z-10 border border-dark-900" 
        />

        {/* Period (Desktop Left) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          className="hidden md:block md:col-span-1 pt-2 text-right"
        >
          <span className="text-primary font-bold text-lg tracking-wide bg-primary/10 px-4 py-1.5 rounded-full inline-block border border-primary/20">{exp.period}</span>
        </motion.div>

        {/* Timeline Line/Dot (Desktop Center) */}
        <div className="hidden md:flex flex-col items-center justify-start h-full relative z-0">
          <motion.div 
            style={{ backgroundColor: dotColor, scale: dotScale, boxShadow: dotShadow }}
            className="w-5 h-5 rounded-full ring-4 ring-primary/20 z-10 mt-2 border-2 border-dark-900" 
          />
          
          {/* Static Background Line */}
          {!isLast && (
            <div className="absolute top-8 bottom-[-64px] w-[2px] bg-white/5 rounded-full z-0" />
          )}
          {/* Animated Fill Line */}
          {!isLast && (
            <motion.div 
              className="absolute top-8 bottom-[-64px] w-[2px] bg-gradient-to-b from-primary via-indigo-500 to-primary origin-top shadow-[0_0_15px_rgba(170,59,255,0.8)] rounded-full z-10"
              style={{ scaleY: scrollYProgress }} 
            />
          )}
        </div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
          className="md:col-span-3 pb-4"
        >
          <motion.div 
            whileHover={{ scale: 1.02, x: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass-card p-6 md:p-8 relative cursor-hover hover:border-primary/40 transition-colors shadow-lg hover:shadow-primary/20 group overflow-hidden"
          >
            {/* Subtle Gradient Glow inside card */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Period (Mobile only) */}
            <span className="md:hidden inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary text-sm font-bold rounded-full mb-4">
              {exp.period}
            </span>
            
            <h3 className="text-2xl font-bold text-white mb-2">{exp.role}</h3>
            
            <div className="flex items-center gap-2 mb-6">
              {exp.icon}
              <h4 className="text-lg text-gray-300 font-medium">{exp.company}</h4>
            </div>
            
            <ul className="space-y-4 relative z-10">
              {exp.responsibilities.map((task, tIdx) => (
                <li key={tIdx} className="flex items-start gap-3 group/item">
                  <span className="w-2 h-2 rounded-full bg-white/20 group-hover/item:bg-primary mt-2 flex-shrink-0 transition-colors shadow-[0_0_10px_rgba(170,59,255,0)] group-hover/item:shadow-[0_0_10px_rgba(170,59,255,0.8)]" />
                  <span className="text-gray-400 group-hover/item:text-gray-200 leading-relaxed transition-colors">{task}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const Experience = () => {
  return (
    <section id="experience" className="py-24 relative bg-dark-900/50">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="flex flex-col items-center mb-20"
        >
          <div className="inline-flex items-center justify-center p-3 glass rounded-2xl mb-4 cursor-hover">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-4 text-white">Work & Education</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-transparent rounded-full" />
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {experiences.map((exp, idx) => (
            <ExperienceItem 
              key={idx} 
              exp={exp} 
              isLast={idx === experiences.length - 1} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
