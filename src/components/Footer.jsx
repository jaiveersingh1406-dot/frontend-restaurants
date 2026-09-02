import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">

      <div className="container text-center">

        <h2 className="mb-3">PLATIA</h2>

        <p>
          Fresh Food • Premium Dining • Best Experience
        </p>

        <div className="social-icons">

          <a href="#">
            <FaFacebookF />
          </a>

          <a href="#">
            <FaInstagram />
          </a>

          <a href="#">
            <FaTwitter />
          </a>

        </div>

        <hr />

        <p className="mb-0">
          © 2026 Platia Restaurant. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;