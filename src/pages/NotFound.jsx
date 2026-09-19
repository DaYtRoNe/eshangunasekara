import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFound = () => (
  <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
    <SEO title="Page not found" description="That page doesn't exist." noindex={true} />
    <div className="text-center max-w-md">
      <p className="text-sm font-mono text-gray-500 mb-3">404</p>
      <h1 className="text-3xl font-bold text-white mb-4">Page not found</h1>
      <p className="text-gray-400 mb-8">There's nothing at this address. It may have moved, or the link was wrong.</p>
      <Link to="/" className="inline-flex px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors">
        Back to home
      </Link>
    </div>
  </div>
);

export default NotFound;
