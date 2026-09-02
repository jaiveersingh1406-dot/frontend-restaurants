import { useEffect, useState } from "react";

import {
  createAccountingEntry,
  deleteAccountingEntry,
  getAccountingEntries,
} from "../api/accountingApi";
import { getSalesSummary } from "../api/salesApi";
import EmptyState from "../components/common/EmptyState";
import ErrorAlert from "../components/common/ErrorAlert";
import PageHeader from "../components/common/PageHeader";
import Spinner from "../components/common/Spinner";
import {
  ACCOUNTING_FORM_TEMPLATE,
  WEEKDAYS,
} from "../config/constants";

const emptyForm = ACCOUNTING_FORM_TEMPLATE;

function AdminAccounting() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [sales, setSales] = useState(null);
  const [salesPeriod, setSalesPeriod] = useState("all");

  const fetchEntries = async () => {
    try {
      setFetching(true);
      setError(null);

      const data = await getAccountingEntries();
      setEntries(data);
    } catch (err) {
      console.error("GET Accounting Error:", err);
      setError(err);
    } finally {
      setFetching(false);
    }
  };

  const fetchSales = async () => {
    try {
      setSales(await getSalesSummary(salesPeriod));
    } catch (err) {
      console.error("GET Sales Summary Error:", err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesPeriod]);

  const totalRevenue = entries.reduce((sum, e) => sum + Number(e.revenue || 0), 0);
  const totalExpenses = entries.reduce((sum, e) => sum + Number(e.expenses || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.day || form.revenue === "" || form.expenses === "") {
      alert("Please fill day, revenue and expenses");
      return;
    }

    const entryData = {
      day: form.day,
      revenue: Number(form.revenue),
      expenses: Number(form.expenses),
      orders: Number(form.orders) || 0,
    };

    try {
      setLoading(true);

      await createAccountingEntry(entryData);

      setForm(emptyForm);
      await fetchEntries();
    } catch (err) {
      console.error("POST Accounting Error:", err);
      alert(err?.message || "Failed to add accounting entry");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this entry?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteAccountingEntry(id);

      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert(err?.message || "Failed to delete entry");
    }
  };

  return (
    <div className="admin-section-card">

      <PageHeader
        badge="Accounting"
        title="Daily Revenue Overview"
      />

      {error && <ErrorAlert error={error} onRetry={fetchEntries} />}

      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
        <h5 className="mb-0 fw-bold">Sales Overview</h5>
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small">Period:</span>
          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={salesPeriod}
            onChange={(e) => setSalesPeriod(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="day">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="accounting-stat accounting-green">
            <span>Revenue</span>
            <strong>${(sales ? Number(sales.total_revenue) : totalRevenue).toLocaleString()}</strong>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="accounting-stat accounting-gold">
            <span>Expenses</span>
            <strong>${(sales ? Number(sales.total_expenses) : totalExpenses).toLocaleString()}</strong>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="accounting-stat accounting-blue">
            <span>Net Profit</span>
            <strong>${(sales ? Number(sales.net_profit) : netProfit).toLocaleString()}</strong>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="accounting-stat accounting-dark">
            <span>Orders</span>
            <strong>{(sales ? Number(sales.total_orders) : 0).toLocaleString()}</strong>
          </div>
        </div>
      </div>

      <div className="row g-4">

        <div className="col-12 col-xl-4">

          <form
            className="product-form"
            onSubmit={handleSubmit}
          >

            <h5 className="mb-4">
              Add Daily Entry
            </h5>

            <div className="mb-3">

              <label className="form-label">
                Day
              </label>

              <select
                name="day"
                className="form-select"
                value={form.day}
                onChange={handleChange}
              >
                {WEEKDAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

            </div>

            <div className="row g-3">

              <div className="col-12 col-md-6">

                <label className="form-label">
                  Revenue
                </label>

                <input
                  type="number"
                  name="revenue"
                  className="form-control"
                  value={form.revenue}
                  onChange={handleChange}
                  placeholder="1200"
                  min="0"
                  step="0.01"
                />

              </div>

              <div className="col-12 col-md-6">

                <label className="form-label">
                  Expenses
                </label>

                <input
                  type="number"
                  name="expenses"
                  className="form-control"
                  value={form.expenses}
                  onChange={handleChange}
                  placeholder="400"
                  min="0"
                  step="0.01"
                />

              </div>

            </div>

            <div className="mb-3 mt-3">

              <label className="form-label">
                Orders
              </label>

              <input
                type="number"
                name="orders"
                className="form-control"
                value={form.orders}
                onChange={handleChange}
                placeholder="80"
                min="0"
              />

            </div>

            <button
              type="submit"
              className="btn btn-warning rounded-pill w-100 mt-2"
              disabled={loading}
            >
              {loading ? "Saving Entry..." : "Save Entry"}
            </button>

          </form>

        </div>

        <div className="col-12 col-xl-8">

          {fetching ? (

            <Spinner label="Loading accounting data..." />

          ) : entries.length === 0 ? (

            <EmptyState
              title="No Entries Found"
              subtitle="Add your first daily entry."
            />

          ) : (

            <div className="table-responsive">
              <table className="table align-middle table-hover">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Revenue</th>
                    <th>Expenses</th>
                    <th>Net</th>
                    <th>Orders</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => {

                    const net =
                      Number(entry.revenue || 0) -
                      Number(entry.expenses || 0);

                    return (
                      <tr key={entry.id}>
                        <td>{entry.day}</td>
                        <td>${Number(entry.revenue).toLocaleString()}</td>
                        <td>${Number(entry.expenses).toLocaleString()}</td>
                        <td className={net >= 0 ? "fw-bold text-success" : "fw-bold text-danger"}>
                          ${net.toLocaleString()}
                        </td>
                        <td>{entry.orders}</td>
                        <td className="text-end">
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="btn btn-outline-danger btn-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminAccounting;
