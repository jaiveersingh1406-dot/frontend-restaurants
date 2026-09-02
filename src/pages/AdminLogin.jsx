import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { ApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";

const DEFAULT_ADMIN_CREDENTIALS = {
  email: "admin@platia.com",
  password: "admin123",
};

function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (isAuthenticated && isAdmin) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fillDefaultAdmin = () => setFormData(DEFAULT_ADMIN_CREDENTIALS);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(formData.email.trim(), formData.password);

      if (user.role !== "admin") {
        setError("This account does not have admin access.");
        return;
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
    <section className="auth-page admin-auth-page">
      <div className="auth-card admin-auth-card">
        <span className="auth-badge">PLATIA · ADMIN PORTAL</span>
        <h2 className="auth-title">Staff Sign In</h2>
        <p className="auth-subtitle">
          Restricted area. Authorized personnel only.
        </p>

        {searchParams.get("expired") === "1" && (
          <div className="alert alert-warning">
            Your session has expired. Please sign in again.
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Admin Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="admin@platia.com"
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
              placeholder="Enter admin password"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3 small-text">
            <button
              type="button"
              className="btn btn-link btn-sm p-0 text-warning text-decoration-none"
              onClick={fillDefaultAdmin}
            >
              Use default admin
            </button>
            <Link to="/" className="text-warning text-decoration-none">
              ← Back to site
            </Link>
          </div>

          <button type="submit" className="btn btn-warning w-100 auth-btn" disabled={loading}>
            {loading ? "Authenticating..." : "Sign in to Admin Portal"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminLoginPage;
