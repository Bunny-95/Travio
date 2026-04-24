import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import logo from "../assets/logo.png";
import pattern from "../assets/food-pattern.png";

function Login() {
  const navigate = useNavigate();
  const { role } = useParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const loginUser = async () => {
    try {
      const res = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      );

      if (
        res.data.user.role ===
        "student"
      ) {
        navigate("/home");
      } else {
        navigate("/admin");
      }
    } catch (error) {
      alert(
        "Invalid login"
      );
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center px-6"
      style={{
        backgroundColor: "#8AAA00",
        backgroundImage: `url(${pattern})`,
        backgroundSize: "220px",
      }}
    >
      <div className="w-full max-w-sm md:max-w-md bg-white rounded-[34px] p-8 shadow-2xl">

        <div className="text-center">

          <img
            src={logo}
            className="w-20 h-20 mx-auto"
          />

          <h1 className="text-3xl font-bold mt-4">
            {role === "student"
              ? "Student Login"
              : "Kitchen Login"}
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Welcome back
          </p>

        </div>

        <div className="mt-8 space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full border rounded-2xl px-4 py-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full border rounded-2xl px-4 py-4"
          />

        </div>

        <button
          onClick={loginUser}
          className="w-full mt-6 bg-zinc-900 text-white py-4 rounded-2xl font-semibold"
        >
          Login
        </button>

        <button
          onClick={() =>
            navigate("/")
          }
          className="w-full mt-3 text-gray-500"
        >
          Back
        </button>

      </div>
    </div>
  );
}

export default Login;