import { useEffect, useRef, useState } from "react";

import { createReservation, getAvailability } from "../api/reservationsApi";
import { ApiError } from "../api/client";
import { RESERVATION_FORM_TEMPLATE } from "../config/constants";

const TIME_SLOTS = [
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "6:00 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "10:00 PM",
];

function Reservation() {
  const [form, setForm] = useState(RESERVATION_FORM_TEMPLATE);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const abortRef = useRef(null);

  const fetchAvailability = async (date, timeSlot) => {
    try {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoadingTables(true);
      const data = await getAvailability(date, timeSlot);
      setTables(data.tables);
    } catch {
      setTables([]);
    } finally {
      setLoadingTables(false);
    }
  };

  useEffect(() => {
    if (form.reservation_date && form.time_slot) {
      fetchAvailability(form.reservation_date, form.time_slot);
    } else {
      setTables([]);
    }
  }, [form.reservation_date, form.time_slot]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const next = { ...form, [name]: value };

    if (name === "reservation_date" || name === "time_slot") {
      next.table_no = "";
      setTables([]);
    }

    setForm(next);

    if (status.text) setStatus({ type: "", text: "" });
  };

  const handleSelectTable = (table_no, tableStatus) => {
    if (tableStatus === "Booked") return;
    setForm((prev) => ({ ...prev, table_no: prev.table_no === table_no ? "" : table_no }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.customer_name.trim() || !form.time_slot || !form.reservation_date) {
      setStatus({
        type: "error",
        text: "Please fill your name, date and time slot.",
      });
      return;
    }

    if (!form.table_no) {
      setStatus({ type: "error", text: "Please select an available table." });
      return;
    }

    setLoading(true);

    try {
      await createReservation({
        customer_name: form.customer_name.trim(),
        guests: Number(form.guests) || 2,
        reservation_date: form.reservation_date,
        time_slot: form.time_slot,
        phone: form.phone.trim() || null,
        table_no: form.table_no,
        special_request: form.special_request.trim() || null,
        status: "Pending",
      });

      setForm(RESERVATION_FORM_TEMPLATE);
      setTables([]);

      setStatus({
        type: "success",
        text: "Table reserved! We will confirm your booking shortly.",
      });
    } catch (err) {
      setStatus({
        type: "error",
        text:
          err instanceof ApiError
            ? err.message
            : "Booking failed. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="reservation-section py-5" id="reservation">
      <div className="container">

        <div className="text-center mb-5">
          <span className="section-title">RESERVATION</span>
          <h2 className="display-5 fw-bold mt-2">
            Book Your Table
          </h2>
          <p className="text-muted">
            Reserve your table and enjoy an unforgettable dining experience.
          </p>
        </div>

        <div className="reservation-box shadow-lg">

          <form onSubmit={handleSubmit} noValidate>

            <div className="row">

              <div className="col-md-6 mb-4">
                <input
                  type="text"
                  name="customer_name"
                  className="form-control"
                  placeholder="Your Name *"
                  value={form.customer_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-4">
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-4">
                <input
                  type="date"
                  name="reservation_date"
                  className="form-control"
                  min={new Date().toISOString().split("T")[0]}
                  value={form.reservation_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-4">
                <select
                  name="time_slot"
                  className="form-select"
                  value={form.time_slot}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Time Slot *</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-4">
                <input
                  type="number"
                  name="guests"
                  className="form-control"
                  placeholder="Guests"
                  min="1"
                  max="20"
                  value={form.guests}
                  onChange={handleChange}
                />
              </div>

              {form.reservation_date && form.time_slot && (
                <div className="col-12 mb-4">
                  <label className="form-label fw-semibold mb-2">
                    Select Table *
                    {!loadingTables && tables.length > 0 && (
                      <span className="badge text-bg-success ms-2">
                        {tables.filter((t) => t.status === "Free").length} Free
                      </span>
                    )}
                    {!loadingTables && tables.length > 0 &&
                      tables.every((t) => t.status === "Booked") && (
                      <span className="badge text-bg-danger ms-2">
                        No tables available
                      </span>
                    )}
                  </label>

                  {loadingTables ? (
                    <p className="text-muted small mb-0">Checking availability...</p>
                  ) : (
                    <div className="d-flex flex-wrap gap-2 table-chips">
                      {tables.map((table) => (
                        <button
                          key={table.table_no}
                          type="button"
                          disabled={table.status === "Booked"}
                          onClick={() => handleSelectTable(table.table_no, table.status)}
                          className={`btn table-chip ${
                            form.table_no === table.table_no
                              ? "selected"
                              : table.status === "Booked"
                                ? "booked"
                                : "free"
                          }`}
                        >
                          {table.table_no}
                          {table.status === "Booked" && " ✕"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {form.reservation_date && form.time_slot && !loadingTables && (
                <div className="col-12 mb-4">
                  <p className="form-control-plaintext text-muted small p-0 mb-0">
                    {!form.table_no
                      ? "Tap a free table above to select it."
                      : `Selected: Table ${form.table_no}`}
                  </p>
                </div>
              )}

              <div className="col-12 mb-4">
                <textarea
                  rows="4"
                  name="special_request"
                  className="form-control"
                  placeholder="Special Request (birthday setup, window seat...)"
                  value={form.special_request}
                  onChange={handleChange}
                ></textarea>
              </div>

              {status.text && (
                <div className="col-12 mb-4">
                  <div className={`alert ${status.type === "success" ? "alert-success" : "alert-danger"} mb-0`}>
                    {status.text}
                  </div>
                </div>
              )}

              <div className="col-12 text-center">
                <button
                  type="submit"
                  className="btn btn-warning px-5 rounded-pill"
                  disabled={loading}
                >
                  {loading ? "Reserving..." : "Reserve Now"}
                </button>
              </div>

            </div>

          </form>

        </div>

      </div>
    </section>
  );
}

export default Reservation;
