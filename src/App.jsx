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
  const [comparisonCity, setComparisonCity] = useState(null);

  const [savedCities, setSavedCities] = useState(
    getSavedCities
  );

  const [preferences, setPreferences] = useState({
    climate: "",
    lifestyle: "",
    priorities: [],
  });

  /*Current Weather*/

  const [weather, setWeather] = useState(null);
  const [weatherStatus, setWeatherStatus] =
    useState("idle");
  const [weatherError, setWeatherError] =
    useState("");

  /*7-Day Forecast*/

  const [forecast, setForecast] = useState(null);
  const [forecastStatus, setForecastStatus] =
    useState("idle");
  const [forecastError, setForecastError] =
    useState("");

  /*Cost of Living*/

  const [costOfLiving, setCostOfLiving] =
    useState(null);

  const [costOfLivingStatus, setCostOfLivingStatus] =
    useState("idle");

  const [costOfLivingError, setCostOfLivingError] =
    useState("");

  /* Comparison Weather*/

  const [comparisonWeather, setComparisonWeather] =
    useState(null);

  const [
    comparisonWeatherStatus,
    setComparisonWeatherStatus,
  ] = useState("idle");

  const [
    comparisonWeatherError,
    setComparisonWeatherError,
  ] = useState("");

  /*Current Weather API*/

  useEffect(() => {
    if (!selectedCity) {
      return;
    }

    let isActive = true;

    async function loadWeather() {
      try {
        const currentWeather =
          await getCurrentWeather(
            selectedCity.latitude,
            selectedCity.longitude
          );

        if (!isActive) {
          return;
        }

        setWeather(currentWeather);
        setWeatherStatus("success");
        setWeatherError("");
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

  /*7-Day Forecast API*/

  useEffect(() => {
    if (!selectedCity) {
      return;
    }

    let isActive = true;

    async function loadForecast() {
      try {
        const forecastData =
          await getWeatherForecast(
            selectedCity.latitude,
            selectedCity.longitude
          );

        if (!isActive) {
          return;
        }

        setForecast(forecastData);
        setForecastStatus("success");
        setForecastError("");
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

  /*Cost of Living API*/

  useEffect(() => {
    if (!selectedCity) {
      return;
    }

    let isActive = true;

    async function loadCostOfLiving() {
      setCostOfLiving(null);
      setCostOfLivingError("");
      setCostOfLivingStatus("loading");

      try {
        const data =
          await getCostOfLiving(selectedCity);

        if (!isActive) {
          return;
        }

        setCostOfLiving(data);
        setCostOfLivingStatus("success");
        setCostOfLivingError("");
      } catch (requestError) {
        if (!isActive) {
          return;
        }

        setCostOfLiving(null);

        setCostOfLivingError(
          requestError.message ||
            "Unable to retrieve cost-of-living information right now."
        );

        setCostOfLivingStatus("error");
      }
    }

    loadCostOfLiving();

    return () => {
      isActive = false;
    };
  }, [selectedCity]);

  /*Comparison Weather API*/

  useEffect(() => {
    if (!comparisonCity) {
      return;
    }

    let isActive = true;

    async function loadComparisonWeather() {
      setComparisonWeatherStatus("loading");
      setComparisonWeatherError("");

      try {
        const currentWeather =
          await getCurrentWeather(
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

  /*Preferences*/

  function handlePreferencesChange(
    updatedPreferences
  ) {
    setPreferences(updatedPreferences);
  }

/*City Selection*/

  function handleCitySelect(city) {
    const isSelectedCity =
      selectedCity?.id === city.id;

    const isComparisonCity =
      comparisonCity?.id === city.id;

    if (isSelectedCity || isComparisonCity) {
      return;
    }

    /*First City*/

    if (!selectedCity) {
      setSelectedCity(city);

      setWeather(null);
      setWeatherError("");
      setWeatherStatus("loading");

      setForecast(null);
      setForecastError("");
      setForecastStatus("loading");

      setCostOfLiving(null);
      setCostOfLivingError("");
      setCostOfLivingStatus("loading");

      return;
    }

    /*Second City For Comparison */

    if (!comparisonCity) {
      setComparisonCity(city);

      setComparisonWeather(null);
      setComparisonWeatherError("");
      setComparisonWeatherStatus("loading");

      return;
    }

    /*Replace Comparison City*/

    setComparisonCity(city);

    setComparisonWeather(null);
    setComparisonWeatherError("");
    setComparisonWeatherStatus("loading");
  }

/* Save City */

function handleSaveCity(city) {
  const updatedCities = toggleSavedCity(city);

  setSavedCities(updatedCities);
}

/* Remove Saved City */

function handleRemoveCity(cityId) {
  const updatedCities = removeSavedCity(cityId);

  setSavedCities(updatedCities);
}

/* Clear Saved Cities */

function handleClearSavedCities() {
  const updatedCities = clearSavedCities();

  setSavedCities(updatedCities);
}

/* Select Saved City */

function handleSavedCitySelect(city) {
  setSelectedCity(city);
  setComparisonCity(null);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/* Recommendation */

const recommendation =
  calculateRecommendation(
    preferences,
    weather
  );

/* City Comparison */

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

/* City Details */

const cityDetails = selectedCity
  ? getCityDetails(selectedCity)
  : null;

/* Saved City Status */

const selectedCityIsSaved = selectedCity
  ? isCitySaved(selectedCity.id)
  : false;

/* RENDER */

  return (
    <main className="design-system">
      <Nav />

      <Hero />

      <Preferences
        value={preferences}
        onPreferencesChange={
          handlePreferencesChange
        }
      />

      <CitySearch
        onCitySelect={handleCitySelect}
      />

<SavedCities
  cities={savedCities}
  onRemoveCity={handleRemoveCity}
  onSelectCity={handleSavedCitySelect}
  onClearCities={handleClearSavedCities}
/>

{/*SELECTED CITY WEATHER AREA*/}

      {selectedCity && (
        <section className="weather-section">
          <div className="page-container">

{/*Current Weather Loading*/}

            {weatherStatus === "loading" && (
              <div className="search-state">
                <p>
                  Loading weather for{" "}
                  {selectedCity.name}...
                </p>
              </div>
            )}

{/*Current Weather Error*/}

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

{/*Current Weather Success*/}

            {weatherStatus === "success" && (
              <>
                <WeatherCard
                  city={selectedCity}
                  weather={weather}
                />

                <div className="city-save-action">
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() =>
                      handleSaveCity(
                        selectedCity
                      )
                    }
                  >
                    {selectedCityIsSaved
                      ? "Remove from saved cities"
                      : "Save this city"}
                  </button>
                </div>
              </>
            )}

{/*Recommendation*/}

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

                    {recommendation.reasons
                      .length > 0 && (
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

{/*7-Day Forecast Loading*/}

            {forecastStatus === "loading" && (
              <div className="search-state">
                <p>
                  Loading the 7-day forecast for{" "}
                  {selectedCity.name}...
                </p>
              </div>
            )}

{/*7-Day Forecast Error*/}

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

{/*7-Day Forecast Success*/}

            {forecastStatus === "success" && (
              <WeatherForecast
                city={selectedCity}
                forecast={forecast}
              />
            )}

{/*Cost of Living*/}

            {costOfLivingStatus === "loading" && (
              <div className="search-state">
                <p>
                  Loading cost-of-living information
                  for{" "}
                  {selectedCity.name}...
                </p>
              </div>
            )}

{/*Cost of Living Error*/}

            {costOfLivingStatus === "error" && (
              <div
                className="search-state search-state-error"
                role="alert"
              >
                <h3>
                  We couldn't load cost-of-living
                  information.
                </h3>

                <p>
                  {costOfLivingError}
                </p>
              </div>
            )}

{/*Cost of Living Success*/}

            {costOfLivingStatus === "success" && (
              <CostOfLiving
                data={costOfLiving}
                cityName={selectedCity.name}
              />
            )}

{/*Comparison Weather Loading*/}

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

{/*Comparison Weather Error*/}

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

{/*City Comparison*/}

            {comparison &&
              comparisonWinner && (
                <CityComparison
                  comparison={comparison}
                  winner={comparisonWinner}
                />
              )}

{/*City Details*/}

            {cityDetails && (
              <CityDetails
                city={cityDetails}
              />
            )}
          </div>
        </section>
      )}

{/*Static Page Sections*/}

      <HowItWorks />

      <CityPreview />

      <FinalCTA />

{/*Design System*/}

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