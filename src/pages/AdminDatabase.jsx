const entities = [
  { name: 'users', columns: 'id, name, email, role', desc: 'Stores admin and customer access data' },
  { name: 'products', columns: 'id, name, category, price, stock, image', desc: 'Holds menu items and inventory details' },
  { name: 'reservations', columns: 'id, customer_name, guests, time_slot, table_no, status', desc: 'Tracks bookings and table confirmations' },
  { name: 'accounting', columns: 'id, day, revenue, expenses, orders', desc: 'Stores daily revenue and expense records' },
  { name: 'messages', columns: 'id, sender, subject, detail, created_at', desc: 'Stores customer inquiries and support messages' },
];

function AdminDatabase() {
  return (
    <div className="admin-section-card">
      <div className="mb-4">
        <span className="text-warning fw-bold text-uppercase">Database Design</span>
        <h2 className="mb-0 text-dark">Entity Structure</h2>
      </div>

      <div className="row g-3">
        {entities.map((entity) => (
          <div className="col-12 col-lg-6" key={entity.name}>
            <div className="database-card">
              <div className="database-card-header">
                <span>{entity.name}</span>
                <small>Table</small>
              </div>
              <div className="database-columns">{entity.columns}</div>
              <p className="mb-0 text-muted">{entity.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="database-relationship-box">
          <h5 className="mb-3">Relationship Flow</h5>
          <div className="database-flow">
            <span>users</span>
            <span>→</span>
            <span>reservations</span>
            <span>→</span>
            <span>messages</span>
            <span>→</span>
            <span>products</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDatabase;
