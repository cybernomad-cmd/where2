import { useEffect, useState } from "react";
import "./App.css";

import DashboardShell from "./components/DashboardShell";
import Preferences from "./components/Preferences";
import CitySearch from "./components/CitySearch";
import WeatherCard from "./components/WeatherCard";
import WeatherForecast from "./components/WeatherForecast";
import CityWeatherInsights from "./components/CityWeatherInsights";
import CityComparison from "./components/CityComparison";
import CityDetails from "./components/CityDetails";
import SavedCities from "./components/SavedCities";
import CostOfLiving from "./components/CostOfLiving";

import { getCurrentWeather } from "./services/weatherApi";
import { getWeatherForecast } from "./services/forecastApi";
import { getCityDetails } from "./services/cityDetailsService";
import { getCostOfLiving } from "./services/costOfLivingService";

import {
  calculateRecommendation,
} from "./services/recommendationService";

import {
  compareCities,
  getComparisonWinner,
} from "./services/comparisonService";

import {
  getSavedCities,
  isCitySaved,
  toggleSavedCity,
  removeSavedCity,
  clearSavedCities,
} from "./services/savedCitiesService";

function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [comparisonCity, setComparisonCity] =
    useState(null);

  const [savedCities, setSavedCities] = useState(
    getSavedCities
  );

  const [preferences, setPreferences] = useState({
    climate: "",
    lifestyle: "",
    priorities: [],
  });

  const [weather, setWeather] = useState(null);
  const [weatherStatus, setWeatherStatus] =
    useState("idle");
  const [weatherError, setWeatherError] =
    useState("");

  const [forecast, setForecast] = useState(null);
  const [forecastStatus, setForecastStatus] =
    useState("idle");
  const [forecastError, setForecastError] =
    useState("");

  const [costOfLiving, setCostOfLiving] =
    useState(null);
  const [
    costOfLivingStatus,
    setCostOfLivingStatus,
  ] = useState("idle");
  const [
    costOfLivingError,
    setCostOfLivingError,
  ] = useState("");

  const [
    comparisonWeather,
    setComparisonWeather,
  ] = useState(null);

  const [
    comparisonWeatherStatus,
    setComparisonWeatherStatus,
  ] = useState("idle");

  const [
    comparisonWeatherError,
    setComparisonWeatherError,
  ] = useState("");

  /*
   * CURRENT WEATHER
   */

  useEffect(() => {
    if (!selectedCity) {
      return;
    }

    let active = true;

    async function loadWeather() {
      setWeatherStatus("loading");
      setWeatherError("");

      try {
        const data = await getCurrentWeather(
          selectedCity.latitude,
          selectedCity.longitude
        );

        if (!active) {
          return;
        }

        setWeather(data);
        setWeatherStatus("success");
      } catch (error) {
        if (!active) {
          return;
        }

        setWeather(null);
        setWeatherStatus("error");
        setWeatherError(
          error.message ||
            "Unable to load current weather."
        );
      }
    }

    loadWeather();

    return () => {
      active = false;
    };
  }, [selectedCity]);

  /*
   * FORECAST
   */

  useEffect(() => {
    if (!selectedCity) {
      return;
    }

    let active = true;

    async function loadForecast() {
      setForecastStatus("loading");
      setForecastError("");

      try {
        const data = await getWeatherForecast(
          selectedCity.latitude,
          selectedCity.longitude
        );

        if (!active) {
          return;
        }

        setForecast(data);
        setForecastStatus("success");
      } catch (error) {
        if (!active) {
          return;
        }

        setForecast(null);
        setForecastStatus("error");
        setForecastError(
          error.message ||
            "Unable to load the weather forecast."
        );
      }
    }

    loadForecast();

    return () => {
      active = false;
    };
  }, [selectedCity]);

  /*
   * COST OF LIVING
   */

  useEffect(() => {
    if (!selectedCity) {
      return;
    }

    let active = true;

    async function loadCostOfLiving() {
      setCostOfLivingStatus("loading");
      setCostOfLivingError("");

      try {
        const data =
          await getCostOfLiving(selectedCity);

        if (!active) {
          return;
        }

        setCostOfLiving(data);
        setCostOfLivingStatus("success");
      } catch (error) {
        if (!active) {
          return;
        }

        setCostOfLiving(null);
        setCostOfLivingStatus("error");
        setCostOfLivingError(
          error.message ||
            "Unable to load cost-of-living information."
        );
      }
    }

    loadCostOfLiving();

    return () => {
      active = false;
    };
  }, [selectedCity]);

  /*
   * COMPARISON WEATHER
   */

  useEffect(() => {
    if (!comparisonCity) {
      return;
    }

    let active = true;

    async function loadComparisonWeather() {
      setComparisonWeatherStatus("loading");
      setComparisonWeatherError("");

      try {
        const data = await getCurrentWeather(
          comparisonCity.latitude,
          comparisonCity.longitude
        );

        if (!active) {
          return;
        }

        setComparisonWeather(data);
        setComparisonWeatherStatus("success");
      } catch (error) {
        if (!active) {
          return;
        }

        setComparisonWeather(null);
        setComparisonWeatherStatus("error");
        setComparisonWeatherError(
          error.message ||
            "Unable to load comparison weather."
        );
      }
    }

    loadComparisonWeather();

    return () => {
      active = false;
    };
  }, [comparisonCity]);

  /*
   * HANDLERS
   */

  function handlePreferencesChange(
    updatedPreferences
  ) {
    setPreferences(updatedPreferences);
  }

  function handleCitySelect(city) {
    if (!city) {
      return;
    }

    if (!selectedCity) {
      setSelectedCity(city);
      setComparisonCity(null);
      setComparisonWeather(null);
      setComparisonWeatherStatus("idle");
      setComparisonWeatherError("");
      return;
    }

    if (selectedCity.id === city.id) {
      return;
    }

    if (!comparisonCity) {
      setComparisonCity(city);
      return;
    }

    setComparisonCity(city);
  }

  function handleSaveCity(city) {
    const updatedCities =
      toggleSavedCity(city);

    setSavedCities(updatedCities);
  }

  function handleRemoveCity(cityId) {
    const updatedCities =
      removeSavedCity(cityId);

    setSavedCities(updatedCities);
  }

  function handleClearSavedCities() {
    const updatedCities =
      clearSavedCities();

    setSavedCities(updatedCities);
  }

  function handleSavedCitySelect(city) {
    setSelectedCity(city);
    setComparisonCity(null);
    setComparisonWeather(null);
    setComparisonWeatherStatus("idle");
    setComparisonWeatherError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /*
   * DERIVED DATA
   */

  const recommendation =
    calculateRecommendation(
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

  const selectedCityIsSaved = selectedCity
    ? isCitySaved(selectedCity.id)
    : false;

  /*
   * DASHBOARD
   */

  return (
    <DashboardShell>
      <div className="where2-dashboard-sections">

        {/* Dashboard heading */}

        <section className="where2-dashboard-welcome">
          <div>
            <p className="eyebrow">
              YOUR WHERE2 DASHBOARD
            </p>

            <h1>
              Find a city that fits your life.
            </h1>

            <p className="where2-dashboard-welcome-text">
              Explore cities using your climate,
              lifestyle, budget, weather, and
              personal priorities.
            </p>
          </div>
        </section>

        {/* Preferences */}

        <Preferences
          value={preferences}
          onPreferencesChange={
            handlePreferencesChange
          }
        />

        {/* City search */}

        <CitySearch
          onCitySelect={handleCitySelect}
        />

        {/* Saved cities */}

        <SavedCities
          cities={savedCities}
          onRemoveCity={handleRemoveCity}
          onSelectCity={handleSavedCitySelect}
          onClearCities={
            handleClearSavedCities
          }
        />

        {/* Selected city */}

        {selectedCity && (
          <section className="weather-section">
            <div className="page-container">

              <div className="where2-selected-city-header">
                <div>
                  <p className="eyebrow">
                    CURRENT CITY
                  </p>

                  <h2>
                    {selectedCity.name}
                  </h2>

                  <p>
                    Weather, cost of living,
                    insights, and recommendations
                    for your selected city.
                  </p>
                </div>

                {comparisonCity && (
                  <div className="where2-comparison-badge">
                    Comparing with{" "}
                    <strong>
                      {comparisonCity.name}
                    </strong>
                  </div>
                )}
              </div>

              {/* Current weather loading */}

              {weatherStatus === "loading" && (
                <div className="search-state">
                  <p>
                    Loading weather for{" "}
                    {selectedCity.name}...
                  </p>
                </div>
              )}

              {/* Current weather error */}

              {weatherStatus === "error" && (
                <div
                  className="search-state search-state-error"
                  role="alert"
                >
                  <h3>
                    We couldn't load the weather.
                  </h3>

                  <p>
                    {weatherError}
                  </p>
                </div>
              )}

              {/* Current weather */}

              {weatherStatus === "success" && (
                <WeatherCard
                  city={selectedCity}
                  weather={weather}
                  isSaved={selectedCityIsSaved}
                  onSave={handleSaveCity}
                />
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

              {/* Recommendation */}

              {weatherStatus === "success" &&
                recommendation.label !==
                  "Not enough information" && (
                  <section
                    className="recommendation-section"
                    aria-label="Personalized city recommendation"
                  >
                    <div className="recommendation-card">

                      <div className="recommendation-header">
                        <div className="recommendation-heading">

                          <p className="eyebrow">
                            YOUR WHERE2 MATCH
                          </p>

                          <h2>
                            {recommendation.label}
                          </h2>

                          <p className="recommendation-intro">
                            This recommendation is
                            based on your preferences
                            and current conditions in{" "}
                            {selectedCity.name}.
                          </p>

                        </div>

                        <div
                          className="recommendation-score-wrapper"
                          aria-label={`Recommendation score: ${recommendation.score}`}
                        >
                          <span className="recommendation-score">
                            {recommendation.score}
                          </span>

                          <span className="recommendation-score-label">
                            match score
                          </span>
                        </div>
                      </div>

                      {recommendation.reasons.length >
                        0 && (
                        <div className="recommendation-reasons">

                          <div className="recommendation-reasons-heading">

                            <p className="eyebrow">
                              WHY THIS CITY MAY
                              SUIT YOU
                            </p>

                            <h3>
                              Your preferences
                              and current
                              conditions
                            </h3>

                          </div>

                          <ul>
                            {recommendation.reasons.map(
                              (reason) => (
                                <li key={reason}>
                                  <span
                                    className="recommendation-check"
                                    aria-hidden="true"
                                  >
                                    ✓
                                  </span>

                                  <span>
                                    {reason}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>

                        </div>
                      )}
                    </div>
                  </section>
                )}

              {/* Forecast loading */}

              {forecastStatus === "loading" && (
                <div className="search-state">
                  <p>
                    Loading the 7-day forecast
                    for{" "}
                    {selectedCity.name}...
                  </p>
                </div>
              )}

              {/* Forecast error */}

              {forecastStatus === "error" && (
                <div
                  className="search-state search-state-error"
                  role="alert"
                >
                  <h3>
                    We couldn't load the
                    forecast.
                  </h3>

                  <p>
                    {forecastError}
                  </p>
                </div>
              )}

              {/* Forecast */}

              {forecastStatus === "success" && (
                <WeatherForecast
                  city={selectedCity}
                  forecast={forecast}
                />
              )}

              {/* Cost of living loading */}

              {costOfLivingStatus ===
                "loading" && (
                <div className="search-state">
                  <p>
                    Loading cost-of-living
                    information for{" "}
                    {selectedCity.name}...
                  </p>
                </div>
              )}

              {/* Cost of living error */}

              {costOfLivingStatus ===
                "error" && (
                <div
                  className="search-state search-state-error"
                  role="alert"
                >
                  <h3>
                    We couldn't load
                    cost-of-living
                    information.
                  </h3>

                  <p>
                    {costOfLivingError}
                  </p>
                </div>
              )}

              {/* Cost of living */}

              {costOfLivingStatus ===
                "success" && (
                <CostOfLiving
                  data={costOfLiving}
                  cityName={selectedCity.name}
                />
              )}

              {/* Comparison loading */}

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

              {/* Comparison error */}

              {comparisonCity &&
                comparisonWeatherStatus ===
                  "error" && (
                <div
                  className="search-state search-state-error"
                  role="alert"
                >
                  <h3>
                    We couldn't load the
                    comparison weather.
                  </h3>

                  <p>
                    {comparisonWeatherError}
                  </p>
                </div>
              )}

              {/* Comparison */}

              {comparison &&
                comparisonWinner && (
                <CityComparison
                  comparison={comparison}
                  winner={comparisonWinner}
                />
              )}

              {/* City details */}

              {cityDetails && (
                <CityDetails
                  city={cityDetails}
                />
              )}

            </div>
          </section>
        )}

        {/* Empty dashboard */}

        {!selectedCity && (
          <section className="where2-dashboard-empty">
            <div className="where2-dashboard-empty-card">

              <div className="where2-dashboard-empty-icon">
                <span>W2</span>
              </div>

              <div>
                <p className="eyebrow">
                  START EXPLORING
                </p>

                <h2>
                  Which city could fit your life?
                </h2>

                <p>
                  Set your preferences and search
                  for a city above. WHERE2 will
                  bring together weather, cost of
                  living, recommendations, and
                  city information to help you
                  make a more informed decision.
                </p>
              </div>

            </div>
          </section>
        )}

      </div>
    </DashboardShell>
  );
}

export default App;