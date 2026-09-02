import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ApiError } from "../api/client";
import { ROLES } from "../config/constants";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(formData.email.trim(), formData.password);

      const from = location.state?.from;

      if (from && from !== "/login" && from !== "/admin/login") {
        navigate(from, { replace: true });
      } else if (user.role === ROLES.ADMIN) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <span className="auth-badge">PLATIA</span>
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to reserve your favorite table.</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          <div className="d-flex justify-content-end align-items-center mb-3 small-text">
            <Link to="/forgot-password" className="text-warning text-decoration-none">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn btn-warning w-100 auth-btn" disabled={loading}>
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        <p className="auth-footer d-flex justify-content-between align-items-center">
          <span>
            New here? <Link to="/signup">Sign up</Link>
          </span>
          <Link to="/admin/login" className="small text-decoration-none text-muted">
            Admin login →
          </Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
