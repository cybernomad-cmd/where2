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
import { getCurrentWeather } from "./services/weatherApi";
import { getWeatherForecast } from "./services/forecastApi";

function App() {
  const [selectedCity, setSelectedCity] = useState(null);

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
            "Unable to retrieve weather data right now."
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

  function handlePreferencesChange(updatedPreferences) {
    setPreferences(updatedPreferences);
  }

  function handleCitySelect(city) {
    const isSameCity = selectedCity?.id === city.id;

    if (isSameCity && weatherStatus !== "error") {
      return;
    }

    setSelectedCity(city);

    setWeather(null);
    setWeatherError("");
    setWeatherStatus("loading");

    setForecast(null);
    setForecastError("");
    setForecastStatus("loading");
  }

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
                  Loading weather for {selectedCity.name}...
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
                <h3>We couldn't load the forecast.</h3>

                <p>{forecastError}</p>
              </div>
            )}

            {forecastStatus === "success" && (
              <WeatherForecast
                city={selectedCity}
                forecast={forecast}
              />
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
            <p className="eyebrow">Foundation</p>

            <h2>WHERE2 design system</h2>
          </div>

          <div className="component-grid">
            <article className="demo-card">
              <div className="color-sample color-primary" />

              <h3>Primary</h3>

              <p>
                The main WHERE2 brand color used for important
                actions and highlights.
              </p>
            </article>

            <article className="demo-card">
              <div className="color-sample color-light" />

              <h3>Primary Light</h3>

              <p>
                A soft supporting color for backgrounds,
                highlights, and selected states.
              </p>
            </article>

            <article className="demo-card">
              <div className="color-sample color-surface" />

              <h3>Surface</h3>

              <p>
                Used for cards, sections, and subtle
                separation from the main background.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;