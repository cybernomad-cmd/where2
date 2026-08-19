import { useEffect, useState } from "react";
import "./App.css";

import Nav from "./components/Nav";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import CityPreview from "./components/CityPreview";
import FinalCTA from "./components/FinalCTA";
import Preferences from "./components/Preferences";
import CitySearch from "./components/CitySearch";
import WeatherCard from "./components/WeatherCard";
import WeatherForecast from "./components/WeatherForecast";
import CityComparison from "./components/CityComparison";
import CityDetails from "./components/CityDetails";

import { getCurrentWeather } from "./services/weatherApi";
import { getWeatherForecast } from "./services/forecastApi";
import { getCityDetails } from "./services/cityDetailsService";

import {
  calculateRecommendation,
} from "./services/recommendationService";

import {
  compareCities,
  getComparisonWinner,
} from "./services/comparisonService";

function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [comparisonCity, setComparisonCity] = useState(null);

  const [preferences, setPreferences] = useState({
    climate: "",
    lifestyle: "",
    priorities: [],
  });

  const [weather, setWeather] = useState(null);
  const [weatherStatus, setWeatherStatus] = useState("idle");
  const [weatherError, setWeatherError] = useState("");

  const [forecast, setForecast] = useState(null);
  const [forecastStatus, setForecastStatus] = useState("idle");
  const [forecastError, setForecastError] = useState("");

  const [comparisonWeather, setComparisonWeather] =
    useState(null);

  const [comparisonWeatherStatus, setComparisonWeatherStatus] =
    useState("idle");

  const [comparisonWeatherError, setComparisonWeatherError] =
    useState("");

  useEffect(() => {
    if (!selectedCity) {
      return;
    }

    let isActive = true;

    async function loadWeather() {
      try {
        const currentWeather = await getCurrentWeather(
          selectedCity.latitude,
          selectedCity.longitude
        );

        if (!isActive) {
          return;
        }

        setWeather(currentWeather);
        setWeatherStatus("success");
      } catch (requestError) {
        if (!isActive) {
          return;
        }

        setWeather(null);

        setWeatherError(
          requestError.message ||
            "Unable to retrieve the weather data right now."
        );

        setWeatherStatus("error");
      }
    }

    loadWeather();

    return () => {
      isActive = false;
    };
  }, [selectedCity]);

  useEffect(() => {
    if (!selectedCity) {
      return;
    }

    let isActive = true;

    async function loadForecast() {
      try {
        const forecastData = await getWeatherForecast(
          selectedCity.latitude,
          selectedCity.longitude
        );

        if (!isActive) {
          return;
        }

        setForecast(forecastData);
        setForecastStatus("success");
      } catch (requestError) {
        if (!isActive) {
          return;
        }

        setForecast(null);

        setForecastError(
          requestError.message ||
            "Unable to retrieve the weather forecast right now."
        );

        setForecastStatus("error");
      }
    }

    loadForecast();

    return () => {
      isActive = false;
    };
  }, [selectedCity]);

  useEffect(() => {
    if (!comparisonCity) {
      return;
    }

    let isActive = true;

    async function loadComparisonWeather() {
      setComparisonWeatherStatus("loading");
      setComparisonWeatherError("");

      try {
        const currentWeather = await getCurrentWeather(
          comparisonCity.latitude,
          comparisonCity.longitude
        );

        if (!isActive) {
          return;
        }

        setComparisonWeather(currentWeather);
        setComparisonWeatherStatus("success");
      } catch (requestError) {
        if (!isActive) {
          return;
        }

        setComparisonWeather(null);

        setComparisonWeatherError(
          requestError.message ||
            "Unable to retrieve comparison weather right now."
        );

        setComparisonWeatherStatus("error");
      }
    }

    loadComparisonWeather();

    return () => {
      isActive = false;
    };
  }, [comparisonCity]);

  function handlePreferencesChange(updatedPreferences) {
    setPreferences(updatedPreferences);
  }

  function handleCitySelect(city) {
    const isSelectedCity = selectedCity?.id === city.id;
    const isComparisonCity = comparisonCity?.id === city.id;

    if (isSelectedCity || isComparisonCity) {
      return;
    }

    if (!selectedCity) {
      setSelectedCity(city);

      setWeather(null);
      setWeatherError("");
      setWeatherStatus("loading");

      setForecast(null);
      setForecastError("");
      setForecastStatus("loading");

      return;
    }

    if (!comparisonCity) {
      setComparisonCity(city);

      setComparisonWeather(null);
      setComparisonWeatherError("");
      setComparisonWeatherStatus("loading");

      return;
    }

    setComparisonCity(city);

    setComparisonWeather(null);
    setComparisonWeatherError("");
    setComparisonWeatherStatus("loading");
  }

  const recommendation = calculateRecommendation(
    preferences,
    weather
  );

  const comparison =
    comparisonWeatherStatus === "success"
      ? compareCities(
          selectedCity,
          weather,
          comparisonCity,
          comparisonWeather,
          preferences
        )
      : null;

  const comparisonWinner =
    comparison
      ? getComparisonWinner(comparison)
      : null;

  const cityDetails = selectedCity
    ? getCityDetails(selectedCity)
    : null;

  return (
    <main className="design-system">
      <Nav />

      <Hero />

      <Preferences
        value={preferences}
        onPreferencesChange={handlePreferencesChange}
      />

      <CitySearch onCitySelect={handleCitySelect} />

      {selectedCity && (
        <section className="weather-section">
          <div className="page-container">
            {weatherStatus === "loading" && (
              <div className="search-state">
                <p>
                  Loading weather for{" "}
                  {selectedCity.name}...
                </p>
              </div>
            )}

            {weatherStatus === "error" && (
              <div
                className="search-state search-state-error"
                role="alert"
              >
                <h3>
                  We couldn't load the weather.
                </h3>

                <p>{weatherError}</p>
              </div>
            )}

            {weatherStatus === "success" && (
              <WeatherCard
                city={selectedCity}
                weather={weather}
              />
            )}

            {weatherStatus === "success" &&
              recommendation.label !==
                "Not enough information" && (
                <section
                  className="recommendation-section"
                  aria-label="City recommendation"
                >
                  <div className="recommendation-card">
                    <div className="recommendation-header">
                      <div>
                        <p className="eyebrow">
                          Your WHERE2 match
                        </p>

                        <h2>
                          {recommendation.label}
                        </h2>
                      </div>

                      <span className="recommendation-score">
                        {recommendation.score}
                      </span>
                    </div>

                    {recommendation.reasons.length > 0 && (
                      <div className="recommendation-reasons">
                        <h3>
                          Why it may suit you
                        </h3>

                        <ul>
                          {recommendation.reasons.map(
                            (reason) => (
                              <li key={reason}>
                                {reason}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              )}

            {forecastStatus === "loading" && (
              <div className="search-state">
                <p>
                  Loading the 7-day forecast for{" "}
                  {selectedCity.name}...
                </p>
              </div>
            )}

            {forecastStatus === "error" && (
              <div
                className="search-state search-state-error"
                role="alert"
              >
                <h3>
                  We couldn't load the forecast.
                </h3>

                <p>{forecastError}</p>
              </div>
            )}

            {forecastStatus === "success" && (
              <WeatherForecast
                city={selectedCity}
                forecast={forecast}
              />
            )}

            {comparisonCity &&
              comparisonWeatherStatus ===
                "loading" && (
                <div className="search-state">
                  <p>
                    Loading weather for{" "}
                    {comparisonCity.name}...
                  </p>
                </div>
              )}

            {comparisonCity &&
              comparisonWeatherStatus ===
                "error" && (
                <div
                  className="search-state search-state-error"
                  role="alert"
                >
                  <h3>
                    We couldn't load the comparison
                    weather.
                  </h3>

                  <p>
                    {comparisonWeatherError}
                  </p>
                </div>
              )}

            {comparison &&
              comparisonWinner && (
                <CityComparison
                  comparison={comparison}
                  winner={comparisonWinner}
                />
              )}

            {cityDetails && (
              <CityDetails city={cityDetails} />
            )}
          </div>
        </section>
      )}

      <HowItWorks />

      <CityPreview />

      <FinalCTA />

      <section className="component-section">
        <div className="page-container">
          <div className="section-heading">
            <p className="eyebrow">
              Foundation
            </p>

            <h2>
              WHERE2 design system
            </h2>
          </div>

          <div className="component-grid">
            <article className="demo-card">
              <div className="color-sample color-primary" />

              <h3>Primary</h3>

              <p>
                The main WHERE2 brand color used
                for important actions and
                highlights.
              </p>
            </article>

            <article className="demo-card">
              <div className="color-sample color-light" />

              <h3>Primary Light</h3>

              <p>
                A soft supporting color for
                backgrounds, highlights, and
                selected states.
              </p>
            </article>

            <article className="demo-card">
              <div className="color-sample color-surface" />

              <h3>Surface</h3>

              <p>
                Used for cards, sections, and
                subtle separation from the main
                background.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;