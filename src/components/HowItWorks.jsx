function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Tell us about you",
      description:
        "Share your budget, career, lifestyle, climate preferences, family needs, and what matters most to you.",
    },
    {
      number: "02",
      title: "We compare what matters",
      description:
        "WHERE2 combines your priorities with real-world information about cities around the world.",
    },
    {
      number: "03",
      title: "Discover your best matches",
      description:
        "Explore cities ranked around your needs and compare the places that could fit your life.",
    },
  ];

  return (
    <section className="how-it-works">
      <div className="page-container">
        <div className="how-it-works-heading">
          <div>
            <p className="eyebrow">How WHERE2 works</p>

            <h2 className="section-title">
              Your life is unique.
              <br />
              Your city should be too.
            </h2>
          </div>

          <p className="section-description">
            WHERE2 turns the things that matter to you into
            a clearer picture of where you could live, work,
            and build your life.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step) => (
            <article className="step-card" key={step.number}>
              <span className="step-number">
                {step.number}
              </span>

              <div className="step-content">
                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;