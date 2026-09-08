import { Link } from "react-router-dom";

function LandingGate() {
  return (
    <section className="landing-gate">
      <div className="landing-gate-backdrop"></div>

      <div className="landing-gate-content">
        <div className="text-center mb-5">
          <h1 className="display-3 fw-bold text-white">
            Welcome to <span style={{ color: "#ffc107" }}>PLATIA</span>
          </h1>
          <p className="text-white-50 fs-5">
            Choose an option to continue
          </p>
        </div>

        <div className="row justify-content-center g-4">
          <div className="col-12 col-md-4">
            <div className="landing-gate-card">
              <div className="landing-gate-icon">🍽️</div>
              <h4 className="text-white">Customer Login</h4>
              <p className="text-white-50">
                Already have an account? Login to order food.
              </p>
              <Link to="/login" className="btn btn-warning rounded-pill px-4">
                Login
              </Link>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="landing-gate-card">
              <div className="landing-gate-icon">✨</div>
              <h4 className="text-white">Sign Up</h4>
              <p className="text-white-50">
                New here? Create an account in seconds.
              </p>
              <Link to="/signup" className="btn btn-outline-warning rounded-pill px-4">
                Sign Up
              </Link>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="landing-gate-card">
              <div className="landing-gate-icon">🛠️</div>
              <h4 className="text-white">Admin Login</h4>
              <p className="text-white-50">
                Restaurant staff? Manage your restaurant.
              </p>
              <Link to="/admin/login" className="btn btn-light rounded-pill px-4">
                Admin Login
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-5">
          <Link to="/home" className="text-white-50 text-decoration-none">
            Continue browsing as guest →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default LandingGate;