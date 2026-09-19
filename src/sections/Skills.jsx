import React from 'react';
import { motion } from 'framer-motion';
import {
  SiReact, SiTailwindcss, SiJavascript, SiTypescript, SiHtml5, SiCss, SiFramer, SiGreensock, SiThreedotjs,
  SiNodedotjs, SiPhp,
  SiMysql, SiFirebase,
  SiGit, SiPostman, SiAndroidstudio, SiVite
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import SectionHeading from '../components/SectionHeading';

const groups = [
  {
    title: 'Frontend',
    skills: [
      { name: 'React', icon: <SiReact /> },
      { name: 'TypeScript', icon: <SiTypescript /> },
      { name: 'JavaScript', icon: <SiJavascript /> },
      { name: 'Tailwind CSS', icon: <SiTailwindcss /> },
      { name: 'GSAP', icon: <SiGreensock /> },
      { name: 'Three.js', icon: <SiThreedotjs /> },
      { name: 'Framer Motion', icon: <SiFramer /> },
      { name: 'HTML', icon: <SiHtml5 /> },
      { name: 'CSS', icon: <SiCss /> },
    ]
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', icon: <SiNodedotjs /> },
      { name: 'Java', icon: <FaJava /> },
      { name: 'PHP', icon: <SiPhp /> },
    ]
  },
  {
    title: 'Databases',
    skills: [
      { name: 'MySQL', icon: <SiMysql /> },
      { name: 'Firebase', icon: <SiFirebase /> },
    ]
  },
  {
    title: 'Tools',
    skills: [
      { name: 'Git', icon: <SiGit /> },
      { name: 'Postman', icon: <SiPostman /> },
      { name: 'Android Studio', icon: <SiAndroidstudio /> },
      { name: 'Vite', icon: <SiVite /> },
    ]
  }
];

const Skills = () => (
  <section id="skills" className="py-24 border-t border-white/5">
    <div className="container mx-auto px-6 md:px-12">
      <SectionHeading
        eyebrow="Skills"
        title="What I work with"
        intro="Everything here is something I've used in at least one of the projects below."
      />

      <div className="grid sm:grid-cols-2 gap-6 max-w-5xl">
        {groups.map((group, i) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="card p-6"
          >
            <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-4">{group.title}</h3>
            <ul className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <li
                  key={skill.name}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-sm text-gray-200"
                >
                  <span className="text-base text-gray-400" aria-hidden="true">{skill.icon}</span>
                  {skill.name}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Skills;
