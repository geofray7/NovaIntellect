import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/chat");
    } catch (error: any) {
      alert("Login failed: " + error.message);
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  const continueAsGuest = () => {
    navigate("/chat");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
      <div className="bg-[#1a1a1a] p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome to NovaIntellect</h1>

        <input
          className="w-full p-2 mb-4 rounded bg-[#2b2b2b] text-white"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 mb-6 rounded bg-[#2b2b2b] text-white"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-[#ff0055] hover:bg-[#e6004c] text-white p-2 rounded mb-4"
        >
          Login
        </button>

        <button
          onClick={goToRegister}
          className="w-full border border-gray-500 text-gray-300 hover:text-white p-2 rounded mb-2"
        >
          Sign Up
        </button>

        <button
          onClick={continueAsGuest}
          className="w-full border border-gray-500 text-gray-300 hover:text-white p-2 rounded"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
