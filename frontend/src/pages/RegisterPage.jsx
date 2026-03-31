import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/api/users/register", {
        username,
        email,
        password,
      });

      setMessage("Registration successful! Redirecting to login...");

      setUsername("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      console.error("Registration failed:", error);
      setMessage("Registration failed. Try a different username or email.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-sm p-4" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="text-center mb-4">
          <h1 className="h3 mb-1">Create Account</h1>
          <p className="text-muted mb-0">Join StockWatchlist</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Register
          </button>
        </form>

        {message && (
          <div
            className={`alert mt-3 mb-0 ${
              message.includes("successful") ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        <p className="text-center mt-3 mb-0">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;