import { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

import { sendMessage } from "../api/contentApi";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: "error", text: "Please fill your name, email and message." });
      return;
    }

    setSending(true);
    try {
      await sendMessage(form);
      setStatus({ type: "success", text: "Message sent successfully! We'll get back to you soon." });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", text: err?.message || "Failed to send message. Please try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="contact-section py-5" id="contact">
      <div className="container">

        <div className="text-center mb-5">
          <span className="section-title">CONTACT US</span>
          <h2 className="display-5 fw-bold mt-2">
            Get In Touch
          </h2>
        </div>

        <div className="row">

          <div className="col-lg-5 mb-4">

            <div className="contact-box">

              <h3 className="mb-4">Contact Information</h3>

              <p>
                <FaMapMarkerAlt className="me-2 text-warning"/>
                123 Restaurant Street, Jaipur, India
              </p>

              <p>
                <FaPhoneAlt className="me-2 text-warning"/>
                +91 9876543210
              </p>

              <p>
                <FaEnvelope className="me-2 text-warning"/>
                info@platia.com
              </p>

            </div>

          </div>

          <div className="col-lg-7">

            <form className="contact-form" onSubmit={handleSubmit}>

              <div className="row">

                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 mb-3">
                  <input
                    type="text"
                    name="subject"
                    className="form-control"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 mb-3">
                  <textarea
                    name="message"
                    rows="5"
                    className="form-control"
                    placeholder="Message"
                    value={form.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="col-12 mb-3">
                  {status && (
                    <div
                      className={`alert ${
                        status.type === "success" ? "alert-success" : "alert-danger"
                      } py-2`}
                    >
                      {status.text}
                    </div>
                  )}
                </div>

                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-warning px-5 rounded-pill"
                    disabled={sending}
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </div>

              </div>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Contact;