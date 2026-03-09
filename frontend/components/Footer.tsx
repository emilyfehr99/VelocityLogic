import React from 'react';
import { Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-border py-12 mt-auto transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-default">
          <Zap className="w-4 h-4 text-textMain" />
          <span className="font-bold text-md text-textMain">
            Velocity<span className="text-textMuted font-normal">Logic</span>
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8 text-sm text-textMuted">
          <p className="max-w-md">
            Built by <span className="text-textMain font-medium">Emily Fehr</span> for high-volume trades and home services teams that are tired of
            quoting from a laptop at 10 PM.
          </p>
          <a href="mailto:founder@velocitylogic.ai" className="hover:text-textMain transition-colors font-medium">
            Contact the founder
          </a>
        </div>
        <div className="text-textMuted text-xs font-mono text-center md:text-right">
          © {new Date().getFullYear()} Velocity Logic Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};