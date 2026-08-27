function SavedCities({
  cities,
  onRemoveCity,
  onSelectCity,
  onClearCities,
}) {
  const hasSavedCities =
    Array.isArray(cities) && cities.length > 0;

  function handleClearCities() {
    const shouldClear = window.confirm(
      "Are you sure you want to remove all saved cities?"
    );

    if (!shouldClear) {
      return;
    }

    onClearCities();
  }

  if (!hasSavedCities) {
    return (
      <section
        className="saved-cities dashboard-section"
        id="saved-cities"
        aria-label="Saved cities"
      >
        <div className="dashboard-section-header">
          <div>
            <p className="dashboard-eyebrow">
              YOUR SHORTLIST
            </p>

            <h2>Saved cities</h2>

            <p>
              Save cities you're considering so you can
              quickly compare them later.
            </p>
          </div>

          <span className="saved-cities-count">
            0 saved
          </span>
        </div>

        <div className="saved-cities-empty-card">
          <div className="saved-cities-empty-icon">
            ☆
          </div>

          <div>
            <h3>No saved cities yet</h3>

            <p>
              Explore cities and save the places that
              match the way you want to live.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="saved-cities dashboard-section"
      id="saved-cities"
      aria-label="Saved cities"
    >
      <div className="dashboard-section-header">
        <div>
          <p className="dashboard-eyebrow">
            YOUR SHORTLIST
          </p>

          <h2>Saved cities</h2>

          <p>
            Your shortlisted places at a glance.
          </p>
        </div>

        <div className="saved-cities-header-actions">
          <span className="saved-cities-count">
            {cities.length}{" "}
            {cities.length === 1 ? "saved" : "saved"}
          </span>

          <button
            type="button"
            className="saved-cities-view-all"
            onClick={() => {
              const section =
                document.getElementById("saved-cities");

              section?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            View all →
          </button>

          <button
            type="button"
            className="saved-cities-clear-button"
            onClick={handleClearCities}
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="saved-cities-dashboard-grid">
        {cities.map((city, index) => {
          const matchScore = Math.max(
            80,
            91 - index * 3
          );

          return (
            <article
              className="saved-city-dashboard-card"
              key={city.id}
            >
              <div className="saved-city-image">
                <div className="saved-city-image-overlay">
                  <span className="saved-city-country-code">
                    {city.country_code || "—"}
                  </span>

                  <span className="saved-city-match">
                    {matchScore}% Match
                  </span>
                </div>

                <div className="saved-city-placeholder">
                  {city.name?.charAt(0)?.toUpperCase()}
                </div>
              </div>

              <div className="saved-city-dashboard-content">
                <div className="saved-city-dashboard-heading">
                  <div>
                    <h3>{city.name}</h3>

                    <p>
                      {city.country}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="saved-city-menu"
                    aria-label={`Options for ${city.name}`}
                  >
                    •••
                  </button>
                </div>

                <div className="saved-city-dashboard-location">
                  {city.admin1
                    ? `${city.admin1}, ${city.country}`
                    : city.country}
                </div>

                <div className="saved-city-dashboard-meta">
                  <span>
                    Lat{" "}
                    {Number(city.latitude).toFixed(2)}
                  </span>

                  <span>
                    Lon{" "}
                    {Number(city.longitude).toFixed(2)}
                  </span>
                </div>

                <div className="saved-city-dashboard-footer">
                  <div className="saved-city-weather-placeholder">
                    <span className="saved-city-weather-icon">
                      ☀
                    </span>

                    <div>
                      <strong>Explore</strong>

                      <small>
                        View city details
                      </small>
                    </div>
                  </div>

                  <span className="saved-city-score">
                    {matchScore}%
                  </span>
                </div>

                <div className="saved-city-dashboard-actions">
                  <button
                    type="button"
                    className="saved-city-view-button"
                    onClick={() =>
                      onSelectCity(city)
                    }
                  >
                    View details
                  </button>

                  <button
                    type="button"
                    className="saved-city-remove-button"
                    onClick={() =>
                      onRemoveCity(city.id)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default SavedCities;