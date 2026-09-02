import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { initPayment, verifyPayment } from "../api/paymentsApi";
import ErrorAlert from "../components/common/ErrorAlert";

const ORDER_TABLES = ["T-01", "T-02", "T-04", "T-05", "T-10"];
const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const PHONE_RE = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existing) {
      existing.addEventListener("load", () => resolve(window.Razorpay));
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Razorpay checkout script"))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout script"));
    document.body.appendChild(script);
  });
}

function CartPage() {
  const { items, total, updateQty, removeItem, clearCart } = useCart();
  const { user, isAuthenticated, updateProfile } = useAuth();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tableNo, setTableNo] = useState(ORDER_TABLES[0]);
  const [saveDetails, setSaveDetails] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Prefill from the logged-in user only once on mount
  useEffect(() => {
    if (user) {
      setCustomerName((prev) => prev || user.name || "");
      setPhone((prev) => prev || user.phone || "");
      setEmail((prev) => prev || user.email || "");
    }
  }, [user]);

  const validate = () => {
    const nextErrors = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      nextErrors.customerName = "Please enter your full name (min 2 characters).";
    }

    if (phone.trim() && !PHONE_RE.test(phone.trim().replace(/\s+/g, ""))) {
      nextErrors.phone = "Enter a valid Indian mobile number (e.g. 9876543210).";
    }

    if (email.trim() && !EMAIL_RE.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    return nextErrors;
  };

  const handlePay = async (event) => {
    event.preventDefault();
    setError(null);

    const fieldErrors = validate();
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      setError("Please correct the highlighted fields below.");
      return;
    }

    try {
      setPlacing(true);

      // Optionally save the phone number for the next order
      if (saveDetails && isAuthenticated && phone.trim()) {
        try {
          await updateProfile(phone.trim());
        } catch (e) {
          console.error("Profile save error:", e);
        }
      }

      // 1. Create Razorpay order on the backend
      const paymentOrder = await initPayment(total, `platia_${Date.now()}`);

      // 2. Make sure the checkout script is loaded
      const Razorpay = await loadRazorpayScript();

      // 3. Open the Razorpay payment modal
      const options = {
        key: paymentOrder.key_id,
        amount: paymentOrder.amount, // paise
        currency: paymentOrder.currency,
        name: "PLATIA Restaurant",
        description: "Dine-in order payment",
        order_id: paymentOrder.id,
        prefill: {
          name: customerName.trim(),
          contact: phone.trim() || undefined,
          email: email.trim() || undefined,
        },
        theme: { color: "#ffc107" },
        handler: async (response) => {
          // 4. Verify the signature on the backend, which also places the order
          try {
            const result = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              customer_name: customerName.trim(),
              phone: phone.trim() || null,
              email: email.trim() || null,
              table_no: tableNo,
              total,
              payment_method: "Razorpay",
            });

            setPlacedOrder(result.order);
            clearCart();
            setCustomerName("");
            setPhone("");
            setEmail("");
            setTableNo(ORDER_TABLES[0]);
            setSaveDetails(false);
          } catch (err) {
            console.error("Payment Verify Error:", err);
            setError(err);
          }
        },
        modal: {
          ondismiss: () => {
            setError("Payment was cancelled. Your cart is still saved.");
          },
        },
      };

      const rzp = new Razorpay(options);
      rzp.on("payment.failed", (response) => {
        console.error("Razorpay payment failed:", response?.error);
        setError(
          response?.error?.description ||
            "Payment failed. Please try again."
        );
      });
      rzp.open();
    } catch (err) {
      console.error("Razorpay Init Error:", err);
      setError(err);
    } finally {
      setPlacing(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="cart-page">
        <section className="menu-section py-5 mt-5">
          <div className="container text-center" style={{ maxWidth: "640px" }}>
            <h2 className="fw-bold mb-3">✅ Order Placed & Paid!</h2>
            <p className="text-muted mb-4">
              Thanks <strong>{placedOrder.customer_name}</strong>! Your order
              <strong> #{placedOrder.id}</strong> (₹{placedOrder.total}) for
              table <strong>{placedOrder.table_no || "—"}</strong> has been
              received and paid. We will serve you shortly.
            </p>
            <p className="small text-muted mb-4">
              Payment Status:{" "}
              <span className="text-success fw-bold">
                {placedOrder.payment_status || "Paid"}
              </span>
              {placedOrder.payment_id && (
                <>
                  {" "}
                  · Ref: {placedOrder.payment_id.slice(0, 12)}…
                </>
              )}
            </p>
            <Link to="/menu" className="btn btn-warning rounded-pill px-4 me-2">
              Order More
            </Link>
            <button
              type="button"
              className="btn btn-outline-dark rounded-pill px-4"
              onClick={() => setPlacedOrder(null)}
            >
              View Empty Cart
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <section className="menu-section py-5 mt-5">
        <div className="container" style={{ maxWidth: "900px" }}>
          <div className="text-center mb-5">
            <span className="section-title">YOUR ORDER</span>
            <h2 className="display-5 fw-bold mt-2">Shopping Cart</h2>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-5">
              <p className="fs-5 text-muted mb-4">Your cart is empty 🛒</p>
              <Link to="/menu" className="btn btn-warning rounded-pill px-4">
                Browse Menu
              </Link>
            </div>
          ) : (
            <>
              {error && <ErrorAlert error={error} />}

              <div className="card border-0 shadow mb-4">
                <div className="table-responsive">
                  <table className="table align-middle mb-0 cart-table">
                    <thead className="table-light">
                      <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th style={{ width: "150px" }}>Qty</th>
                        <th className="text-end">Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.key}>
                          <td className="fw-semibold">{item.name}</td>
                          <td>₹{item.price}</td>
                          <td>
                            <div className="input-group input-group-sm qty-group">
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => updateQty(item.key, item.qty - 1)}
                              >
                                −
                              </button>
                              <span className="form-control text-center">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => updateQty(item.key, item.qty + 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="text-end fw-bold">
                            ₹{item.price * item.qty}
                          </td>
                          <td className="text-end">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeItem(item.key)}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="fw-bold fs-5">
                          Total
                        </td>
                        <td className="text-end fw-bold fs-5 text-warning-emphasis">
                          ₹{total}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <form onSubmit={handlePay} noValidate className="card border-0 shadow p-4 checkout-card">

                <h5 className="mb-4">
                  <i className="bi bi-person-circle me-2 text-warning"></i>
                  Delivery Details
                </h5>

                {isAuthenticated && user?.name && (
                  <div className="alert alert-light border small py-2 mb-4">
                    Welcome back, <strong>{user.name}</strong>!{" "}
                    <span className="text-muted">
                      We have filled in your saved information below.
                    </span>
                  </div>
                )}

                {/* CONTACT DETAILS */}
                <div className="mb-4">
                  <h6 className="text-uppercase small fw-bold text-muted mb-3">
                    Contact Details
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.customerName ? "is-invalid" : ""}`}
                        value={customerName}
                        onChange={(event) => {
                          setCustomerName(event.target.value);
                          setErrors((prev) => ({ ...prev, customerName: "" }));
                        }}
                        placeholder="Enter your full name"
                        autoComplete="name"
                      />
                      {errors.customerName && (
                        <div className="invalid-feedback d-block">
                          {errors.customerName}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                        value={phone}
                        onChange={(event) => {
                          setPhone(event.target.value);
                          setErrors((prev) => ({ ...prev, phone: "" }));
                        }}
                        placeholder="98765 43210"
                        autoComplete="tel"
                      />
                      {errors.phone ? (
                        <div className="invalid-feedback d-block">
                          {errors.phone}
                        </div>
                      ) : (
                        <div className="form-text">
                          Indian mobile number. Used for order updates.
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                      {errors.email ? (
                        <div className="invalid-feedback d-block">
                          {errors.email}
                        </div>
                      ) : (
                        <div className="form-text">
                          Your bill/receipt will be sent here.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* DINING DETAILS */}
                <div className="mb-4">
                  <h6 className="text-uppercase small fw-bold text-muted mb-3">
                    Dining Details
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">
                        Table *
                      </label>
                      <select
                        className="form-select"
                        value={tableNo}
                        onChange={(event) => setTableNo(event.target.value)}
                        required
                      >
                        {ORDER_TABLES.map((table) => (
                          <option key={table} value={table}>
                            Table {table}
                          </option>
                        ))}
                      </select>
                      <div className="form-text">
                        Choose the table where you are seated.
                      </div>
                    </div>
                  </div>
                </div>

                {isAuthenticated && (
                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="saveDetails"
                      checked={saveDetails}
                      onChange={(event) => setSaveDetails(event.target.checked)}
                    />
                    <label className="form-check-label small" htmlFor="saveDetails">
                      Save my phone number for next time
                    </label>
                  </div>
                )}

                <div className="d-flex flex-wrap gap-2 mt-2">
                  <button
                    type="submit"
                    className="btn btn-warning rounded-pill px-5 fw-bold"
                    disabled={placing}
                  >
                    {placing
                      ? "Starting Payment..."
                      : `Pay ₹${total} · Razorpay`}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger rounded-pill px-4"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                </div>
                <p className="small text-muted mt-3 mb-0">
                  🔒 Secure payments powered by Razorpay. Your card details are
                  handled by Razorpay and never stored on our server.
                </p>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default CartPage;