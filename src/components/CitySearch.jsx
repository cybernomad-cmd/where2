import { useState } from "react";
import { searchCities } from "../services/geocodingApi";

function CitySearch({ onCitySelect }) {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setCities([]);
      setError("Please enter a city name.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError("");
    setCities([]);

    try {
      const results = await searchCities(trimmedQuery);

      setCities(results);
      setStatus(results.length > 0 ? "success" : "empty");
    } catch (requestError) {
      setCities([]);
      setError(
        requestError.message ||
          "Unable to search for cities right now."
      );
      setStatus("error");
    }
  }

  function handleCitySelect(city) {
    onCitySelect(city);
  }

  return (
    <section className="city-search" id="city-search">
      <div className="page-container">
        <div className="city-search-heading">
          <p className="eyebrow">Discover your possibilities</p>

          <h2 className="section-title">
            Where could you live?
          </h2>

          <p className="section-description">
            Search for a city and start exploring the
            information that could help you decide if it
            fits your life.
          </p>
        </div>

        <form
          className="city-search-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="city-search-input">
            Search for a city
          </label>

          <div className="city-search-input-group">
            <input
              id="city-search-input"
              type="search"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Try Nairobi, Lisbon, or Tokyo"
              autoComplete="off"
            />

            <button
              type="submit"
              className="button button-primary"
              disabled={status === "loading"}
            >
              {status === "loading"
                ? "Searching..."
                : "Search cities"}
            </button>
          </div>
        </form>

        <div
          className="city-search-results"
          aria-live="polite"
        >
          {status === "loading" && (
            <div className="search-state">
              <p>Searching for cities...</p>
            </div>
          )}

          {status === "error" && (
            <div
              className="search-state search-state-error"
              role="alert"
            >
              <h3>We couldn't complete that search.</h3>
              <p>{error}</p>
            </div>
          )}

          {status === "empty" && (
            <div className="search-state">
              <h3>No cities found.</h3>

              <p>
                Try another city name or check your spelling.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="city-search-grid">
              {cities.map((city) => (
                <button
                  type="button"
                  className="search-city-card"
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                >
                  <div className="search-city-card-top">
                    <span className="city-country">
                      {city.country}
                    </span>

                    <span className="city-country-code">
                      {city.country_code}
                    </span>
                  </div>

                  <h3>{city.name}</h3>

                  <p>
                    {city.admin1
                      ? `${city.admin1}, ${city.country}`
                      : city.country}
                  </p>

                  <div className="search-city-coordinates">
                    <span>
                      Latitude: {city.latitude.toFixed(4)}
                    </span>

                    <span>
                      Longitude: {city.longitude.toFixed(4)}
                    </span>
                  </div>

                  <span className="search-city-action">
                    View weather →
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CitySearch;