import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight, MapPin } from "lucide-react";
import { searchCities } from "../services/geocodingApi";

function CitySearch({ onCitySelect }) {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const resultsRef = useRef(null);

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

    window.setTimeout(() => {
      document
        .getElementById("weather-section")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 120);
  }

  useLayoutEffect(() => {
    if (!resultsRef.current || cities.length === 0) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        ".search-city-card",
        {
          y: 28,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    }, resultsRef);

    return () => {
      context.revert();
    };
  }, [cities]);

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
          ref={resultsRef}
        >
          {status === "loading" && (
            <div className="search-state search-state-loading">
              <div className="loading-pulse" />
              <p>Finding cities...</p>
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
                <article
                  className="search-city-card"
                  key={city.id}
                >
                  <div className="search-city-card-top">
                    <span className="city-country">
                      {city.country}
                    </span>

                    <span className="city-country-code">
                      {city.country_code}
                    </span>
                  </div>

                  <div className="search-city-location">
                    <MapPin size={18} strokeWidth={1.8} />

                    <div>
                      <h3>{city.name}</h3>

                      <p>
                        {city.admin1
                          ? `${city.admin1}, ${city.country}`
                          : city.country}
                      </p>
                    </div>
                  </div>

                  <div className="search-city-coordinates">
                    <span>
                      Latitude:{" "}
                      {city.latitude.toFixed(4)}
                    </span>

                    <span>
                      Longitude:{" "}
                      {city.longitude.toFixed(4)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="weather-tab"
                    onClick={() => handleCitySelect(city)}
                    aria-label={`View weather for ${city.name}`}
                  >
                    <span>View Weather</span>

                    <ArrowRight
                      size={17}
                      strokeWidth={2}
                    />
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CitySearch;