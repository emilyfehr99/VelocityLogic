import React from 'react';
import { Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-border py-12 mt-auto transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
          <Zap className="w-4 h-4 text-textMain" />
          <span className="font-bold text-md text-textMain">
            Velocity<span className="text-textMuted font-normal">Logic</span>
          </span>
        </div>
        <div className="flex gap-8 text-sm text-textMuted">
           <a href="#" className="hover:text-textMain transition-colors">Privacy</a>
           <a href="#" className="hover:text-textMain transition-colors">Terms</a>
           <a href="#" className="hover:text-textMain transition-colors">Contact</a>
        </div>
        <div className="text-textMuted text-xs font-mono">
          © {new Date().getFullYear()} Velocity Logic Inc.
        </div>
      </div>
    </footer>
  );
};