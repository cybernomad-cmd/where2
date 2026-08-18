function FinalCTA() {
  return (
    <section className="final-cta" id="get-started">
      <div className="page-container">
        <div className="final-cta-card">
          <div className="final-cta-content">
            <p className="eyebrow">Your next chapter</p>

            <h2>
              Find a city that
              <br />
              fits your life.
            </h2>

            <p>
              Stop choosing cities based on popularity alone.
              Discover places that match your priorities,
              ambitions, and way of life.
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

          <div className="final-cta-mark" aria-hidden="true">
            <span>WHERE</span>
            <strong>2</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;