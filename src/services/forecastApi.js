const FORECAST_API_URL =
  "https://api.open-meteo.com/v1/forecast";

export async function getWeatherForecast(
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

  const url = new URL(FORECAST_API_URL);

  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);

  url.searchParams.set(
    "daily",
    "temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max"
  );

  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Unable to retrieve the weather forecast right now."
    );
  }

  const data = await response.json();

  if (!data.daily) {
    throw new Error(
      "Weather forecast data is unavailable for this location."
    );
  }

  return data.daily;
}