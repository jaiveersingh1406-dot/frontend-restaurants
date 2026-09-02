import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";

function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const nextErrors = {};
    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!name) {
      nextErrors.name = "Full name is required.";
    } else if (name.length < 2) {
      nextErrors.name = "Full name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      nextErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await signup(formData.name.trim(), formData.email.trim().toLowerCase(), formData.password);

      setMessage({
        type: "success",
        text: "Account created successfully! Redirecting to login...",
      });

      setTimeout(() => navigate("/login", { replace: true }), 800);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setErrors({ email: "This email is already registered." });
        setMessage({
          type: "error",
          text: "This email is already registered. Please login instead.",
        });
      } else {
        setMessage({
          type: "error",
          text: err instanceof ApiError ? err.message : "Signup failed. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-container">
        <h1>PLATIA</h1>

        <h2>Create account</h2>

        <p>Join us and book your favorite dining experience.</p>

        {message.text && (
          <div
            className={`alert ${
              message.type === "success" ? "alert-success" : "alert-danger"
            }`}
          >
            {message.text}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Full name</label>

            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <div className="invalid-feedback d-block">{errors.name}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>

            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="invalid-feedback d-block">{errors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>

            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className="invalid-feedback d-block">{errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-warning w-100 auth-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}

export default SignupPage;
