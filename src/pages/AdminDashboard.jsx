import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getDashboardStats } from '../api/dashboardApi';
import ErrorAlert from '../components/common/ErrorAlert';
import Spinner from '../components/common/Spinner';
import { useAuth } from '../context/AuthContext';

function statusBadgeClass(status) {
  if (status === 'Completed') return 'text-bg-success';
  if (status === 'Preparing') return 'text-bg-info';
  if (status === 'Cancelled') return 'text-bg-danger';
  return 'text-bg-warning';
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setError(null);
        setStats(await getDashboardStats(period));
      } catch (err) {
        console.error('Dashboard Stats Error:', err);
        setError(err);
      }
    };

    loadStats();
  }, [period]);

  const kpis = stats
    ? [
        { label: 'Total Orders', value: stats.total_orders.toLocaleString(), tone: 'warning' },
        { label: 'Reservations', value: stats.reservations_count.toLocaleString(), tone: 'success' },
        { label: 'Revenue', value: `$${stats.revenue_total.toLocaleString()}`, tone: 'info' },
        { label: 'Customers', value: stats.customers_count.toLocaleString(), tone: 'dark' },
      ]
    : [];

  const maxRevenue =
    stats && stats.performance.length > 0
      ? Math.max(...stats.performance.map((p) => Number(p.revenue)))
      : 0;

  const lowStockItems = stats ? stats.inventory.filter((i) => Number(i.stock) <= 10) : [];

  return (
    <div className="admin-page">
      <div className="container py-5">
        <div className="admin-header d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
          <div>
            <span className="text-warning fw-bold text-uppercase">Admin Portal</span>
            <h1 className="display-5 fw-bold text-white mt-2">Restaurant Control Center</h1>
            <p className="text-white-50 mb-0">
              Welcome back, {user?.name || 'Admin'} — live records for reservations, products, menu health, and daily performance.
            </p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <div className="d-flex align-items-center gap-2">
              <span className="text-white-50 small">Period:</span>
              <select
                className="form-select form-select-sm bg-dark text-white border-secondary"
                style={{ width: "auto" }}
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="day">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
            <Link to="/home" className="btn btn-outline-light rounded-pill px-4">Back to Site</Link>
            <button className="btn btn-warning rounded-pill px-4" onClick={() => window.print()}>Export Report</button>
          </div>
        </div>

        {error && <ErrorAlert error={error} onRetry={() => window.location.reload()} />}

        {!stats && !error && <Spinner label="Loading dashboard..." />}

        {stats && (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-white-50 small">
                Showing data for <strong className="text-warning">{stats.period_label || 'All Time'}</strong>
              </span>
            </div>
            <div className="row g-4 mb-4">
              {kpis.map((stat) => (
                <div className="col-12 col-md-6 col-xl-3" key={stat.label}>
                  <div className={`admin-kpi admin-kpi-${stat.tone}`}>
                    <p>{stat.label}</p>
                    <h3>{stat.value}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* STATUS + PAYMENT BREAKDOWN */}
            <div className="row g-4 mb-4">
              <div className="col-12 col-md-6">
                <div className="admin-card h-100">
                  <h4 className="mb-3">Orders by Status</h4>
                  {Object.keys(stats.orders_by_status).length === 0 ? (
                    <div className="text-muted">No orders yet.</div>
                  ) : (
                    Object.entries(stats.orders_by_status).map(([status, count]) => (
                      <div key={status} className="d-flex justify-content-between align-items-center border-bottom py-2">
                        <span className={`badge ${statusBadgeClass(status)}`}>{status}</span>
                        <strong>{count} order{count !== 1 ? 's' : ''}</strong>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="admin-card h-100">
                  <h4 className="mb-3">Payments</h4>
                  {Object.keys(stats.payment_breakdown).length === 0 ? (
                    <div className="text-muted">No payments recorded.</div>
                  ) : (
                    Object.entries(stats.payment_breakdown).map(([status, count]) => (
                      <div key={status} className="d-flex justify-content-between align-items-center border-bottom py-2">
                        <span>
                          <i className={`bi me-2 ${status === 'Paid' ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}`}></i>
                          {status}
                        </span>
                        <strong>{count}</strong>
                      </div>
                    ))
                  )}
                  <div className="d-flex justify-content-between align-items-center pt-2">
                    <span className="badge text-bg-warning">{stats.payment_breakdown_total || 0} total</span>
                    <span className="badge text-bg-success">
                      {stats.revenue_total ? `$${stats.revenue_total.toLocaleString()} collected` : 'No revenue'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT ORDERS + RECENT RESERVATIONS */}
            <div className="row g-4 mb-4">
              <div className="col-12 col-xl-7">
                <div className="admin-card h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Recent Orders</h4>
                    <Link to="/admin/orders" className="btn btn-sm btn-outline-warning rounded-pill">View All</Link>
                  </div>
                  <div className="table-responsive">
                    <table className="table align-middle mb-0 admin-data-table">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Customer</th>
                          <th>Table</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recent_orders.length === 0 ? (
                          <tr><td colSpan="5" className="text-center text-muted py-4">No orders found.</td></tr>
                        ) : (
                          stats.recent_orders.map((o) => (
                            <tr key={o.id}>
                              <td>#{o.id}<br /><small className="text-muted">{new Date(o.created_at).toLocaleDateString()}</small></td>
                              <td>
                                {o.customer_name}
                                {o.email && <div className="small text-muted">{o.email}</div>}
                              </td>
                              <td><span className="badge text-bg-light border">{o.table_no || '—'}</span></td>
                              <td className="fw-bold">${o.total}</td>
                              <td><span className={`badge ${statusBadgeClass(o.status)}`}>{o.status}</span></td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="col-12 col-xl-5">
                <div className="admin-card h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Recent Reservations</h4>
                    <Link to="/admin/reservations" className="btn btn-sm btn-outline-warning rounded-pill">View All</Link>
                  </div>
                  <div className="table-responsive">
                    <table className="table align-middle mb-0 admin-data-table">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Table</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recent_reservations.length === 0 ? (
                          <tr><td colSpan="3" className="text-center text-muted py-4">No reservations found.</td></tr>
                        ) : (
                          stats.recent_reservations.map((item) => (
                            <tr key={item.id}>
                              <td>
                                {item.customer_name}
                                {item.time_slot && <div className="small text-muted">{item.time_slot}</div>}
                              </td>
                              <td><span className="badge text-bg-light border">{item.table_no || '—'}</span></td>
                              <td>
                                <span className={`badge ${item.status === 'Confirmed' ? 'text-bg-success' : item.status === 'Pending' || item.status === 'Waiting' ? 'text-bg-warning' : 'text-bg-secondary'}`}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* INVENTORY + PERFORMANCE */}
            <div className="row g-4">
              <div className="col-12 col-xl-6">
                <div className="admin-card h-100">
                  <h4 className="mb-3">Menu Inventory (Lowest Stock)</h4>
                  {stats.inventory.length === 0 ? (
                    <div className="list-group list-group-flush">
                      <div className="list-group-item admin-db-item text-muted">No products found.</div>
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {stats.inventory.map((item) => (
                        <div className="list-group-item d-flex justify-content-between align-items-center admin-db-item" key={item.id}>
                          <div>
                            <strong>{item.name}</strong>
                            <div className="small text-muted">{item.stock} left</div>
                          </div>
                          <span className={`badge ${Number(item.stock) <= 10 ? 'text-bg-danger' : 'text-bg-success'}`}>
                            {Number(item.stock) <= 10 ? 'Low Stock' : item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {lowStockItems.length > 0 && (
                    <div className="alert alert-warning small mb-0 mt-3">
                      ⚠️ {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} low on stock. Restock soon.
                    </div>
                  )}
                </div>
              </div>

              <div className="col-12 col-xl-6">
                <div className="admin-card h-100">
                  <h4 className="mb-3">Performance Snapshot (Revenue)</h4>
                  <div className="admin-chart">
                    {stats.performance.map((p) => (
                      <div
                        className="chart-bar"
                        style={{ height: `${maxRevenue > 0 ? Math.round((Number(p.revenue) / maxRevenue) * 100) : 0}%` }}
                        key={p.day}
                        title={`$${Number(p.revenue).toLocaleString()}`}
                      >
                        <span>{p.day.slice(0, 3)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                    <div>
                      <div className="small text-muted">Revenue</div>
                      <strong>${stats.accounting_revenue.toLocaleString()}</strong>
                    </div>
                    <div>
                      <div className="small text-muted">Expenses</div>
                      <strong>${stats.expenses.toLocaleString()}</strong>
                    </div>
                    <div>
                      <div className="small text-muted">Profit</div>
                      <strong className={stats.profit >= 0 ? 'text-success' : 'text-danger'}>
                        ${stats.profit.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;