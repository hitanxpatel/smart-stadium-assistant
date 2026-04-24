import React, { useState, useEffect } from 'react';
import { Coffee, ShoppingCart, Plus, Minus, X, CheckCircle2, Clock, ClipboardList, CreditCard, Smartphone, Wallet, Lock, Fingerprint } from 'lucide-react';
import { FOOD_STALLS } from '../utils/dummyData';
import { motion, AnimatePresence } from 'framer-motion';

const FoodOrdering = ({ addToast, globalOrders, addGlobalOrder }) => {
  const [stalls, setStalls] = useState(FOOD_STALLS);
  const [selectedStall, setSelectedStall] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // States for flow: cart -> payment -> payment_details -> success
  const [cartStep, setCartStep] = useState('cart'); // 'cart', 'payment', 'payment_details', 'success'
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('card');
  
  // View state
  const [view, setView] = useState('menu'); // 'menu' | 'orders'

  useEffect(() => {
    const interval = setInterval(() => {
      setStalls(prev => prev.map(stall => ({
        ...stall,
        waitTime: Math.floor(Math.random() * 20) + 5 // 5 to 25 mins
      })));
    }, 7000); // Update every 7 seconds
    return () => clearInterval(interval);
  }, []);

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

  const handleCheckout = () => {
    setCartStep('payment');
  };

  const handleContinueToDetails = () => {
    setCartStep('payment_details');
  };

  const processPayment = (e) => {
    if (e) e.preventDefault(); // Prevent form submission refresh
    setIsProcessing(true);
    
    // Simulate payment gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      setCartStep('success');
      
      // Generate Order ID
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder = {
        id: orderId,
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
        status: 'New', // Start as New so Vendor can accept it
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        paymentMethod: selectedPayment
      };
      
      addGlobalOrder(newOrder);

      // Close drawer after showing success
      setTimeout(() => {
        setCart([]);
        setCartStep('cart');
        setIsCartOpen(false);
        setView('orders'); // Auto switch to orders view
        addToast(`Order ${orderId} placed successfully!`, 'success');
      }, 2500);
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
        <div className="flex gap-2">
          <button 
            onClick={() => { setView('orders'); setSelectedStall(null); }}
            className={`relative p-2 rounded-full transition-colors ${view === 'orders' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
            title="My Orders"
          >
            <ClipboardList className="w-6 h-6" />
            {globalOrders.length > 0 && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-card"></span>
            )}
          </button>
          <button 
            onClick={() => { setView('menu'); setCartStep('cart'); setIsCartOpen(true); }}
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
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-4 border-b border-border pb-2">
        <button 
          onClick={() => setView('menu')}
          className={`text-sm font-bold pb-2 border-b-2 transition-colors ${view === 'menu' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Menu
        </button>
        <button 
          onClick={() => { setView('orders'); setSelectedStall(null); }}
          className={`text-sm font-bold pb-2 border-b-2 transition-colors flex items-center gap-2 ${view === 'orders' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          My Orders {globalOrders.length > 0 && <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px]">{globalOrders.length}</span>}
        </button>
      </div>

      {view === 'menu' && (
        <>
          {!selectedStall ? (
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {stalls.map(stall => (
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
            <div className="flex flex-col h-full overflow-hidden">
              <button 
                onClick={() => setSelectedStall(null)}
                className="text-sm text-primary font-medium mb-4 hover:underline self-start shrink-0"
              >
                ← Back to stalls
              </button>
              <div className="mb-4 shrink-0">
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
        </>
      )}

      {view === 'orders' && (
        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar h-full">
          {globalOrders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-10">
              <ClipboardList className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">No active orders</p>
              <button 
                onClick={() => setView('menu')}
                className="mt-4 text-primary font-medium text-sm hover:underline"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            globalOrders.map(order => (
              <div key={order.id} className="p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex justify-between items-start mb-3 border-b border-border/50 pb-3">
                  <div>
                    <h3 className="font-bold text-sm">{order.id}</h3>
                    <p className="text-xs text-muted-foreground">{order.time}</p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded font-bold flex items-center gap-1 ${
                    order.status === 'New' || order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {order.status === 'New' || order.status === 'Preparing' ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {order.status}
                  </div>
                </div>
                <div className="space-y-2 mb-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span><span className="text-muted-foreground">{item.qty}x</span> {item.name}</span>
                      <span className="font-medium">${item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border/50">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-muted-foreground uppercase">Total Paid</span>
                    <span className="text-xs font-bold text-primary">{order.paymentMethod === 'upi' ? 'UPI / Wallet' : order.paymentMethod === 'applepay' ? 'Apple/Google Pay' : 'Credit Card'}</span>
                  </div>
                  <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Cart / Payment Drawer */}
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
                <h3 className="font-bold text-lg">
                  {cartStep === 'cart' ? 'Your Order' : cartStep === 'payment' ? 'Payment Method' : cartStep === 'payment_details' ? 'Payment Details' : ''}
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="p-1 hover:bg-muted rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cartStep === 'success' ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/20"
                  >
                    <CheckCircle2 className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
                  <p className="text-sm text-muted-foreground">Your order has been sent to the kitchen. You can track it in the My Orders tab.</p>
                </div>
              ) : cartStep === 'payment_details' ? (
                <div className="flex-1 flex flex-col h-full">
                  <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                    <button 
                      onClick={() => setCartStep('payment')}
                      className="text-sm text-primary font-medium hover:underline mb-4 block"
                      disabled={isProcessing}
                    >
                      ← Back to Methods
                    </button>
                    
                    <div className="bg-muted/30 rounded-xl p-4 mb-6">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <h3 className="text-xl font-black">${total.toFixed(2)}</h3>
                      </div>
                    </div>

                    <form id="payment-form" onSubmit={processPayment} className="space-y-4">
                      {selectedPayment === 'card' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">Cardholder Name</label>
                            <input type="text" required placeholder="John Doe" className="w-full bg-input/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">Card Number</label>
                            <div className="relative">
                              <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                              <input type="text" required pattern="[0-9]{16}" maxLength="16" placeholder="0000 0000 0000 0000" className="w-full bg-input/50 border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-muted-foreground mb-1">Expiry (MM/YY)</label>
                              <input type="text" required placeholder="MM/YY" maxLength="5" className="w-full bg-input/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs font-medium text-muted-foreground mb-1">CVV</label>
                              <input type="password" required placeholder="123" maxLength="3" className="w-full bg-input/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {selectedPayment === 'upi' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1">Enter UPI ID</label>
                            <div className="relative">
                              <Wallet className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                              <input type="text" required placeholder="username@upi" className="w-full bg-input/50 border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">A payment request will be sent to your UPI app.</p>
                          </div>
                        </motion.div>
                      )}

                      {selectedPayment === 'applepay' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 flex flex-col items-center justify-center py-8">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Fingerprint className="w-8 h-8 text-primary" />
                          </div>
                          <div className="text-center">
                            <p className="font-medium mb-1">Authenticate to Pay</p>
                            <p className="text-xs text-muted-foreground">Double-click side button or use Touch ID</p>
                          </div>
                        </motion.div>
                      )}
                    </form>
                  </div>
                  
                  <div className="mt-auto p-4 border-t bg-card">
                    <button 
                      type="submit"
                      form="payment-form"
                      disabled={isProcessing}
                      className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Pay Securely ${total.toFixed(2)}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : cartStep === 'payment' ? (
                <div className="flex-1 flex flex-col h-full">
                  <div className="p-4 overflow-y-auto custom-scrollbar">
                    <button 
                      onClick={() => setCartStep('cart')}
                      className="text-sm text-primary font-medium hover:underline mb-4 block"
                    >
                      ← Back to Cart
                    </button>
                    
                    <div className="bg-muted/30 rounded-xl p-4 mb-6">
                      <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                      <h3 className="text-3xl font-black">${total.toFixed(2)}</h3>
                    </div>

                    <h4 className="font-bold mb-3">Select Method</h4>
                    <div className="space-y-3">
                      <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${selectedPayment === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'}`}>
                        <input type="radio" name="payment" className="hidden" checked={selectedPayment === 'card'} onChange={() => setSelectedPayment('card')} />
                        <CreditCard className={`w-5 h-5 mr-3 ${selectedPayment === 'card' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div className="flex-1">
                          <span className="block font-medium text-sm">Credit / Debit Card</span>
                        </div>
                        {selectedPayment === 'card' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                      </label>
                      
                      <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${selectedPayment === 'applepay' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'}`}>
                        <input type="radio" name="payment" className="hidden" checked={selectedPayment === 'applepay'} onChange={() => setSelectedPayment('applepay')} />
                        <Smartphone className={`w-5 h-5 mr-3 ${selectedPayment === 'applepay' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div className="flex-1">
                          <span className="block font-medium text-sm">Apple Pay / Google Pay</span>
                        </div>
                        {selectedPayment === 'applepay' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                      </label>
                      
                      <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${selectedPayment === 'upi' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'}`}>
                        <input type="radio" name="payment" className="hidden" checked={selectedPayment === 'upi'} onChange={() => setSelectedPayment('upi')} />
                        <Wallet className={`w-5 h-5 mr-3 ${selectedPayment === 'upi' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div className="flex-1">
                          <span className="block font-medium text-sm">UPI / Digital Wallet</span>
                        </div>
                        {selectedPayment === 'upi' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-auto p-4 border-t bg-card">
                    <button 
                      onClick={handleContinueToDetails}
                      className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      Continue
                    </button>
                  </div>
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
                        <span className="text-xl font-bold">${total.toFixed(2)}</span>
                      </div>
                      <button 
                        onClick={handleCheckout}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        Proceed to Payment
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
