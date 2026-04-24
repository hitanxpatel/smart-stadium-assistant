import React, { useState } from 'react';
import { Coffee, ShoppingCart, Plus, Minus, X, CheckCircle2 } from 'lucide-react';
import { FOOD_STALLS } from '../utils/dummyData';
import { motion, AnimatePresence } from 'framer-motion';

const FoodOrdering = ({ addToast }) => {
  const [selectedStall, setSelectedStall] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const addToCart = (item, stallName) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, stallName, qty: 1 }];
    });
    addToast(`Added ${item.name} to cart`, 'success');
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.qty + delta);
        return { ...i, qty: newQty };
      }
      return i;
    }).filter(i => i.qty > 0));
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      setCart([]);
      setOrderPlaced(false);
      setIsCartOpen(false);
      addToast('Order placed successfully!', 'success');
    }, 2000);
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-sm border p-6 h-full flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Coffee className="w-5 h-5 text-primary" />
            Food & Drinks
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Order ahead and skip the line</p>
        </div>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ShoppingCart className="w-6 h-6" />
          {cart.length > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
              {cart.reduce((sum, i) => sum + i.qty, 0)}
            </span>
          )}
        </button>
      </div>

      {!selectedStall ? (
        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {FOOD_STALLS.map(stall => (
            <div 
              key={stall.id} 
              onClick={() => setSelectedStall(stall)}
              className="p-4 rounded-xl border border-border hover:border-primary/50 cursor-pointer transition-all hover:shadow-md group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold group-hover:text-primary transition-colors">{stall.name}</h3>
                <span className="text-xs bg-muted px-2 py-1 rounded font-medium">{stall.waitTime} min wait</span>
              </div>
              <p className="text-sm text-muted-foreground">{stall.location} • ★ {stall.rating}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <button 
            onClick={() => setSelectedStall(null)}
            className="text-sm text-primary font-medium mb-4 hover:underline self-start"
          >
            ← Back to stalls
          </button>
          <div className="mb-4">
            <h3 className="font-bold text-lg">{selectedStall.name}</h3>
            <p className="text-sm text-muted-foreground">Estimated wait: {selectedStall.waitTime} mins</p>
          </div>
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {selectedStall.menu.map(item => (
              <div key={item.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <div>
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <p className="text-primary font-bold text-sm">${item.price}</p>
                </div>
                <button 
                  onClick={() => addToCart(item, selectedStall.name)}
                  className="w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm z-20"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-3/4 sm:w-2/3 bg-card border-l shadow-2xl z-30 flex flex-col"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg">Your Order</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-1 hover:bg-muted rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {orderPlaced ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">Order Confirmed!</h3>
                  <p className="text-sm text-muted-foreground">Your order is being prepared. We'll notify you when it's ready.</p>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                        <ShoppingCart className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-sm">Your cart is empty</p>
                      </div>
                    ) : (
                      cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">{item.stallName}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-muted rounded-full px-2 py-1">
                              <button onClick={() => updateQty(item.id, -1)} className="p-0.5 hover:bg-background rounded-full"><Minus className="w-3 h-3" /></button>
                              <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                              <button onClick={() => updateQty(item.id, 1)} className="p-0.5 hover:bg-background rounded-full"><Plus className="w-3 h-3" /></button>
                            </div>
                            <span className="font-bold text-sm w-12 text-right">${item.price * item.qty}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {cart.length > 0 && (
                    <div className="p-4 border-t bg-muted/20">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium">Total</span>
                        <span className="text-xl font-bold">${total}</span>
                      </div>
                      <button 
                        onClick={handlePlaceOrder}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        Place Order
                      </button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodOrdering;
