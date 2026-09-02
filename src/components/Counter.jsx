function Counter() {
  return (
    <section className="counter-section">
      <div className="container">
        <div className="row text-center">

          <div className="col-md-3" data-aos="fade-up">
            <h1>25+</h1>
            <p>Expert Chefs</p>
          </div>

          <div className="col-md-3" data-aos="fade-up" data-aos-delay="150">
            <h1>500+</h1>
            <p>Food Items</p>
          </div>

          <div className="col-md-3" data-aos="fade-up" data-aos-delay="300">
            <h1>12K+</h1>
            <p>Happy Customers</p>
          </div>

          <div className="col-md-3" data-aos="fade-up" data-aos-delay="450">
            <h1>15+</h1>
            <p>Years Experience</p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Counter;