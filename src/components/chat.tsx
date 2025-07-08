import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 👈 Add this
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Sidebar from "./sidebar";
import MoodSelector from "./moodselector";

const Chat: React.FC = () => {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState("Default");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate(); // 👈 useNavigate hook

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setChat((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-4o",
          messages: [...chat, userMsg],
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const botReply = response.data.choices[0].message;
      setChat((prev) => [...prev, botReply]);
    } catch (err: any) {
      console.error("❌ OpenAI API Error:", err?.response?.data || err.message || err);
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ API Error: " +
            (err?.response?.data?.error?.message || "Something went wrong."),
        },
      ]);
    }

    setLoading(false);
  };

  const handleNewChat = () => {
    setChat([]);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // 👈 Redirect to login or home page
  };

  const handleFeedback = () => {
    alert("Feedback feature coming soon!");
  };

  return (
    <div className="flex h-screen bg-[#0e0e0e] text-white">
      <Sidebar
        onNewChat={handleNewChat}
        onLogout={handleLogout}
        onFeedback={handleFeedback}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-[#1a1a1a] p-4 flex justify-between items-center shadow-md">
          <h1 className="text-2xl font-bold text-[#ff004f]">NovaIntellect</h1>
        </div>

        <MoodSelector mood={mood} setMood={setMood} />

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`max-w-3xl px-4 py-3 rounded-lg shadow-md ${
                msg.role === "user"
                  ? "bg-red-600 text-right ml-auto"
                  : "bg-gray-800 text-left mr-auto"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-[#1a1a1a] flex items-center">
          <input
            className="flex-1 bg-[#2a2a2a] text-white p-2 rounded-l focus:outline-none"
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-red-600 px-4 py-2 rounded-r hover:bg-red-700"
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
