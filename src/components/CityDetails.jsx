import { useState } from "react";

import {
  Copy,
  Share2,
} from "lucide-react";

import {
  getCountryMetadata,
} from "../services/countryMetadata";

function CityDetails({ city }) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  if (!city) {
    return null;
  }

  const countryMetadata =
    getCountryMetadata(city.countryCode);
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

  function getShareText() {
    const coordinates = getCoordinateValue();

    return [
      `${city.name}, ${city.country}`,
      city.region
        ? `Region: ${city.region}`
        : "",
      city.timezone
        ? `Timezone: ${city.timezone}`
        : "",
      coordinates
        ? `Coordinates: ${coordinates}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  function getLocalTime() {
    if (!city.timezone) {
      return null;
    }

    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: city.timezone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());
    } catch {
      return null;
    }
  }

  function getUtcOffset() {
    if (!city.timezone) {
      return null;
    }

    try {
      const parts = new Intl.DateTimeFormat(
        "en-US",
        {
          timeZone: city.timezone,
          timeZoneName: "longOffset",
          hour: "2-digit",
          minute: "2-digit",
        }
      ).formatToParts(new Date());

      const offset = parts.find(
        (part) => part.type === "timeZoneName"
      );

      return offset?.value || null;
    } catch {
      return null;
    }
  }

  const localTime = getLocalTime();
  const utcOffset = getUtcOffset();

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

  async function handleShareCity() {
    const shareText = getShareText();

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${city.name}, ${city.country}`,
          text: shareText,
        });

        setShared(true);

        window.setTimeout(() => {
          setShared(false);
        }, 1800);

        return;
      }

      await navigator.clipboard.writeText(
        shareText
      );

      setShared(true);

      window.setTimeout(() => {
        setShared(false);
      }, 1800);
    } catch {
      setShared(false);
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
            <p className="eyebrow">
              Location snapshot
            </p>

            <h2>
              {city.countryCode && (
  <img
    className="city-details-flag"
    src={`https://flagcdn.com/32x24/${city.countryCode.toLowerCase()}.png`}
    alt=""
    aria-hidden="true"
  />
)}

{city.name}, {city.country}
            </h2>

            <p>
              Get a clearer picture of the place
              you're exploring with essential
              geographic, location, and local
              information.
            </p>
          </div>

          {city.countryCode && (
            <span className="city-details-country-code">
              {city.countryCode}
            </span>
          )}
        </div>

        <div className="city-details-actions">
          <button
            type="button"
            className="button button-primary"
            onClick={handleShareCity}
          >
            <Share2
              size={17}
              aria-hidden="true"
            />

            {shared
              ? "City details copied"
              : "Share this city"}
          </button>
        </div>

        <div className="city-details-grid">
          <article className="city-detail-card">
            <div className="city-detail-card-label">
              Country
            </div>

            <strong>
  {city.countryCode && (
    <img
      className="city-detail-inline-flag"
      src={`https://flagcdn.com/24x18/${city.countryCode.toLowerCase()}.png`}
      alt=""
      aria-hidden="true"
    />
  )}

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

          <article className="city-detail-card">
            <div className="city-detail-card-label">
              Local time
            </div>

            <strong>
              {localTime || "Not available"}
            </strong>

            <small>
              {utcOffset ||
                "Local time unavailable"}
            </small>
          </article>

          <article className="city-detail-card">
            <div className="city-detail-card-label">
              Currency
            </div>

            <strong>
              {countryMetadata.currency}
            </strong>

            <small>
              Local currency
            </small>
          </article>

          <article className="city-detail-card">
            <div className="city-detail-card-label">
              Languages
            </div>

            <strong>
              {countryMetadata.languages}
            </strong>

            <small>
              Commonly spoken languages
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
                <Copy
                  size={15}
                  aria-hidden="true"
                />

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