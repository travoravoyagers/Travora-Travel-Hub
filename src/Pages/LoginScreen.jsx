import { Link } from "react-router-dom";

const LoginScreen = () => {
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

        <form className="flex flex-col gap-4">
          
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded-lg border outline-none"
            style={{ color: "#12213e" }}
          />

          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded-lg border outline-none"
            style={{ color: "#12213e" }}
          />

          <button
            type="button"
            className="w-full py-3 rounded-lg mt-2 font-semibold"
            style={{ backgroundColor: "#12213e", color: "#fcf9f2" }}
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-4" style={{ color: "#12213e" }}>
          Don't have an account? {" "}
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
