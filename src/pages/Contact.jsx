import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

function Contact() {
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

            <form className="contact-form">

              <div className="row">

                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Name"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                  />
                </div>

                <div className="col-12 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Subject"
                  />
                </div>

                <div className="col-12 mb-3">
                  <textarea
                    rows="5"
                    className="form-control"
                    placeholder="Message"
                  ></textarea>
                </div>

                <div className="col-12">
                  <button className="btn btn-warning px-5 rounded-pill">
                    Send Message
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