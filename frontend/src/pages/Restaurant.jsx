import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";

function Restaurant() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    cart,
    addToCart,
    increaseQty,
    decreaseQty,
  } = useCart();

  const [active, setActive] = useState("Popular");
  const [selectedItem, setSelectedItem] = useState(null);

  const restaurants = {
    1: {
      name: "Campus Cafe",
      subtitle: "Snacks • Drinks • Fast Pickup",
      hero:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
    },
    2: {
      name: "Burger Hub",
      subtitle: "Burgers • Fries • Combo Meals",
      hero:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
    },
    3: {
      name: "Coffee Corner",
      subtitle: "Coffee • Bakery • Fresh Bakes",
      hero:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
    },
  };

  const data = restaurants[id];

  const menu = [
    {
      name: "Chicken Burger",
      price: 149,
      eta: "8 min",
      type: "Burgers",
      popular: true,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Veg Sandwich",
      price: 99,
      eta: "5 min",
      type: "Snacks",
      popular: true,
      image:
        "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Cold Coffee",
      price: 79,
      eta: "3 min",
      type: "Drinks",
      popular: true,
      image:
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "French Fries",
      price: 89,
      eta: "4 min",
      type: "Snacks",
      popular: false,
      image:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Lemon Soda",
      price: 59,
      eta: "2 min",
      type: "Drinks",
      popular: false,
      image:
        "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const tabs = [
    "Popular",
    "Burgers",
    "Drinks",
    "Snacks",
  ];

  const filtered =
    active === "Popular"
      ? menu.filter((item) => item.popular)
      : menu.filter((item) => item.type === active);

  return (
    <div className="max-w-md md:max-w-3xl xl:max-w-7xl mx-auto min-h-screen bg-zinc-50 pb-28">

      {/* Hero */}
      <div className="relative">
        <div className="w-full h-64 md:h-72 relative">
          <img
            src={data.hero}
            className="w-full h-full object-cover"
          />
          {/* Subtle dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/30 to-transparent pointer-events-none"></div>
        </div>

        <div className="absolute top-5 left-4 right-4 flex justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 backdrop-blur-md text-white border border-white/20 w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-white/30 active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="bg-white/20 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-full shadow-lg font-semibold hover:bg-white/30 active:scale-95 transition-all flex items-center gap-2"
          >
            Cart <span className="bg-lime-500 text-black px-2 py-0.5 rounded-full text-xs">{cart.length}</span>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {data.name}
          </h1>

          <p className="text-sm md:text-base font-medium text-zinc-200 mt-1">
            {data.subtitle}
          </p>
        </div>
      </div>

      {/* Tabs */}
      {/* Tabs */}
      <div className="px-4 md:px-6 xl:px-8 mt-6 relative z-20">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap flex-shrink-0 text-sm font-medium transition-all duration-300 ${
                active === tab
                  ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/20"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 md:px-6 xl:px-8 mt-6 space-y-5">
        {filtered.map((item, index) => {
          const found = cart.find(
            (p) => p.name === item.name
          );

          return (
            <div
              key={index}
              onClick={() => setSelectedItem(item)}
              className="group bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden flex-shrink-0 relative">
                <img
                  src={item.image}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-zinc-900 group-hover:text-lime-600 transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-sm font-medium text-gray-500 mt-0.5 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ready in {item.eta}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <p className="font-bold text-lg text-zinc-900">
                    ₹{item.price}
                  </p>

                  {found ? (
                    <div className="flex items-center justify-between w-24 bg-zinc-900 text-white px-3 py-2 rounded-full shadow-md">
                      <button
                        onClick={(e) => { e.stopPropagation(); decreaseQty(item.name); }}
                        className="w-6 h-6 flex items-center justify-center font-bold text-lg active:scale-90 transition-transform"
                      >
                        -
                      </button>

                      <span className="font-bold text-sm">{found.qty}</span>

                      <button
                        onClick={(e) => { e.stopPropagation(); increaseQty(item.name); }}
                        className="w-6 h-6 flex items-center justify-center font-bold text-lg text-lime-400 active:scale-90 transition-transform"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          ...item,
                          restaurant_id: Number(id),
                        });
                      }}
                      className="bg-lime-500 hover:bg-lime-600 active:scale-95 text-zinc-900 px-6 py-2 rounded-full font-bold shadow-md shadow-lime-500/20 transition-all duration-300"
                    >
                      ADD
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl transform transition-transform translate-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 w-full">
              <img src={selectedItem.image} className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/60 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold text-zinc-900">{selectedItem.name}</h2>
                <div className="bg-lime-50 text-lime-700 px-2 py-1 rounded-lg text-xs font-bold border border-lime-100 whitespace-nowrap">
                  ⭐ Bestseller
                </div>
              </div>
              
              <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                A delicious campus favorite prepared fresh on order. Enjoy the perfect blend of premium ingredients and signature spices for your perfect snack break.
              </p>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Price</p>
                  <p className="text-2xl font-bold text-zinc-900">₹{selectedItem.price}</p>
                </div>
                
                {cart.find(p => p.name === selectedItem.name) ? (
                  <div className="flex items-center justify-between w-32 bg-zinc-900 text-white px-4 py-3 rounded-full shadow-md">
                    <button
                      onClick={() => decreaseQty(selectedItem.name)}
                      className="w-6 h-6 flex items-center justify-center font-bold text-xl active:scale-90 transition-transform"
                    >
                      -
                    </button>
                    <span className="font-bold text-lg">{cart.find(p => p.name === selectedItem.name).qty}</span>
                    <button
                      onClick={() => increaseQty(selectedItem.name)}
                      className="w-6 h-6 flex items-center justify-center font-bold text-xl text-lime-400 active:scale-90 transition-transform"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      addToCart({
                        ...selectedItem,
                        restaurant_id: Number(id),
                      })
                    }
                    className="bg-lime-500 hover:bg-lime-600 active:scale-95 text-zinc-900 px-8 py-3 rounded-full font-bold shadow-md shadow-lime-500/20 transition-all duration-300 text-lg"
                  >
                    ADD TO CART
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Restaurant;