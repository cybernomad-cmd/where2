const GEOCODING_API_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

export async function searchCities(cityName) {
  const trimmedCityName = cityName.trim();

  if (!trimmedCityName) {
    throw new Error("Please enter a city name.");
  }

  const url = new URL(GEOCODING_API_URL);

  url.searchParams.set("name", trimmedCityName);
  url.searchParams.set("count", "10");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Unable to search for cities right now."
    );
  }

  const data = await response.json();

  return data.results ?? [];
}