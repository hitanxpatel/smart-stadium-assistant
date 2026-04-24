import React, { useState } from 'react';
import { MapPin, Navigation as NavIcon, ArrowRight, CheckCircle2, Crosshair } from 'lucide-react';
import { FACILITIES, STADIUM_ZONES } from '../utils/dummyData';
import { motion } from 'framer-motion';

const Navigation = () => {
  const [currentLocation, setCurrentLocation] = useState('zone-south');
  const [selectedDest, setSelectedDest] = useState('');
  const [route, setRoute] = useState(null);

  const handleNavigate = () => {
    if (!selectedDest) return;
    const dest = FACILITIES.find(f => f.id === selectedDest);
    const startZone = STADIUM_ZONES.find(z => z.id === currentLocation) || { name: 'Your Location' };
    
    if (dest) {
      // Create dynamic steps based on start and destination
      let steps = [];
      if (startZone.name === dest.zone) {
        steps = [startZone.name, 'Direct Path', dest.name];
      } else {
        steps = [startZone.name, 'Main Concourse', dest.zone, dest.name];
      }

      setRoute({
        ...dest,
        steps,
        eta: Math.floor(Math.random() * 10) + 2,
      });
    }
  };

  const handleLocateMe = () => {
    // Pick a random zone to simulate GPS auto-locate
    const randomZone = STADIUM_ZONES[Math.floor(Math.random() * STADIUM_ZONES.length)];
    setCurrentLocation(randomZone.id);
    setRoute(null); // Reset route when location changes
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
        {/* Current Location Selection */}
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">Current Location</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <select 
                className="w-full bg-input/30 border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                value={currentLocation}
                onChange={(e) => { setCurrentLocation(e.target.value); setRoute(null); }}
              >
                {STADIUM_ZONES.map(z => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleLocateMe}
              title="Auto Locate"
              className="bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 px-3 py-2 rounded-lg font-medium transition-colors border border-border"
            >
              <Crosshair className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Destination Selection */}
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">Destination</label>
          <div className="flex gap-2">
            <select 
              className="flex-1 bg-input/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedDest}
              onChange={(e) => { setSelectedDest(e.target.value); setRoute(null); }}
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

        {/* Route Display */}
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
              <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3 h-3" />
                Fastest Route
              </div>
            </div>

            <div className="relative pt-2">
              <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-primary/20"></div>
              <div className="space-y-4 relative">
                {route.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${idx === route.steps.length - 1 ? 'bg-primary text-primary-foreground' : idx === 0 ? 'bg-background border-2 border-muted-foreground text-muted-foreground' : 'bg-muted border-2 border-primary/30 text-primary'}`}>
                      {idx === route.steps.length - 1 ? <MapPin className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                    </div>
                    <span className={`text-sm ${idx === route.steps.length - 1 ? 'font-bold' : idx === 0 ? 'text-muted-foreground font-medium' : 'font-medium'}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {!route && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
            <MapPin className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm">Select a destination to see the recommended path from your location.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
