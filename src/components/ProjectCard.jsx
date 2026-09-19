import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

// Colours for tech badges
const techColors = {
  'React.js': 'border-blue-500/50 text-blue-400',
  'React': 'border-blue-500/50 text-blue-400',
  'React Native': 'border-blue-400/50 text-blue-300',
  'Node.js': 'border-green-500/50 text-green-400',
  'Firebase': 'border-yellow-500/50 text-yellow-400',
  'Tailwind CSS': 'border-cyan-500/50 text-cyan-400',
  'Java': 'border-orange-500/50 text-orange-400',
  'PHP': 'border-indigo-400/50 text-indigo-300',
  'MySQL': 'border-blue-300/50 text-blue-200',
  'TypeScript': 'border-blue-600/50 text-blue-500',
  'Android Studio': 'border-green-400/50 text-green-300',
};

const linkClass = "p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-primary/50 transition-colors hover:shadow-[0_0_10px_rgba(170,59,255,0.2)] flex items-center justify-center relative z-50";

const ProjectCard = ({ project, isHovered, isAnotherHovered, onHoverStart, onHoverEnd }) => {
  const hasGithub = Boolean(project.githubUrl);
  const hasLive = Boolean(project.liveUrl);
  const hasImage = Boolean(project.imageUrl);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isAnotherHovered ? 0.3 : 1,
        scale: isAnotherHovered ? 0.96 : 1,
        filter: isAnotherHovered ? "blur(3px)" : "blur(0px)",
      }}
      exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
      transition={{ duration: 0.4 }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className={`glass-card flex flex-col h-full relative overflow-hidden transition-all duration-300 ${
        isHovered ? 'shadow-[0_0_30px_rgba(170,59,255,0.15)] border-primary/40 -translate-y-2' : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* Screenshot (or a plain placeholder until one is added in the admin panel) */}
      <div className="relative aspect-video w-full bg-dark-800 border-b border-white/5 overflow-hidden">
        {hasImage ? (
          <img
            src={project.imageUrl}
            alt={`${project.title} screenshot`}
            loading="lazy"
            className={`w-full h-full object-cover object-top transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <div className="flex flex-col items-center gap-2">
              <span className="[&>svg]:w-8 [&>svg]:h-8">{project.icon}</span>
              <span className="text-xs font-mono uppercase tracking-wider">{project.category}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-1">
        {/* Header */}
        <div className="flex justify-between items-start gap-4 mb-4 relative z-10">
          <h3 className={`text-xl md:text-2xl font-bold transition-colors ${isHovered ? 'text-primary' : 'text-white'}`}>
            {project.title}
          </h3>

          {(hasGithub || hasLive) && (
            <div className="flex gap-2 shrink-0 relative z-50">
              {hasGithub && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} on GitHub`} title="Source code" className={linkClass}>
                  <FaGithub className="w-5 h-5 pointer-events-none" />
                </a>
              )}
              {hasLive && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title}`} title="Live site" className={linkClass}>
                  <ExternalLink className="w-5 h-5 pointer-events-none" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Body */}
        <p className="text-gray-400 text-sm leading-relaxed mb-6 relative z-10 flex-1">
          {project.description}
        </p>

        {/* Tech badges */}
        <div className="relative z-10 mt-auto pt-5 border-t border-white/5">
          <div className="flex flex-wrap gap-2">
            {(project.tech || []).map((tech) => {
              const colorClass = techColors[tech] || 'border-primary/30 text-primary/80';
              return (
                <span
                  key={tech}
                  className={`text-[11px] font-mono tracking-wider px-2.5 py-1 bg-dark-950/80 rounded-md border ${colorClass} shadow-sm backdrop-blur-md`}
                >
                  {tech}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
