export const STADIUM_ZONES = [
  { id: 'zone-north', name: 'North Stand', capacity: 5000 },
  { id: 'zone-south', name: 'South Stand', capacity: 5000 },
  { id: 'zone-east', name: 'East Wing', capacity: 3000 },
  { id: 'zone-west', name: 'West Wing', capacity: 3000 },
  { id: 'vip-lounge', name: 'VIP Lounge', capacity: 500 },
];

export const FOOD_STALLS = [
  { id: 'f1', name: 'Burger Bliss', location: 'North Concourse', rating: 4.8, waitTime: 5, menu: [
    { id: 'm1', name: 'Classic Burger', price: 12 },
    { id: 'm2', name: 'Cheese Fries', price: 6 },
    { id: 'm3', name: 'Soda', price: 4 }
  ]},
  { id: 'f2', name: 'Pizza Corner', location: 'East Wing', rating: 4.5, waitTime: 12, menu: [
    { id: 'm4', name: 'Pepperoni Slice', price: 7 },
    { id: 'm5', name: 'Garlic Knots', price: 5 },
    { id: 'm6', name: 'Water', price: 3 }
  ]},
  { id: 'f3', name: 'Taco Fiesta', location: 'South Stand', rating: 4.2, waitTime: 18, menu: [
    { id: 'm7', name: '3x Street Tacos', price: 10 },
    { id: 'm8', name: 'Nachos Supreme', price: 9 },
    { id: 'm9', name: 'Margarita', price: 14 }
  ]},
];

export const FACILITIES = [
  { id: 'fac1', type: 'Washroom', name: 'Restroom North', distance: '50m', zone: 'North Stand', status: 'Available' },
  { id: 'fac2', type: 'Washroom', name: 'Restroom East', distance: '120m', zone: 'East Wing', status: 'Busy' },
  { id: 'fac3', type: 'Gate', name: 'Exit Gate A', distance: '200m', zone: 'North Concourse', status: 'Clear' },
  { id: 'fac4', type: 'Gate', name: 'Exit Gate B', distance: '400m', zone: 'South Stand', status: 'Crowded' },
  { id: 'fac5', type: 'Medical', name: 'First Aid Center', distance: '150m', zone: 'West Wing', status: 'Available' },
];

export const MOCK_ALERTS = [
  { id: 1, type: 'warning', message: 'Gate B is currently crowded. Please use Gate A.' },
  { id: 2, type: 'info', message: 'Burger Bliss has the fastest service right now! (5 min wait)' },
  { id: 3, type: 'error', message: 'South Washroom is currently closed for cleaning.' },
  { id: 4, type: 'success', message: 'Halftime show will begin in 10 minutes!' },
];

export const generateRandomCrowdData = () => {
  return STADIUM_ZONES.map(zone => {
    // Generate a random percentage between 10 and 100
    const crowdPercentage = Math.floor(Math.random() * 90) + 10;
    let status = 'Low';
    let color = 'bg-green-500';
    if (crowdPercentage > 75) {
      status = 'High';
      color = 'bg-red-500';
    } else if (crowdPercentage > 40) {
      status = 'Medium';
      color = 'bg-yellow-500';
    }
    
    return {
      ...zone,
      crowdPercentage,
      status,
      color
    };
  });
};
