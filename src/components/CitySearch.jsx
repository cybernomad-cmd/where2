import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import gsap from "gsap";

import {
  ArrowRight,
  ChevronDown,
  Filter,
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

  const [countryFilter, setCountryFilter] =
    useState("all");

  const [regionFilter, setRegionFilter] =
    useState("all");

  const [capitalOnly, setCapitalOnly] =
    useState(false);

  const [filtersOpen, setFiltersOpen] =
    useState(false);

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
      const results =
        await searchCities(trimmedQuery);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setCities(results);

      setStatus(
        results.length > 0
          ? "success"
          : "empty"
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

    setCountryFilter("all");
    setRegionFilter("all");
    setCapitalOnly(false);

    inputRef.current?.focus();
  }

  /* Search keyboard shortcut */

  useEffect(() => {
    function handleSearchShortcut(event) {
      if (
        event.key !== "/" ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (
          target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(
            target.tagName
          )
        )
      ) {
        return;
      }

      event.preventDefault();

      inputRef.current?.focus();
    }

    window.addEventListener(
      "keydown",
      handleSearchShortcut
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleSearchShortcut
      );
    };
  }, []);

  function clearFilters() {
    setCountryFilter("all");
    setRegionFilter("all");
    setCapitalOnly(false);
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

  /* Debounced search */

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

  const countries = useMemo(() => {
    return [
      ...new Set(
        cities
          .map((city) => city.country)
          .filter(Boolean)
      ),
    ].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [cities]);

  const regions = useMemo(() => {
    return [
      ...new Set(
        cities
          .map((city) => city.admin1)
          .filter(Boolean)
      ),
    ].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [cities]);

  const filteredCities = useMemo(() => {
    return cities.filter((city) => {
      const matchesCountry =
        countryFilter === "all" ||
        city.country === countryFilter;

      const matchesRegion =
        regionFilter === "all" ||
        city.admin1 === regionFilter;

      const matchesCapital =
        !capitalOnly ||
        city.feature_code === "PPLC";

      return (
        matchesCountry &&
        matchesRegion &&
        matchesCapital
      );
    });
  }, [
    cities,
    countryFilter,
    regionFilter,
    capitalOnly,
  ]);

  const activeFilterCount =
    (countryFilter !== "all" ? 1 : 0) +
    (regionFilter !== "all" ? 1 : 0) +
    (capitalOnly ? 1 : 0);

  /* Animate search results */

  useLayoutEffect(() => {
    if (
      !resultsRef.current ||
      filteredCities.length === 0
    ) {
      return undefined;
    }

    const prefersReducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    const cards =
      resultsRef.current.querySelectorAll(
        ".search-result-card"
      );

    if (!cards.length) {
      return undefined;
    }

    const animation = gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 18,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.06,
        ease: "power2.out",
      }
    );

    return () => {
      animation.kill();
    };
  }, [filteredCities]);

  return (
    <section
      className="city-search-section"
      id="city-search"
      aria-labelledby="city-search-title"
    >
      <div className="page-container">
        <div className="city-search-header">
          <div>
            <p className="eyebrow">
              Find your next place
            </p>

            <h2 id="city-search-title">
              Search cities
            </h2>

            <p className="city-search-description">
              Explore cities around the world and
              compare the places you're considering.
            </p>
          </div>
        </div>

        <form
          className="city-search-form"
          onSubmit={handleSubmit}
          role="search"
        >
          <div className="city-search-input-wrapper">
            <Search
              className="city-search-icon"
              size={20}
              aria-hidden="true"
            />

            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={handleInputChange}
              placeholder="Search for a city..."
              aria-label="Search for a city"
              aria-keyshortcuts="Slash"
              autoComplete="off"
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
                  aria-hidden="true"
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
                  size={18}
                  className="city-search-spinner"
                  aria-hidden="true"
                />

                Searching
              </>
            ) : (
              <>
                Search
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                />
              </>
            )}
          </button>
        </form>

        <div className="city-search-helper">
          <span>
            Search by city name, then refine the
            results using the available filters.
          </span>

          <span className="city-search-shortcut">
            Press <kbd>/</kbd> to focus search
          </span>
        </div>

        {cities.length > 0 && (
          <div className="city-search-toolbar">
            <div className="city-search-results-count">
              <strong>
                {filteredCities.length}
              </strong>

              <span>
                {filteredCities.length === 1
                  ? "city"
                  : "cities"}{" "}
                found
              </span>
            </div>

            <button
              type="button"
              className={`city-filter-toggle ${
                filtersOpen
                  ? "is-open"
                  : ""
              }`}
              onClick={() =>
                setFiltersOpen(
                  (current) => !current
                )
              }
              aria-expanded={filtersOpen}
              aria-controls="city-search-filters"
            >
              <Filter
                size={17}
                aria-hidden="true"
              />

              Filters

              {activeFilterCount > 0 && (
                <span className="city-filter-count">
                  {activeFilterCount}
                </span>
              )}

              <ChevronDown
                size={17}
                aria-hidden="true"
              />
            </button>
          </div>
        )}

        {filtersOpen && cities.length > 0 && (
          <div
            className="city-search-filters"
            id="city-search-filters"
          >
            <div className="city-search-filter-group">
              <label htmlFor="country-filter">
                Country
              </label>

              <select
                id="country-filter"
                value={countryFilter}
                onChange={(event) =>
                  setCountryFilter(
                    event.target.value
                  )
                }
              >
                <option value="all">
                  All countries
                </option>

                {countries.map((country) => (
                  <option
                    value={country}
                    key={country}
                  >
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="city-search-filter-group">
              <label htmlFor="region-filter">
                Region
              </label>

              <select
                id="region-filter"
                value={regionFilter}
                onChange={(event) =>
                  setRegionFilter(
                    event.target.value
                  )
                }
              >
                <option value="all">
                  All regions
                </option>

                {regions.map((region) => (
                  <option
                    value={region}
                    key={region}
                  >
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <label className="city-search-capital-filter">
              <input
                type="checkbox"
                checked={capitalOnly}
                onChange={(event) =>
                  setCapitalOnly(
                    event.target.checked
                  )
                }
              />

              <span>
                Capital cities only
              </span>
            </label>

            {activeFilterCount > 0 && (
              <button
                type="button"
                className="button button-secondary city-search-clear-filters"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {status === "loading" && (
          <div
            className="search-state"
            role="status"
            aria-live="polite"
          >
            <LoaderCircle
              className="search-state-icon city-search-spinner"
              size={28}
              aria-hidden="true"
            />

            <p>
              Searching for cities matching{" "}
              <strong>{query}</strong>...
            </p>
          </div>
        )}

        {status === "error" && (
          <div
            className="search-state search-state-error"
            role="alert"
          >
            <h3>
              We couldn't complete the search.
            </h3>

            <p>{error}</p>

            <button
              type="button"
              className="button button-secondary"
              onClick={() =>
                performSearch(query)
              }
            >
              Try again
            </button>
          </div>
        )}

        {status === "empty" && (
          <div
            className="search-state"
            role="status"
            aria-live="polite"
          >
            <Search
              className="search-state-icon"
              size={28}
              aria-hidden="true"
            />

            <h3>
              No cities found
            </h3>

            <p>
              We couldn't find a city matching{" "}
              <strong>{query}</strong>. Try a
              different spelling or search term.
            </p>
          </div>
        )}

        {status === "success" &&
          filteredCities.length === 0 && (
            <div
              className="search-state"
              role="status"
              aria-live="polite"
            >
              <Filter
                className="search-state-icon"
                size={28}
                aria-hidden="true"
              />

              <h3>
                No cities match these filters
              </h3>

              <p>
                Try changing your filters or clear
                them to see all search results.
              </p>

              <button
                type="button"
                className="button button-secondary"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            </div>
          )}

        {filteredCities.length > 0 && (
          <div
            className="city-search-results"
            ref={resultsRef}
          >
            {filteredCities.map((city) => (
              <article
                className="search-result-card"
                key={city.id}
              >
                <div className="search-result-card-main">
                  <div className="search-result-icon">
                    <MapPin
                      size={20}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="search-result-content">
                    <div className="search-result-heading">
                      <h3>{city.name}</h3>

                      {city.country_code && (
                        <span className="search-result-country-code">
                          {city.country_code}
                        </span>
                      )}
                    </div>

                    <p className="search-result-location">
                      {city.admin1
                        ? `${city.admin1}, ${city.country}`
                        : city.country}
                    </p>

                    <p className="search-result-coordinates">
                      {Number(
                        city.latitude
                      ).toFixed(4)}
                      ,{" "}
                      {Number(
                        city.longitude
                      ).toFixed(4)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="button button-secondary search-result-action"
                  onClick={() =>
                    handleCitySelect(city)
                  }
                >
                  Explore city
                  <ArrowRight
                    size={17}
                    aria-hidden="true"
                  />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CitySearch;