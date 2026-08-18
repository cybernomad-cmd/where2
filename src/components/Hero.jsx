function Hero() {
  return (
    <section className="hero-section">
      <div className="page-container hero-container">
        <div className="hero-content">
          <p className="eyebrow">
            Find the place that fits your life
          </p>

          <h1 className="display-heading">
            Where could you live that fits your life?
          </h1>

          <p className="lead-text">
            WHERE2 helps you discover and compare cities based
            on your lifestyle, budget, career goals, climate
            preferences, and personal priorities.
          </p>

          <div className="button-group">
            <button
              type="button"
              className="button button-primary"
            >
              Discover your cities
            </button>

            <button
              type="button"
              className="button button-secondary"
            >
              Explore how it works
            </button>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-city-card">
            <span className="hero-city-label">
              YOUR NEXT CITY
            </span>

            <strong>Could be anywhere.</strong>

            <div className="hero-location">
              <span>◉</span>
              <span>Worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;