function Metric({ label, value }) {
  return (
    <div className="comparison-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function CityComparison({
  comparison,
  winner,
  selectedCity,
  comparisonCity,
}) {
  if (
    !comparison ||
    !selectedCity ||
    !comparisonCity
  ) {
    return null;
  }

  const cityA = comparison.cityA;
  const cityB = comparison.cityB;

  const cityAIsWinner =
    winner?.cityId === selectedCity.id;

  const cityBIsWinner =
    winner?.cityId === comparisonCity.id;

  return (
    <section
      className="city-comparison"
      id="city-comparison"
      aria-labelledby="city-comparison-title"
    >
      <div className="page-container">
        <div className="city-comparison-heading">
          <p className="eyebrow">City comparison</p>

          <h2 id="city-comparison-title">
            Which city fits you better?
          </h2>

          <p>
            Compare your selected cities using current weather
            conditions and your personal preferences.
          </p>
        </div>

        {winner && (
          <div
            className="comparison-winner"
            role="status"
            aria-live="polite"
          >
            <p className="eyebrow">
              Personalized recommendation
            </p>

            <h3>
              {winner.cityName} is the better match for you.
            </h3>

            <p className="comparison-winner-reason">
              {winner.reason}
            </p>
          </div>
        )}

        <div className="comparison-grid">
          <article
            className={[
              "comparison-card",
              cityAIsWinner
                ? "comparison-card-winner"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="comparison-card-header">
              <div>
                <p className="comparison-label">
                  City A
                </p>

                <h3>{cityA.name}</h3>

                <p className="comparison-location">
                  {cityA.admin1
                    ? `${cityA.admin1}, ${cityA.country}`
                    : cityA.country}
                </p>
              </div>

              <div
                className="comparison-score"
                aria-label={`${cityA.score} out of 100`}
              >
                {cityA.score}
              </div>
            </div>

            {cityAIsWinner && (
              <div className="comparison-best-match">
                Best match
              </div>
            )}

            <div className="comparison-condition">
              <span>
                Current conditions
              </span>

              <strong>
                {cityA.weather?.temperature !==
                undefined
                  ? `${Math.round(
                      cityA.weather.temperature
                    )}°`
                  : "Unavailable"}
              </strong>
            </div>

            <div className="comparison-details">
              <Metric
                label="Feels like"
                value={
                  cityA.weather?.apparentTemperature !==
                  undefined
                    ? `${Math.round(
                        cityA.weather.apparentTemperature
                      )}°`
                    : "Unavailable"
                }
              />

              <Metric
                label="Humidity"
                value={
                  cityA.weather?.relativeHumidity !==
                  undefined
                    ? `${Math.round(
                        cityA.weather.relativeHumidity
                      )}%`
                    : "Unavailable"
                }
              />

              <Metric
                label="Wind"
                value={
                  cityA.weather?.windSpeed !==
                  undefined
                    ? `${Math.round(
                        cityA.weather.windSpeed
                      )} km/h`
                    : "Unavailable"
                }
              />

              <Metric
                label="Personal fit"
                value={`${cityA.score}/100`}
              />
            </div>

            <div className="comparison-recommendation">
              <span>Recommendation</span>

              <p>{cityA.recommendation}</p>
            </div>
          </article>

          <article
            className={[
              "comparison-card",
              cityBIsWinner
                ? "comparison-card-winner"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="comparison-card-header">
              <div>
                <p className="comparison-label">
                  City B
                </p>

                <h3>{cityB.name}</h3>

                <p className="comparison-location">
                  {cityB.admin1
                    ? `${cityB.admin1}, ${cityB.country}`
                    : cityB.country}
                </p>
              </div>

              <div
                className="comparison-score"
                aria-label={`${cityB.score} out of 100`}
              >
                {cityB.score}
              </div>
            </div>

            {cityBIsWinner && (
              <div className="comparison-best-match">
                Best match
              </div>
            )}

            <div className="comparison-condition">
              <span>
                Current conditions
              </span>

              <strong>
                {cityB.weather?.temperature !==
                undefined
                  ? `${Math.round(
                      cityB.weather.temperature
                    )}°`
                  : "Unavailable"}
              </strong>
            </div>

            <div className="comparison-details">
              <Metric
                label="Feels like"
                value={
                  cityB.weather?.apparentTemperature !==
                  undefined
                    ? `${Math.round(
                        cityB.weather.apparentTemperature
                      )}°`
                    : "Unavailable"
                }
              />

              <Metric
                label="Humidity"
                value={
                  cityB.weather?.relativeHumidity !==
                  undefined
                    ? `${Math.round(
                        cityB.weather.relativeHumidity
                      )}%`
                    : "Unavailable"
                }
              />

              <Metric
                label="Wind"
                value={
                  cityB.weather?.windSpeed !==
                  undefined
                    ? `${Math.round(
                        cityB.weather.windSpeed
                      )} km/h`
                    : "Unavailable"
                }
              />

              <Metric
                label="Personal fit"
                value={`${cityB.score}/100`}
              />
            </div>

            <div className="comparison-recommendation">
              <span>Recommendation</span>

              <p>{cityB.recommendation}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default CityComparison;