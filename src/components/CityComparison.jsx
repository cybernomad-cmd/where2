function CityComparison({
  comparison,
  winner,
}) {
  if (!comparison) {
    return null;
  }

  const { cityA, cityB } = comparison;

  function formatTemperature(value) {
    return `${Math.round(Number(value))}°C`;
  }

  return (
    <section
      className="city-comparison"
      aria-label="City comparison"
    >
      <div className="page-container">
        <div className="city-comparison-heading">
          <p className="eyebrow">Compare cities</p>

          <h2>Which city fits you better?</h2>

          <p>
            Compare the weather and personalized match for
            the cities you're considering.
          </p>
        </div>

        {winner && (
          <div className="comparison-winner">
            <p className="eyebrow">WHERE2 recommendation</p>

            <h3>{winner.label}</h3>
          </div>
        )}

        <div className="comparison-grid">
          <article className="comparison-card">
            <div className="comparison-card-header">
              <div>
                <p className="comparison-label">
                  City A
                </p>

                <h3>
                  {cityA.city.name}, {cityA.city.country}
                </h3>
              </div>

              <span className="comparison-score">
                {cityA.recommendation.score}
              </span>
            </div>

            <div className="comparison-condition">
              <span>Current conditions</span>

              <strong>
                {formatTemperature(
                  cityA.weather.temperature_2m
                )}
              </strong>
            </div>

            <div className="comparison-details">
              <div>
                <span>Feels like</span>

                <strong>
                  {formatTemperature(
                    cityA.weather.apparent_temperature
                  )}
                </strong>
              </div>

              <div>
                <span>Humidity</span>

                <strong>
                  {cityA.weather.relative_humidity_2m}%
                </strong>
              </div>

              <div>
                <span>Wind</span>

                <strong>
                  {cityA.weather.wind_speed_10m} km/h
                </strong>
              </div>
            </div>

            <div className="comparison-fit">
              <span>Personalized fit</span>

              <strong>
                {cityA.recommendation.label}
              </strong>
            </div>
          </article>

          <article className="comparison-card">
            <div className="comparison-card-header">
              <div>
                <p className="comparison-label">
                  City B
                </p>

                <h3>
                  {cityB.city.name}, {cityB.city.country}
                </h3>
              </div>

              <span className="comparison-score">
                {cityB.recommendation.score}
              </span>
            </div>

            <div className="comparison-condition">
              <span>Current conditions</span>

              <strong>
                {formatTemperature(
                  cityB.weather.temperature_2m
                )}
              </strong>
            </div>

            <div className="comparison-details">
              <div>
                <span>Feels like</span>

                <strong>
                  {formatTemperature(
                    cityB.weather.apparent_temperature
                  )}
                </strong>
              </div>

              <div>
                <span>Humidity</span>

                <strong>
                  {cityB.weather.relative_humidity_2m}%
                </strong>
              </div>

              <div>
                <span>Wind</span>

                <strong>
                  {cityB.weather.wind_speed_10m} km/h
                </strong>
              </div>
            </div>

            <div className="comparison-fit">
              <span>Personalized fit</span>

              <strong>
                {cityB.recommendation.label}
              </strong>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default CityComparison;