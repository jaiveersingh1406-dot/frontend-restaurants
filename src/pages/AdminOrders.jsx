import { Fragment, useEffect, useState } from "react";

import {
  deleteOrder,
  getOrders,
  updateOrderStatus,
} from "../api/ordersApi";
import EmptyState from "../components/common/EmptyState";
import ErrorAlert from "../components/common/ErrorAlert";
import PageHeader from "../components/common/PageHeader";
import Spinner from "../components/common/Spinner";
import { ORDER_STATUSES } from "../config/constants";

function statusBadgeClass(status) {
  if (status === "Completed") return "text-bg-success";
  if (status === "Preparing") return "text-bg-info";
  if (status === "Cancelled") return "text-bg-danger";
  return "text-bg-warning";
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const fetchOrders = async () => {
    try {
      setFetching(true);
      setError(null);

      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      if (paymentFilter) filters.payment_status = paymentFilter;

      const data = await getOrders(filters);
      setOrders(data);
    } catch (err) {
      console.error("GET Orders Error:", err);
      setError(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, paymentFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      const updated = await updateOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? updated : order))
      );
    } catch (err) {
      console.error("Update Order Status Error:", err);
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete order #${id}?`)) return;

    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (err) {
      console.error("DELETE Order Error:", err);
      alert(err.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Customer Orders"
        subtitle="Track and manage incoming food orders"
      />

      {error && <ErrorAlert error={error} onRetry={fetchOrders} />}

      <div className="d-flex flex-wrap gap-2 mb-3">
        <select
          className="form-select form-select-sm"
          style={{ width: "auto" }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select
          className="form-select form-select-sm"
          style={{ width: "auto" }}
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {fetching ? (
        <Spinner />
      ) : orders.length === 0 ? (
        <EmptyState message="No orders yet. They will appear here when customers check out." />
      ) : (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Table</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <Fragment key={order.id}>
                    <tr>
                      <td>
                        <strong>#{order.id}</strong>
                        <br />
                        <small className="text-muted">
                          {new Date(order.created_at).toLocaleString()}
                        </small>
                      </td>
                      <td>
                        {order.customer_name}
                        <br />
                        <small className="text-muted">
                          {order.phone || "—"}
                        </small>
                      </td>
                      <td>
                        <span className="badge text-bg-light border">
                          {order.table_no || "—"}
                        </span>
                      </td>
                      <td className="fw-bold">₹{order.total}</td>
                      <td>
                        <select
                          className={`form-select form-select-sm fw-semibold ${statusBadgeClass(order.status)}`}
                          value={order.status}
                          onChange={(event) =>
                            handleStatusChange(order.id, event.target.value)
                          }
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() =>
                            setExpandedId(expandedId === order.id ? null : order.id)
                          }
                        >
                          {expandedId === order.id ? "Hide" : "Details"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(order.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr>
                        <td colSpan="6" className="bg-light">
                          <div className="small">
                            <strong>Order:</strong> #{order.id} ·{" "}
                            {new Date(order.created_at).toLocaleString()}
                            <br />
                            <strong>Customer:</strong> {order.customer_name} ·{" "}
                            {order.phone || "No phone"}
                            {order.email && <> · {order.email}</>}
                            <br />
                            <strong>Table:</strong> {order.table_no || "—"}
                            <br />
                            <strong>Payment:</strong>{" "}
                            <span
                              className={
                                order.payment_status === "Paid"
                                  ? "text-success"
                                  : "text-muted"
                              }
                            >
                              {order.payment_status || "Not Paid"}
                            </span>
                            {order.payment_method && (
                              <> · {order.payment_method}
                                {order.payment_id && (
                                  <> · Ref: {order.payment_id.slice(0, 12)}…</>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
