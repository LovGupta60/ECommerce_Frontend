import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi"; // for eye icon

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // for register
  const [showPassword, setShowPassword] = useState(false); // eye toggle

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // existing submit logic unchanged
    try {
      if (isLogin) {
        const endpoint = isAdmin
          ? "https://demo-deployment-ervl.onrender.com/auth/admin/login"
          : "https://demo-deployment-ervl.onrender.com/auth/login";

        const body = isAdmin
          ? { username: emailOrUsername, password }
          : { email: emailOrUsername, password };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("token", data.token);
          localStorage.setItem("isAdmin", isAdmin ? "true" : "false");
          console.log("🔥 Login successful! Token:", data.token);
          try {
            const payload = JSON.parse(atob(data.token.split(".")[1]));
            console.log("📝 Decoded JWT payload:", payload);
          } catch (err) {
            console.warn("⚠️ Failed to decode token payload", err);
          }
          navigate("/");
        } else {
          alert("Invalid credentials");
        }
      } else {
        const endpoint = "https://demo-deployment-ervl.onrender.com/auth/signup";
        const body = { name, email: emailOrUsername, password };
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          alert("Registration successful! Please login.");
          setIsLogin(true);
          setName("");
          setPassword("");
          setEmailOrUsername("");
        } else {
          alert("Registration failed.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md mx-auto">
        {/* Tabs */}
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 ${isLogin ? "border-b-2 border-indigo-500" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 ${!isLogin ? "border-b-2 border-indigo-500" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6">
          {isLogin ? "Welcome Back 👋" : "Create Account ✨"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          )}

          <input
            type={isAdmin ? "text" : "email"}
            placeholder={isAdmin ? "Admin Username" : "Email Address"}
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
          />

          {/* Password with eye toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {isLogin && (
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
              />
              <span>Login as Admin</span>
            </label>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
