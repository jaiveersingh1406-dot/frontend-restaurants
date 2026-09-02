import { useEffect, useState } from "react";

import { getGallery } from "../api/contentApi";
import Spinner from "../components/common/Spinner";

function Gallery() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let active = true;

    getGallery()
      .then((data) => {
        if (active) setGalleryImages(data);
      })
      .catch((err) => {
        console.error("GET Gallery Error:", err);
      })
      .finally(() => {
        if (active) setFetching(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="gallery-section py-5 mt-5" id="gallery">
      <div className="container">

        <div className="text-center mb-5">
          <span className="section-title">GALLERY</span>
          <h2 className="display-5 fw-bold mt-2">
            Our Restaurant
          </h2>
        </div>

        {fetching ? (
          <Spinner />
        ) : (
          <div className="row">
            {galleryImages.map((img, index) => (
              <div className="col-lg-4 col-md-6 mb-4" key={index}>
                <div className="gallery-card">
                  <img src={img} alt="gallery" className="img-fluid" />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
      <section id="gallery"></section>
    </section>
  );
}

export default Gallery;
