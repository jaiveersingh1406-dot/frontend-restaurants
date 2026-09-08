import { useEffect, useState } from "react";

import { getMessages } from "../api/contentApi";
import Spinner from "../components/common/Spinner";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const data = await getMessages();
        setMessages(data);
      } catch (err) {
        console.error("GET Messages Error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="admin-section-card">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="text-warning fw-bold text-uppercase">Messages</span>
          <h2 className="mb-0 text-dark">Customer Messages</h2>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">{error?.message || "Failed to load messages."}</div>
      )}

      {loading ? (
        <Spinner label="Loading messages..." />
      ) : messages.length === 0 ? (
        <div className="alert alert-light text-center py-5">
          <div className="display-6 text-muted mb-2">📭</div>
          <p className="text-muted mb-0">No messages yet.</p>
        </div>
      ) : (
        <div className="list-group">
          {messages.map((message) => (
            <div className="list-group-item border-0 rounded-4 mb-2 admin-message-item" key={message.id}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="mb-1">{message.name}</h5>
                  <div className="fw-semibold">{message.subject || "No subject"}</div>
                  <div className="small text-muted">{message.email}</div>
                  <p className="mb-0 text-muted mt-2">{message.message}</p>
                </div>
                {message.sent_at && (
                  <span className="text-muted small">
                    {new Date(message.sent_at).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminMessages;