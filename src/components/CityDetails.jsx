function CityDetails({ city }) {
  if (!city) {
    return null;
  }

  const population = Number(city.population);

  function formatNumber(value) {
    if (!Number.isFinite(value) || value <= 0) {
      return "Not available";
    }

    return new Intl.NumberFormat("en-US").format(value);
  }

  function formatCoordinate(value) {
    if (!Number.isFinite(Number(value))) {
      return "Not available";
    }

    return Number(value).toFixed(4);
  }

  function formatElevation(value) {
    if (!Number.isFinite(Number(value))) {
      return "Not available";
    }

    return `${Math.round(Number(value))} m`;
  }

  return (
    <section
      className="city-details"
      id="city-details"
      aria-label={`${city.name} details`}
    >
      <div className="page-container">
        <div className="city-details-heading">
          <p className="eyebrow">City details</p>

          <h2>
            {city.name}, {city.country}
          </h2>

          <p>
            Useful location information to help you
            understand the city you're exploring.
          </p>
        </div>

        <div className="city-details-grid">
          <article className="city-detail-card">
            <span>Country</span>

            <strong>
              {city.country || "Not available"}
            </strong>

            {city.countryCode && (
              <small>{city.countryCode}</small>
            )}
          </article>

          <article className="city-detail-card">
            <span>Region</span>

            <strong>
              {city.region || "Not available"}
            </strong>
          </article>

          <article className="city-detail-card">
            <span>Population</span>

            <strong>
              {formatNumber(population)}
            </strong>
          </article>

          <article className="city-detail-card">
            <span>Elevation</span>

            <strong>
              {formatElevation(city.elevation)}
            </strong>
          </article>

          <article className="city-detail-card">
            <span>Timezone</span>

            <strong>
              {city.timezone || "Not available"}
            </strong>
          </article>

          <article className="city-detail-card">
            <span>Coordinates</span>

            <strong>
              {formatCoordinate(city.latitude)},{" "}
              {formatCoordinate(city.longitude)}
            </strong>
          </article>
        </div>
      </div>
    </section>
  );
}

export default CityDetails;