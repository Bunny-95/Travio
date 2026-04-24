import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

function TrackOrder() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] =
    useState(null);

  const steps = [
    "Placed",
    "Accepted",
    "Preparing",
    "Almost Ready",
    "Ready",
  ];

  const fetchOrder =
    async () => {
      try {
        const res =
          await api.get(
            "/orders/" +
              id +
              "/track"
          );

        setOrder(res.data);
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    fetchOrder();

    const timer =
      setInterval(
        fetchOrder,
        5000
      );

    return () =>
      clearInterval(timer);
  }, []);

  if (!order) {
    return (
      <div className="max-w-md md:max-w-3xl xl:max-w-7xl mx-auto p-6">
        Loading...
      </div>
    );
  }

  const current =
    steps.indexOf(
      order.status
    );

  const maxTime = 15;
  const left =
    order.predicted_minutes;

  const progress =
    ((maxTime - left) /
      maxTime) *
    100;

  const ready =
    order.status ===
    "Ready";
    const pickupCode =
  1000 + Number(id);

  return (
    <div className="max-w-md md:max-w-3xl xl:max-w-7xl mx-auto min-h-screen bg-zinc-50 pb-28">

      {/* Header */}
      <div className="p-5 flex items-center gap-3">

        <button
          onClick={() =>
            navigate("/home")
          }
          className="bg-white px-3 py-2 rounded-2xl shadow"
        >
          ←
        </button>

        <div>
          <h1 className="text-2xl md:text-3xl xl:text-4xl md:text-3xl xl:text-4xl font-bold">
            Track Order
          </h1>

          <p className="text-sm text-gray-500">
            Order #{id}
          </p>
        </div>
        {ready && (
  <div className="px-4 md:px-6 xl:px-8 mt-4">
    <div className="bg-zinc-900 text-white rounded-3xl p-5 shadow-lg border border-lime-500 text-center relative overflow-hidden">

      {/* Glow accents */}
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-lime-500 rounded-full opacity-25"></div>
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-lime-400 rounded-full opacity-20"></div>

      <p className="text-sm text-white/70 relative z-10">
        Show this code at counter
      </p>

      <h2 className="text-4xl font-bold tracking-[8px] mt-3 text-lime-400 relative z-10">
        {pickupCode}
      </h2>

      <p className="text-xs text-white/60 mt-2 relative z-10">
        Pickup Verification Code
      </p>

    </div>
  </div>
)}

      </div>

      {/* Main Card */}
      <div className="px-4 md:px-6 xl:px-8">
        <div className="bg-zinc-900 text-white rounded-3xl p-6 shadow-lg">

          {/* Countdown Circle */}
          <div className="flex justify-center">

            <div className="w-36 h-36 rounded-full border-[10px] border-lime-500 flex flex-col justify-center items-center shadow-inner">

              <p className="text-sm text-white/70">
                ETA
              </p>

              <h2 className="text-5xl font-bold">
                {ready
                  ? "0"
                  : left}
              </h2>

              <p className="text-xs text-white/70">
                min
              </p>

            </div>

          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">

              <div
                className="h-full bg-lime-500 transition-all duration-1000"
                style={{
                  width:
                    ready
                      ? "100%"
                      : `${progress}%`,
                }}
              ></div>

            </div>
          </div>

          {/* Status */}
          <div className="mt-5 text-center">

            <p className="text-white/70 text-sm">
              Current Status
            </p>

            <h3 className="text-2xl md:text-3xl xl:text-4xl md:text-3xl xl:text-4xl font-bold mt-1">
              {order.status}
            </h3>

            <p className="text-sm text-white/70 mt-2">
              Ready by{" "}
              {order.ready_time}
            </p>

          </div>

        </div>
      </div>

      {/* Pickup Slot */}
      {order.pickup_slot && (
        <div className="px-4 md:px-6 xl:px-8 mt-4">
          <div className="bg-lime-500 rounded-3xl p-4 text-black shadow-sm">
            <p className="text-sm opacity-70">
              Pickup Slot
            </p>

            <h3 className="text-xl font-bold mt-1">
              {
                order.pickup_slot
              }
            </h3>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="px-4 md:px-6 xl:px-8 mt-5 space-y-3">
        {steps.map(
          (
            step,
            index
          ) => {
            const done =
              index <
              current;

            const active =
              index ===
              current;

            return (
              <div
                key={index}
                className={`rounded-2xl p-4 flex items-center gap-3 ${
                  done
                    ? "bg-lime-100"
                    : active
                    ? "bg-white shadow-sm border"
                    : "bg-gray-100"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full ${
                    done
                      ? "bg-lime-600"
                      : active
                      ? "bg-zinc-900"
                      : "bg-gray-300"
                  }`}
                ></div>
                

                <p className="font-medium">
                  {step}
                </p>
              </div>
            );
          }
        )}
      </div>

      {/* Ready State */}
      {ready && (
        <div className="px-4 md:px-6 xl:px-8 mt-5">
          <div className="bg-green-100 text-green-700 rounded-3xl p-5 text-center font-semibold">
            🎉 Your order is ready for pickup!
          </div>
        </div>
      )}

      {/* Refresh */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md md:max-w-3xl xl:max-w-7xl mx-auto bg-white border-t p-4">
        <button
          onClick={
            fetchOrder
          }
          className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-semibold"
        >
          Refresh Status
        </button>
      </div>

    </div>
  );
}

export default TrackOrder;