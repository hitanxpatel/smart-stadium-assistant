import React, { useState, useEffect } from 'react';
import { generateRandomCrowdData } from '../utils/dummyData';
import { Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Heatmap = () => {
  const [crowdData, setCrowdData] = useState([]);

  useEffect(() => {
    // Initial data
    setCrowdData(generateRandomCrowdData());

    // Update every 3 seconds
    const interval = setInterval(() => {
      setCrowdData(generateRandomCrowdData());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-sm border p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Live Crowd Heatmap
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time stadium density</p>
        </div>
        <div className="flex gap-3 text-xs font-medium">
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> Low</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Medium</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> High</div>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] relative rounded-xl border bg-muted/30 overflow-hidden flex items-center justify-center p-4">
        {/* Abstract Stadium Layout */}
        <div className="w-full max-w-md aspect-[4/3] relative">
          <div className="absolute inset-0 border-4 border-muted-foreground/20 rounded-[100px] flex items-center justify-center p-6">
            <div className="w-full h-full border-2 border-muted-foreground/10 rounded-[80px] flex items-center justify-center bg-background/50">
               <span className="text-muted-foreground font-semibold tracking-widest text-sm">PITCH</span>
            </div>
          </div>
          
          {/* Zones */}
          <AnimatePresence>
            {crowdData.map((zone, idx) => {
              // Positioning zones arbitrarily around the pitch
              const positions = [
                { top: '5%', left: '50%', transform: 'translate(-50%, 0)' }, // North
                { bottom: '5%', left: '50%', transform: 'translate(-50%, 0)' }, // South
                { top: '50%', right: '5%', transform: 'translate(0, -50%)' }, // East
                { top: '50%', left: '5%', transform: 'translate(0, -50%)' }, // West
                { top: '20%', right: '20%' }, // VIP
              ];
              
              const pos = positions[idx] || {};

              return (
                <motion.div
                  key={zone.id}
                  className={`absolute p-3 rounded-xl cursor-pointer group transition-all duration-500 flex flex-col items-center justify-center backdrop-blur-md shadow-lg ${zone.color} text-white`}
                  style={{ ...pos, minWidth: '80px' }}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <span className="text-xs font-bold whitespace-nowrap">{zone.name}</span>
                  <span className="text-sm font-black">{zone.crowdPercentage}%</span>
                  
                  {/* Tooltip */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full mb-2 bg-foreground text-background text-xs py-1 px-3 rounded shadow-xl whitespace-nowrap z-10 pointer-events-none">
                    Capacity: {zone.capacity} <br/>
                    Status: {zone.status}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
