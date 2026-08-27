import { getWeatherCondition } from "../services/weatherConditions";
import WeatherIcon from "./WeatherIcon";

function getDayName(dateString, index) {
  if (index === 0) {
    return "Today";
  }

  const date = new Date(
    `${dateString}T12:00:00`
  );

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(date);
}

function WeatherForecast({ city, forecast }) {
  if (!city || !forecast) {
    return null;
  }

  const forecastDays = forecast.time.map(
    (date, index) => ({
      date,
      dayName: getDayName(date, index),
      weatherCode: forecast.weather_code[index],
      condition: getWeatherCondition(
        forecast.weather_code[index]
      ),
      maxTemperature:
        forecast.temperature_2m_max[index],
      minTemperature:
        forecast.temperature_2m_min[index],
      precipitationProbability:
        forecast.precipitation_probability_max[index],
    })
  );

  return (
    <section
      className="weather-forecast-dashboard"
      aria-label="Seven day weather forecast"
    >
      <div className="weather-forecast-dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            WEATHER OUTLOOK
          </p>

          <h3>7-day forecast</h3>
        </div>

        <button
          type="button"
          className="forecast-view-button"
        >
          View full forecast →
        </button>
      </div>

      <div className="forecast-dashboard-grid">
        {forecastDays.map((day, index) => (
          <article
            className={`forecast-dashboard-card ${
              index === 0
                ? "forecast-dashboard-card-active"
                : ""
            }`}
            key={day.date}
          >
            <span className="forecast-dashboard-day">
              {day.dayName}
            </span>

            <div
              className="forecast-dashboard-icon"
              aria-hidden="true"
            >
              <WeatherIcon
                code={day.weatherCode}
                size={48}
              />
            </div>

            <span className="forecast-dashboard-condition">
              {day.condition}
            </span>

            <div className="forecast-dashboard-temperatures">
              <strong>
                {Math.round(day.maxTemperature)}°
              </strong>

              <span>
                {Math.round(day.minTemperature)}°
              </span>
            </div>

            <span className="forecast-dashboard-rain">
              {day.precipitationProbability}% rain
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WeatherForecast;