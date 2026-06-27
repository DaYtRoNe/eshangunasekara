import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const educationData = [
  {
    degree: 'BEng / BSc (Hons) Software Engineering',
    institution: 'Java Institute for Advanced Technology',
    period: '2023 - 2027',
  },
  {
    degree: 'GCE Advanced Level',
    institution: 'ST. Thomas College, Matale',
    period: '2022',
  }
];

const Education = () => {
  return (
    <section id="education" className="py-20 relative bg-dark-800/30">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 glass rounded-2xl mb-4 cursor-hover">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-outfit mb-4">Education</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-transparent rounded-full" />
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {educationData.map((edu, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, delay: idx * 0.2, ease: "easeOut" }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="glass-card p-8 flex flex-col relative overflow-hidden group cursor-hover shadow-lg hover:shadow-primary/20 hover:border-primary/30 transition-colors"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-500 pointer-events-none" />
              
              <span className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-primary w-max mb-6">
                {edu.period}
              </span>
              
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{edu.degree}</h3>
              <p className="text-lg text-gray-400 font-medium">{edu.institution}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
