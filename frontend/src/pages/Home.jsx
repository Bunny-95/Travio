import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import ChatBot from "../components/ChatBot";

function Home() {
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    email: localStorage.getItem("user") || "student@college.edu",
    name: localStorage.getItem("profile_name") || "",
    phone: localStorage.getItem("profile_phone") || ""
  });

  const [editForm, setEditForm] = useState({...profile});

  const handleSaveProfile = () => {
    setProfile(editForm);
    localStorage.setItem("profile_name", editForm.name);
    localStorage.setItem("profile_phone", editForm.phone);
    setIsEditing(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const getInitial = () => {
    if (profile.name) return profile.name.charAt(0).toUpperCase();
    if (profile.email) return profile.email.charAt(0).toUpperCase();
    return "U";
  };

  const restaurants = [
    {
      id: 1,
      name: "Campus Cafe",
      type: "Snacks",
      eta: "5-8 min",
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 2,
      name: "Burger Hub",
      type: "Burgers",
      eta: "8-10 min",
      rating: "4.6",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 3,
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
    onClick={() => setShowProfile(true)}
    className="w-10 h-10 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center shadow-md hover:scale-105 transition-transform"
  >
    {getInitial()}
  </button>

</div>

        {/* Search */}
        <div className="relative mt-5 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-lime-500 transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for restaurants, cuisine or a dish"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full bg-white rounded-2xl pl-12 pr-4 py-4 shadow-sm border border-gray-200 outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 transition-all duration-300"
          />
        </div>

        {/* Offers */}
        <div className="mt-5 grid grid-cols-2 gap-3">

          {/* Main Promo */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-3xl p-5 row-span-2 min-h-[190px] flex flex-col justify-between shadow-lg relative overflow-hidden hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer">

            <div className="absolute -right-6 -top-6 w-24 h-24 bg-lime-500 rounded-full opacity-30 blur-xl"></div>
            <div className="absolute right-5 bottom-5 w-14 h-14 bg-lime-400 rounded-full opacity-20 blur-lg"></div>

            <div className="relative z-10">
              <p className="text-sm text-white/70 font-medium">
                Today’s Offer
              </p>

              <h2 className="text-3xl font-bold mt-2 leading-tight">
                Flat 20% Off
              </h2>
            </div>

            <div className="relative z-10 mt-auto pt-4 flex items-center justify-between">
              <p className="text-xs font-medium bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full inline-block">
                Pickup orders only
              </p>
              <div className="bg-white text-zinc-900 p-2 rounded-full shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* White Card */}
          <div className="bg-white rounded-3xl p-4 min-h-[90px] shadow-sm border border-gray-100 flex flex-col justify-between hover:scale-[1.03] hover:shadow-md transition-all duration-300 cursor-pointer">
            <p className="text-sm text-gray-500 font-medium">
              Bonus Deal
            </p>

            <h3 className="font-bold text-lg text-zinc-900">
              Free Coffee ☕
            </h3>
          </div>

          {/* Lime Card */}
          <div className="bg-gradient-to-br from-lime-400 to-lime-500 text-black rounded-3xl p-4 min-h-[90px] shadow-sm flex flex-col justify-between hover:scale-[1.03] hover:shadow-md hover:shadow-lime-500/20 transition-all duration-300 cursor-pointer">
            <p className="text-sm font-medium opacity-80">
              Fast Lane
            </p>

            <h3 className="font-bold text-lg">
              Ready in 5 min
            </h3>
          </div>

        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto mt-6 pb-2 scrollbar-hide">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all duration-300 ${
                active === item
                  ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/20"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
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
            className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-full h-44 overflow-hidden relative">
              <img
                src={shop.image}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start">

                <div>
                  <h3 className="text-xl font-bold text-zinc-900 group-hover:text-lime-600 transition-colors duration-300">
                    {shop.name}
                  </h3>

                  <p className="text-sm text-gray-500 font-medium mt-0.5">
                    {shop.type}
                  </p>
                </div>

                <div className="bg-lime-50 text-lime-700 border border-lime-100 px-2.5 py-1.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-1">
                  <span>⭐</span> {shop.rating}
                </div>

              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center text-sm">
                <div className="flex items-center gap-1.5 text-gray-600 font-medium bg-gray-50 px-2.5 py-1 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {shop.eta}
                </div>
                <p className="text-lime-600 font-bold tracking-tight">
                  Pickup Ready
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>
      {/* Profile Modal/Panel */}
      {showProfile && (
        <div 
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => {
            setShowProfile(false);
            setIsEditing(false);
          }}
        >
          <div 
            className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-3xl p-6 shadow-2xl transform transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-zinc-900">My Profile</h2>
              <button onClick={() => { setShowProfile(false); setIsEditing(false); }} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {!isEditing ? (
              <div className="space-y-5">
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="w-14 h-14 rounded-full bg-lime-500 text-zinc-900 font-bold text-xl flex items-center justify-center shadow-inner">
                    {getInitial()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900">{profile.name || "Add your name"}</h3>
                    <p className="text-sm text-gray-500">{profile.email}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{profile.phone || "Add mobile number"}</p>
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  <button 
                    onClick={() => {
                      setEditForm({...profile});
                      setIsEditing(true);
                    }}
                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 hover:shadow-sm transition-all text-left"
                  >
                    <span className="font-semibold text-zinc-900">Edit Profile</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>

                  <button 
                    onClick={() => {
                      setShowProfile(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full flex items-center justify-between p-4 bg-white border border-red-100 rounded-2xl hover:bg-red-50 hover:shadow-sm transition-all text-left"
                  >
                    <span className="font-bold text-red-500">Logout</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number</label>
                  <input 
                    type="tel" 
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    placeholder="Enter mobile number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-all"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveProfile}
                    className="flex-1 bg-lime-500 text-zinc-900 py-3 rounded-xl font-bold hover:bg-lime-600 active:scale-95 transition-all shadow-md shadow-lime-500/20"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Logout</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={logout}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 active:scale-95 transition-all shadow-md shadow-red-500/20"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

          <ChatBot />
    </div>
  );
}

export default Home;