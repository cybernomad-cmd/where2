import { getWeatherCondition } from "../services/weatherConditions";
import WeatherIcon from "./WeatherIcon";

function formatForecastDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

function WeatherForecast({ city, forecast }) {
  if (!city || !forecast) {
    return null;
  }

  const forecastDays = forecast.time.map(
    (date, index) => ({
      date,
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
    <section className="weather-forecast">
      <div className="weather-forecast-heading">
        <div>
          <p className="eyebrow">Looking ahead</p>

          <h2>7-day forecast</h2>
        </div>

        <p>
          See how the weather could change in{" "}
          {city.name} over the next week.
        </p>
      </div>

      <div className="forecast-grid">
        {forecastDays.map((day) => (
          <article
            className="forecast-card"
            key={day.date}
          >
            <p className="forecast-date">
              {formatForecastDate(day.date)}
            </p>

            <div
              className="forecast-icon"
              aria-hidden="true"
            >
              <WeatherIcon
                code={day.weatherCode}
                size={82}
              />
            </div>

            <p className="forecast-condition">
              {day.condition}
            </p>

            <div className="forecast-temperatures">
              <strong>
                {Math.round(day.maxTemperature)}°
              </strong>

              <span>
                {Math.round(day.minTemperature)}°
              </span>
            </div>

            <div className="forecast-rain">
              <span>Rain chance</span>

              <strong>
                {day.precipitationProbability}%
              </strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WeatherForecast;