const COST_OF_LIVING_API_URL =
  "https://getwherenext.com/api/data/city-prices";

function normalizeCityName(cityName) {
  return cityName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function getCityName(item) {
  return String(
    item.city ??
      item.name ??
      item.city_name ??
      ""
  ).trim();
}

function matchesCity(item, cityName) {
  return (
    normalizeCityName(getCityName(item)) ===
    normalizeCityName(cityName)
  );
}

function normalizePriceItem(item) {
  return {
    name:
      item.item ??
      item.name ??
      item.category ??
      "Unknown item",

    category:
      item.category ??
      "Other",

    usd:
      Number(
        item.usd ??
          item.price_usd ??
          item.price
      ),

    local:
      Number(
        item.local ??
          item.price_local ??
          item.local_price
      ),

    currency:
      item.currency ??
      item.currency_code ??
      null,
  };
}

export async function getCostOfLiving(cityName) {
  const trimmedCityName = cityName.trim();

  if (!trimmedCityName) {
    throw new Error("Please provide a city name.");
  }

  const response = await fetch(
    COST_OF_LIVING_API_URL
  );

  if (!response.ok) {
    throw new Error(
      "Unable to load cost-of-living data right now."
    );
  }

  const data = await response.json();

  const records = Array.isArray(data)
    ? data
    : Array.isArray(data.data)
      ? data.data
      : [];

  const cityRecords = records.filter((item) =>
    matchesCity(item, trimmedCityName)
  );

  if (cityRecords.length === 0) {
    throw new Error(
      `No cost-of-living data found for ${trimmedCityName}.`
    );
  }

  const firstRecord = cityRecords[0];

  const prices = cityRecords
    .map(normalizePriceItem)
    .filter(
      (item) =>
        Number.isFinite(item.usd) ||
        Number.isFinite(item.local)
    );

  return {
    city: getCityName(firstRecord),

    country:
      firstRecord.country ??
      firstRecord.country_name ??
      null,

    currency:
      firstRecord.currency ??
      firstRecord.currency_code ??
      null,

    prices,
  };
}