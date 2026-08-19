const WEATHER_API_URL =
  "https://api.open-meteo.com/v1/forecast";

export async function getCurrentWeather(
  latitude,
  longitude
) {
  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    throw new Error(
      "Valid latitude and longitude are required."
    );
  }

  const url = new URL(WEATHER_API_URL);

  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m"
  );
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Unable to retrieve weather data right now."
    );
  }

  const data = await response.json();

  if (!data.current) {
    throw new Error(
      "Weather data is unavailable for this location."
    );
  }

  return data.current;
}