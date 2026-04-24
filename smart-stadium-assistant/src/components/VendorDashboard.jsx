import React, { useState, useEffect } from 'react';
import { ChefHat, CheckCircle2, Clock, Check, TrendingUp, AlertCircle, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock menu items for simulation
const MOCK_ITEMS = [
  [{ name: 'Classic Burger', price: 9.99, qty: 2 }, { name: 'Coke', price: 2.99, qty: 1 }],
  [{ name: 'Cheese Fries', price: 4.99, qty: 1 }, { name: 'Pepsi', price: 2.49, qty: 2 }],
  [{ name: 'Veg Wrap', price: 7.49, qty: 1 }],
  [{ name: 'Hot Dog', price: 5.99, qty: 3 }, { name: 'Water Bottle', price: 1.99, qty: 2 }],
  [{ name: 'Nachos', price: 6.49, qty: 1 }, { name: 'Mango Juice', price: 3.49, qty: 1 }],
  [{ name: 'Double Patty Burger', price: 12.99, qty: 1 }, { name: 'Onion Rings', price: 3.99, qty: 1 }],
];

const MOCK_NOTES = [null, null, null, 'No onions please', 'Extra spicy', 'Less ice'];

const generateMockOrder = () => {
  const items = MOCK_ITEMS[Math.floor(Math.random() * MOCK_ITEMS.length)];
  const note = MOCK_NOTES[Math.floor(Math.random() * MOCK_NOTES.length)];
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    items,
    total,
    notes: note,
    status: 'New',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    paymentMethod: ['card', 'upi', 'applepay'][Math.floor(Math.random() * 3)],
  };
};

// Pre-seed some initial mock orders
const INITIAL_ORDERS = [
  { ...generateMockOrder(), id: 'ORD-4821', status: 'New' },
  { ...generateMockOrder(), id: 'ORD-3917', status: 'Preparing' },
  { ...generateMockOrder(), id: 'ORD-2045', status: 'Ready for Pickup' },
];

