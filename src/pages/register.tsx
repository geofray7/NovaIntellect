import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      alert("Registration failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
      <div className="bg-[#1a1a1a] p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Your Account</h1>

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
          onClick={handleRegister}
          className="w-full bg-[#ff0055] hover:bg-[#e6004c] text-white p-2 rounded mb-4"
        >
          Sign Up
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full border border-gray-500 text-gray-300 hover:text-white p-2 rounded"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
