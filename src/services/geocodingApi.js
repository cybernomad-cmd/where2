const GEOCODING_API_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

function rankCityResults(results, cityName) {
  const normalizedQuery = cityName
    .trim()
    .toLowerCase();

  return [...results].sort((a, b) => {
    const aExact =
      a.name?.toLowerCase() === normalizedQuery ? 1 : 0;

    const bExact =
      b.name?.toLowerCase() === normalizedQuery ? 1 : 0;

    if (aExact !== bExact) {
      return bExact - aExact;
    }

    const aCapital =
      a.feature_code === "PPLC" ? 1 : 0;

    const bCapital =
      b.feature_code === "PPLC" ? 1 : 0;

    if (aCapital !== bCapital) {
      return bCapital - aCapital;
    }

    const aPopulation = Number(a.population) || 0;
    const bPopulation = Number(b.population) || 0;

    return bPopulation - aPopulation;
  });
}

function filterCityResults(results, cityName) {
  const normalizedQuery = cityName
    .trim()
    .toLowerCase();

  return results.filter((city) => {
    const cityNameValue =
      city.name?.toLowerCase() || "";

    return (
      cityNameValue === normalizedQuery ||
      cityNameValue.includes(normalizedQuery)
    );
  });
}

export async function searchCities(cityName) {
  const trimmedCityName = cityName.trim();

  if (!trimmedCityName) {
    throw new Error("Please enter a city name.");
  }

  const url = new URL(GEOCODING_API_URL);

  url.searchParams.set("name", trimmedCityName);

  // Increased from 10 to 20 so client-side
  // filters have a larger result set to work with.
  url.searchParams.set("count", "20");

  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Unable to search for cities right now."
    );
  }

  const data = await response.json();

  const results = data.results ?? [];

  const filteredResults = filterCityResults(
    results,
    trimmedCityName
  );

  return rankCityResults(
    filteredResults,
    trimmedCityName
  );
}