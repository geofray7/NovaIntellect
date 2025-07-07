import { useState, useRef, useEffect } from "react";
import {
  FaMicrophone,
  FaPaperPlane,
  FaDownload,
  FaVolumeUp,
  FaRedo,
} from "react-icons/fa";
import { motion } from "framer-motion";

const SYSTEM_TONES = {
  default: "You are a helpful and intelligent AI.",
  casual: "You are a chill and funny AI who talks like a friend.",
  formal: "You are a polite, professional assistant.",
  sarcastic: "You respond with playful sarcasm.",
  motivational: "You are a cheerful coach who motivates users.",
};

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState<keyof typeof SYSTEM_TONES>("default");
  const [memory, setMemory] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const speakText = (text: string) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    synth.speak(utterance);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = memory
      ? [...messages, userMessage]
      : [messages[0], userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const reply = await getAIResponse(updatedMessages);
    const aiMessage: Message = { role: "assistant", content: reply };
    setMessages([...updatedMessages, aiMessage]);
    setLoading(false);
  };

  const getAIResponse = async (conversationHistory: Message[]) => {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    const baseMessages: Message[] = [
      { role: "system", content: SYSTEM_TONES[tone] },
      ...conversationHistory.filter((msg) => msg.role !== "system"),
    ];

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "NovaIntellect",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: baseMessages,
        }),
      });

      const data = await response.json();
      if (data.choices?.[0]?.message) {
        return data.choices[0].message.content.trim();
      } else if (data.error) {
        return `⚠️ API Error: ${data.error.message}`;
      } else {
        return "⚠️ Unexpected response from AI.";
      }
    } catch (error) {
      console.error("API call failed:", error);
      return "⚠️ Could not connect to AI.";
    }
  };

  const handleMic = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onerror = (event: any) => {
      alert("Mic error: " + event.error);
    };
    recognition.start();
  };

  const handleDownload = () => {
    const content = messages
      .map((msg) => `${msg.role === "user" ? "You" : "NovaIntellect"}: ${msg.content}`)
      .join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat-history.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const rewritePrompt = async (msg: string) => {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            {
              role: "system",
              content:
                "You are an assistant that improves and rephrases user prompts to be clearer and more effective.",
            },
            { role: "user", content: msg },
          ],
        }),
      });
      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
        setInput(data.choices[0].message.content.trim());
      } else {
        alert("Error rewriting prompt.");
      }
    } catch (error) {
      alert("Network error while rewriting.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f] text-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-[#0f0f0f] px-4 py-4 shadow-md">
        <motion.h1
          className="text-4xl text-center mb-4 neon-title"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          NovaIntellect 🧠
        </motion.h1>

        <div className="flex flex-wrap justify-center gap-4 mb-2">
          <select
            className="bg-[#222] px-4 py-2 rounded text-sm"
            value={tone}
            onChange={(e) => setTone(e.target.value as keyof typeof SYSTEM_TONES)}
          >
            {Object.keys(SYSTEM_TONES).map((t) => (
              <option key={t} value={t}>
                {t.toUpperCase()}
              </option>
            ))}
          </select>

          <button
            onClick={() => setMemory(!memory)}
            className={`px-4 py-2 rounded-full text-sm font-medium shadow-md ${
              memory ? "bg-green-600" : "bg-gray-600"
            }`}
          >
            {memory ? "Memory ON" : "Memory OFF"}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full text-sm shadow-md"
          >
            <FaDownload /> Export Chat
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto max-w-3xl w-full mx-auto space-y-4 scrollbar-thin pb-4 px-4">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            className={`relative max-w-[80%] px-4 py-3 rounded-2xl shadow-md ${
              msg.role === "user"
                ? "bg-[#141414] self-end ml-auto text-white border border-pink-600"
                : "bg-[#141414] self-start mr-auto text-white border border-pink-600 backdrop-blur-md"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
          >
            <p
              className={`text-xs font-semibold mb-1 ${
                msg.role === "user" ? "text-pink-400 text-right" : "text-pink-500"
              }`}
            >
              {msg.role === "user" ? "You" : "NovaIntellect"}
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
            {msg.role === "assistant" && (
              <button
                onClick={() => speakText(msg.content)}
                className="absolute top-2 right-2 text-pink-400 hover:text-pink-200"
                title="Speak reply"
              >
                <FaVolumeUp />
              </button>
            )}
            {msg.role === "user" && (
              <button
                onClick={() => rewritePrompt(msg.content)}
                className="absolute top-2 left-2 text-pink-400 hover:text-pink-200"
                title="Rewrite this prompt"
              >
                <FaRedo />
              </button>
            )}
          </motion.div>
        ))}
        {loading && (
          <motion.div
            className="max-w-[60%] px-4 py-3 bg-[#1a1a1a] border border-pink-600 rounded-2xl animate-pulse text-pink-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            NovaIntellect is typing...
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl w-full mx-auto mt-4 px-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button type="submit" className="p-3 bg-pink-600 hover:bg-pink-700 rounded-full text-white shadow-lg">
          <FaPaperPlane />
        </button>
        <button type="button" onClick={handleMic} className="p-3 bg-[#333] hover:bg-[#555] rounded-full shadow-lg">
          <FaMicrophone />
        </button>
      </form>
    </div>
  );
}

export default App;
