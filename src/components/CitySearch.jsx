import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import {
  ArrowRight,
  LoaderCircle,
  MapPin,
  Search,
  X,
} from "lucide-react";

import { searchCities } from "../services/geocodingApi";

function CitySearch({ onCitySelect }) {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const resultsRef = useRef(null);
  const inputRef = useRef(null);
  const requestIdRef = useRef(0);

  async function performSearch(searchQuery) {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      return;
    }

    const requestId = ++requestIdRef.current;

    setStatus("loading");
    setError("");

    try {
      const results = await searchCities(trimmedQuery);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setCities(results);
      setStatus(
        results.length > 0 ? "success" : "empty"
      );
    } catch (requestError) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setCities([]);
      setError(
        requestError.message ||
          "Unable to search for cities right now."
      );
      setStatus("error");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    performSearch(query);
  }

  function handleInputChange(event) {
    const nextQuery = event.target.value;

    setQuery(nextQuery);

    if (!nextQuery.trim()) {
      requestIdRef.current += 1;
      setCities([]);
      setError("");
      setStatus("idle");
      return;
    }

    setStatus("idle");
    setError("");
  }

  function handleClear() {
    requestIdRef.current += 1;

    setQuery("");
    setCities([]);
    setError("");
    setStatus("idle");

    inputRef.current?.focus();
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

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      performSearch(trimmedQuery);
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

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
          y: 24,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.07,
          ease: "power3.out",
        }
      );
    }, resultsRef);

    return () => {
      context.revert();
    };
  }, [cities]);

  return (
    <section
      className="city-search"
      id="city-search"
    >
      <div className="page-container">
        <div className="city-search-heading">
          <p className="eyebrow">
            Discover your possibilities
          </p>

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
          role="search"
        >
          <label htmlFor="city-search-input">
            Search for a city
          </label>

          <div className="city-search-input-group">
            <div className="city-search-input-wrapper">
              <Search
                className="city-search-input-icon"
                size={20}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <input
                ref={inputRef}
                id="city-search-input"
                type="search"
                value={query}
                onChange={handleInputChange}
                placeholder="Try Nairobi, Lisbon, or Tokyo"
                autoComplete="off"
                spellCheck="false"
                aria-describedby="city-search-help"
                aria-busy={status === "loading"}
              />

              {query && (
                <button
                  type="button"
                  className="city-search-clear"
                  onClick={handleClear}
                  aria-label="Clear city search"
                >
                  <X
                    size={18}
                    strokeWidth={2}
                  />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="button button-primary city-search-submit"
              disabled={
                status === "loading" ||
                !query.trim()
              }
            >
              {status === "loading" ? (
                <>
                  <LoaderCircle
                    className="city-search-spinner"
                    size={18}
                    strokeWidth={2}
                    aria-hidden="true"
                  />

                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>Search cities</span>

                  <ArrowRight
                    size={17}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </>
              )}
            </button>
          </div>

          <p
            id="city-search-help"
            className="city-search-help"
          >
            Start typing to search automatically, or press
            Enter to search.
          </p>
        </form>

        <div
          className="city-search-results"
          aria-live="polite"
          ref={resultsRef}
        >
          {status === "loading" && (
            <div className="search-state search-state-loading">
              <div className="loading-pulse" />

              <div>
                <strong>Finding cities...</strong>

                <p>
                  Searching locations that match "
                  {query.trim()}"
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div
              className="search-state search-state-error"
              role="alert"
            >
              <h3>
                We couldn't complete that search.
              </h3>

              <p>{error}</p>

              <button
                type="button"
                className="button button-secondary"
                onClick={() => performSearch(query)}
              >
                Try again
              </button>
            </div>
          )}

          {status === "empty" && (
            <div className="search-state search-state-empty">
              <div className="search-empty-icon">
                <MapPin
                  size={24}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </div>

              <div>
                <h3>No cities found.</h3>

                <p>
                  Try another city name or check your
                  spelling.
                </p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="city-search-results-header">
              <div>
                <p className="eyebrow">
                  Search results
                </p>

                <h3>
                  {cities.length}{" "}
                  {cities.length === 1
                    ? "city"
                    : "cities"}{" "}
                  found
                </h3>
              </div>

              <span>
                Showing matches for "{query.trim()}"
              </span>
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

                    {city.country_code && (
                      <span className="city-country-code">
                        {city.country_code}
                      </span>
                    )}
                  </div>

                  <div className="search-city-location">
                    <span
                      className="search-city-location-icon"
                      aria-hidden="true"
                    >
                      <MapPin
                        size={19}
                        strokeWidth={1.8}
                      />
                    </span>

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
                      <strong>LAT</strong>{" "}
                      {Number(city.latitude).toFixed(4)}
                    </span>

                    <span>
                      <strong>LON</strong>{" "}
                      {Number(city.longitude).toFixed(4)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="weather-tab"
                    onClick={() =>
                      handleCitySelect(city)
                    }
                    aria-label={`View weather for ${city.name}`}
                  >
                    <span>
                      Explore {city.name}
                    </span>

                    <ArrowRight
                      size={17}
                      strokeWidth={2}
                      aria-hidden="true"
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