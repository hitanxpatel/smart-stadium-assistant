import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { MOCK_ALERTS } from '../utils/dummyData';
import { motion, AnimatePresence } from 'framer-motion';

const getIcon = (type) => {
  switch(type) {
    case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'info': return <Info className="w-4 h-4 text-blue-500" />;
    case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
    default: return <Bell className="w-4 h-4" />;
  }
};

const AlertsSystem = ({ addToast }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Start with 2 random alerts
    const shuffled = [...MOCK_ALERTS].sort(() => 0.5 - Math.random());
    setAlerts(shuffled.slice(0, 2));

    // Every 8 seconds add or replace an alert to simulate live updates
    const interval = setInterval(() => {
      const randomAlert = MOCK_ALERTS[Math.floor(Math.random() * MOCK_ALERTS.length)];
      setAlerts(prev => {
        const isExisting = prev.find(a => a.id === randomAlert.id);
        if (isExisting) return prev;
        
        const newAlerts = [randomAlert, ...prev].slice(0, 4); // Keep max 4
        
        // Show a toast for the new alert if it's important
        if (randomAlert.type === 'warning' || randomAlert.type === 'error') {
           addToast(randomAlert.message, randomAlert.type);
        }
        
        return newAlerts;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-sm border p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Live Updates
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Real-time stadium announcements</p>
      </div>

      <div className="space-y-3 flex-1 overflow-hidden relative">
        <AnimatePresence initial={false}>
          {alerts.map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-3 rounded-xl border border-border bg-muted/20 flex gap-3 items-start"
            >
              <div className="mt-0.5">{getIcon(alert.type)}</div>
              <p className="text-sm">{alert.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        {alerts.length === 0 && (
          <div className="text-center text-sm text-muted-foreground mt-8">No active alerts.</div>
        )}
      </div>
    </div>
  );
};

export default AlertsSystem;
