import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Snowflake,
  Sun,
} from "lucide-react";

import { getWeatherType } from "../services/weatherIconService";

const ICONS = {
  sun: Sun,
  "cloud-sun": CloudSun,
  cloud: Cloud,
  "cloud-fog": CloudFog,
  "cloud-rain": CloudRain,
  "cloud-lightning": CloudLightning,
  droplets: Droplets,
  snowflake: Snowflake,
};

function WeatherIcon({
  code,
  size = 72,
  className = "",
}) {
  const weatherType = getWeatherType(code);

  const Icon = ICONS[weatherType.icon] || Cloud;

  return (
    <span
      className={`weather-icon weather-icon-${weatherType.icon} ${className}`}
      title={weatherType.label}
      aria-label={weatherType.label}
      role="img"
    >
      <Icon
        size={size}
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </span>
  );
}

export default WeatherIcon;