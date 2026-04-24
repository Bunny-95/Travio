import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api";

function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    increaseQty,
    decreaseQty,
    clearCart,
  } = useCart();

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  const fee =
    cart.length > 0 ? 9 : 0;

  const total =
    subtotal + fee;

 const placeOrder = async () => {
  try {
    const pay = await api.post(
      "/payment/create-order?amount=" + total
    );

    const options = {
      key: "rzp_test_SgwHdywMCxal2c",
      amount: pay.data.amount,
      currency: "INR",
      name: "Easy Eats",
      description: "Campus Food Order",
      order_id: pay.data.id,

      handler: async function (response) {
        try {
          const res = await api.post(
            "/orders/place?user_id=1&restaurant_id=7&total=" +
              total
          );

          const id = res.data.order_id;

          clearCart();

          navigate("/track/" + id);
        } catch (error) {
          console.log(error);
          alert("Order creation failed");
        }
      },

      prefill: {
        name: "Easy Eats User",
        email: "student@test.com",
        contact: "9999999999",
      },

      notes: {
        source: "Easy Eats",
      },

      theme: {
        color: "#84cc16",
      },

      modal: {
        ondismiss: function () {
          console.log("Payment popup closed");
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.log(error);
    alert("Payment failed");
  }
};

  return (
    <div className="max-w-md md:max-w-3xl xl:max-w-7xl mx-auto min-h-screen bg-zinc-50 pb-32">

      {/* Header */}
      <div className="p-5 flex items-center gap-3">

        <button
          onClick={() =>
            navigate(-1)
          }
          className="bg-white px-3 py-2 rounded-2xl shadow-sm"
        >
          ←
        </button>

        <div>
          <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold">
            Your Cart
          </h1>

          <p className="text-sm text-gray-500">
            Review before checkout
          </p>
        </div>

      </div>

      {/* Empty */}
      {cart.length === 0 ? (
        <div className="px-4 md:px-6 xl:px-8">
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm border">
            <p className="text-5xl">
              🛒
            </p>

            <h2 className="text-xl font-bold mt-3">
              Cart is Empty
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Add tasty food first
            </p>

            <button
              onClick={() =>
                navigate("/home")
              }
              className="mt-5 bg-zinc-900 text-white px-4 md:px-6 xl:px-8 py-3 rounded-2xl"
            >
              Browse Food
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Items */}
          <div className="px-4 md:px-6 xl:px-8 space-y-4">

            {cart.map(
              (item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl p-4 shadow-sm border"
                >
                  <div className="flex justify-between items-start">

                    <div>
                      <h3 className="font-bold text-lg">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        ₹{item.price} each
                      </p>
                    </div>

                    <p className="font-bold text-lg">
                      ₹
                      {item.price *
                        item.qty}
                    </p>

                  </div>

                  {/* Qty */}
                  <div className="mt-4 flex justify-end">
                    <div className="flex items-center gap-4 bg-zinc-900 text-white px-4 py-2 rounded-2xl">

                      <button
                        onClick={() =>
                          decreaseQty(
                            item.name
                          )
                        }
                      >
                        -
                      </button>

                      <span className="font-semibold">
                        {item.qty}
                      </span>

                      <button
                        onClick={() =>
                          increaseQty(
                            item.name
                          )
                        }
                      >
                        +
                      </button>

                    </div>
                  </div>
                </div>
              )
            )}

          </div>

          {/* Promo */}
          <div className="px-4 md:px-6 xl:px-8 mt-5">
            <div className="bg-lime-500 rounded-3xl p-4 text-black shadow-sm">
              <p className="text-sm opacity-70">
                Promo Applied
              </p>

              <h3 className="text-xl font-bold mt-1">
                FREE PICKUP
              </h3>
            </div>
          </div>

          {/* Bill */}
          <div className="px-4 md:px-6 xl:px-8 mt-5">
            <div className="bg-white rounded-3xl p-5 shadow-sm border space-y-3">

              <div className="flex justify-between text-sm">
                <p className="text-gray-500">
                  Subtotal
                </p>

                <p>
                  ₹{subtotal}
                </p>
              </div>

              <div className="flex justify-between text-sm">
                <p className="text-gray-500">
                  Platform Fee
                </p>

                <p>
                  ₹{fee}
                </p>
              </div>

              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>
                  ₹{total}
                </p>
              </div>

            </div>
          </div>
        </>
      )}

      {/* Bottom CTA */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md md:max-w-3xl xl:max-w-7xl mx-auto bg-white border-t p-4">

          <button
            onClick={
              placeOrder
            }
            className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-semibold"
          >
            Place Order • ₹{total}
          </button>

        </div>
      )}
    </div>
  );
}

export default Cart;