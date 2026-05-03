import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

const RESTAURANTS = {
  1: "Campus Cafe",
  2: "Burger Hub",
  3: "Coffee Corner",
};

const STEPS = ["Placed", "Accepted", "Preparing", "Almost Ready", "Ready"];

function TrackOrder() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // seconds

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}/track`);
      setOrder(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Poll backend every 5 seconds
  useEffect(() => {
    fetchOrder();
    const timer = setInterval(fetchOrder, 5000);
    return () => clearInterval(timer);
  }, [id]);

  // Sync timeLeft with backend predicted ready_time
  useEffect(() => {
    if (order && order.ready_time && order.status !== "Ready") {
      const now = new Date();
      const [hours, minutes] = order.ready_time.split(':');
      const target = new Date();
      target.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      
      const diffInSeconds = Math.floor((target - now) / 1000);
      setTimeLeft(diffInSeconds > 0 ? diffInSeconds : 0);
    } else if (order?.status === "Ready") {
      setTimeLeft(0);
    }
  }, [order]);

  // Fast 1-second countdown for UI smoothness
  useEffect(() => {
    if (timeLeft > 0 && order?.status !== "Ready") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, order?.status]);

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentStepIdx = STEPS.indexOf(order.status);
  const isReady = order.status === "Ready";
  const pickupCode = 1000 + Number(id);
  
  // Format MM:SS
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  
  // Smart Alert Logic (Under 3 mins)
  const isUrgent = timeLeft > 0 && timeLeft <= 180;
  const ringColor = isReady ? "stroke-lime-500" : isUrgent ? "stroke-orange-500" : "stroke-lime-500";
  const glowColor = isUrgent ? "bg-orange-500" : "bg-lime-500";

  // Circular Ring Math
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const maxTime = 900; // 15 mins max for visual scaling
  const progressPercent = Math.min(timeLeft / maxTime, 1);
  const strokeDashoffset = isReady ? 0 : circumference - progressPercent * circumference;

  let itemsParsed = [];
  let isPlainString = false;
  try {
    itemsParsed = order.items ? JSON.parse(order.items) : [];
  } catch(e) {
    isPlainString = true;
    itemsParsed = order.items;
  }

  return (
    <div className="max-w-md md:max-w-2xl mx-auto min-h-screen bg-zinc-50 pb-10">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-50/90 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => navigate("/home")} className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Track Order</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      <div className="px-5 pt-6 space-y-6">

        {/* Pickup Verification Code (Only when Ready) */}
        {isReady && (
          <div className="bg-zinc-900 text-white rounded-3xl p-6 shadow-xl border border-lime-500/50 text-center relative overflow-hidden animate-[pulse_2s_ease-in-out_infinite]">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-lime-500 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-lime-400 rounded-full opacity-20 blur-2xl"></div>
            
            <p className="text-sm text-lime-400 font-bold uppercase tracking-wider relative z-10">
              Skip the line!
            </p>
            <h2 className="text-6xl font-black tracking-[12px] mt-4 text-white relative z-10 ml-3">
              {pickupCode}
            </h2>
            <p className="text-sm text-white/80 mt-4 relative z-10 font-medium">
              Show this code at the counter to collect your food.
            </p>
          </div>
        )}

        {/* Hero Tracking Card */}
        <div className="bg-zinc-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Background Glow */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 ${glowColor} rounded-full opacity-10 blur-3xl transition-colors duration-1000`}></div>

          <div className="flex flex-col items-center relative z-10">
            {/* Circular Ring */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Background track */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r={radius} className="stroke-white/10" strokeWidth="8" fill="none" />
                <circle 
                  cx="80" 
                  cy="80" 
                  r={radius} 
                  className={`${ringColor} transition-all duration-1000 ease-linear`} 
                  strokeWidth="8" 
                  fill="none" 
                  strokeLinecap="round"
                  style={{ strokeDasharray: circumference, strokeDashoffset: strokeDashoffset }}
                />
              </svg>
              
              {/* Center Content */}
              <div className="text-center">
                {isReady ? (
                  <div className="text-lime-500 flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold text-lg">Done</span>
                  </div>
                ) : (
                  <>
                    <p className="text-5xl font-black text-white tracking-tight">{isUrgent ? Math.ceil(timeLeft / 60) : mins}</p>
                    <p className="text-xs text-white/60 font-medium uppercase tracking-widest mt-1">
                      {isUrgent ? "Mins Left" : "Mins Left"}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Smart Alerts */}
            {isUrgent && !isReady && (
              <div className="mt-4 bg-orange-500/20 border border-orange-500/50 text-orange-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide animate-pulse">
                Almost Ready
              </div>
            )}

            {/* Status Text */}
            <div className="text-center mt-6">
              <h3 className="text-2xl font-bold text-white">
                {isReady ? "Food is ready!" : order.status + "..."}
              </h3>
              <p className="text-white/60 text-sm mt-1.5 font-medium">
                {isReady 
                  ? "Walk up to the counter to collect it." 
                  : `Hang tight! Ready by ${order.ready_time}`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Order Details Receipt */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Order ID</p>
              <p className="font-black text-lg text-zinc-900">#{order.order_id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">From</p>
              <p className="font-bold text-zinc-900">{RESTAURANTS[order.restaurant_id] || "Restaurant"}</p>
            </div>
          </div>
          
          <div className="py-4 space-y-3">
            {isPlainString ? (
              <p className="text-sm font-medium text-zinc-800">{itemsParsed}</p>
            ) : itemsParsed.length > 0 ? (
              itemsParsed.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">{item.qty}x</span>
                    <span className="font-medium text-zinc-800">{item.name}</span>
                  </div>
                  {item.price && <span className="font-bold text-zinc-900">₹{item.price * item.qty}</span>}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No items details available.</p>
            )}
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="font-bold text-zinc-900">Total Paid</span>
            <span className="text-xl font-black text-lime-600">₹{order.total}</span>
          </div>
        </div>

        {/* Vertical Stepper Timeline */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg text-zinc-900 mb-5">Live Timeline</h3>
          <div className="space-y-6">
            {STEPS.map((step, index) => {
              const isCompleted = index < currentStepIdx;
              const isActive = index === currentStepIdx;
              const isLast = index === STEPS.length - 1;

              return (
                <div key={index} className="relative flex gap-4">
                  {/* Line connecting steps */}
                  {!isLast && (
                    <div className={`absolute top-6 left-3 bottom-[-24px] w-0.5 ${isCompleted ? 'bg-lime-500' : 'bg-gray-200'}`}></div>
                  )}
                  
                  {/* Node */}
                  <div className={`relative z-10 w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center border-2 ${
                    isCompleted 
                      ? 'bg-lime-500 border-lime-500' 
                      : isActive 
                        ? 'bg-white border-lime-500 shadow-[0_0_10px_rgba(132,204,22,0.4)]' 
                        : 'bg-white border-gray-300'
                  }`}>
                    {isCompleted && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {isActive && <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></div>}
                  </div>
                  
                  {/* Text */}
                  <div className="-mt-1">
                    <p className={`font-bold ${isActive ? 'text-zinc-900 text-lg' : isCompleted ? 'text-zinc-700' : 'text-gray-400'}`}>
                      {step}
                    </p>
                    {isActive && <p className="text-xs text-lime-600 font-medium mt-0.5">Currently happening...</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default TrackOrder;