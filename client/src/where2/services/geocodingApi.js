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

    // 1. Exact city-name matches first
    const aExact =
      aName === normalizedQuery ? 1 : 0;

    const bExact =
      bName === normalizedQuery ? 1 : 0;

    if (aExact !== bExact) {
      return bExact - aExact;
    }

    // 2. Names beginning with the search term
    const aStartsWith =
      aName.startsWith(normalizedQuery) ? 1 : 0;

    const bStartsWith =
      bName.startsWith(normalizedQuery) ? 1 : 0;

    if (aStartsWith !== bStartsWith) {
      return bStartsWith - aStartsWith;
    }

    // 3. Prefer actual population centres
    const aPopulation =
      Number(a.population) || 0;

    const bPopulation =
      Number(b.population) || 0;

    if (aPopulation !== bPopulation) {
      return bPopulation - aPopulation;
    }

    // 4. Prefer results with a region
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

/*
 * Worldwide city search
 *
 * Open-Meteo's geocoding service returns locations
 * from around the world. We deliberately avoid
 * restricting the request to a particular country.
 */
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

  // Return a larger pool so we can rank
  // the most useful worldwide matches.
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
    Array.isArray(data.results)
      ? data.results
      : [];

  const rankedResults =
    rankCityResults(
      results,
      trimmedCityName
    );

  return rankedResults;
}