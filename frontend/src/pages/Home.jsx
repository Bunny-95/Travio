import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import ChatBot from "../components/ChatBot";

function Home() {
  const navigate = useNavigate();

  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/");
};

  const restaurants = [
    {
      id: 7,
      name: "Campus Cafe",
      type: "Snacks",
      eta: "5-8 min",
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 8,
      name: "Burger Hub",
      type: "Burgers",
      eta: "8-10 min",
      rating: "4.6",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 9,
      name: "Coffee Corner",
      type: "Coffee",
      eta: "3-5 min",
      rating: "4.9",
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const categories = [
    "All",
    "Burgers",
    "Coffee",
    "Snacks",
  ];

  const [search, setSearch] = useState("");
  const [active, setActive] = useState("All");

  const filtered = restaurants.filter((shop) => {
    const matchSearch = shop.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      active === "All" || shop.type === active;

    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-md md:max-w-3xl xl:max-w-7xl mx-auto min-h-screen bg-zinc-50 pb-10">

      <div className="px-4 md:px-6 xl:px-8 pt-6">

        <div className="flex items-center justify-between gap-3">

  <div className="flex items-center gap-3">

    <img
      src={logo}
      alt="logo"
      className="w-12 h-12 object-contain"
    />

    <div>
      <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold">
        Easy Eats
      </h1>

      <p className="text-sm text-gray-500">
        Pick up faster on campus
      </p>
    </div>

  </div>

  <button
    onClick={logout}
    className="bg-white border px-4 py-2 rounded-2xl text-sm font-medium shadow-sm"
  >
    Logout
  </button>

</div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search restaurant"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full mt-5 bg-white rounded-2xl px-4 py-4 shadow-sm border"
        />

        {/* Offers */}
<div className="mt-5 grid grid-cols-2 gap-3">

  {/* Main Promo */}
  <div className="bg-zinc-900 text-white rounded-3xl p-5 row-span-2 min-h-[190px] flex flex-col justify-between shadow-lg relative overflow-hidden">

    <div className="absolute -right-6 -top-6 w-24 h-24 bg-lime-500 rounded-full opacity-30"></div>
    <div className="absolute right-5 bottom-5 w-14 h-14 bg-lime-400 rounded-full opacity-20"></div>

    <div className="relative z-10">
      <p className="text-sm text-white/70">
        Today’s Offer
      </p>

      <h2 className="text-3xl font-bold mt-2">
        Flat 20% Off
      </h2>
    </div>

    <p className="text-sm text-white/70 relative z-10">
      Pickup orders only
    </p>
  </div>

  {/* White Card */}
  <div className="bg-white rounded-3xl p-4 min-h-[90px] shadow-sm border border-zinc-100 flex flex-col justify-between">
    <p className="text-sm text-gray-500">
      Bonus Deal
    </p>

    <h3 className="font-bold text-lg">
      Free Coffee ☕
    </h3>
  </div>

  {/* Lime Card */}
  <div className="bg-lime-500 text-black rounded-3xl p-4 min-h-[90px] shadow-sm flex flex-col justify-between">
    <p className="text-sm opacity-70">
      Fast Lane
    </p>

    <h3 className="font-bold text-lg">
      Ready in 5 min
    </h3>
  </div>

</div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto mt-5 pb-1">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                active === item
                  ? "bg-zinc-900 text-white"
                  : "bg-white border"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

      </div>

      {/* Restaurants */}
      <div className="px-4 md:px-6 xl:px-8 mt-6 space-y-5">
        {filtered.map((shop) => (
          <div
            key={shop.id}
            onClick={() =>
              navigate("/restaurant/" + shop.id)
            }
            className="bg-white rounded-3xl overflow-hidden shadow-sm border cursor-pointer"
          >
            <img
              src={shop.image}
              className="w-full h-40 object-cover"
            />

            <div className="p-4">
              <div className="flex justify-between">

                <div>
                  <h3 className="text-xl font-bold">
                    {shop.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {shop.type}
                  </p>
                </div>

                <div className="bg-lime-500 px-3 py-1 rounded-xl text-sm font-semibold">
                  ⭐ {shop.rating}
                </div>

              </div>

              <div className="flex justify-between mt-4 text-sm">
                <p>⏱ {shop.eta}</p>
                <p className="text-lime-600">
                  Pickup Ready
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>
          <ChatBot />
    </div>
  );
}

export default Home;