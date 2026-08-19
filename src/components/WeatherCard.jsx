function WeatherCard({ city, weather }) {
  if (!city || !weather) {
    return null;
  }

  return (
    <article className="weather-card">
      <div className="weather-card-header">
        <div>
          <p className="eyebrow">Current weather</p>

          <h2>
            {city.name}, {city.country}
          </h2>
        </div>

        <span className="weather-temperature">
          {Math.round(weather.temperature_2m)}°C
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