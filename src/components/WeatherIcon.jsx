import clearDay from "@meteocons/svg/fill/clear-day.svg";
import clearNight from "@meteocons/svg/fill/clear-night.svg";
import partlyCloudyDay from "@meteocons/svg/fill/partly-cloudy-day.svg";
import partlyCloudyNight from "@meteocons/svg/fill/partly-cloudy-night.svg";
import overcast from "@meteocons/svg/fill/overcast.svg";
import fog from "@meteocons/svg/fill/fog.svg";
import drizzle from "@meteocons/svg/fill/drizzle.svg";
import rain from "@meteocons/svg/fill/rain.svg";
import snow from "@meteocons/svg/fill/snow.svg";
import thunderstorms from "@meteocons/svg/fill/thunderstorms.svg";
import thunderstormsExtreme from "@meteocons/svg/fill/thunderstorms-extreme.svg";

import { getWeatherType } from "../services/weatherIconService";

const WEATHER_ICONS = {
  clear: {
    day: clearDay,
    night: clearNight,
  },

  partlyCloudy: {
    day: partlyCloudyDay,
    night: partlyCloudyNight,
  },

  cloudy: {
    day: overcast,
    night: overcast,
  },

  fog: {
    day: fog,
    night: fog,
  },

  drizzle: {
    day: drizzle,
    night: drizzle,
  },

  rain: {
    day: rain,
    night: rain,
  },

  snow: {
    day: snow,
    night: snow,
  },

  storm: {
    day: thunderstorms,
    night: thunderstorms,
  },

  stormExtreme: {
    day: thunderstormsExtreme,
    night: thunderstormsExtreme,
  },
};

function WeatherIcon({
  code,
  isDay = true,
  size = 96,
  className = "",
}) {
  const weatherType = getWeatherType(code);

  const iconSet =
    WEATHER_ICONS[weatherType.type] || WEATHER_ICONS.cloudy;

  const icon =
    iconSet[isDay ? "day" : "night"];

  return (
    <span
      className={`weather-icon ${className}`}
      title={weatherType.label}
      aria-label={weatherType.label}
      role="img"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <img
        src={icon}
        alt={weatherType.label}
        width={size}
        height={size}
        className="weather-icon-image"
      />
    </span>
  );
}

export default WeatherIcon;