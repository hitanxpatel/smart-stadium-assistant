import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Moon, Sun, Settings } from 'lucide-react';
import Heatmap from './components/Heatmap';
import Navigation from './components/Navigation';
import FoodOrdering from './components/FoodOrdering';
import NearbyFacilities from './components/NearbyFacilities';
import AlertsSystem from './components/AlertsSystem';
import Toast from './components/Toast';
import LoadingSkeleton from './components/LoadingSkeleton';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
    
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
      addToast('Welcome to the Smart Stadium Assistant!', 'success');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl text-primary-foreground">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-tight">Smart Stadium</h1>
              <p className="text-xs text-muted-foreground font-medium">Assistant Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>
            <button className="p-2.5 rounded-full hover:bg-muted transition-colors sm:flex hidden">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(350px,auto)]">
          
          {/* Main Heatmap Area - Span 2 cols on large screens */}
          <div className="lg:col-span-2 row-span-2">
            <Heatmap />
          </div>

          {/* Navigation */}
          <div className="col-span-1">
            <Navigation />
          </div>

          {/* Alerts */}
          <div className="col-span-1">
            <AlertsSystem addToast={addToast} />
          </div>

          {/* Food Ordering */}
          <div className="col-span-1 lg:col-span-2 row-span-1">
            <FoodOrdering addToast={addToast} />
          </div>

          {/* Nearby Facilities */}
          <div className="col-span-1">
            <NearbyFacilities />
          </div>
          
        </div>
      </main>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
