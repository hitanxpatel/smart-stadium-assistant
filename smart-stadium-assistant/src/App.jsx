import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Moon, Sun, Settings } from 'lucide-react';
import Heatmap from './components/Heatmap';
import Navigation from './components/Navigation';
import FoodOrdering from './components/FoodOrdering';
import NearbyFacilities from './components/NearbyFacilities';
import AlertsSystem from './components/AlertsSystem';
import Toast from './components/Toast';
import LoadingSkeleton from './components/LoadingSkeleton';
import LiveScoreWidget from './components/LiveScoreWidget';
import Chatbot from './components/Chatbot';
import SOSButton from './components/SOSButton';
import AdminDashboard from './components/AdminDashboard';
import VendorDashboard from './components/VendorDashboard';
import Auth from './components/Auth';
import SettingsDrawer from './components/SettingsDrawer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('user'); // 'user' | 'admin' | 'vendor'
  const [userName, setUserName] = useState('');
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Shared Global State for Orders
  const [globalOrders, setGlobalOrders] = useState([]);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
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
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleLogin = (role, name) => {
    setLoading(true);
    setTimeout(() => {
      // Determine Role based on email
      let finalRole = 'user';
      if (role.includes('admin')) finalRole = 'admin';
      if (role.includes('vendor') || role.includes('food')) finalRole = 'vendor';

      setUserRole(finalRole);
      setUserName(name);
      setIsAuthenticated(true);
      setLoading(false);
      addToast(`Logged in successfully as ${name} (${finalRole})`, 'success');
    }, 1500);
  };

  const handleLogout = () => {
    setIsSettingsOpen(false);
    setIsAuthenticated(false);
    setUserRole('user');
    setUserName('');
    addToast('Logged out successfully', 'info');
  };

  const addGlobalOrder = (order) => {
    setGlobalOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (id, newStatus) => {
    setGlobalOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  if (!isAuthenticated) {
    return (
      <>
        {loading ? <LoadingSkeleton /> : <Auth onLogin={(role, name) => handleLogin(role, name)} />}
        <Toast toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-20">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl text-primary-foreground">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-tight">Smart Stadium</h1>
              <p className="text-xs text-muted-foreground font-medium">
                {userRole === 'admin' ? 'Admin Control Panel' : userRole === 'vendor' ? 'Kitchen Display System' : 'Assistant Dashboard'}
              </p>
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
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 rounded-full hover:bg-muted transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {userRole === 'admin' ? (
          <AdminDashboard addToast={addToast} />
        ) : userRole === 'vendor' ? (
          <VendorDashboard orders={globalOrders} updateOrderStatus={updateOrderStatus} addToast={addToast} />
        ) : (
          <>
            <LiveScoreWidget />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(350px,auto)]">
              <div className="lg:col-span-2 row-span-2">
                <Heatmap />
              </div>
              <div className="col-span-1">
                <Navigation />
              </div>
              <div className="col-span-1">
                <AlertsSystem addToast={addToast} />
              </div>
              <div className="col-span-1 lg:col-span-2 row-span-1">
                <FoodOrdering addToast={addToast} globalOrders={globalOrders} addGlobalOrder={addGlobalOrder} />
              </div>
              <div className="col-span-1">
                <NearbyFacilities />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Floating Elements (Only in user view) */}
      {userRole === 'user' && (
        <>
          <SOSButton addToast={addToast} />
          <Chatbot />
        </>
      )}

      {/* Overlays */}
      <SettingsDrawer 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onLogout={handleLogout}
        userRole={userRole}
        userName={userName}
      />
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
