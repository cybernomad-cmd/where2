import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleDollarSign,
  CloudSun,
  Compass,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  Users,
} from "lucide-react";

import CitySearch from "./CitySearch";
import WeatherCard from "./WeatherCard";
import WeatherForecast from "./WeatherForecast";
import CityWeatherInsights from "./CityWeatherInsights";
import CityComparison from "./CityComparison";
import CityDetails from "./CityDetails";
import CostOfLiving from "./CostOfLiving";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1516026672328-bc52d61a55d5?w=1800&auto=format&fit=crop&q=85";

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

  const preferenceCount =
    Number(Boolean(preferences.climate)) +
    Number(Boolean(preferences.lifestyle)) +
    (preferences.priorities || []).length;

  return (
    <main className="where2-redesign where2-dashboard-redesign">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="where2-hero">
        <div className="where2-hero-image">
          <img
            src={HERO_IMAGE}
            alt="Cape Town coastline and Table Mountain"
          />
        </div>

        <div className="where2-hero-overlay" />

        <div className="where2-hero-content">
          <p className="where2-hero-eyebrow">
            FIND YOUR PLACE
          </p>

          <h1>
            Find the right place
            <br />
            to live your best life.
          </h1>

          <p className="where2-hero-description">
            Compare cities worldwide based on weather,
            cost of living and lifestyle that fit you.
          </p>

          <button
            type="button"
            className="where2-hero-button"
            onClick={() => {
              document
                .getElementById("where2-discover")
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
            }}
          >
            <Sparkles size={17} />
            Find my match
          </button>
        </div>
      </section>

      {/* =====================================================
          QUICK DASHBOARD STATS
      ===================================================== */}

      <section className="where2-dashboard-stats">
        <article className="where2-dashboard-stat">
          <div className="where2-dashboard-stat-icon">
            <Heart size={17} />
          </div>

          <div>
            <span>Saved cities</span>
            <strong>{savedCities.length}</strong>
          </div>

          <ChevronRight size={15} />
        </article>

        <article className="where2-dashboard-stat">
          <div className="where2-dashboard-stat-icon">
            <SlidersHorizontal size={17} />
          </div>

          <div>
            <span>Preferences</span>
            <strong>{preferenceCount}</strong>
          </div>

          <ChevronRight size={15} />
        </article>

        <article className="where2-dashboard-stat">
          <div className="where2-dashboard-stat-icon">
            <MapPin size={17} />
          </div>

          <div>
            <span>Current focus</span>
            <strong>
              {selectedCity
                ? selectedCity.name
                : "Explore"}
            </strong>
          </div>

          <ChevronRight size={15} />
        </article>
      </section>

      {/* =====================================================
          PREFERENCES
      ===================================================== */}

      <section
        className="where2-preferences-card"
        id="where2-preferences"
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
                    (preferences.priorities || []).includes(
                      value
                    );

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
          />
        </div>
      </section>

      {/* =====================================================
          SAVED CITIES
      ===================================================== */}

      <section className="where2-shortlist-card">
        <div className="where2-section-heading where2-section-heading-inline">
          <div>
            <p className="where2-redesign-eyebrow">
              YOUR SHORTLIST
            </p>

            <h2>Saved cities</h2>

            <p>
              Your shortlisted places to compare later.
            </p>
          </div>

          <span className="where2-count-pill">
            {savedCities.length} saved
          </span>
        </div>

        {savedCities.length === 0 ? (
          <div className="where2-empty-shortlist">
            <div className="where2-empty-shortlist-icon">
              <Star size={20} />
            </div>

            <div>
              <strong>
                Your shortlist is empty
              </strong>

              <p>
                Search for a city above and save
                the places you want to compare later.
              </p>
            </div>

            <ArrowRight size={18} />
          </div>
        ) : (
          <div className="where2-shortlist-grid">
            {savedCities
              .slice(0, 4)
              .map((city) => (
                <article
                  className="where2-shortlist-item"
                  key={city.id}
                >
                  <div className="where2-shortlist-item-top">
                    <div className="where2-city-avatar">
                      {city.name.charAt(0)}
                    </div>

                    <button
                      type="button"
                      aria-label={`Remove ${city.name}`}
                      onClick={() =>
                        onRemoveCity(city.id)
                      }
                    >
                      ×
                    </button>
                  </div>

                  <span>{city.country}</span>

                  <h3>{city.name}</h3>

                  <button
                    type="button"
                    className="where2-text-button"
                    onClick={() =>
                      onSelectSavedCity(city)
                    }
                  >
                    View city
                    <ArrowRight size={13} />
                  </button>
                </article>
              ))}
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