import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function GlobalCartBar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Calculate totals
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const fee = cart.length > 0 ? 9 : 0;
  const total = subtotal + fee;

  // Only show the global cart on the Home or Restaurant pages
  const isShowRoute = location.pathname.startsWith("/home") || location.pathname.startsWith("/restaurant");

  // Should we show the bar?
  const showBar = cart.length > 0 && isShowRoute;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 pointer-events-none transition-transform duration-300 ease-in-out ${
        showBar ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-md md:max-w-3xl xl:max-w-7xl mx-auto px-4 pb-4 md:pb-6">
        <button
          onClick={() => navigate("/cart")}
          className="pointer-events-auto w-full bg-zinc-900/95 backdrop-blur-lg border border-white/10 text-white rounded-2xl p-4 flex justify-between items-center shadow-2xl hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(132,204,22,0.25)] transition-all duration-300 ease-out active:scale-[0.98]"
        >
          <div className="flex flex-col text-left">
            <span className="font-bold text-lg tracking-tight">
              {totalItems} ITEM{totalItems > 1 ? 'S' : ''}
            </span>
            <span className="text-sm text-zinc-300 font-medium">
              ₹{total} plus platform fee
            </span>
          </div>
          
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            View Cart
            <div className="bg-white/10 rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
