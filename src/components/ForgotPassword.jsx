import { useState } from "react";
import { Link } from "react-router-dom";

import { checkEmailExists } from "../api/authApi";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { exists } = await checkEmailExists(email);
      setMessage(
        exists
          ? `Reset instructions have been sent to ${email}.`
          : "No account found with this email. Please sign up first."
      );
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <span className="auth-badge">PLATIA</span>
        <h2 className="auth-title">Forgot password?</h2>
        <p className="auth-subtitle">
          Enter your email address and we'll guide you to reset your password.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-warning w-100 auth-btn" disabled={loading}>
            {loading ? "Checking..." : "Send Reset Link"}
          </button>
        </form>

        {message && <p className="auth-status mt-3">{message}</p>}

        <p className="auth-footer">
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}

export default ForgotPassword;
