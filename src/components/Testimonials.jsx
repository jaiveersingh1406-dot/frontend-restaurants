import { useEffect, useState } from "react";

import { getReviews } from "../api/contentApi";
import Spinner from "./common/Spinner";

function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let active = true;

    getReviews()
      .then((data) => {
        if (active) setReviews(data);
      })
      .catch((err) => {
        console.error("GET Reviews Error:", err);
      })
      .finally(() => {
        if (active) setFetching(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="testimonial-section py-5" id="testimonials">
      <div className="container">

        <div className="text-center mb-5">
          <span className="section-title">TESTIMONIALS</span>
          <h2 className="display-5 fw-bold mt-2">
            What Our Customers Say
          </h2>
        </div>

        {fetching ? (
          <Spinner />
        ) : (
          <div className="row">

            {reviews.map((item) => (
              <div className="col-lg-4 col-md-6 mb-4" key={item.id}>

                <div className="testimonial-card">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="testimonial-img"
                  />

                  <h5>{item.name}</h5>

                  <small className="text-warning fw-bold">
                    {item.role}
                  </small>

                  <div className="stars mt-3">
                    ⭐⭐⭐⭐⭐
                  </div>

                  <p className="mt-3">
                    {item.review}
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}

export default Testimonials;