const VendorDashboard = ({ orders, updateOrderStatus, addToast }) => {
  const [stallStatus, setStallStatus] = useState('open');
  const [localOrders, setLocalOrders] = useState(INITIAL_ORDERS);
  const [revenue, setRevenue] = useState(1847.50);
  const [totalCount, setTotalCount] = useState(87);

  // Merge global orders (from real users) with local mock orders
  const allOrders = [...orders, ...localOrders];

  // Filter by status
  const newOrders = allOrders.filter(o => o.status === 'New');
  const preparingOrders = allOrders.filter(o => o.status === 'Preparing');
  const readyOrders = allOrders.filter(o => o.status === 'Ready for Pickup');

  useEffect(() => {
    // Auto-generate a new mock order every 12-18 seconds
    const orderInterval = setInterval(() => {
      const newOrder = generateMockOrder();
      setLocalOrders(prev => [newOrder, ...prev].slice(0, 20)); // keep max 20
      setTotalCount(prev => prev + 1);
      addToast(`New order ${newOrder.id} received!`, 'info');
    }, 14000);

    // Revenue slowly ticks up
    const revenueInterval = setInterval(() => {
      setRevenue(prev => prev + Math.floor(Math.random() * 15 + 5));
    }, 5000);

    return () => {
      clearInterval(orderInterval);
      clearInterval(revenueInterval);
    };
  }, []);

  const handleStatusChange = (e) => {
    setStallStatus(e.target.value);
    addToast(`Stall status updated to ${e.target.value.toUpperCase()}`, 'info');
  };

  const handleMoveOrder = (id, nextStatus) => {
    // Try global orders first, then local
    if (orders.find(o => o.id === id)) {
      updateOrderStatus(id, nextStatus);
    } else {
      setLocalOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
    }
    if (nextStatus === 'Completed') {
      setRevenue(prev => prev + Math.floor(Math.random() * 20 + 10));
    }
    addToast(`Order ${id} → ${nextStatus}`, 'success');
  };

  const OrderCard = ({ order, nextStatus, nextStatusText, btnClass }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-card border rounded-xl p-4 shadow-sm"
    >
      <div className="flex justify-between items-center mb-3 border-b pb-3">
        <div>
          <h3 className="font-black text-lg">{order.id}</h3>
          <p className="text-xs text-muted-foreground">{order.time}</p>
        </div>
        <span className="font-bold text-lg text-primary">${order.total.toFixed(2)}</span>
      </div>

      <div className="space-y-2 mb-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm">
            <span className="font-bold bg-muted px-2 py-0.5 rounded text-xs">{item.qty}x</span>
            <span className="font-medium leading-tight">{item.name}</span>
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 p-2 rounded text-xs font-medium mb-4 flex gap-1 items-start">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{order.notes}</p>
        </div>
      )}

      {nextStatus && (
        <button
          onClick={() => handleMoveOrder(order.id, nextStatus)}
          className={`w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] ${btnClass}`}
        >
          {nextStatusText}
        </button>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-2xl p-4 shadow-sm flex items-center justify-between col-span-1 md:col-span-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Stall Management</p>
              <h3 className="text-xl font-bold">Burger Bliss Station</h3>
            </div>
          </div>
          <select
            value={stallStatus}
            onChange={handleStatusChange}
            className={`text-sm font-bold border-2 rounded-xl px-4 py-2 outline-none appearance-none cursor-pointer ${
              stallStatus === 'open' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:border-green-800/50 dark:text-green-400' :
              stallStatus === 'busy' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800/50 dark:text-yellow-400' :
              'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-400'
            }`}
          >
            <option value="open">🟢 Accepting Orders</option>
            <option value="busy">🟡 Busy (High Wait)</option>
            <option value="closed">🔴 Closed / Paused</option>
          </select>
        </div>

        <div className="bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Today's Orders</p>
            <h3 className="text-2xl font-bold">{totalCount + allOrders.length}</h3>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Revenue</p>
            <h3 className="text-2xl font-bold">${revenue.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-280px)] min-h-[500px]">

        {/* NEW ORDERS */}
        <div className="bg-muted/30 border border-border rounded-2xl p-4 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="font-bold flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
              New Orders
            </h2>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">{newOrders.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
            <AnimatePresence>
              {newOrders.map(order => (
                <OrderCard key={order.id} order={order} nextStatus="Preparing" nextStatusText="Accept & Start" btnClass="bg-blue-500 hover:bg-blue-600 text-white" />
              ))}
            </AnimatePresence>
            {newOrders.length === 0 && (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm font-medium">No new orders</div>
            )}
          </div>
        </div>

        {/* PREPARING */}
        <div className="bg-muted/30 border border-border rounded-2xl p-4 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              Preparing
            </h2>
            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">{preparingOrders.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
            <AnimatePresence>
              {preparingOrders.map(order => (
                <OrderCard key={order.id} order={order} nextStatus="Ready for Pickup" nextStatusText="Mark as Ready" btnClass="bg-yellow-500 hover:bg-yellow-600 text-white" />
              ))}
            </AnimatePresence>
            {preparingOrders.length === 0 && (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm font-medium">Kitchen is clear</div>
            )}
          </div>
        </div>

        {/* READY */}
        <div className="bg-muted/30 border border-border rounded-2xl p-4 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Ready for Pickup
            </h2>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">{readyOrders.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
            <AnimatePresence>
              {readyOrders.map(order => (
                <OrderCard key={order.id} order={order} nextStatus="Completed" nextStatusText={<><Check className="w-4 h-4" /> Handed Over</>} btnClass="bg-green-500 hover:bg-green-600 text-white" />
              ))}
            </AnimatePresence>
            {readyOrders.length === 0 && (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm font-medium">No orders waiting</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default VendorDashboard;
