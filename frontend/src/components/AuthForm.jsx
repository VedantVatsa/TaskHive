import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const AuthForm = ({ type }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Added error state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password) {
      setError("All fields are required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/${type}`, {
        email,
        password,
      });
      if (type === "login") {
        localStorage.setItem("token", res.data.token); // Save token to localStorage
        navigate("/"); // Redirect to home page
      } else if (type === "signup") {
        navigate("/login"); // Redirect to login page after signup
      }
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed"); // Display error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field focus:ring-2 focus:ring-indigo-500"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field focus:ring-2 focus:ring-indigo-500"
          placeholder="••••••••"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn w-full bg-gradient-to-r from-blue-600 to-indigo-600 
        hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-xl
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        transform transition-all duration-300 hover:scale-[1.02]"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span className="ml-2">
              {type === "login" ? "Logging in..." : "Signing up..."}
            </span>
          </div>
        ) : (
          <span>{type === "login" ? "Login" : "Create Account"}</span>
        )}
      </button>

      {type === "login" && (
        <div className="text-center">
          <a
            href="#"
            className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Forgot your password?
          </a>
        </div>
      )}
    </form>
  );
};

export default AuthForm;
