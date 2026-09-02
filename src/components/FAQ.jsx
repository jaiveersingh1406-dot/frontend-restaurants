function FAQ() {
  return (
    <section className="faq-section py-5">
      <div className="container">

        <h2 className="text-center mb-5">
          Frequently Asked Questions
        </h2>

        <div className="accordion" id="faq">

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                data-bs-toggle="collapse"
                data-bs-target="#q1"
              >
                Do you offer home delivery?
              </button>
            </h2>

            <div
              id="q1"
              className="accordion-collapse collapse show"
            >
              <div className="accordion-body">
                Yes, we deliver within the city.
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default FAQ;