const GEOCODING_API_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

function normalizeValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function rankCityResults(results, cityName) {
  const normalizedQuery =
    normalizeValue(cityName);

  return [...results].sort((a, b) => {
    const aName = normalizeValue(a.name);
    const bName = normalizeValue(b.name);

    const aExact =
      aName === normalizedQuery ? 1 : 0;
    const bExact =
      bName === normalizedQuery ? 1 : 0;

    if (aExact !== bExact) {
      return bExact - aExact;
    }

    const aStartsWith =
      aName.startsWith(normalizedQuery) ? 1 : 0;
    const bStartsWith =
      bName.startsWith(normalizedQuery) ? 1 : 0;

    if (aStartsWith !== bStartsWith) {
      return bStartsWith - aStartsWith;
    }

    const aCapital =
      a.feature_code === "PPLC" ? 1 : 0;
    const bCapital =
      b.feature_code === "PPLC" ? 1 : 0;

    if (aCapital !== bCapital) {
      return bCapital - aCapital;
    }

    const aPopulation =
      Number(a.population) || 0;
    const bPopulation =
      Number(b.population) || 0;

    if (aPopulation !== bPopulation) {
      return bPopulation - aPopulation;
    }

    const aHasRegion =
      a.admin1 ? 1 : 0;
    const bHasRegion =
      b.admin1 ? 1 : 0;

    if (aHasRegion !== bHasRegion) {
      return bHasRegion - aHasRegion;
    }

    return aName.localeCompare(bName);
  });
}

function filterCityResults(results, cityName) {
  const normalizedQuery =
    normalizeValue(cityName);

  return results.filter((city) => {
    const cityNameValue =
      normalizeValue(city.name);

    return (
      cityNameValue === normalizedQuery ||
      cityNameValue.includes(normalizedQuery)
    );
  });
}

export async function searchCities(cityName) {
  const trimmedCityName =
    cityName.trim();

  if (!trimmedCityName) {
    throw new Error(
      "Please enter a city name."
    );
  }

  const url = new URL(
    GEOCODING_API_URL
  );

  url.searchParams.set(
    "name",
    trimmedCityName
  );

  url.searchParams.set(
    "count",
    "20"
  );

  url.searchParams.set(
    "language",
    "en"
  );

  url.searchParams.set(
    "format",
    "json"
  );

  const response =
    await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Unable to search for cities right now."
    );
  }

  const data =
    await response.json();

  const results =
    data.results ?? [];

  const filteredResults =
    filterCityResults(
      results,
      trimmedCityName
    );

  return rankCityResults(
    filteredResults,
    trimmedCityName
  );
}