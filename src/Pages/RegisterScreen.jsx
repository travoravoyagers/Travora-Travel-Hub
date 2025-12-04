import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterScreen = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError("");

    if (formData.password.length < 8) {
      return setError("Password must be at least 8 characters long.");
    }

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match!");
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return setError(data.message || "Registration failed");
      }

      // Save token to localStorage
      localStorage.setItem("token", data.token);

      navigate("/login");
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
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
          Create Account
        </h2>

        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-lg border outline-none"
            style={{ color: "#12213e" }}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 rounded-lg border outline-none"
            style={{ color: "#12213e" }}
            required
          />

          <input
            type="number"
            name="phone"
            placeholder="Phone Number (Not required for now)"
            value={formData.phone}
            onChange={handleChange}
            className="p-3 rounded-lg border outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 rounded-lg border outline-none"
            style={{ color: "#12213e" }}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="p-3 rounded-lg border outline-none"
            style={{ color: "#12213e" }}
            required
          />

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={handleRegister}
            className="w-full py-3 rounded-lg mt-2 font-semibold disabled:opacity-50"
            style={{ backgroundColor: "#12213e", color: "#fcf9f2" }}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-4" style={{ color: "#12213e" }}>
          Already have an account?{" "}
          <Link 
            className="font-semibold underline"
            style={{ color: "#12213e" }}
            to="/login"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;
