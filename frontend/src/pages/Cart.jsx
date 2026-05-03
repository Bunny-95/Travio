import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import api from "../api";

function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    increaseQty,
    decreaseQty,
    clearCart,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  const fee =
    cart.length > 0 ? 9 : 0;

  const applyCoupon = () => {
    if (!couponCode) return;
    const code = couponCode.toUpperCase().trim();
    if (code === "EASY20") {
      const amount = subtotal * 0.2;
      setDiscount(amount);
      setCouponMsg("🎉 ₹" + amount.toFixed(0) + " saved!");
    } else if (code === "FLAT50") {
      const amount = 50;
      setDiscount(amount);
      setCouponMsg("🎉 ₹50 flat discount applied!");
    } else {
      setDiscount(0);
      setCouponMsg("❌ Invalid coupon code");
    }
  };

  const total =
    subtotal + fee - discount;

 const placeOrder = async () => {
  try {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (!window.Razorpay) {
      alert("Payment system loading. Please try again.");
      return;
    }

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

      handler: async function () {
  try {
    const itemText = JSON.stringify(
      cart.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.price
      }))
    );

const res = await api.post(
  "/orders/place?user_id=1&restaurant_id=" +
    cart[0].restaurant_id +
    "&total=" +
    total +
    "&items=" +
    encodeURIComponent(itemText)
);
    

    const orderId =
      res.data.order_id;

    clearCart();

    navigate(
      "/track/" + orderId
    );
  } catch (error) {
    console.log(error);
    alert("Order creation failed");
  }
  console.log(cart);
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
          console.log(
            "Payment popup closed"
          );
        },
      },

      retry: {
        enabled: true,
      },

      timeout: 300,
    };

    const razorpay =
      new window.Razorpay(
        options
      );

    razorpay.open();
  } catch (error) {
    console.log(error);
    alert(
      "Payment failed. Please try again."
    );
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
                  <div className="flex justify-between items-start gap-4">
                    <img src={item.image} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg leading-tight">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1 font-medium">
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

          {/* Coupon Section */}
          <div className="px-4 md:px-6 xl:px-8 mt-6">
            <h2 className="text-lg font-bold mb-3 px-1 text-zinc-900">Offers & Benefits</h2>
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter coupon code (e.g., EASY20)"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponMsg("");
                    setDiscount(0);
                  }}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 transition-all uppercase text-zinc-900 font-bold placeholder-gray-400 placeholder:font-normal"
                />
                <button
                  onClick={applyCoupon}
                  className="bg-zinc-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-zinc-800 active:scale-95 transition-all"
                >
                  Apply
                </button>
              </div>
              {couponMsg && (
                <p className={`text-sm font-bold px-1 ${couponMsg.includes('❌') ? 'text-red-500' : 'text-lime-600'}`}>
                  {couponMsg}
                </p>
              )}
            </div>
          </div>

          {/* Bill Section */}
          <div className="px-4 md:px-6 xl:px-8 mt-6">
            <h2 className="text-lg font-bold mb-3 px-1">Bill Details</h2>
            <div className="bg-white rounded-3xl p-5 shadow-sm border">
              
              {/* Pickup Info Banner */}
              <div className="bg-lime-50 border border-lime-100 rounded-2xl p-4 mb-5 flex items-start gap-3">
                <div className="bg-lime-100 text-lime-700 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-lime-800">FREE PICKUP</h3>
                  <p className="text-xs text-lime-700 mt-0.5 leading-snug">
                    Collect your order at the counter using your pickup code
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Item Total</p>
                  <p className="font-medium">₹{subtotal}</p>
                </div>

                <div className="flex justify-between text-sm border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-1 group relative">
                    <p className="text-gray-600">Platform Fee</p>
                    <div className="text-gray-400 hover:text-gray-600 cursor-help">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {/* Tooltip */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-zinc-800 text-white text-xs rounded-lg text-center shadow-lg pointer-events-none z-10 transition-opacity">
                        This fee supports platform operations
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800"></div>
                      </div>
                    </div>
                  </div>
                  <p className="font-medium">₹{fee}</p>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-lime-600 font-bold pt-2">
                    <p>Item Discount</p>
                    <p>- ₹{discount.toFixed(0)}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <p className="font-bold text-lg text-zinc-900">Grand Total</p>
                  <p className="font-bold text-xl text-lime-600">₹{total.toFixed(0)}</p>
                </div>
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