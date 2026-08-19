import { useEffect, useState } from "react";
import "./App.css";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import CityPreview from "./components/CityPreview";
import FinalCTA from "./components/FinalCTA";
import CitySearch from "./components/CitySearch";
import WeatherCard from "./components/WeatherCard";
import { getCurrentWeather } from "./services/weatherApi";

function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherStatus, setWeatherStatus] = useState("idle");
  const [weatherError, setWeatherError] = useState("");

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

function handleCitySelect(city) {
  const isSameCity = selectedCity?.id === city.id;

  if (isSameCity && weatherStatus !== "error") {
    return;
  }

  setSelectedCity(city);
  setWeather(null);
  setWeatherError("");
  setWeatherStatus("loading");
}

  return (
    <main className="design-system">
      <Nav />

      <Hero />

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