import video from "../assets/video/227128.mp4";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";


function Hero() {
  return (
    <section className="hero">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="hero-video"
      >
        <source src={video} type="video/mp4" />
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