import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../App';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled
      ? 'bg-surface/80 backdrop-blur-2xl border-border py-4 shadow-sm'
      : 'bg-transparent border-transparent py-6'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-border overflow-hidden group-hover:border-primary/50 transition-colors shadow-sm">
              <div className="absolute inset-0 bg-primary/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src="/assets/logo.png" alt="Velocity Logic" className="w-6 h-6 object-contain relative z-10" />
            </div>
            <span className="font-bold text-lg tracking-tight text-textMain group-hover:text-primary transition-colors">
              Velocity<span className="text-textMuted font-normal">Logic</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/vs-jobber" className="text-sm font-medium text-textMuted hover:text-textMain transition-colors">
              Compare
            </Link>
            <button onClick={() => handleNavClick('features')} className="text-sm font-medium text-textMuted hover:text-textMain transition-colors cursor-pointer bg-transparent border-none">
              Features
            </button>
            <button onClick={() => handleNavClick('pricing')} className="text-sm font-medium text-textMuted hover:text-textMain transition-colors cursor-pointer bg-transparent border-none">
              Pricing
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-surface hover:bg-surfaceHighlight border border-border text-textMuted hover:text-textMain transition-all active:scale-95"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link to="/login" className="hidden md:block text-sm font-medium text-textMuted hover:text-textMain transition-colors">
              Sign In
            </Link>
            <button
              onClick={() => {
                if (location.pathname !== '/') {
                  navigate('/');
                  setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 100);
                } else {
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-blue-600 border border-transparent transition-all rounded-full hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
            >
              Get Demo
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};