import React, { useState, useEffect } from 'react';
import { Trophy, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveScoreWidget = () => {
  const [tickerIndex, setTickerIndex] = useState(0);
  
  const matchEvents = [
    "🏏 Virat Kohli hits a massive SIX over long-on!",
    "🔥 WICKET! Rashid Khan strikes, Maxwell is out.",
    "💥 Boundary! Faf du Plessis reaches his 50 off 32 balls.",
    "📈 Current Run Rate: 10.2 | Projected Score: 205",
    "😲 What a catch by Shubman Gill at the boundary!",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % matchEvents.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-primary text-primary-foreground rounded-2xl shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 z-10 w-full md:w-auto">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-300" />
          <div>
            <p className="text-xs font-medium opacity-80 uppercase tracking-wider">Live Cricket</p>
            <h3 className="font-bold">IPL T20 - Match 45</h3>
          </div>
        </div>
        
        <div className="h-10 w-px bg-primary-foreground/20 hidden md:block"></div>

        <div className="flex items-center justify-between md:justify-start gap-4">
          <div className="flex flex-col items-center">
            <span className="text-lg font-black tracking-tight text-red-300">RCB</span>
            <span className="text-xl font-bold">185/4</span>
            <span className="text-xs opacity-80">(18.2 ov)</span>
          </div>
          
          <span className="bg-primary-foreground/20 text-primary-foreground px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
            VS
          </span>
          
          <div className="flex flex-col items-center opacity-70">
            <span className="text-lg font-black tracking-tight text-blue-300">GT</span>
            <span className="text-sm font-bold mt-1">Yet to bat</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-primary-foreground/10 px-4 py-2 rounded-xl border border-primary-foreground/20 w-full md:w-auto z-10">
        <Activity className="w-4 h-4 text-red-300 animate-pulse shrink-0" />
        <div className="relative h-5 w-full md:w-72 overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.p
              key={tickerIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-medium absolute whitespace-nowrap"
            >
              {matchEvents[tickerIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LiveScoreWidget;
