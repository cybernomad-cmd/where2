import { useState } from "react";

function CityDetails({ city }) {
  const [copied, setCopied] = useState(false);

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

  function getCoordinateValue() {
    const latitude = Number(city.latitude);
    const longitude = Number(city.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return "";
    }

    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }

  async function handleCopyCoordinates() {
    const coordinates = getCoordinateValue();

    if (!coordinates) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        coordinates
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section
      className="city-details"
      id="city-details"
      aria-label={`${city.name} details`}
    >
      <div className="page-container">
        <div className="city-details-heading">
          <div>
            <p className="eyebrow">Location snapshot</p>

            <h2>
              {city.name}, {city.country}
            </h2>

            <p>
              Get a clearer picture of the place you're
              exploring with essential geographic and
              location information.
            </p>
          </div>

          {city.countryCode && (
            <span className="city-details-country-code">
              {city.countryCode}
            </span>
          )}
        </div>

        <div className="city-details-grid">
          <article className="city-detail-card">
            <div className="city-detail-card-label">
              Country
            </div>

            <strong>
              {city.country || "Not available"}
            </strong>

            {city.countryCode && (
              <small>
                Country code: {city.countryCode}
              </small>
            )}
          </article>

          <article className="city-detail-card">
            <div className="city-detail-card-label">
              Region
            </div>

            <strong>
              {city.region || "Not available"}
            </strong>

            <small>
              Administrative region
            </small>
          </article>

          <article className="city-detail-card">
            <div className="city-detail-card-label">
              Population
            </div>

            <strong>
              {formatNumber(population)}
            </strong>

            <small>
              Recorded population
            </small>
          </article>

          <article className="city-detail-card">
            <div className="city-detail-card-label">
              Elevation
            </div>

            <strong>
              {formatElevation(city.elevation)}
            </strong>

            <small>
              Above sea level
            </small>
          </article>

          <article className="city-detail-card">
            <div className="city-detail-card-label">
              Timezone
            </div>

            <strong>
              {city.timezone || "Not available"}
            </strong>

            <small>
              Local time zone
            </small>
          </article>

          <article className="city-detail-card city-detail-card-coordinates">
            <div className="city-detail-card-label">
              Coordinates
            </div>

            <strong>
              {formatCoordinate(city.latitude)},{" "}
              {formatCoordinate(city.longitude)}
            </strong>

            <small>
              Latitude and longitude
            </small>

            {getCoordinateValue() && (
              <button
                type="button"
                className="city-details-copy-button"
                onClick={handleCopyCoordinates}
              >
                {copied
                  ? "Coordinates copied"
                  : "Copy coordinates"}
              </button>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}

export default CityDetails;