import { useState } from "react";

import { ApiError, apiClient } from "../../api/client";

function ChangePasswordModal({ onClose }) {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiClient.post(
        "/auth/change-password",
        {
          old_password: formData.old_password,
          new_password: formData.new_password,
        },
        { auth: true }
      );

      setSuccess("Password updated successfully!");

      setTimeout(onClose, 1200);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to update password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal d-block"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content border-0 rounded-4">
          <div className="modal-header">
            <h5 className="modal-title">Change Password</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">

              {error && <div className="alert alert-danger py-2">{error}</div>}
              {success && <div className="alert alert-success py-2">{success}</div>}

              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  name="old_password"
                  className="form-control"
                  value={formData.old_password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="new_password"
                  className="form-control"
                  value={formData.new_password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
              </div>

              <div className="mb-1">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  className="form-control"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
              </div>

            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-warning rounded-pill px-4" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
