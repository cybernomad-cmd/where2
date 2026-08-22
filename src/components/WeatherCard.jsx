import { getWeatherCondition } from "../services/weatherConditions";
import WeatherIcon from "./WeatherIcon";

function WeatherCard({ city, weather }) {
  if (!city || !weather) {
    return null;
  }

  const condition = getWeatherCondition(weather.weather_code);

  const isDay = weather.is_day === 1;

  return (
    <article className="weather-card">
      <div className="weather-card-header">
        <div>
          <p className="eyebrow">Current weather</p>

          <h2>
            {city.name}, {city.country}
          </h2>

          <p className="weather-condition">
            {condition}
          </p>
        </div>

        <WeatherIcon
          code={weather.weather_code}
          isDay={isDay}
          size={112}
        />
      </div>

      <div className="weather-temperature-row">
        <strong className="weather-temperature">
          {Math.round(weather.temperature_2m)}°C
        </strong>

        <span className="weather-temperature-label">
          Current temperature
        </span>
      </div>

      <div className="weather-details">
        <div className="weather-detail">
          <span>Feels like</span>

          <strong>
            {Math.round(weather.apparent_temperature)}°C
          </strong>
        </div>

        <div className="weather-detail">
          <span>Humidity</span>

          <strong>
            {weather.relative_humidity_2m}%
          </strong>
        </div>

        <div className="weather-detail">
          <span>Wind</span>

          <strong>
            {weather.wind_speed_10m} km/h
          </strong>
        </div>
      </div>
    </article>
  );
}

export default WeatherCard;