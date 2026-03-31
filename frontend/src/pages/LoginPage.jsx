import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const token = btoa(`${username}:${password}`);

      await axios.get("http://localhost:8080/api/watchlist", {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      localStorage.setItem("authToken", token);
      localStorage.setItem("username", username);

      setMessage("");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setMessage("Login failed. Check your username or password.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-sm p-4" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="text-center mb-4">
          <h1 className="h3 mb-1">StockWatchlist</h1>
          <p className="text-muted mb-0">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        {message && <div className="alert alert-danger mt-3 mb-0">{message}</div>}

        <p className="text-center mt-3 mb-0">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;