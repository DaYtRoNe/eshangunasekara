import React from 'react';
import { ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const linkClass = "p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors";

const ProjectCard = ({ project }) => {
  const hasGithub = Boolean(project.githubUrl);
  const hasLive = Boolean(project.liveUrl);
  const hasImage = Boolean(project.imageUrl);

  return (
    <article className="card flex flex-col h-full overflow-hidden hover:border-white/20 transition-colors">
      {/* Screenshot, or a plain placeholder until one is added in the admin panel */}
      <div className="aspect-video w-full bg-dark-800 border-b border-white/5 overflow-hidden">
        {hasImage ? (
          <img
            src={project.imageUrl}
            alt={`${project.title} screenshot`}
            loading="lazy"
            className="w-full h-full object-cover object-top"
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

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="text-xl font-semibold text-white leading-snug">{project.title}</h3>

          {(hasGithub || hasLive) && (
            <div className="flex gap-1 shrink-0 -mt-1 -mr-2">
              {hasGithub && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source code on GitHub`} title="Source code" className={linkClass}>
                  <FaGithub className="w-5 h-5" />
                </a>
              )}
              {hasLive && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title}`} title="Live site" className={linkClass}>
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
          )}
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
          {project.description}
        </p>

        <ul className="flex flex-wrap gap-1.5 mt-auto">
          {(project.tech || []).map((tech) => (
            <li key={tech} className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-300">
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};

export default ProjectCard;
