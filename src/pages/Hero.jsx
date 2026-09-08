import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";

const HERO_VIDEO_URL = "https://res.cloudinary.com/dnjau9zjm/video/upload/q_auto,f_mp4/v1788891958/platia/ygmntykfkzhjoyd24xjl.mp4";


function Hero() {
  return (
    <section className="hero">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="hero-video"
      >
        <source src={HERO_VIDEO_URL} type="video/mp4" />
      </video>

      <div className="overlay"></div>

      <div className="hero-content">

        <h1>
          Welcome to <span>PLATIA</span>
        </h1>

        <p>
          Discover delicious food with a premium dining experience.
        </p>

        <Link
          to="/menu"
          className="btn btn-warning btn-lg rounded-pill px-5"
        >
          Explore Menu
        </Link>
      </div>

    </section>
  );
}

export default Hero;