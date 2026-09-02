import { useEffect, useState } from "react";

import {
  deleteReservation,
  getReservations,
  updateReservationStatus,
} from "../api/reservationsApi";
import EmptyState from "../components/common/EmptyState";
import ErrorAlert from "../components/common/ErrorAlert";
import PageHeader from "../components/common/PageHeader";
import Spinner from "../components/common/Spinner";

const RESERVATION_STATUSES = [
  { value: "Pending", label: "Pending", cls: "btn-warning" },
  { value: "Confirmed", label: "Confirm", cls: "btn-success" },
  { value: "Waiting", label: "Waiting", cls: "btn-info" },
  { value: "Cancelled", label: "Cancel", cls: "btn-danger-outline" },
];

function statusBadgeClass(status) {
  if (status === "Confirmed") return "text-bg-success";
  if (status === "Pending") return "text-bg-warning";
  if (status === "Waiting") return "text-bg-info";
  if (status === "Cancelled") return "text-bg-secondary";
  return "text-bg-light";
}

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchReservations = async () => {
    try {
      setFetching(true);
      setError(null);
      const filters = statusFilter ? { status: statusFilter } : {};
      const data = await getReservations(filters);
      setReservations(data);
    } catch (err) {
      console.error("GET Reservations Error:", err);
      setError(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatus = async (id, status) => {
    try {
      setBusyId(id);
      const updated = await updateReservationStatus(id, status);
      setReservations((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
    } catch (err) {
      console.error("Update status error:", err);
      alert(err?.message || "Failed to update status");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this reservation?")) return;
    try {
      await deleteReservation(id);
      setReservations((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert(err?.message || "Failed to delete reservation");
    }
  };

  return (
    <div className="admin-section-card">
      <PageHeader badge="Reservations" title="Manage Bookings" />

      <div className="d-flex flex-wrap gap-2 mb-3">
        <select
          className="form-select form-select-sm"
          style={{ width: "auto" }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {RESERVATION_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.value}</option>
          ))}
          <option value="Completed">Completed</option>
        </select>
      </div>

      {error && <ErrorAlert error={error} onRetry={fetchReservations} />}

      {fetching ? (
        <Spinner label="Loading reservations..." />
      ) : reservations.length === 0 ? (
        <EmptyState
          title="No Reservations Found"
          subtitle="New bookings will appear here."
        />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Guests</th>
                <th>Date</th>
                <th>Time</th>
                <th>Table</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.customer_name}</strong>
                    {item.phone && (
                      <div className="small text-muted">{item.phone}</div>
                    )}
                    {item.special_request && (
                      <div
                        className="small text-warning"
                        title={item.special_request}
                      >
                        ★ special request
                      </div>
                    )}
                  </td>
                  <td>{item.guests}</td>
                  <td>{item.reservation_date || "—"}</td>
                  <td>{item.time_slot}</td>
                  <td>{item.table_no}</td>
                  <td>
                    <span className={`badge ${statusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-2 justify-content-end">
                      {RESERVATION_STATUSES.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          disabled={busyId === item.id || item.status === s.value}
                          onClick={() => handleStatus(item.id, s.value)}
                          className={`btn btn-sm rounded-pill ${
                            item.status === s.value
                              ? `${s.cls} disabled`
                              : s.value === "Cancelled"
                                ? "btn-outline-danger"
                                : `btn-outline-secondary`
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        disabled={busyId === item.id}
                        onClick={() => handleDelete(item.id)}
                        className="btn btn-danger btn-sm rounded-pill"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminReservations;
