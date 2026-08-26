function Hero() {
  return (
    <section
      className="dashboard-hero"
      aria-labelledby="hero-title"
    >
      <div className="dashboard-hero-content">
        <p className="dashboard-hero-eyebrow">
          FIND YOUR NEXT PLACE TO LIVE
        </p>

        <h1 id="hero-title">
          Find the right place
          <br />
          to live your best life
        </h1>

        <p className="dashboard-hero-description">
          Compare cities worldwide based on weather,
          cost of living and lifestyle that fit you.
        </p>

        <div className="dashboard-hero-actions">
          <button
            type="button"
            className="dashboard-hero-primary"
          >
            <span aria-hidden="true">✦</span>
            Find my match
          </button>
        </div>
      </div>

      <div
        className="dashboard-hero-image"
        role="img"
        aria-label="Beautiful coastal city"
      >
        <div className="dashboard-hero-image-overlay" />

        <div className="dashboard-hero-location-card">
          <span>YOUR NEXT CITY</span>

          <strong>
            Could be
            <br />
            anywhere.
          </strong>

          <small>
            <i />
            Worldwide
          </small>
        </div>
      </div>
    </section>
  );
}

export default Hero;