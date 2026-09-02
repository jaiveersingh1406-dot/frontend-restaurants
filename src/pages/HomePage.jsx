import Hero from "./Hero";
import About from "./About";
import Menu from "./Menu";
import Gallery from "./Gallery";
import Reservation from "./Reservation";
import Testimonials from "../components/Testimonials";
import Contact from "./Contact";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Menu />
      <Gallery />
      <Reservation />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}

export default HomePage;
