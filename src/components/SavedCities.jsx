function SavedCities({
  cities,
  onRemoveCity,
  onSelectCity,
}) {
  if (!Array.isArray(cities) || cities.length === 0) {
    return (
      <section
        className="saved-cities"
        id="saved-cities"
        aria-label="Saved cities"
      >
        <div className="page-container">
          <div className="saved-cities-heading">
            <div>
              <p className="eyebrow">Your shortlist</p>

              <h2>Saved cities</h2>

              <p>
                Save cities you're considering so you can come back to them
                later.
              </p>
            </div>

            <span className="saved-cities-count">0 saved</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="saved-cities"
      id="saved-cities"
      aria-label="Saved cities"
    >
      <div className="page-container">
        <div className="saved-cities-heading">
          <p className="eyebrow">Your shortlist</p>

          <h2>Saved cities</h2>

          <p>
            Keep track of the places you're considering
            and return to their details whenever you need.
          </p>
        </div>

        <div className="saved-cities-grid">
          {cities.map((city) => (
            <article
              className="saved-city-card"
              key={city.id}
            >
              <div className="saved-city-card-header">
                <div>
                  <p className="saved-city-country">
                    {city.country}
                  </p>

                  <h3>{city.name}</h3>
                </div>

                {city.country_code && (
                  <span className="saved-city-code">
                    {city.country_code}
                  </span>
                )}
              </div>

              <div className="saved-city-location">
                <p>
                  {city.admin1
                    ? `${city.admin1}, ${city.country}`
                    : city.country}
                </p>
              </div>

              <div className="saved-city-coordinates">
                <span>
                  Latitude:{" "}
                  {Number(city.latitude).toFixed(4)}
                </span>

                <span>
                  Longitude:{" "}
                  {Number(city.longitude).toFixed(4)}
                </span>
              </div>

              <div className="saved-city-actions">
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => onSelectCity(city)}
                >
                  View city
                </button>

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => onRemoveCity(city.id)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SavedCities;