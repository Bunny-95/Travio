import { useState } from "react";

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I'm Easy Eats Assistant.",
    },
  ]);

  const getReply = (msg) => {
    const text = msg.toLowerCase();

    if (
      text.includes("hi") ||
      text.includes("hello")
    ) {
      return "Hello 👋 Hungry already?";
    }

    if (
      text.includes("fast")
    ) {
      return "Fastest today: Coffee Corner (3-5 min) ☕";
    }

    if (
      text.includes("offer")
    ) {
      return "Today's offer: Flat 20% Off 🎉";
    }

    if (
      text.includes("100") ||
      text.includes("cheap")
    ) {
      return "Best under ₹100: Burger Combo ₹89 🍔";
    }

    if (
      text.includes("track")
    ) {
      return "Use Track Order page with your Order ID 📦";
    }

    if (
      text.includes("coffee")
    ) {
      return "Top pick: Cold Coffee + Sandwich ☕🥪";
    }

    if (
      text.includes("burger")
    ) {
      return "Try Burger Hub combo meal 🍔";
    }

    return "Ask me about offers, prices, fast food, or tracking 😊";
  };

  const sendMessage = (custom) => {
    const text = custom || input;

    if (!text.trim()) return;

    const userMsg = {
      sender: "user",
      text,
    };

    setMessages((prev) => [
      ...prev,
      userMsg,
    ]);

    setInput("");
    setTyping(true);

    setTimeout(() => {
      const botMsg = {
        sender: "bot",
        text: getReply(text),
      };

      setMessages((prev) => [
        ...prev,
        botMsg,
      ]);

      setTyping(false);
    }, 900);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 md:right-6 w-[92vw] max-w-sm md:max-w-md bg-white rounded-3xl shadow-2xl border z-50 overflow-hidden">

          {/* Header */}
          <div className="bg-zinc-900 text-white px-4 py-3 font-semibold">
            Easy Eats Assistant
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-zinc-50">

            {messages.map(
              (msg, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.sender === "user"
                      ? "ml-auto bg-lime-500 text-black"
                      : "bg-white border"
                  }`}
                >
                  {msg.text}
                </div>
              )
            )}

            {typing && (
              <div className="bg-white border px-4 py-2 rounded-2xl text-sm w-fit">
                Typing...
              </div>
            )}

          </div>

          {/* Quick Chips */}
          <div className="px-3 pt-2 flex gap-2 overflow-x-auto bg-white">

            {[
              "Offers",
              "Fast Food",
              "Under 100",
              "Track Order",
            ].map((item) => (
              <button
                key={item}
                onClick={() =>
                  sendMessage(item)
                }
                className="text-xs bg-zinc-100 px-3 py-2 rounded-full whitespace-nowrap"
              >
                {item}
              </button>
            ))}

          </div>

          {/* Input */}
          <div className="p-3 flex gap-2 border-t">

            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Ask something..."
              className="flex-1 border rounded-2xl px-3 py-2 text-sm outline-none"
            />

            <button
              onClick={() =>
                sendMessage()
              }
              className="bg-zinc-900 text-white px-4 rounded-2xl"
            >
              Send
            </button>

          </div>

        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="fixed bottom-5 right-4 md:bottom-6 md:right-6 w-16 h-16 rounded-full bg-lime-500 text-black text-2xl shadow-xl z-50 hover:scale-110 transition"
      >
        💬
      </button>
    </>
  );
}

export default ChatBot;