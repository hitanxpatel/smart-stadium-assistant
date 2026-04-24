import React, { useState } from 'react';
import { AlertOctagon, Phone, ShieldAlert, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SOSButton = ({ addToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSOS = (type) => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsOpen(false);
      addToast(`Emergency alert sent to ${type} team. Help is on the way!`, 'error');
    }, 1500);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 p-3 bg-destructive text-destructive-foreground rounded-full shadow-2xl hover:scale-110 transition-transform z-40 animate-pulse"
        title="Emergency SOS"
      >
        <AlertOctagon className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed bottom-24 left-6 w-80 bg-card border-2 border-destructive/50 shadow-2xl rounded-2xl flex flex-col z-50 overflow-hidden"
            >
              <div className="bg-destructive p-4 text-destructive-foreground flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5" />
                  <h3 className="font-bold">Emergency Assistance</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-black/20 p-1 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-sm text-muted-foreground mb-4">Select the type of emergency. Your current stadium location will be automatically shared.</p>
                
                <button 
                  onClick={() => handleSOS('Medical')}
                  disabled={isSending}
                  className="w-full bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 p-4 rounded-xl font-bold flex items-center gap-3 transition-colors disabled:opacity-50"
                >
                  <Phone className="w-5 h-5" />
                  Medical Emergency
                </button>
                
                <button 
                  onClick={() => handleSOS('Security')}
                  disabled={isSending}
                  className="w-full bg-orange-100 hover:bg-orange-200 text-orange-700 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 dark:text-orange-400 p-4 rounded-xl font-bold flex items-center gap-3 transition-colors disabled:opacity-50"
                >
                  <ShieldAlert className="w-5 h-5" />
                  Security Issue
                </button>
              </div>
              
              {isSending && (
                <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-4 border-destructive border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="font-bold animate-pulse text-destructive">Transmitting Location...</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SOSButton;
