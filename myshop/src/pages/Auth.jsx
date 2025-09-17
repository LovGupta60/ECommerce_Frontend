import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // for register

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // LOGIN
        const endpoint = isAdmin
          ? "http://localhost:8080/auth/admin/login"
          : "http://localhost:8080/auth/login";

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
          localStorage.setItem("token", data.token); // save token
          // Debug: print token and decoded payload so developer can verify roles
          try {
            // eslint-disable-next-line no-console
            console.debug("[Auth] received token:", data.token);
            const payload = JSON.parse(atob(data.token.split(".")[1]));
            // eslint-disable-next-line no-console
            console.debug("[Auth] decoded payload:", payload);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.debug("[Auth] failed to decode token payload", e);
          }
          // persist admin flag so UI (Navbar, CartContext) can hide cart for admins
          localStorage.setItem("isAdmin", isAdmin ? "true" : "false");
          navigate("/"); // go home
        } else {
          alert("Invalid credentials");
        }
      } else {
        // REGISTER
        const endpoint = "http://localhost:8080/auth/signup";
        const body = { name, email: emailOrUsername, password };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          alert("Registration successful! Please login.");
          setIsLogin(true); // switch to login tab
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
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
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

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
          />

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
