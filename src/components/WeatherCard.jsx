import { getWeatherCondition } from "../services/weatherConditions";
import WeatherIcon from "./WeatherIcon";

function WeatherCard({ city, weather, isSaved, onSave }) {
  if (!city || !weather) {
    return null;
  }

  const condition = getWeatherCondition(
    weather.weather_code
  );

  const isDay = weather.is_day === 1;

  return (
    <article className="weather-dashboard-card">
      <div className="weather-dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            SELECTED CITY
          </p>

          <div className="weather-city-title">
            <h2>
              {city.name}, {city.country}
            </h2>

            {city.country_code && (
              <span className="weather-country-code">
                {city.country_code}
              </span>
            )}

            {isSaved && (
              <span className="weather-saved-badge">
                Saved
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          className="weather-card-menu"
          aria-label="City options"
        >
          •••
        </button>
      </div>

      <div className="weather-main-row">
        <div className="weather-main-condition">
          <WeatherIcon
            code={weather.weather_code}
            isDay={isDay}
            size={76}
          />

          <div>
            <strong className="weather-dashboard-temperature">
              {Math.round(weather.temperature_2m)}°C
            </strong>

            <p>{condition}</p>

            <span>
              Feels like{" "}
              {Math.round(
                weather.apparent_temperature
              )}
              °C
            </span>
          </div>
        </div>

        <div className="weather-dashboard-details">
          <div className="weather-dashboard-detail">
            <span>Humidity</span>

            <strong>
              {weather.relative_humidity_2m}%
            </strong>
          </div>

          <div className="weather-dashboard-detail">
            <span>Wind</span>

            <strong>
              {weather.wind_speed_10m} km/h
            </strong>
          </div>

          <div className="weather-dashboard-detail">
            <span>Weather</span>

            <strong>{condition}</strong>
          </div>
        </div>
      </div>

      {onSave && (
        <div className="weather-dashboard-actions">
          <button
            type="button"
            className={
              isSaved
                ? "weather-save-button weather-save-button-saved"
                : "weather-save-button"
            }
            onClick={() => onSave(city)}
          >
            {isSaved
              ? "Remove from saved cities"
              : "Save this city"}
          </button>
        </div>
      )}
    </article>
  );
}

export default WeatherCard;