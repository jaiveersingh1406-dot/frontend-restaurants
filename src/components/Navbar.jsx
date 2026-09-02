import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [scroll, setScroll] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 80);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark fixed-top custom-navbar${
        scroll ? " scrolled" : ""
      }`}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold fs-2" to="/">
          PLATIA
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link active" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/menu">
                Menu
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/gallery">
                Gallery
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/admin">
                Admin
              </Link>
            </li>
          </ul>

          <Link
            to="/cart"
            className={`btn rounded-pill ms-lg-3 ms-0 mt-3 mt-lg-0 position-relative cart-btn${
              count > 0 ? " has-items" : ""
            }`}
          >
            🛒 Cart
            {count > 0 && (
              <span
                key={count}
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-warning cart-badge"
              >
                {count}
              </span>
            )}
          </Link>

          <Link
            to="/reservation"
            className="btn btn-warning rounded-pill ms-lg-4 px-4"
          >
            Book Table
          </Link>

          {isAuthenticated ? (
            <>
              <span
                className={`badge rounded-pill px-3 py-2 ms-lg-3 ms-0 mt-3 mt-lg-0 ${
                  isAdmin ? "text-bg-warning" : "text-bg-light"
                }`}
              >
                {isAdmin ? "★ " : ""}
                {user?.name || user?.email}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-outline-light rounded-pill ms-2 px-4"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-outline-light rounded-pill ms-2 px-4 gap-3"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="btn btn-outline-light rounded-pill ms-2 px-4"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
