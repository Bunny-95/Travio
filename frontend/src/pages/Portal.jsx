import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import pattern from "../assets/food-pattern.png";
import logo from "../assets/logo.png";

function Portal() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 150);
  }, []);

  return (
    <div
      className="min-h-screen flex justify-center items-center px-6 overflow-hidden relative"
      style={{
        backgroundColor: "#8AAA00",
        backgroundImage: `url(${pattern})`,
        backgroundRepeat: "repeat",
        backgroundSize: "220px",
      }}
    >
      {/* Soft overlay */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Phone Style Center Card */}
      <div
        className={`relative z-10 w-full max-w-sm md:max-w-md rounded-[38px] px-8 py-12 text-center transition-all duration-1000 ${
          show
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        {/* Animated Logo */}
       <div className="flex justify-center mb-6">

     <div className="text-white text-8xl">
          🍴
        </div>

  
</div>

        {/* Brand */}
        <h1 className="text-white text-5xl font-bold tracking-tight">
          Easy Eats
        </h1>

        <p className="text-white/80 mt-3 text-sm">
          Smart Campus Pickup Experience
        </p>

        {/* Buttons */}
        <div className="mt-10 space-y-4">

          <button
            onClick={() => navigate("/login/student")}
            className="w-full bg-white text-black py-4 rounded-2xl font-semibold shadow-xl hover:scale-105 transition"
          >
            Continue as Student
          </button>

          <button
            onClick={() => navigate("/login/kitchen")}
            className="w-full bg-black/80 text-white py-4 rounded-2xl font-semibold backdrop-blur-md shadow-xl hover:scale-105 transition"
          >
            Continue as Kitchen
          </button>
        </div>

        {/* Footer */}
        <p className="text-white/60 text-xs mt-8">
          Fast • Smart • Contactless
        </p>
      </div>
    </div>
  );
}

export default Portal;