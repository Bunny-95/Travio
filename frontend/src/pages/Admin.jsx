import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Admin() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const prevOrderCount = useRef(0);

  const STATUS_COLORS = {
    Placed: "bg-gray-100 text-gray-700 border-gray-200",
    Accepted: "bg-blue-50 text-blue-700 border-blue-200",
    Preparing: "bg-yellow-50 text-yellow-700 border-yellow-200",
    "Almost Ready": "bg-orange-50 text-orange-700 border-orange-200",
    Ready: "bg-lime-100 text-lime-800 border-lime-300",
    Collected: "bg-zinc-900 text-white border-zinc-900"
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.log("Audio not supported or blocked");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/");
      const fetchedOrders = res.data.reverse();
      
      // Check for new orders to trigger sound
      if (prevOrderCount.current > 0 && fetchedOrders.length > prevOrderCount.current) {
        playNotificationSound();
      }
      prevOrderCount.current = fetchedOrders.length;
      
      setOrders(fetchedOrders);
      
      // Update selected order data safely using functional update to avoid closure traps
      setSelectedOrder(prev => {
        if (!prev) return null; // If closed, keep it closed!
        const updatedSelected = fetchedOrders.find(o => o.id === prev.id);
        return updatedSelected ? updatedSelected : prev;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status?status=${status}`);
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteOrder = async (id) => {
    setIsDeleting(true);
    try {
      await api.delete(`/orders/${id}`);
      setShowDeleteConfirm(null);
      if (selectedOrder?.id === id) setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const timer = setInterval(fetchOrders, 4000);
    return () => clearInterval(timer);
  }, [selectedOrder]); // Re-bind closure to catch selectedOrder updates

  // Analytics Math
  const pending = orders.filter(o => !["Ready", "Collected"].includes(o.status)).length;
  const preparing = orders.filter(o => ["Accepted", "Preparing", "Almost Ready"].includes(o.status)).length;
  const ready = orders.filter(o => o.status === "Ready").length;
  const revenue = orders.filter(o => o.status === "Collected" || o.status === "Ready").reduce((sum, o) => sum + o.total, 0);

  // Filtering & Search
  const filteredOrders = orders.filter((o) => {
    const code = (1000 + o.id).toString();
    const matchSearch = code.includes(search) || o.id.toString().includes(search);
    const matchFilter = filter === "All" || 
                        (filter === "Pending" && !["Ready", "Collected"].includes(o.status)) ||
                        o.status === filter;
    return matchSearch && matchFilter;
  }).sort((a, b) => {
    // Priority: Ready -> Preparing/Almost Ready -> Accepted -> Placed -> Collected
    const p = {"Ready": 1, "Almost Ready": 2, "Preparing": 3, "Accepted": 4, "Placed": 5, "Collected": 6};
    return (p[a.status] || 99) - (p[b.status] || 99);
  });

  const parseItems = (itemsString) => {
    try {
      return itemsString ? JSON.parse(itemsString) : [];
    } catch (e) {
      return itemsString; // Fallback to plain string for old DB records
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] font-sans pb-20">

      {/* Header */}
      <div className="bg-zinc-900 text-white px-6 md:px-10 py-5 flex flex-col md:flex-row justify-between md:items-center shadow-lg gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Kitchen Dashboard</h1>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1.5 text-sm font-medium text-white/80 bg-white/10 px-3 py-1 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime-500"></span>
              </span>
              System Live
            </span>
            <span className="text-xs text-white/50">Auto-syncing every 4s</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={logout} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2.5 rounded-xl font-bold transition-all">
            Logout
          </button>
        </div>
      </div>

      <div className="px-6 md:px-10 mt-8">

        {/* Analytics Top Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Pending</p>
            <div className="flex items-end gap-2 mt-2">
              <h2 className="text-4xl font-black text-zinc-900">{pending}</h2>
              {pending > 0 && <span className="text-lime-500 text-lg">↑</span>}
            </div>
          </div>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Preparing</p>
            <h2 className="text-4xl font-black text-zinc-900 mt-2">{preparing}</h2>
          </div>
          <div className="bg-gradient-to-br from-lime-400 to-lime-500 text-zinc-900 rounded-3xl p-5 shadow-sm shadow-lime-500/20 hover:scale-[1.02] transition-transform">
            <p className="text-zinc-800 font-bold text-sm uppercase tracking-wider">Ready for Pickup</p>
            <h2 className="text-4xl font-black mt-2">{ready}</h2>
          </div>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Orders</p>
            <h2 className="text-4xl font-black text-zinc-900 mt-2">{orders.length}</h2>
          </div>
          <div className="bg-zinc-900 text-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow md:col-span-1 col-span-2">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Revenue (Today)</p>
            <h2 className="text-4xl font-black mt-2 text-lime-400">₹{revenue}</h2>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 scrollbar-hide">
            {["All", "Pending", "Preparing", "Ready", "Collected"].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${filter === f ? 'bg-zinc-900 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="Search ID or Code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white rounded-xl pl-10 pr-4 py-3 outline-none border border-gray-200 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all font-medium"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOrders.map(order => {
            const code = 1000 + order.id;
            const isReady = order.status === "Ready";
            const isUrgent = order.status === "Almost Ready" || order.status === "Preparing";
            const items = parseItems(order.items);
            
            return (
              <div 
                key={order.id} 
                onClick={() => setSelectedOrder(order)}
                className={`bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden group ${isReady ? 'ring-2 ring-lime-500 ring-offset-2' : ''}`}
              >
                {isReady && <div className="absolute top-0 left-0 w-full h-1.5 bg-lime-500"></div>}
                
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
                    <h3 className="text-2xl font-black text-zinc-900">#{order.id}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${STATUS_COLORS[order.status] || STATUS_COLORS.Placed}`}>
                    {order.status}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600 line-clamp-2 min-h-[40px]">
                    {Array.isArray(items) ? items.map(i => `${i.qty}x ${i.name}`).join(", ") : items}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center group-hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Code</p>
                    <p className={`text-2xl font-black tracking-[4px] ${isReady ? 'text-lime-600 animate-pulse' : 'text-zinc-900'}`}>{code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Target</p>
                    <p className={`text-sm font-bold ${isUrgent ? 'text-orange-500' : 'text-zinc-700'}`}>{order.estimated_ready_time}</p>
                  </div>
                </div>

                {/* Quick Actions (stopPropagation to prevent opening panel) */}
                {order.status !== "Collected" && (
                  <div className="mt-4 flex gap-2" onClick={e => e.stopPropagation()}>
                    {order.status === "Placed" && <button onClick={() => updateStatus(order.id, "Accepted")} className="w-full bg-blue-50 text-blue-600 font-bold py-2 rounded-xl hover:bg-blue-100">Accept</button>}
                    {order.status === "Accepted" && <button onClick={() => updateStatus(order.id, "Preparing")} className="w-full bg-yellow-50 text-yellow-600 font-bold py-2 rounded-xl hover:bg-yellow-100">Prepare</button>}
                    {(order.status === "Preparing" || order.status === "Almost Ready") && <button onClick={() => updateStatus(order.id, "Ready")} className="w-full bg-lime-500 text-zinc-900 font-bold py-2 rounded-xl hover:bg-lime-600 shadow-md shadow-lime-500/20">Mark Ready</button>}
                    {order.status === "Ready" && <button onClick={() => updateStatus(order.id, "Collected")} className="w-full bg-zinc-900 text-white font-bold py-2 rounded-xl hover:bg-zinc-800 shadow-md">Handed Over</button>}
                  </div>
                )}
              </div>
            );
          })}
          
          {filteredOrders.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-xl font-bold">No orders found.</p>
              <p className="text-sm">Try changing your filters or search.</p>
            </div>
          )}
        </div>

      </div>

      {/* Side Panel Modal for Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl p-6 md:p-8 animate-[slideInRight_0.3s_ease-out]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-zinc-900">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Quick Summary Card */}
            <div className="bg-zinc-900 rounded-3xl p-6 text-white mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              <p className="text-sm text-white/60 font-medium uppercase tracking-wider mb-1">Order #{selectedOrder.id}</p>
              <h1 className="text-5xl font-black tracking-[4px] text-lime-400 mb-4">{1000 + selectedOrder.id}</h1>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${STATUS_COLORS[selectedOrder.status] || "bg-white text-zinc-900"}`}>
                  {selectedOrder.status}
                </span>
                <span className="text-sm text-white/60 font-medium ml-auto">Target: {selectedOrder.estimated_ready_time}</span>
              </div>
            </div>

            {/* Items Breakdown */}
            <h3 className="font-bold text-lg text-zinc-900 mb-3">Item Breakdown</h3>
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-6 space-y-3">
              {Array.isArray(parseItems(selectedOrder.items)) ? (
                parseItems(selectedOrder.items).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <span className="bg-zinc-200 text-zinc-800 px-2.5 py-1 rounded-lg text-xs font-black">{item.qty}x</span>
                      <span className="font-bold text-zinc-900">{item.name}</span>
                    </div>
                    {item.price && <span className="font-bold text-zinc-600">₹{item.price * item.qty}</span>}
                  </div>
                ))
              ) : (
                <p className="font-medium text-zinc-800">{parseItems(selectedOrder.items)}</p>
              )}
              <div className="pt-3 flex justify-between items-center border-t border-gray-200 mt-2">
                <span className="font-bold text-gray-500 uppercase tracking-widest text-xs">Total Paid</span>
                <span className="text-xl font-black text-lime-600">₹{selectedOrder.total}</span>
              </div>
            </div>

            {/* Status Actions */}
            <h3 className="font-bold text-lg text-zinc-900 mb-3">Update Status</h3>
            <div className="grid grid-cols-2 gap-3 mb-8">
              <button onClick={() => updateStatus(selectedOrder.id, "Accepted")} disabled={selectedOrder.status !== "Placed"} className="bg-blue-50 text-blue-700 disabled:opacity-50 disabled:bg-gray-50 disabled:text-gray-400 font-bold py-3 rounded-xl transition-all border border-blue-200 disabled:border-transparent">Accept</button>
              <button onClick={() => updateStatus(selectedOrder.id, "Preparing")} disabled={selectedOrder.status !== "Accepted"} className="bg-yellow-50 text-yellow-700 disabled:opacity-50 disabled:bg-gray-50 disabled:text-gray-400 font-bold py-3 rounded-xl transition-all border border-yellow-200 disabled:border-transparent">Prepare</button>
              <button onClick={() => updateStatus(selectedOrder.id, "Ready")} disabled={selectedOrder.status === "Ready" || selectedOrder.status === "Collected" || selectedOrder.status === "Placed"} className="bg-lime-500 text-zinc-900 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 font-bold py-3 rounded-xl transition-all shadow-md shadow-lime-500/20 disabled:shadow-none col-span-2">Mark as Ready</button>
              <button onClick={() => updateStatus(selectedOrder.id, "Collected")} disabled={selectedOrder.status !== "Ready"} className="bg-zinc-900 text-white disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 font-bold py-3 rounded-xl transition-all col-span-2">Handed Over (Collected)</button>
            </div>

            {/* Delete/Archive Feature */}
            {selectedOrder.status === "Collected" && (
              <div className="border-t border-red-100 pt-6">
                <button 
                  onClick={() => setShowDeleteConfirm(selectedOrder.id)}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 font-bold py-3 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Delete Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center transform transition-transform animate-[popIn_0.2s_ease-out]">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Delete Order?</h3>
            <p className="text-gray-500 mb-6 font-medium">This action cannot be undone. It will be removed from your dashboard stats permanently.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={() => deleteOrder(showDeleteConfirm)}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 active:scale-95 transition-all shadow-md shadow-red-500/20 disabled:opacity-50 flex justify-center items-center"
                disabled={isDeleting}
              >
                {isDeleting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
}

export default Admin;