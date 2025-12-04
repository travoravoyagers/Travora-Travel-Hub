import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  setError("");

  if (!email || !password) {
    return setError("Please fill all fields");
  }

  try {
    setLoading(true);
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      return setError(data.message || "Invalid credentials");
    }

    // Save JWT token
    localStorage.setItem("token", data.token);

    // Redirect to Home
    navigate("/home");

  } catch (err) {
    setError("Something went wrong, try again");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen"
      style={{ backgroundColor: "#fcf9f2" }}
    >
      <div className="w-80 bg-white p-6 rounded-xl shadow-md">
        <h2 
          className="text-2xl font-bold text-center mb-6" 
          style={{ color: "#12213e" }}
        >
          Login
        </h2>

        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded-lg border outline-none"
            style={{ color: "#12213e" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded-lg border outline-none"
            style={{ color: "#12213e" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="button"
            disabled={loading}
            className="w-full py-3 rounded-lg mt-2 font-semibold disabled:opacity-50"
            style={{ backgroundColor: "#12213e", color: "#fcf9f2" }}
            onClick={handleLogin}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4" style={{ color: "#12213e" }}>
          Don’t have an account?{" "}
          <Link 
            className="font-semibold underline"
            style={{ color: "#12213e" }}
            to="/register"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
