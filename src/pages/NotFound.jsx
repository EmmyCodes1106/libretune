import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="py-20 text-center space-y-4">
      <h1 className="text-4xl font-bold text-brand-text-primary">404</h1>
      <p className="text-brand-text-secondary text-sm">
        The page you are looking for does not exist.
      </p>
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-control bg-brand-action text-white text-sm font-semibold hover:bg-brand-action-hover transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
