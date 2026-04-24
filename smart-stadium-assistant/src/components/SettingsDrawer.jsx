import React, { useState } from 'react';
import { X, User, Bell, Shield, CreditCard, LogOut, Settings as SettingsIcon, ChevronLeft, Check, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsDrawer = ({ isOpen, onClose, onLogout, userRole, userName }) => {
  const [activeMenu, setActiveMenu] = useState(null); // 'profile' | 'notifications' | 'payment' | 'access' | null
  const [savedName, setSavedName] = useState(userName);
  
  // Mock states for settings
  const [notifications, setNotifications] = useState({ match: true, food: true, promotional: false });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'profile':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Display Name</label>
              <input type="text" value={savedName} onChange={(e) => setSavedName(e.target.value)} className="w-full bg-input/50 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Email Address</label>
              <input type="email" value={`${userName.toLowerCase().replace(' ', '')}@example.com`} disabled className="w-full bg-muted border rounded-xl px-4 py-2 text-sm opacity-70" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Phone Number</label>
              <input type="text" defaultValue="+1 (555) 000-0000" className="w-full bg-input/50 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <button onClick={handleSave} className="w-full bg-primary text-primary-foreground py-2 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 hover:opacity-90 transition-all">
              {isSaved ? <Check className="w-4 h-4" /> : 'Save Changes'}
              {isSaved ? 'Saved!' : ''}
            </button>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between p-3 border rounded-xl">
              <div>
                <p className="font-bold text-sm">Match Updates</p>
                <p className="text-xs text-muted-foreground">Live scores and events</p>
              </div>
              <input type="checkbox" checked={notifications.match} onChange={() => setNotifications(prev => ({...prev, match: !prev.match}))} className="toggle-checkbox" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-xl">
              <div>
                <p className="font-bold text-sm">Food Orders</p>
                <p className="text-xs text-muted-foreground">Order status updates</p>
              </div>
              <input type="checkbox" checked={notifications.food} onChange={() => setNotifications(prev => ({...prev, food: !prev.food}))} className="toggle-checkbox" />
            </div>
            <div className="flex items-center justify-between p-3 border border-destructive/20 bg-destructive/5 rounded-xl">
              <div>
                <p className="font-bold text-sm text-destructive">Emergency Alerts</p>
                <p className="text-xs text-muted-foreground">Cannot be disabled</p>
              </div>
              <input type="checkbox" checked={true} disabled className="toggle-checkbox opacity-50" />
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="p-4 border border-primary/30 bg-primary/5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-bold text-sm">Visa ending in 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/28</p>
                </div>
              </div>
              <button className="text-destructive p-2 hover:bg-destructive/10 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
            <button className="w-full border-2 border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary py-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors">
              <Plus className="w-5 h-5" />
              <span className="text-sm font-bold">Add New Card</span>
            </button>
          </div>
        );

      case 'access':
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              {[
                { name: 'Mike Security', role: 'Security Chief' },
                { name: 'Sarah Vendor', role: 'F&B Manager' },
              ].map((staff, i) => (
                <div key={i} className="flex justify-between items-center p-3 border rounded-xl bg-muted/30">
                  <div>
                    <p className="font-bold text-sm">{staff.name}</p>
                    <p className="text-xs text-muted-foreground">{staff.role}</p>
                  </div>
                  <button className="text-xs text-destructive font-bold px-2 py-1 hover:bg-destructive/10 rounded transition-colors">Revoke</button>
                </div>
              ))}
            </div>
            <button className="w-full bg-primary/10 text-primary hover:bg-primary/20 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
              <Plus className="w-4 h-4" />
              Add Staff Member
            </button>
          </div>
        );

      default:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Account Options</h4>
              <div className="space-y-1">
                <button onClick={() => setActiveMenu('profile')} className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted rounded-xl transition-colors">
                  <div className="flex items-center gap-3 text-sm font-medium"><User className="w-4 h-4 text-muted-foreground" /> Edit Profile</div>
                  <ChevronLeft className="w-4 h-4 rotate-180 opacity-50" />
                </button>
                <button onClick={() => setActiveMenu('notifications')} className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted rounded-xl transition-colors">
                  <div className="flex items-center gap-3 text-sm font-medium"><Bell className="w-4 h-4 text-muted-foreground" /> Notifications</div>
                  <ChevronLeft className="w-4 h-4 rotate-180 opacity-50" />
                </button>
                {userRole === 'user' && (
                  <button onClick={() => setActiveMenu('payment')} className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted rounded-xl transition-colors">
                    <div className="flex items-center gap-3 text-sm font-medium"><CreditCard className="w-4 h-4 text-muted-foreground" /> Payment Methods</div>
                    <ChevronLeft className="w-4 h-4 rotate-180 opacity-50" />
                  </button>
                )}
              </div>
            </div>

            {userRole === 'admin' && (
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">System Settings</h4>
                <div className="space-y-1">
                  <button onClick={() => setActiveMenu('access')} className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted rounded-xl transition-colors">
                    <div className="flex items-center gap-3 text-sm font-medium"><Shield className="w-4 h-4 text-muted-foreground" /> Access Control</div>
                    <ChevronLeft className="w-4 h-4 rotate-180 opacity-50" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  const getMenuTitle = () => {
    switch(activeMenu) {
      case 'profile': return 'Edit Profile';
      case 'notifications': return 'Notifications';
      case 'payment': return 'Payment Methods';
      case 'access': return 'Access Control';
      default: return 'Settings';
    }
  };

  // Reset menu when closed
  React.useEffect(() => {
    if (!isOpen) setTimeout(() => setActiveMenu(null), 300);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-80 bg-card border-l shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b flex justify-between items-center bg-muted/20">
              <div className="flex items-center gap-3">
                {activeMenu ? (
                  <button onClick={() => setActiveMenu(null)} className="p-1 hover:bg-muted rounded-full transition-colors mr-1">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                    <SettingsIcon className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold">{getMenuTitle()}</h3>
                  {!activeMenu && <p className="text-xs text-muted-foreground capitalize">{userRole} Account</p>}
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
              {!activeMenu && (
                <div className="flex flex-col items-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-tr from-primary to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg">
                    {savedName ? savedName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <h2 className="text-xl font-bold">{savedName || 'User'}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase mt-1 ${userRole === 'admin' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                    {userRole}
                  </span>
                </div>
              )}

              {renderContent()}
            </div>

            {!activeMenu && (
              <div className="p-6 border-t bg-muted/10 mt-auto">
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl transition-colors font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsDrawer;
