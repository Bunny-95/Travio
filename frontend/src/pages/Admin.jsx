import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Admin() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/");
      setOrders(res.data.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(
        "/orders/" + id + "/status?status=" + status
      );
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();

    const timer = setInterval(fetchOrders, 4000);

    return () => clearInterval(timer);
  }, []);

  const pending = orders.filter(
    (o) =>
      o.status !== "Ready" &&
      o.status !== "Collected"
  ).length;

  const ready = orders.filter(
    (o) => o.status === "Ready"
  ).length;

  const revenue = orders.reduce(
    (sum, o) => sum + o.total,
    0
  );

  return (
    <div className="min-h-screen bg-[#f5f6f8]">

      {/* Top Bar */}
      <div className="bg-zinc-900 text-white px-8 py-6 flex justify-between items-center shadow-sm">

  <div>
    <h1 className="text-3xl font-bold">
      Easy Eats Dashboard
    </h1>

    <p className="text-sm text-white/60 mt-1">
      Kitchen Operations Center
    </p>
  </div>

  <div className="flex items-center gap-3">

    <div className="bg-lime-500 text-black px-5 py-2 rounded-2xl font-semibold">
      LIVE
    </div>

    <button
      onClick={logout}
      className="bg-white text-black px-4 py-2 rounded-2xl font-medium"
    >
      Logout
    </button>

  </div>

</div>

      <div className="p-8">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5 mb-8">

          <div className="bg-white rounded-3xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm">
              Pending Orders
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {pending}
            </h2>
          </div>

          <div className="bg-lime-500 rounded-3xl p-6 shadow-sm">
            <p className="text-black/70 text-sm">
              Ready Orders
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {ready}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border">
            <p className="text-gray-500 text-sm">
              Revenue
            </p>

            <h2 className="text-4xl font-bold mt-2">
              ₹{revenue}
            </h2>
          </div>

          <div className="bg-zinc-900 text-white rounded-3xl p-6 shadow-sm">
            <p className="text-white/60 text-sm">
              Total Orders
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {orders.length}
            </h2>
          </div>

        </div>

        {/* Orders Header */}
        <div className="flex justify-between items-center mb-5">

          <h2 className="text-2xl font-bold">
            Live Orders
          </h2>

          <p className="text-gray-500">
            Auto refresh every 4 sec
          </p>

        </div>

        {/* Orders Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">

          {orders.map((order) => {
            const code = 1000 + order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 shadow-sm border hover:shadow-md transition"
              >
                {/* Top */}
                <div className="flex justify-between items-start">

                  <div>
                    <h3 className="text-xl font-bold">
                      Order #{order.id}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      ₹{order.total}
                    </p>
                  </div>

                  <span className="bg-zinc-100 px-3 py-1 rounded-xl text-sm font-medium">
                    {order.status}
                  </span>

                </div>

                {/* Pickup Code */}
                <div className="mt-4 bg-zinc-900 rounded-2xl p-4 text-center text-white">

                  <p className="text-xs text-white/60">
                    Pickup Code
                  </p>

                  <h2 className="text-3xl font-bold text-lime-400 tracking-[8px] mt-1">
                    {code}
                  </h2>

                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-4">

                  <button
                    onClick={() =>
                      updateStatus(order.id, "Accepted")
                    }
                    className="bg-zinc-100 rounded-2xl py-3 font-medium"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(order.id, "Preparing")
                    }
                    className="bg-yellow-100 rounded-2xl py-3 font-medium"
                  >
                    Preparing
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(order.id, "Ready")
                    }
                    className="bg-lime-200 rounded-2xl py-3 font-medium"
                  >
                    Ready
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(order.id, "Collected")
                    }
                    className="bg-zinc-900 text-white rounded-2xl py-3 font-medium"
                  >
                    Collected
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
}

export default Admin;