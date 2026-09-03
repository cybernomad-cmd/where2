import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

gsap.registerPlugin(ScrollTrigger);

const HERO_SLIDES = [
  {
    city: "Cape Town",
    country: "South Africa",
    flag: "🇿🇦",
    image: capeTownHero,
    eyebrow: "SMART TRAVEL STARTS HERE",
    title: "Discover cities that fit your world.",
    description:
      "Real-time insights on weather, lifestyle, cost of living, and compatibility — all in one place.",
  },
  {
    city: "Lisbon",
    country: "Portugal",
    flag: "🇵🇹",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1800&q=88",
    eyebrow: "FIND YOUR NEXT CHAPTER",
    title: "Explore places made for the way you live.",
    description:
      "Compare cities worldwide and discover the places that align with your priorities.",
  },
  {
    city: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1800&q=88",
    eyebrow: "YOUR WORLD, EXPANDED",
    title: "Go beyond the usual city search.",
    description:
      "Understand climate, lifestyle, affordability, and compatibility before you decide.",
  },
  {
    city: "Paris",
    country: "France",
    flag: "🇫🇷",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1800&q=88",
    eyebrow: "MAKE THE CHOICE CLEARER",
    title: "Turn city research into a smarter decision.",
    description:
      "Bring the information you need together and build a shortlist around your life.",
  },
  {
    city: "Santorini",
    country: "Greece",
    flag: "🇬🇷",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1800&q=88",
    eyebrow: "WHERE COULD YOU LIVE?",
    title: "Your next city could be closer than you think.",
    description:
      "Explore destinations through the lens of what actually matters to you.",
  },
];

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

  const dashboardRef = useRef(null);

  useLayoutEffect(() => {
    const root = dashboardRef.current;

    if (!root) {
      return undefined;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const animateSections = () => {
        const sections = root.querySelectorAll(
          [
            ".where2-preferences",
            ".where2-discovery-card",
            ".where2-saved-cities",
            ".where2-selected-dashboard",
            ".where2-feature-strip",
          ].join(", ")
        );

        sections.forEach((section) => {
          if (section.dataset.gsapAnimated === "true") {
            return;
          }

          section.dataset.gsapAnimated = "true";

          gsap.fromTo(
            section,
            {
              autoAlpha: 0,
              y: 40,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                once: true,
              },
            }
          );
        });
      };

      const animateCards = () => {
        const cards = root.querySelectorAll(
          [
            ".where2-saved-city-card",
            ".where2-intelligence-primary",
            ".where2-match-card",
            ".where2-comparison-summary",
            ".where2-feature-strip article",
          ].join(", ")
        );

        cards.forEach((card, index) => {
          if (card.dataset.gsapAnimated === "true") {
            return;
          }

          card.dataset.gsapAnimated = "true";

          gsap.fromTo(
            card,
            {
              autoAlpha: 0,
              y: 24,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.65,
              delay: (index % 5) * 0.08,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                once: true,
              },
            }
          );
        });
      };

      animateSections();
      animateCards();

      const observer = new MutationObserver(() => {
        animateSections();
        animateCards();
        ScrollTrigger.refresh();
      });

      observer.observe(root, {
        childList: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
      };
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);


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

/* =====================================================
   HERO CAROUSEL STATE
   ===================================================== */

const [activeHeroSlide, setActiveHeroSlide] = useState(0);
const [isHeroPaused, setIsHeroPaused] = useState(false);

const activeHero = HERO_SLIDES[activeHeroSlide];

useEffect(() => {
  if (isHeroPaused) {
    return undefined;
  }

  const interval = window.setInterval(() => {
    setActiveHeroSlide((current) =>
      (current + 1) % HERO_SLIDES.length
    );
  }, 5500);

  return () => window.clearInterval(interval);
}, [isHeroPaused]);

function goToHeroSlide(index) {
  setActiveHeroSlide(
    (index + HERO_SLIDES.length) % HERO_SLIDES.length
  );
}

return (
  <main
    ref={dashboardRef}
    className="where2-redesign where2-dashboard-redesign"
  >

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="where2-hero where2-hero-carousel"
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={() => setIsHeroPaused(false)}
      >
        <div className="where2-hero-slides" aria-live="polite">
          {HERO_SLIDES.map((slide, index) => (
            <img
              key={slide.city}
              className={`where2-hero-background ${
                index === activeHeroSlide
                  ? "where2-hero-background-active"
                  : ""
              }`}
              src={slide.image}
              alt={`${slide.city}, ${slide.country}`}
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>

        <div className="where2-hero-overlay" />

        <div className="where2-hero-content">
          <div className="where2-hero-badge">
            <Sparkles size={14} />
            <span>{activeHero.eyebrow}</span>
          </div>

          <h1>{activeHero.title}</h1>

          <p className="where2-hero-description">
            {activeHero.description}
          </p>

          <button
            type="button"
            className="where2-hero-button"
            onClick={() => {
              const discoverSection =
                document.querySelector("#where2-discover");

              if (discoverSection) {
                discoverSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
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
          <span className="where2-hero-location-flag" aria-hidden="true">
            {activeHero.flag}
          </span>

          <span>  
            {activeHero.city}, {activeHero.country}
          </span>
        </div>

        <div className="where2-hero-city-card">
          <span className="where2-hero-city-card-label">
            TOP PICK FOR YOU
          </span>

          <strong>{activeHero.city}</strong>

          <span className="where2-hero-city-card-country">
          <span className="where2-hero-flag" aria-hidden="true">
            {activeHero.flag}
          </span>
            <span>{activeHero.country}</span>
          </span>


          <div className="where2-hero-city-card-points">
            <span>
              <Check size={14} />
              Real-time city insights
            </span>

            <span>
              <Check size={14} />
              Lifestyle compatibility
            </span>

            <span>
              <Check size={14} />
              Cost of living context
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              const discoverSection =
                document.querySelector("#where2-discover");

              if (discoverSection) {
                discoverSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }}
          >
            Explore {activeHero.city}
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="where2-hero-dots">
          {HERO_SLIDES.map((slide, index) => (
            <button
              type="button"
              key={slide.city}
              className={`where2-hero-dot ${
                index === activeHeroSlide
                  ? "where2-hero-dot-active"
                  : ""
              }`}
              aria-label={`Show ${slide.city}`}
              aria-current={
                index === activeHeroSlide
                  ? "true"
                  : undefined
              }
              onClick={() => goToHeroSlide(index)}
            />
          ))}
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