import {
  ArrowRight,
  Check,
  CircleDollarSign,
  CloudSun,
  Compass,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";

import capeTownHero from "../assets/cape-town-auth.png";

import CitySearch from "./CitySearch";
import WeatherCard from "./WeatherCard";
import WeatherForecast from "./WeatherForecast";
import CityWeatherInsights from "./CityWeatherInsights";
import CityComparison from "./CityComparison";
import CityDetails from "./CityDetails";
import CostOfLiving from "./CostOfLiving";

const HERO_IMAGE = capeTownHero;

const climateOptions = [
  {
    value: "warm",
    label: "Warm",
    icon: Sun,
  },
  {
    value: "cool",
    label: "Cool",
    icon: CloudSun,
  },
  {
    value: "mild",
    label: "Mild",
    icon: Compass,
  },
];

const lifestyleOptions = [
  {
    value: "quiet",
    label: "Quiet",
  },
  {
    value: "balanced",
    label: "Balanced",
  },
  {
    value: "vibrant",
    label: "Vibrant",
  },
];

const priorityOptions = [
  {
    value: "Affordability",
    label: "Affordability",
  },
  {
    value: "Career opportunities",
    label: "Career",
  },
  {
    value: "Outdoor activities",
    label: "Outdoors",
  },
  {
    value: "Culture and entertainment",
    label: "Culture",
  },
];

function DashboardHome({
  preferences,
  onPreferencesChange,
  onCitySelect,
  savedCities,
  onRemoveCity,
  onSelectSavedCity,
  selectedCity,
  selectedCityIsSaved,
  onSaveCity,
  weather,
  weatherStatus,
  weatherError,
  forecast,
  forecastStatus,
  forecastError,
  costOfLiving,
  costOfLivingStatus,
  costOfLivingError,
  comparisonCity,
  comparisonWeatherStatus,
  comparisonWeatherError,
  comparison,
  comparisonWinner,
  cityDetails,
  recommendation,
}) {
  function updatePreference(key, value) {
    onPreferencesChange({
      ...preferences,
      [key]: value,
    });
  }

  function togglePriority(priority) {
    const current = preferences.priorities || [];

    const next = current.includes(priority)
      ? current.filter((item) => item !== priority)
      : [...current, priority];

    onPreferencesChange({
      ...preferences,
      priorities: next,
    });
  }

  return (
    <main className="where2-redesign where2-dashboard-redesign">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="where2-hero">
        <img
          className="where2-hero-background"
          src={HERO_IMAGE}
          alt="Cape Town coastline and Table Mountain"
        />

        <div className="where2-hero-overlay" />

        <div className="where2-hero-content">
          <p className="where2-hero-eyebrow">
            FIND YOUR PLACE
          </p>

          <h1>
            Find the right place to live your best life
          </h1>

          <p className="where2-hero-description">
            Compare cities worldwide based on weather,
            cost of living and lifestyle that fit you.
          </p>

          <button
            type="button"
            className="where2-hero-button"
            onClick={() => {
              const searchSection =
                document.querySelector(
                  ".where2-search-section"
                );

              if (searchSection) {
                searchSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              } else {
                const discoverSection =
                  document.querySelector(
                    "#where2-discover"
                  );

                if (discoverSection) {
                  discoverSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }
            }}
          >
            <Sparkles size={17} />

            <span>Find my match</span>

            <ArrowRight size={17} />
          </button>
        </div>

        <div className="where2-hero-location">
          <MapPin size={14} />

          <span>Cape Town, South Africa</span>
        </div>
      </section>

      {/* =====================================================
          PREFERENCES
      ===================================================== */}

      <section
        id="where2-preferences"
        className="where2-preferences"
      >
        <div className="where2-section-heading">
          <div>
            <p className="where2-redesign-eyebrow">
              YOUR PROFILE
            </p>

            <h2>What matters to you?</h2>

            <p>
              Set your preferences and WHERE2 will use
              them when interpreting your city data.
            </p>
          </div>

          <div className="where2-section-heading-icon">
            <SlidersHorizontal size={18} />
          </div>
        </div>

        <div className="where2-preference-groups">
          {/* Climate */}

          <fieldset className="where2-preference-group">
            <legend>Climate</legend>

            <div className="where2-choice-row">
              {climateOptions.map(
                ({ value, label, icon: Icon }) => {
                  const active =
                    preferences.climate === value;

                  return (
                    <button
                      type="button"
                      key={value}
                      className={`where2-choice ${
                        active
                          ? "where2-choice-active"
                          : ""
                      }`}
                      onClick={() =>
                        updatePreference(
                          "climate",
                          value
                        )
                      }
                    >
                      <Icon size={15} />

                      <span>{label}</span>

                      {active && (
                        <Check size={13} />
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </fieldset>

          {/* Lifestyle */}

          <fieldset className="where2-preference-group">
            <legend>Lifestyle</legend>

            <div className="where2-choice-row">
              {lifestyleOptions.map(
                ({ value, label }) => {
                  const active =
                    preferences.lifestyle === value;

                  return (
                    <button
                      type="button"
                      key={value}
                      className={`where2-choice ${
                        active
                          ? "where2-choice-active"
                          : ""
                      }`}
                      onClick={() =>
                        updatePreference(
                          "lifestyle",
                          value
                        )
                      }
                    >
                      <Users size={15} />

                      <span>{label}</span>

                      {active && (
                        <Check size={13} />
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </fieldset>

          {/* Priorities */}

          <fieldset className="where2-preference-group where2-preference-group-full">
            <legend>Priorities</legend>

            <div className="where2-choice-row">
              {priorityOptions.map(
                ({ value, label }) => {
                  const active =
                    (
                      preferences.priorities || []
                    ).includes(value);

                  return (
                    <button
                      type="button"
                      key={value}
                      className={`where2-choice ${
                        active
                          ? "where2-choice-active"
                          : ""
                      }`}
                      onClick={() =>
                        togglePriority(value)
                      }
                    >
                      <span
                        className={`where2-checkbox ${
                          active
                            ? "where2-checkbox-active"
                            : ""
                        }`}
                      >
                        {active && (
                          <Check size={11} />
                        )}
                      </span>

                      <span>{label}</span>
                    </button>
                  );
                }
              )}
            </div>
          </fieldset>
        </div>
      </section>

      {/* =====================================================
          DISCOVER / SEARCH
      ===================================================== */}

      <section
        className="where2-discovery-card"
        id="where2-discover"
      >
        <div className="where2-section-heading">
          <div>
            <p className="where2-redesign-eyebrow">
              DISCOVER
            </p>

            <h2>Where could you live?</h2>

            <p>
              Search for a city and start exploring
              information that could help you decide
              if it fits your life.
            </p>
          </div>

          <div className="where2-section-heading-icon">
            <Search size={18} />
          </div>
        </div>

        <div className="where2-search-shell">
          <CitySearch
            onCitySelect={onCitySelect}
            embedded
          />
        </div>
      </section>

{/* =====================================================
    SAVED CITIES
===================================================== */}

<section
  className="where2-saved-cities"
  id="where2-saved-cities"
>
  {/* SECTION HEADER */}
  <div className="where2-section-header">

    <div className="where2-saved-cities-heading">
      <span className="where2-section-eyebrow">
        SAVED CITIES
      </span>

      <h2 className="where2-saved-cities-title">
        Your shortlisted cities
      </h2>

      <p className="where2-section-subtitle">
        Cities you're currently considering.
      </p>
    </div>

    <button
      type="button"
      className="where2-view-all"
      onClick={() => {
        const section = document.getElementById(
          "where2-saved-cities"
        );

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }}
    >
      View all
      <ArrowRight size={16} />
    </button>

  </div>


  {/* =====================================================
      EMPTY STATE
  ===================================================== */}

  {savedCities.length === 0 ? (

    <div className="where2-empty-shortlist">

      <div
        className="where2-empty-shortlist-icon"
        aria-hidden="true"
      >
        <MapPin size={28} strokeWidth={1.8} />
      </div>

      <div className="where2-empty-shortlist-content">

        <strong>
          No saved cities yet
        </strong>

        <p>
          Search for a city and save it to build
          your shortlist.
        </p>

      </div>

    </div>

  ) : (

    /* =================================================
       SAVED CITY GRID
    ================================================= */

    <div className="where2-saved-cities-grid">

      {savedCities.slice(0, 4).map((city) => {

        const temperature =
          city.temperature ??
          city.weather?.temperature ??
          null;

        const condition =
          city.condition ??
          city.weather?.condition ??
          "Weather unavailable";

        const match =
          typeof city.match === "number"
            ? city.match
            : null;

        const countryCode =
          city.countryCode ??
          city.country_code ??
          "";

        return (

          <article
            className="where2-saved-city-card"
            key={city.id}
          >

            {/* CITY IMAGE */}

            <div className="where2-city-image">

              {city.image ? (

                <img
                  src={city.image}
                  alt={`${city.name}, ${city.country}`}
                />

              ) : (

                <div
                  className="where2-city-image-placeholder"
                  aria-hidden="true"
                >
                  <MapPin
                    size={34}
                    strokeWidth={1.6}
                  />
                </div>

              )}

              {countryCode && (
                <span className="where2-country-code">
                  {countryCode}
                </span>
              )}

            </div>


            {/* CITY CONTENT */}

            <div className="where2-city-card-content">

              <div className="where2-city-card-title">

                <h3>
                  {city.name}
                </h3>

                <p>
                  {city.country}
                </p>

              </div>


              {/* WEATHER */}

              <div className="where2-city-weather">

                <div className="where2-weather-summary">

                  <Sun
                    size={21}
                    strokeWidth={1.8}
                  />

                  <div className="where2-weather-text">

                    <strong>
                      {temperature !== null
                        ? `${Math.round(
                            Number(temperature)
                          )}°C`
                        : "—"}
                    </strong>

                    <span>
                      {condition}
                    </span>

                  </div>

                </div>


                {/* MATCH */}

                <div className="where2-match">

                  <span className="where2-match-ring">
                    {match !== null
                      ? `${match}%`
                      : "—"}
                  </span>

                  <span>
                    Match
                  </span>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="where2-city-actions">

                <button
                  type="button"
                  className="where2-view-details"
                  onClick={() =>
                    onSelectSavedCity(city)
                  }
                >
                  View details
                </button>

                <button
                  type="button"
                  className="where2-remove-city"
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

  )}

</section>

      {/* =====================================================
          CITY INTELLIGENCE
      ===================================================== */}

      {selectedCity && (
        <section className="where2-selected-dashboard">
          <div className="where2-selected-dashboard-heading">
            <div>
              <p className="where2-redesign-eyebrow">
                CITY INTELLIGENCE
              </p>

              <h2>{selectedCity.name}</h2>

              <p>
                Your live view of weather, lifestyle,
                cost, and compatibility.
              </p>
            </div>

            {comparisonCity && (
              <span className="where2-comparison-pill">
                Comparing with{" "}
                <strong>
                  {comparisonCity.name}
                </strong>
              </span>
            )}
          </div>

          {/* Weather loading */}

          {weatherStatus === "loading" && (
            <div className="where2-loading-card">
              Loading weather for{" "}
              {selectedCity.name}...
            </div>
          )}

          {/* Weather error */}

          {weatherStatus === "error" && (
            <div
              className="where2-error-card"
              role="alert"
            >
              <strong>
                We couldn't load the weather.
              </strong>

              <p>{weatherError}</p>
            </div>
          )}

          {/* Main weather */}

          {weatherStatus === "success" && (
            <div className="where2-intelligence-grid">
              <div className="where2-intelligence-primary">
                <WeatherCard
                  city={selectedCity}
                  weather={weather}
                  isSaved={selectedCityIsSaved}
                  onSave={onSaveCity}
                />
              </div>

              <div className="where2-match-card">
                <div className="where2-match-card-top">
                  <div>
                    <p className="where2-redesign-eyebrow">
                      YOUR WHERE2 MATCH
                    </p>

                    <h3>
                      {recommendation?.label ||
                        "Possible fit"}
                    </h3>
                  </div>

                  <div className="where2-match-score">
                    {recommendation?.score ?? 0}
                  </div>
                </div>

                <p>
                  Based on your preferences and the
                  current conditions in{" "}
                  {selectedCity.name}.
                </p>

                {recommendation?.reasons?.length >
                  0 && (
                  <ul>
                    {recommendation.reasons
                      .slice(0, 3)
                      .map((reason) => (
                        <li key={reason}>
                          <Check size={13} />

                          <span>{reason}</span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Weather insights */}

          {weatherStatus === "success" &&
            forecastStatus === "success" && (
              <CityWeatherInsights
                city={selectedCity}
                weather={weather}
                forecast={forecast}
              />
            )}

          {/* Forecast loading */}

          {forecastStatus === "loading" && (
            <div className="where2-loading-card">
              Loading the 7-day forecast...
            </div>
          )}

          {/* Forecast error */}

          {forecastStatus === "error" && (
            <div
              className="where2-error-card"
              role="alert"
            >
              <strong>
                We couldn't load the forecast.
              </strong>

              <p>{forecastError}</p>
            </div>
          )}

          {/* Forecast */}

          {forecastStatus === "success" && (
            <WeatherForecast
              city={selectedCity}
              forecast={forecast}
            />
          )}

          {/* Cost + comparison */}

          <div className="where2-intelligence-grid where2-intelligence-grid-secondary">
            <div>
              {costOfLivingStatus === "loading" && (
                <div className="where2-loading-card">
                  Loading cost of living...
                </div>
              )}

              {costOfLivingStatus === "error" && (
                <div
                  className="where2-error-card"
                  role="alert"
                >
                  <strong>
                    Cost of living is unavailable.
                  </strong>

                  <p>{costOfLivingError}</p>
                </div>
              )}

              {costOfLivingStatus === "success" && (
                <CostOfLiving
                  data={costOfLiving}
                  cityName={selectedCity.name}
                />
              )}
            </div>

            {comparisonCity && (
              <div className="where2-comparison-summary">
                <div className="where2-comparison-summary-icon">
                  <CircleDollarSign size={18} />
                </div>

                <p className="where2-redesign-eyebrow">
                  COMPARISON
                </p>

                <h3>
                  {selectedCity.name} vs{" "}
                  {comparisonCity.name}
                </h3>

                {comparisonWeatherStatus ===
                  "loading" && (
                  <p>
                    Loading comparison weather...
                  </p>
                )}

                {comparisonWeatherStatus ===
                  "error" && (
                  <p>
                    {comparisonWeatherError}
                  </p>
                )}

                {comparison &&
                  comparisonWinner && (
                    <CityComparison
                      comparison={comparison}
                      winner={comparisonWinner}
                    />
                  )}
              </div>
            )}
          </div>

          {/* City details */}

          {cityDetails && (
            <CityDetails city={cityDetails} />
          )}
        </section>
      )}

      {/* =====================================================
          FEATURE STRIP
      ===================================================== */}

      <section className="where2-feature-strip">
        <article>
          <div>
            <CloudSun size={18} />
          </div>

          <strong>Real-time data</strong>

          <span>
            Accurate and up-to-date weather
            insights
          </span>
        </article>

        <article>
          <div>
            <CircleDollarSign size={18} />
          </div>

          <strong>Cost insights</strong>

          <span>
            Understand the true cost of living
          </span>
        </article>

        <article>
          <div>
            <SlidersHorizontal size={18} />
          </div>

          <strong>Smart comparison</strong>

          <span>
            Compare what matters most to you
          </span>
        </article>

        <article>
          <div>
            <MapPin size={18} />
          </div>

          <strong>Neighborhood insights</strong>

          <span>
            Explore the best areas to live
          </span>
        </article>

        <article>
          <div>
            <Check size={18} />
          </div>

          <strong>Trusted data</strong>

          <span>
            Sourced from reliable providers
          </span>
        </article>
      </section>
    </main>
  );
}

export default DashboardHome;