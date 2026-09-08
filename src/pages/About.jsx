import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function About() {
  return (
    <>
      <div className="mt-5 pt-5">
     <Navbar />
    <section className="about-section py-5" id="about">
        
       
        
        <div className="container">
        <div className="row align-items-center">

          <div className="col-lg-6 mb-4 mb-lg-0">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900"
              alt="Restaurant"
              className="img-fluid rounded-4 shadow-lg about-img"
            />
          </div>

          <div className="col-lg-6">

            <span className="section-title">
              ABOUT US
            </span>

            <h2 className="display-5 fw-bold mt-3">
              Enjoy Every Bite
            </h2>

            <p className="mt-4 text-secondary">
              We serve freshly prepared dishes using premium ingredients.
              Every meal is crafted with passion to deliver unforgettable
              flavours and a memorable dining experience.
            </p>

            <div className="row mt-4">

              <div className="col-6">
                <div className="feature-box">
                  🍽️ Fresh Food
                </div>
              </div>

              <div className="col-6">
                <div className="feature-box">
                  👨‍🍳 Expert Chefs
                </div>
              </div>

              <div className="col-6 mt-3">
                <div className="feature-box">
                  ⭐ 5 Star Service
                </div>
              </div>

              <div className="col-6 mt-3">
                <div className="feature-box">
                  🚚 Fast Delivery
                </div>
              </div>

            </div>

            <Link
              to="/contact"
              className="btn btn-warning mt-5 px-5 rounded-pill"
            >
              Learn More
            </Link>

          </div>

        </div>
      </div>
      </section>        
  </div>

      </>
  );
}

export default About;