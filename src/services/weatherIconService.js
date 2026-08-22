const WEATHER_TYPES = {
  clear: {
    label: "Clear sky",
    icon: "clear-day",
  },

  partlyCloudy: {
    label: "Partly cloudy",
    icon: "partly-cloudy-day",
  },

  cloudy: {
    label: "Overcast",
    icon: "overcast",
  },

  fog: {
    label: "Fog",
    icon: "fog",
  },

  drizzle: {
    label: "Drizzle",
    icon: "drizzle",
  },

  rain: {
    label: "Rain",
    icon: "rain",
  },

  snow: {
    label: "Snow",
    icon: "snow",
  },

  storm: {
    label: "Thunderstorm",
    icon: "thunderstorms",
  },

  stormExtreme: {
    label: "Severe thunderstorm",
    icon: "thunderstorms-extreme",
  },
};

export function getWeatherType(code) {
  if (code === 0) {
    return WEATHER_TYPES.clear;
  }

  if ([1, 2].includes(code)) {
    return WEATHER_TYPES.partlyCloudy;
  }

  if (code === 3) {
    return WEATHER_TYPES.cloudy;
  }

  if ([45, 48].includes(code)) {
    return WEATHER_TYPES.fog;
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return WEATHER_TYPES.drizzle;
  }

  if (
    [61, 63, 65, 66, 67, 80, 81, 82].includes(code)
  ) {
    return WEATHER_TYPES.rain;
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return WEATHER_TYPES.snow;
  }

  if (code === 95) {
    return WEATHER_TYPES.storm;
  }

  if ([96, 99].includes(code)) {
    return WEATHER_TYPES.stormExtreme;
  }

  return WEATHER_TYPES.cloudy;
}