import { useEffect, useState } from "react";

import { getChefs } from "../api/contentApi";
import Spinner from "./common/Spinner";

function Chef() {
  const [chefs, setChefs] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let active = true;

    getChefs()
      .then((data) => {
        if (active) setChefs(data);
      })
      .catch((err) => {
        console.error("GET Chefs Error:", err);
      })
      .finally(() => {
        if (active) setFetching(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="chef-section">
      <div className="container">

        <div className="text-center mb-5">
          <span className="section-title">OUR CHEFS</span>
          <h2 className="display-5 fw-bold">
            Meet Our Experts
          </h2>
        </div>

        {fetching ? (
          <Spinner />
        ) : (
          <div className="row">

            {chefs.map((chef) => (
              <div
                className="col-lg-4 mb-4"
                key={chef.id}
                data-aos="zoom-in"
              >
                <div className="chef-card">
                  <img src={chef.image} alt={chef.name} />
                  <div className="chef-content">
                    <h4>{chef.name}</h4>
                    <p>{chef.role}</p>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}

export default Chef;
