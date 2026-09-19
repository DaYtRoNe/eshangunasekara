import React from 'react';

// Shared heading for each home page section.
const SectionHeading = ({ eyebrow, title, intro }) => (
  <div className="mb-12 max-w-2xl">
    {eyebrow && (
      <p className="text-xs font-mono uppercase tracking-widest text-primary mb-3">{eyebrow}</p>
    )}
    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
    {intro && <p className="text-gray-400 text-lg leading-relaxed">{intro}</p>}
  </div>
);

export default SectionHeading;
