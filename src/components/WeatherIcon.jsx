import { getWeatherType } from "../services/weatherIconService";

import clearDay from "@meteocons/svg/fill/clear-day.svg";
import partlyCloudyDay from "@meteocons/svg/fill/partly-cloudy-day.svg";
import overcast from "@meteocons/svg/fill/overcast.svg";
import fog from "@meteocons/svg/fill/fog.svg";
import drizzle from "@meteocons/svg/fill/drizzle.svg";
import rain from "@meteocons/svg/fill/rain.svg";
import snow from "@meteocons/svg/fill/snow.svg";
import thunderstorms from "@meteocons/svg/fill/thunderstorms.svg";
import thunderstormsExtreme from "@meteocons/svg/fill/thunderstorms-extreme.svg";

const WEATHER_ICONS = {
  "clear-day": clearDay,
  "partly-cloudy-day": partlyCloudyDay,
  overcast,
  fog,
  drizzle,
  rain,
  snow,
  thunderstorms,
  "thunderstorms-extreme": thunderstormsExtreme,
};

function WeatherIcon({
  code,
  size = 88,
  className = "",
}) {
  const weatherType = getWeatherType(code);

  const iconSource =
    WEATHER_ICONS[weatherType.icon] ||
    WEATHER_ICONS.overcast;

  return (
    <span
      className={[
        "weather-icon",
        `weather-icon-${weatherType.icon}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      title={weatherType.label}
      aria-label={weatherType.label}
      role="img"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <span className="weather-icon-glow" />

      <img
        className="weather-icon-image"
        src={iconSource}
        alt=""
        width={size}
        height={size}
        aria-hidden="true"
      />

      {weatherType.icon === "rain" && (
        <span className="weather-particles weather-rain-particles">
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>
      )}

      {weatherType.icon === "drizzle" && (
        <span className="weather-particles weather-drizzle-particles">
          <span />
          <span />
          <span />
        </span>
      )}

      {weatherType.icon === "snow" && (
        <span className="weather-particles weather-snow-particles">
          <span>•</span>
          <span>•</span>
          <span>•</span>
          <span>•</span>
        </span>
      )}

      {(weatherType.icon === "thunderstorms" ||
        weatherType.icon === "thunderstorms-extreme") && (
        <span className="weather-lightning-flash" />
      )}
    </span>
  );
}

export default WeatherIcon;