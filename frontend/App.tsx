import React, { createContext, useContext, useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import LandingPage from './pages/LandingPage';
import VsJobberPage from './pages/VsJobberPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import JobUpload from './pages/JobUpload';
import QuoteViewer from './pages/QuoteViewer';
import ScheduleManager from './pages/ScheduleManager';
import SMSDemo from './pages/SMSDemo';
import PrivacyPolicy from './pages/PrivacyPolicy';
import BigDashboard from './pages/BigDashboard';
import { AuthProvider } from './contexts/AuthContext';

// Theme Context
type Theme = 'dark' | 'light';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check local storage or system preference
    if (localStorage.getItem('theme') === 'light') return 'light';
    if (localStorage.getItem('theme') === 'dark') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Scroll to top wrapper & Analytics
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
    // Track Page View
    import('./lib/analytics').then(({ trackPageView, startSessionHeartbeat }) => {
      trackPageView(pathname);
      startSessionHeartbeat();
    });
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <div className="bg-background min-h-screen text-textMain font-sans selection:bg-primary/30 selection:text-textMain transition-colors duration-300">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/vs-jobber" element={<VsJobberPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/dashboard" element={<BigDashboard />} />
                <Route path="/agent-upload" element={<JobUpload />} />
                <Route path="/upload" element={<JobUpload />} />
                <Route path="/quotes" element={<QuoteViewer />} />
                <Route path="/schedule" element={<ScheduleManager />} />
                <Route path="/sms" element={<SMSDemo />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
        <Analytics />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;