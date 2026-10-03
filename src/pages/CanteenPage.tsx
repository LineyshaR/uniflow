import React, { useState } from 'react';
import { 
  UtensilsCrossed, Search, ShoppingBag, Clock, 
  Flame, Plus, Minus, Trash2, Wallet, 
  Sparkles, AlertCircle, ChefHat, Check, CheckCircle2,
  Phone, ArrowRight
} from 'lucide-react';
import { useCanteenCart } from '../context/CanteenCartContext';
import { useAuth } from '../context/AuthContext';
import { CANTEEN_ITEMS } from '../data/mockData';

export const CanteenPage: React.FC = () => {
  const { 
    cart, cartCount, cartTotal, addToCart, 
    updateQuantity, clearCart, 
    checkout, activeOrders, updateOrderStatus 
  } = useCanteenCart();
  const { user } = useAuth();

  const isChef = user?.role === 'canteen_staff';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  // For Chef, default to orders tab
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>(isChef ? 'orders' : 'menu');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'upi'>('wallet');
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccessToken, setOrderSuccessToken] = useState<string | null>(null);
  const [chefOrderFilter, setChefOrderFilter] = useState<'All' | 'Received' | 'Preparing' | 'Ready' | 'Picked Up'>('All');

  const displayedOrders = isChef
    ? activeOrders.filter((o) => {
        const matchesSearch = 
          o.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.items.some(i => i.item.name.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesFilter = chefOrderFilter === 'All' || o.status === chefOrderFilter;
        return matchesSearch && matchesFilter;
      })
    : activeOrders.filter(
        (o) => o.studentId === user?.id || o.studentName.toLowerCase().includes(user?.name.toLowerCase() || '')
      );

  const categories = ['All', 'Breakfast', 'Meals', 'Snacks', 'Beverages', 'Specials'];

  const filteredItems = CANTEEN_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesDiet = dietaryFilter === 'all' || 
      (dietaryFilter === 'veg' && item.isVeg) || 
      (dietaryFilter === 'non-veg' && !item.isVeg);
    return matchesSearch && matchesCategory && matchesDiet;
  });

  const handleCheckout = () => {
    setOrderError(null);
    const result = checkout(paymentMethod);
    if (!result.success) {
      setOrderError(result.error || 'Failed to place order.');
    } else if (result.order) {
      setOrderSuccessToken(result.order.tokenNumber);
      setActiveTab('orders');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] text-xs font-semibold font-mono border border-[#047857]/20">
              CKPCET CAMPUS CAFETERIA
            </span>
            <span className="text-xs text-[#526059] dark:text-[#94A3B8]">• Food Court Counters 1 & 2 • Open until 10:00 PM</span>
          </div>
          <h1 className="font-apple text-2xl font-bold text-[#141B18] dark:text-[#F3F7F5] mt-1 flex items-center gap-2">
            {isChef ? (
              <ChefHat className="w-6 h-6 text-[#047857] dark:text-[#34D399]" />
            ) : (
              <UtensilsCrossed className="w-6 h-6 text-[#047857] dark:text-[#34D399]" />
            )}
            <span>
              {isChef ? 'Kitchen Orders Placed Master Console' : 'Food Court & Cashless Canteen'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#526059] dark:text-[#94A3B8]">
            {isChef
              ? 'Real-time kitchen ticket stream • Review orders placed by students, update cook status & notify pickup'
              : 'Order meals and beverages with cashless student wallet • Live digital token tracking'}
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#F6F8F6] dark:bg-[#0B1B14] rounded-2xl border border-[#047857]/15 self-start sm:self-auto">
          {!isChef && (
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'menu'
                  ? 'bg-white dark:bg-[#0D3B2A] text-[#047857] dark:text-[#34D399] shadow-2xs font-bold'
                  : 'text-[#526059] dark:text-[#94A3B8] hover:text-[#047857]'
              }`}
            >
              Food Menu
            </button>
          )}

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all relative ${
              activeTab === 'orders'
                ? 'bg-white dark:bg-[#0D3B2A] text-[#047857] dark:text-[#34D399] shadow-2xs font-bold'
                : 'text-[#526059] dark:text-[#94A3B8] hover:text-[#047857]'
            }`}
          >
            <span>
              {isChef ? `Orders Placed (${activeOrders.length})` : `My Live Tokens (${displayedOrders.length})`}
            </span>
            {displayedOrders.some(o => o.status === 'Ready') && (
              <span className="w-2 h-2 rounded-full bg-[#10B981] absolute top-1.5 right-1.5 animate-ping" />
            )}
          </button>

          {isChef && (
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'menu'
                  ? 'bg-white dark:bg-[#0D3B2A] text-[#047857] dark:text-[#34D399] shadow-2xs font-bold'
                  : 'text-[#526059] dark:text-[#94A3B8] hover:text-[#047857]'
              }`}
            >
              Menu Items ({CANTEEN_ITEMS.length})
            </button>
          )}
        </div>
      </div>

      {activeTab === 'menu' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Menu & Filters */}
          <div className={`${isChef ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-4`}>
            {/* Search & Dietary Filters */}
            <div className="p-3 bg-white dark:bg-[#0B1B14] rounded-2xl border border-[#047857]/20 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#526059] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search crispy dosa, thalis, iced coffee, noodles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.04] dark:border-white/[0.06] text-xs text-[#141B18] dark:text-[#F3F7F5] placeholder:text-[#526059] focus:outline-none focus:ring-2 focus:ring-[#047857]"
                />
              </div>

              {/* Diet Switcher */}
              <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => setDietaryFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    dietaryFilter === 'all'
                      ? 'bg-[#047857] text-white'
                      : 'text-[#526059] hover:bg-[#F6F8F6]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setDietaryFilter('veg')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    dietaryFilter === 'veg'
                      ? 'bg-emerald-600 text-white'
                      : 'text-[#526059] hover:bg-[#F6F8F6]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Veg
                </button>
                <button
                  onClick={() => setDietaryFilter('non-veg')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    dietaryFilter === 'non-veg'
                      ? 'bg-rose-600 text-white'
                      : 'text-[#526059] hover:bg-[#F6F8F6]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Non-Veg
                </button>
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#047857] text-white shadow-2xs'
                      : 'bg-white dark:bg-[#0B1B14] text-[#526059] dark:text-[#94A3B8] border border-[#047857]/15 hover:border-[#047857]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            <div className={`grid grid-cols-1 ${isChef ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
              {filteredItems.map((item) => {
                const inCart = cart.find((i) => i.item.id === item.id);

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs hover:border-[#047857] transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image & Badges */}
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <span
                            className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center bg-white ${
                              item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                              }`}
                            />
                          </span>
                        </div>

                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-xs font-semibold flex items-center gap-1 backdrop-blur-xs">
                          ⭐ {item.rating}
                        </div>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-apple text-sm font-bold text-[#141B18] dark:text-[#F3F7F5] line-clamp-1">
                          {item.name}
                        </h3>
                        <span className="font-mono text-sm font-bold text-[#047857] dark:text-white shrink-0">
                          ₹{item.price}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#526059] dark:text-[#94A3B8] mt-1 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-[#526059] dark:text-[#94A3B8] mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#047857] dark:text-[#34D399]" /> ~{item.prepTimeMinutes} mins
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-[#D97706]" /> {item.calories} kcal
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {!isChef && (
                      <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
                        {inCart ? (
                          <div className="flex items-center justify-between bg-[#F6F8F6] dark:bg-[#0E281E] p-1 rounded-full border border-black/[0.04]">
                            <button
                              onClick={() => updateQuantity(item.id, inCart.quantity - 1)}
                              className="w-7 h-7 rounded-full bg-white dark:bg-[#0B1B14] text-[#141B18] dark:text-white flex items-center justify-center font-bold shadow-2xs hover:bg-[#EBEBEF]"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold text-[#047857] dark:text-[#34D399] font-mono">
                              {inCart.quantity} in order
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              className="w-7 h-7 rounded-full bg-[#047857] text-white flex items-center justify-center font-bold shadow-2xs hover:bg-[#065F46]"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="w-full py-2 rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add to Order
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 1 Col: Live Cart & Checkout Drawer (Only for non-chef) */}
          {!isChef && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#047857] dark:text-[#34D399]" />
                    <span className="font-apple text-sm font-bold text-[#141B18] dark:text-[#F3F7F5]">
                      Current Order ({cartCount})
                    </span>
                  </div>
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-xs text-rose-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>

                {/* Cart items list */}
                {cart.length > 0 ? (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {cart.map(({ item, quantity }) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5] truncate">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-[#526059] dark:text-[#94A3B8]">
                            ₹{item.price} each • ₹{item.price * quantity}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => updateQuantity(item.id, quantity - 1)}
                            className="w-6 h-6 rounded-full bg-white dark:bg-[#0B1B14] text-[#141B18] dark:text-white flex items-center justify-center text-xs font-bold border border-black/[0.08]"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-xs font-bold font-mono text-[#047857] dark:text-[#34D399]">{quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-6 h-6 rounded-full bg-[#047857] text-white flex items-center justify-center text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-10 h-10 mx-auto text-[#526059] mb-2 opacity-40" />
                    <p className="font-apple text-xs font-semibold text-[#141B18] dark:text-[#F3F7F5]">
                      Your cafeteria cart is empty
                    </p>
                    <p className="text-[11px] text-[#526059] dark:text-[#94A3B8] mt-0.5">
                      Select meals to generate your digital pickup token!
                    </p>
                  </div>
                )}

                {/* Price Calculation */}
                {cart.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-black/[0.06] dark:border-white/[0.08] text-xs">
                    <div className="flex justify-between text-[#526059] dark:text-[#94A3B8]">
                      <span>Subtotal</span>
                      <span className="font-mono">₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-[#526059] dark:text-[#94A3B8]">
                      <span>Student Campus Subsidy</span>
                      <span className="text-[#047857] dark:text-[#34D399] font-semibold">Included</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#141B18] dark:text-[#F3F7F5] pt-1 border-t border-black/[0.06] dark:border-white/[0.08]">
                      <span>Total Amount</span>
                      <span className="font-mono text-[#047857] dark:text-[#34D399]">₹{cartTotal}</span>
                    </div>
                  </div>
                )}

                {/* Payment selector */}
                {cart.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="font-apple text-[10px] font-bold uppercase tracking-wider text-[#526059] dark:text-[#94A3B8] block">
                      Payment Channel
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPaymentMethod('wallet')}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                          paymentMethod === 'wallet'
                            ? 'border-[#047857] bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] font-semibold'
                            : 'border-black/[0.08] dark:border-white/[0.1] text-[#526059]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Wallet className="w-3.5 h-3.5 text-[#047857]" />
                          <span>Smart Card</span>
                        </div>
                        <div className="text-[10px] text-[#526059] dark:text-[#94A3B8] font-normal mt-0.5 font-mono">
                          Bal: ₹{user?.walletBalance}
                        </div>
                      </button>

                      <button
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                          paymentMethod === 'upi'
                            ? 'border-[#047857] bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] font-semibold'
                            : 'border-black/[0.08] dark:border-white/[0.1] text-[#526059]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>UPI / QR</span>
                        </div>
                        <div className="text-[10px] text-[#526059] dark:text-[#94A3B8] font-normal mt-0.5">
                          Instant Scan
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {orderError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{orderError}</span>
                  </div>
                )}

                {cart.length > 0 && (
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 rounded-full bg-[#047857] hover:bg-[#065F46] text-white text-xs sm:text-sm font-semibold shadow-md transition-all"
                  >
                    Pay ₹{cartTotal} & Generate Token
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Orders & Tokens Tab */
        <div className="space-y-4">
          {orderSuccessToken && !isChef && (
            <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-apple text-base font-bold">Order Placed Successfully!</h3>
                  <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80">
                    Your cafeteria token is <span className="font-mono font-bold text-sm">#{orderSuccessToken}</span>. Show this at Counter 1.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Chef Kitchen Filter Bar */}
          {isChef && (
            <div className="p-4 bg-white dark:bg-[#0B1B14] rounded-2xl border border-[#047857]/20 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <span className="text-xs font-semibold text-[#526059] shrink-0">Filter Status:</span>
                {(['All', 'Received', 'Preparing', 'Ready', 'Picked Up'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setChefOrderFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      chefOrderFilter === st
                        ? 'bg-[#047857] text-white shadow-xs'
                        : 'bg-[#F6F8F6] dark:bg-[#0E281E] text-[#526059] dark:text-[#94A3B8] hover:bg-[#E2E8E4]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#526059] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter token or student name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.04] text-xs text-[#141B18] dark:text-[#F3F7F5] focus:outline-none focus:ring-2 focus:ring-[#047857]"
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            {displayedOrders.length > 0 ? (
              displayedOrders.map((order) => {
                const isReceived = order.status === 'Received';
                const isPreparing = order.status === 'Preparing';
                const isReady = order.status === 'Ready';
                const isPickedUp = order.status === 'Picked Up';

                return (
                  <div
                    key={order.id}
                    className="p-6 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
                      <div className="flex items-center gap-3">
                        <div className="px-3.5 py-2 rounded-2xl bg-[#047857] text-white font-mono font-bold text-lg tracking-wider shadow-2xs">
                          #{order.tokenNumber}
                        </div>
                        <div>
                          <h4 className="font-apple text-sm font-bold text-[#141B18] dark:text-[#F3F7F5]">
                            Token #{order.tokenNumber} • {order.studentName}
                          </h4>
                          <p className="text-xs text-[#526059] dark:text-[#94A3B8]">
                            Placed at {order.orderTime} • {order.counterNumber}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto ${
                            isReady
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 animate-pulse border border-emerald-200'
                              : isPreparing
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200'
                              : isPickedUp
                              ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                              : 'bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399]'
                          }`}
                        >
                          ● {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress Stepper */}
                    <div className="py-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#526059] dark:text-[#94A3B8] mb-2">
                        <span className="text-[#047857] dark:text-[#34D399] font-bold">1. Placed</span>
                        <span className={order.status !== 'Received' ? 'text-[#047857] dark:text-[#34D399] font-bold' : ''}>2. Kitchen Preparing</span>
                        <span className={isReady || isPickedUp ? 'text-emerald-600 font-bold' : ''}>3. Ready at Counter</span>
                        <span className={isPickedUp ? 'text-[#047857] font-bold' : ''}>4. Collected</span>
                      </div>
                      <div className="w-full bg-[#F6F8F6] dark:bg-[#0E281E] h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isPickedUp
                              ? 'w-full bg-[#047857]'
                              : isReady
                              ? 'w-full bg-emerald-500'
                              : isPreparing
                              ? 'w-2/3 bg-[#D97706]'
                              : 'w-1/4 bg-[#94A3B8]'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Items in order */}
                    <div className="p-3 rounded-2xl bg-[#F6F8F6] dark:bg-[#0E281E] text-xs space-y-1 border border-black/[0.04]">
                      {order.items.map((i) => (
                        <div key={i.item.id} className="flex justify-between text-[#141B18] dark:text-[#F3F7F5]">
                          <span>{i.item.name} × {i.quantity}</span>
                          <span className="font-mono font-bold">₹{i.item.price * i.quantity}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold text-[#141B18] dark:text-[#F3F7F5] pt-1 border-t border-black/[0.06] dark:border-white/[0.08]">
                        <span>Paid Total:</span>
                        <span className="font-mono text-[#047857] dark:text-white">₹{order.totalAmount}</span>
                      </div>
                    </div>

                    {/* Chef Controls to directly update placed order */}
                    {isChef && (
                      <div className="pt-2 flex items-center justify-end gap-2 flex-wrap">
                        {isReceived && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Preparing')}
                            className="px-3.5 py-1.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold transition-all shadow-xs"
                          >
                            Start Preparing
                          </button>
                        )}

                        {isPreparing && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Ready')}
                            className="px-3.5 py-1.5 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Ready at Counter</span>
                          </button>
                        )}

                        {isReady && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Picked Up')}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Hand Over / Picked Up</span>
                          </button>
                        )}

                        {isPickedUp && (
                          <span className="text-xs text-[#526059] font-medium">
                            Completed & Picked Up
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center p-8 bg-white dark:bg-[#0B1B14] rounded-3xl border border-[#047857]/20">
                <UtensilsCrossed className="w-10 h-10 mx-auto text-[#526059] opacity-40 mb-2" />
                <h4 className="font-apple text-sm font-bold text-[#141B18] dark:text-white">
                  No orders found
                </h4>
                <p className="text-xs text-[#526059] dark:text-[#94A3B8] mt-1">
                  {isChef 
                    ? 'Orders placed by students will automatically stream in here.' 
                    : 'Choose fresh meals from the Food Menu to generate your digital pickup token!'}
                </p>
                {!isChef && (
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="mt-3 px-4 py-2 rounded-full bg-[#047857] text-white text-xs font-bold"
                  >
                    Explore Food Menu
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
