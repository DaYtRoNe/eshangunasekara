import React from 'react';
import { Monitor, Smartphone, Globe } from 'lucide-react';

// Icon for the placeholder shown when a project has no screenshot yet.
export const categoryIcon = (category) => {
  if (category === 'Mobile') return <Smartphone />;
  if (category === 'Desktop') return <Monitor />;
  return <Globe />;
};
