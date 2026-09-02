const messages = [
  { sender: 'Samaira', subject: 'Table booking request', detail: 'Please confirm availability for Saturday evening.', time: '10 min ago' },
  { sender: 'Bilal', subject: 'Feedback', detail: 'Loved the desserts, would like more vegan options.', time: '24 min ago' },
  { sender: 'Zara', subject: 'Event inquiry', detail: 'Looking for a private dinner arrangement for 15 guests.', time: '1 hr ago' },
];

function AdminMessages() {
  return (
    <div className="admin-section-card">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span className="text-warning fw-bold text-uppercase">Messages</span>
          <h2 className="mb-0 text-dark">Customer Messages</h2>
        </div>
        <button className="btn btn-outline-warning rounded-pill px-4">Reply All</button>
      </div>

      <div className="list-group">
        {messages.map((message) => (
          <div className="list-group-item border-0 rounded-4 mb-2 admin-message-item" key={message.subject}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="mb-1">{message.sender}</h5>
                <div className="fw-semibold">{message.subject}</div>
                <p className="mb-0 text-muted mt-2">{message.detail}</p>
              </div>
              <span className="text-muted small">{message.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminMessages;
