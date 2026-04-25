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
        <img
          src={data.hero}
          className="w-full h-64 object-cover"
        />

        <div className="absolute top-5 left-4 right-4 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="bg-white px-3 py-2 rounded-2xl shadow"
          >
            ←
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="bg-zinc-900 text-white px-4 py-2 rounded-2xl"
          >
            Cart ({cart.length})
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 text-white">
          <h1 className="text-3xl font-bold">
            {data.name}
          </h1>

          <p className="text-sm text-white/80 mt-1">
            {data.subtitle}
          </p>
        </div>
      </div>

      {/* Tabs */}
      {/* Tabs */}
<div className="px-4 md:px-6 xl:px-8 mt-5 relative z-20">
  <div className="flex gap-3 overflow-x-auto pb-1">

    {tabs.map((tab) => (
      <button
        key={tab}
        type="button"
        onClick={() => setActive(tab)}
        className={`px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0 text-sm font-medium transition ${
          active === tab
            ? "bg-zinc-900 text-white"
            : "bg-white border border-zinc-200 text-black"
        }`}
      >
        {tab}
      </button>
    ))}

  </div>
</div>

      {/* Menu */}
      <div className="px-4 md:px-6 xl:px-8 mt-5 space-y-4">
        {filtered.map((item, index) => {
          const found = cart.find(
            (p) => p.name === item.name
          );

          return (
            <div
              key={index}
              className="bg-white rounded-3xl p-3 shadow-sm border flex gap-3"
            >
              <img
                src={item.image}
                className="w-24 h-24 rounded-2xl object-cover"
              />

              <div className="flex-1">
                <h3 className="font-bold text-lg">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-500">
                  Ready in {item.eta}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <p className="font-bold">
                    ₹{item.price}
                  </p>

                  {found ? (
                    <div className="flex items-center gap-3 bg-zinc-900 text-white px-4 py-2 rounded-2xl">
                      <button
                        onClick={() =>
                          decreaseQty(item.name)
                        }
                      >
                        -
                      </button>

                      <span>{found.qty}</span>

                      <button
                        onClick={() =>
                          increaseQty(item.name)
                        }
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        addToCart(item)
                      }
                      className="bg-lime-500 px-4 py-2 rounded-2xl font-semibold"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md md:max-w-3xl xl:max-w-7xl mx-auto bg-white border-t p-4">
        <button
          onClick={() => navigate("/cart")}
          className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-semibold"
        >
          View Cart ({cart.length})
        </button>
      </div>

    </div>
  );
}

export default Restaurant;