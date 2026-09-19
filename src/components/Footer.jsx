import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = ({ globalSettings }) => {
  const githubUrl = globalSettings?.githubUrl;
  const linkedinUrl = globalSettings?.linkedinUrl;

  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <span>© {new Date().getFullYear()} Eshan Gunasekara</span>

        <nav className="flex items-center gap-6" aria-label="Footer">
          <a href="mailto:eshangunsekara@gmail.com" className="hover:text-white transition-colors">Email</a>
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <FaGithub aria-hidden="true" /> GitHub
            </a>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <FaLinkedin aria-hidden="true" /> LinkedIn
            </a>
          )}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
