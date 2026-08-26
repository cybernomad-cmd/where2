const GEOCODING_API_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

/*
 * GeoNames populated-place feature codes.
 *
 * PPLC  = national capital
 * PPLA  = first-level administrative capital
 * PPLA2 = second-level administrative capital
 * PPLA3 = third-level administrative capital
 * PPLA4 = fourth-level administrative capital
 * PPLA5 = fifth-level administrative capital
 * PPL   = populated place
 * PPLG  = populated place / seat of government
 * PPLR  = populated place / religious center
 * PPLS  = populated place / section of populated place
 */
const CITY_FEATURE_CODES = new Set([
  "PPL",
  "PPLC",
  "PPLA",
  "PPLA2",
  "PPLA3",
  "PPLA4",
  "PPLA5",
  "PPLG",
  "PPLR",
  "PPLS",
]);

/*
 * Ordinary PPL results can include very small villages
 * and localities.
 *
 * We keep official administrative cities regardless of
 * population, but ordinary PPL locations need to have
 * a meaningful population to appear in WHERE2.
 */
const MIN_ORDINARY_CITY_POPULATION = 10000;

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function isAdministrativeCity(city) {
  return [
    "PPLC",
    "PPLA",
    "PPLA2",
    "PPLA3",
    "PPLA4",
    "PPLA5",
  ].includes(city.feature_code);
}

function isCityResult(city) {
  if (!CITY_FEATURE_CODES.has(city.feature_code)) {
    return false;
  }

  /*
   * Administrative cities are allowed even if their
   * population is relatively small.
   */
  if (isAdministrativeCity(city)) {
    return true;
  }

  /*
   * Ordinary populated places need a meaningful population.
   */
  const population = Number(city.population) || 0;

  return population >= MIN_ORDINARY_CITY_POPULATION;
}

function filterCityResults(results, cityName) {
  const normalizedQuery = normalize(cityName);

  return results.filter((city) => {
    if (!isCityResult(city)) {
      return false;
    }

    const cityNameValue = normalize(city.name);

    /*
     * Open-Meteo already performs prefix matching, but we
     * explicitly enforce it here so unrelated results do
     * not leak into WHERE2.
     */
    return (
      cityNameValue === normalizedQuery ||
      cityNameValue.startsWith(`${normalizedQuery} `)
    );
  });
}

function removeDuplicateCities(results) {
  const seen = new Set();

  return results.filter((city) => {
    const key = [
      normalize(city.name),
      normalize(city.country_code),
      normalize(city.admin1),
    ].join("|");

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
}

function getCityTypeScore(city) {
  switch (city.feature_code) {
    case "PPLC":
      return 6;

    case "PPLA":
      return 5;

    case "PPLA2":
      return 4;

    case "PPLA3":
      return 3;

    case "PPLA4":
      return 2;

    case "PPLA5":
      return 1;

    case "PPLG":
    case "PPLR":
    case "PPLS":
    case "PPL":
      return 0;

    default:
      return -1;
  }
}

function rankCityResults(results, cityName) {
  const normalizedQuery = normalize(cityName);

  return [...results].sort((a, b) => {
    /*
     * 1. Exact name match
     */
    const aExact =
      normalize(a.name) === normalizedQuery ? 1 : 0;

    const bExact =
      normalize(b.name) === normalizedQuery ? 1 : 0;

    if (aExact !== bExact) {
      return bExact - aExact;
    }

    /*
     * 2. City / administrative importance
     */
    const aTypeScore = getCityTypeScore(a);
    const bTypeScore = getCityTypeScore(b);

    if (aTypeScore !== bTypeScore) {
      return bTypeScore - aTypeScore;
    }

    /*
     * 3. Population
     */
    const aPopulation = Number(a.population) || 0;
    const bPopulation = Number(b.population) || 0;

    if (aPopulation !== bPopulation) {
      return bPopulation - aPopulation;
    }

    /*
     * 4. Stable alphabetical fallback
     */
    return normalize(a.name).localeCompare(
      normalize(b.name)
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

  /*
   * Ask for more results because we filter out small
   * populated places before displaying them.
   */
  url.searchParams.set("count", "50");

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

  /*
   * Keep meaningful city results only.
   */
  const cityResults = filterCityResults(
    results,
    trimmedCityName
  );

  /*
   * Remove duplicate locations.
   */
  const uniqueCities =
    removeDuplicateCities(cityResults);

  /*
   * Rank the final results.
   */
  return rankCityResults(
    uniqueCities,
    trimmedCityName
  );
}

