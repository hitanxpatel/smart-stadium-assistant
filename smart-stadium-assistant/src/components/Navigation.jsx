import React, { useState } from 'react';
import { MapPin, Navigation as NavIcon, ArrowRight, CheckCircle2 } from 'lucide-react';
import { FACILITIES } from '../utils/dummyData';
import { motion } from 'framer-motion';

const Navigation = () => {
  const [selectedDest, setSelectedDest] = useState('');
  const [route, setRoute] = useState(null);

  const handleNavigate = () => {
    if (!selectedDest) return;
    const dest = FACILITIES.find(f => f.id === selectedDest);
    if (dest) {
      setRoute({
        ...dest,
        steps: ['Current Location', 'Main Concourse', dest.zone, dest.name],
        eta: Math.floor(Math.random() * 10) + 2,
      });
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-sm border p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <NavIcon className="w-5 h-5 text-primary" />
          Smart Navigation
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Find the least crowded path</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Destination</label>
          <div className="flex gap-2">
            <select 
              className="flex-1 bg-input/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedDest}
              onChange={(e) => setSelectedDest(e.target.value)}
            >
              <option value="">Choose a facility...</option>
              {FACILITIES.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.type})</option>
              ))}
            </select>
            <button 
              onClick={handleNavigate}
              disabled={!selectedDest}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              Go
            </button>
          </div>
        </div>

        {route && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl border bg-primary/5 border-primary/20"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{route.name}</h3>
                <p className="text-sm text-muted-foreground">{route.distance} away • ~{route.eta} mins</p>
              </div>
              <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Fastest Route
              </div>
            </div>

            <div className="relative pt-2">
              <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-primary/20"></div>
              <div className="space-y-4 relative">
                {route.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${idx === route.steps.length - 1 ? 'bg-primary text-primary-foreground' : 'bg-muted border-2 border-primary/30 text-primary'}`}>
                      {idx === route.steps.length - 1 ? <MapPin className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                    </div>
                    <span className={`text-sm ${idx === route.steps.length - 1 ? 'font-bold' : 'font-medium'}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {!route && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
            <MapPin className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm">Select a destination to see the recommended path.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
