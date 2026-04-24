import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Bell, ShieldAlert, Send, DollarSign, Activity } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const AdminDashboard = ({ addToast }) => {
  const [alertText, setAlertText] = useState('');
  const [alertType, setAlertType] = useState('warning');
  
  // Dynamic Stats State
  const [stats, setStats] = useState({
    attendees: 42500,
    revenue: 124500,
    orders: 312
  });

  const [sosAlerts, setSosAlerts] = useState([
    { id: 1, type: 'Medical', location: 'Gate B (North)', time: 'Just now', status: 'Pending' }
  ]);

  useEffect(() => {
    // Dynamic Stats Interval
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        attendees: prev.attendees + Math.floor(Math.random() * 10) - 3, // slightly fluctuating up
        revenue: prev.revenue + Math.floor(Math.random() * 50), // increasing
        orders: prev.orders + Math.floor(Math.random() * 3)
      }));
    }, 4000); // update every 4 secs

    // Dynamic SOS Interval
    const sosInterval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% chance every 10 secs
        const types = ['Medical', 'Security', 'Lost Child'];
        const locations = ['Section C4', 'Food Court', 'Gate A', 'South Stand', 'Restroom 2'];
        
        const newSOS = {
          id: Date.now(),
          type: types[Math.floor(Math.random() * types.length)],
          location: locations[Math.floor(Math.random() * locations.length)],
          time: 'Just now',
          status: 'Pending'
        };
        
        setSosAlerts(prev => [newSOS, ...prev].slice(0, 10)); // keep last 10
      }
    }, 10000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(sosInterval);
    };
  }, []);

  const handleSendAlert = (e) => {
    e.preventDefault();
    if (!alertText.trim()) return;
    addToast(`Broadcast sent: ${alertText}`, 'success');
    setAlertText('');
  };

  const resolveSOS = (id) => {
    setSosAlerts(prev => prev.map(alert => alert.id === id ? { ...alert, status: 'Resolved' } : alert));
    addToast('SOS request marked as resolved.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Total Attendees</p>
            <h3 className="text-2xl font-bold">{stats.attendees.toLocaleString()}</h3>
          </div>
        </div>
        
        <div className="bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">F&B Revenue</p>
            <h3 className="text-2xl font-bold">${stats.revenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Active Orders</p>
            <h3 className="text-2xl font-bold">{stats.orders}</h3>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Pending SOS</p>
            <h3 className="text-2xl font-bold">{sosAlerts.filter(a => a.status === 'Pending').length}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Broadcast System */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <Bell className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Broadcast Announcement</h2>
          </div>
          <form onSubmit={handleSendAlert} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Alert Type</label>
              <select 
                value={alertType} 
                onChange={(e) => setAlertType(e.target.value)}
                className="w-full bg-input/50 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="info">General Info</option>
                <option value="warning">Warning / Congestion</option>
                <option value="critical">Critical / Emergency</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea 
                value={alertText}
                onChange={(e) => setAlertText(e.target.value)}
                placeholder="Type your announcement here..."
                className="w-full bg-input/50 border rounded-lg px-4 py-2 h-24 focus:ring-2 focus:ring-primary outline-none resize-none"
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition"
            >
              <Send className="w-5 h-5" />
              Broadcast to All Devices
            </button>
          </form>
        </div>

        {/* SOS Monitor */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-destructive animate-pulse" />
              <h2 className="text-xl font-bold">Live SOS Monitor</h2>
            </div>
            <span className="bg-destructive/10 text-destructive text-xs font-bold px-2 py-1 rounded-full">
              Live updates
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {sosAlerts.map(alert => (
              <div key={alert.id} className={`p-4 rounded-xl border flex items-center justify-between ${alert.status === 'Pending' ? 'border-red-500/50 bg-red-500/5' : 'bg-muted/30 border-border'}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold">{alert.type} Emergency</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${alert.status === 'Pending' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Location: <strong className="text-foreground">{alert.location}</strong></p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
                {alert.status === 'Pending' && (
                  <button 
                    onClick={() => resolveSOS(alert.id)}
                    className="px-4 py-2 bg-foreground text-background text-sm font-bold rounded-lg hover:opacity-80 transition"
                  >
                    Resolve
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
