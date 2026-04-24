import React, { useState } from 'react';
import { Map, Filter } from 'lucide-react';
import { FACILITIES } from '../utils/dummyData';

const NearbyFacilities = () => {
  const [filter, setFilter] = useState('All');

  const types = ['All', ...new Set(FACILITIES.map(f => f.type))];

  const filteredFacilities = filter === 'All' 
    ? FACILITIES 
    : FACILITIES.filter(f => f.type === filter);

  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-sm border p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Map className="w-5 h-5 text-primary" />
            Nearby Facilities
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Quick access to essential spots</p>
        </div>
        <div className="relative">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-muted pl-8 pr-8 py-1.5 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <Filter className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {filteredFacilities.map(facility => (
          <div key={facility.id} className="flex justify-between items-center p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
            <div>
              <h4 className="font-medium text-sm">{facility.name}</h4>
              <p className="text-xs text-muted-foreground">{facility.zone} • {facility.distance}</p>
            </div>
            <div className={`text-xs px-2 py-1 rounded font-bold ${
              facility.status === 'Clear' || facility.status === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
              facility.status === 'Busy' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {facility.status}
            </div>
          </div>
        ))}
        {filteredFacilities.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-4">
            No facilities found matching this filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyFacilities;
