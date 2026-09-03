import {
  CloudRain,
  Sparkles,
  Thermometer,
  Wind,
} from "lucide-react";


function CityWeatherInsights({ city, weather, forecast }) {
  if (!city || !weather || !forecast) {
    return null;
  }

  const forecastDays = forecast.time.map((date, index) => ({
    date,
    maxTemperature: Number(
      forecast.temperature_2m_max[index]
    ),
    minTemperature: Number(
      forecast.temperature_2m_min[index]
    ),
    precipitationProbability: Number(
      forecast.precipitation_probability_max[index]
    ),
  }));

  const validDays = forecastDays.filter(
    (day) =>
      Number.isFinite(day.maxTemperature) &&
      Number.isFinite(day.minTemperature)
  );

  const highestTemperature = validDays.length
    ? Math.max(
        ...validDays.map(
          (day) => day.maxTemperature
        )
      )
    : null;

  const lowestTemperature = validDays.length
    ? Math.min(
        ...validDays.map(
          (day) => day.minTemperature
        )
      )
    : null;

  const highestRainProbability =
    forecastDays.length
      ? Math.max(
          ...forecastDays.map(
            (day) =>
              day.precipitationProbability
          )
        )
      : null;

  const averageTemperature =
    highestTemperature !== null &&
    lowestTemperature !== null
      ? (highestTemperature + lowestTemperature) / 2
      : null;

  function getRainInsight() {
    if (highestRainProbability === null) {
      return "Rain information is unavailable.";
    }

    if (highestRainProbability >= 70) {
      return "Rain is likely during the week.";
    }

    if (highestRainProbability >= 40) {
      return "There is a moderate chance of rain this week.";
    }

    return "Rain chances look relatively low this week.";
  }

  function getTemperatureInsight() {
    if (averageTemperature === null) {
      return "Temperature information is unavailable.";
    }

    if (averageTemperature >= 28) {
      return "Expect generally warm conditions.";
    }

    if (averageTemperature >= 20) {
      return "Expect generally comfortable temperatures.";
    }

    return "Expect generally cool conditions.";
  }

  function getWindInsight() {
    const windSpeed = Number(weather.wind_speed_10m);

    if (!Number.isFinite(windSpeed)) {
      return "Wind information is unavailable.";
    }

    if (windSpeed >= 30) {
      return "Strong winds may affect outdoor activities.";
    }

    if (windSpeed >= 15) {
      return "Moderate winds are expected.";
    }

    return "Light winds should make outdoor conditions comfortable.";
  }

  function getComfortInsight() {
    const temperature = Number(
      weather.temperature_2m
    );

    const humidity = Number(
      weather.relative_humidity_2m
    );

    if (
      !Number.isFinite(temperature) ||
      !Number.isFinite(humidity)
    ) {
      return "Comfort information is unavailable.";
    }

    if (temperature >= 28 && humidity >= 70) {
      return "Warm and humid conditions may feel warmer than the temperature suggests.";
    }

    if (temperature <= 15) {
      return "Cool conditions may require an extra layer.";
    }

    return "Current conditions should feel reasonably comfortable.";
  }

  return (
    <section
      className="city-weather-insights"
      aria-label={`Weather insights for ${city.name}`}
    >
      <div className="city-weather-insights-heading">
        <div>
          <p className="eyebrow">Weather outlook</p>

          <h2>What the weather means</h2>
        </div>

        <div className="city-weather-insights-context">
          <p>
            A simple interpretation of the current
            conditions and the week ahead in{" "}
            {city.name}.
          </p>

          <span className="city-weather-live">
            <span
              className="city-weather-live-dot"
              aria-hidden="true"
            />
            Live weather
          </span>
        </div>
      </div>

      <div className="weather-insights-grid">
        {/* Rain */}
        <article className="weather-insight-card weather-insight-rain">
          <div className="weather-insight-top">
            <div className="weather-insight-icon">
              <CloudRain
                size={19}
                aria-hidden="true"
              />
            </div>

            <span>Rain outlook</span>
          </div>

          <strong>
            {highestRainProbability !== null
              ? `${highestRainProbability}%`
              : "—"}
          </strong>

          {highestRainProbability !== null && (
            <div
              className="weather-insight-progress"
              aria-hidden="true"
            >
              <span
                style={{
                  width: `${Math.min(
                    Math.max(
                      highestRainProbability,
                      0
                    ),
                    100
                  )}%`,
                }}
              />
            </div>
          )}

          <p>{getRainInsight()}</p>
        </article>

        {/* Temperature */}
        <article className="weather-insight-card weather-insight-temperature">
          <div className="weather-insight-top">
            <div className="weather-insight-icon">
              <Thermometer
                size={19}
                aria-hidden="true"
              />
            </div>

            <span>Temperature</span>
          </div>

          <strong>
            {highestTemperature !== null &&
            lowestTemperature !== null
              ? `${Math.round(
                  lowestTemperature
                )}° — ${Math.round(
                  highestTemperature
                )}°`
              : "—"}
          </strong>

          <div
            className="weather-insight-temperature-range"
            aria-hidden="true"
          >
            <span />
          </div>

          <p>{getTemperatureInsight()}</p>
        </article>

        {/* Wind */}
        <article className="weather-insight-card weather-insight-wind">
          <div className="weather-insight-top">
            <div className="weather-insight-icon">
              <Wind
                size={19}
                aria-hidden="true"
              />
            </div>

            <span>Wind</span>
          </div>

          <strong>
            {Number.isFinite(
              Number(weather.wind_speed_10m)
            )
              ? `${Math.round(
                  Number(weather.wind_speed_10m)
                )} km/h`
              : "—"}
          </strong>

          {Number.isFinite(
            Number(weather.wind_speed_10m)
          ) && (
            <div
              className="weather-insight-wind-meter"
              aria-hidden="true"
            >
              <span
                style={{
                  width: `${Math.min(
                    Math.max(
                      Number(
                        weather.wind_speed_10m
                      ),
                      0
                    ),
                    40
                  ) * 2.5}%`,
                }}
              />
            </div>
          )}

          <p>{getWindInsight()}</p>
        </article>

        {/* Comfort */}
        <article className="weather-insight-card weather-insight-comfort">
          <div className="weather-insight-top">
            <div className="weather-insight-icon">
              <Sparkles
                size={19}
                aria-hidden="true"
              />
            </div>

            <span>Comfort</span>
          </div>

          <strong>
            {Number.isFinite(
              Number(weather.temperature_2m)
            )
              ? `${Math.round(
                  Number(weather.temperature_2m)
                )}°C`
              : "—"}
          </strong>

          <div
            className="weather-insight-comfort-status"
            aria-hidden="true"
          >
            <span />
            <span>Comfortable</span>
          </div>

          <p>{getComfortInsight()}</p>
        </article>
      </div>
    </section>
  );
}

export default CityWeatherInsights;