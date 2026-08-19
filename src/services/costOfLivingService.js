const COST_OF_LIVING_API_URL =
  "https://getwherenext.com/api/data/cost-of-living";

function findCountryRecord(records, countryCode) {
  const normalizedCode = countryCode?.trim().toUpperCase();

  if (!normalizedCode) {
    return null;
  }

  return (
    records.find(
      (record) =>
        String(record.country_code ?? "").toUpperCase() ===
        normalizedCode
    ) ?? null
  );
}

export async function getCostOfLiving(city) {
  if (!city?.name) {
    throw new Error("Please provide a city.");
  }

  const response = await fetch(
    COST_OF_LIVING_API_URL
  );

  if (!response.ok) {
    throw new Error(
      "Unable to load cost-of-living data right now."
    );
  }

  const payload = await response.json();

  const records = Array.isArray(payload)
    ? payload
    : Array.isArray(payload.data)
      ? payload.data
      : [];

  const record = findCountryRecord(
    records,
    city.country_code
  );

  if (!record) {
    throw new Error(
      `No cost-of-living data found for ${city.name}.`
    );
  }

  return {
    city: city.name,
    country: record.country,
    countryCode: record.country_code,
    region: record.region,

    costIndex: Number(record.cost_index),

    monthlyEstimateUsd: Number(
      record.monthly_estimate_usd
    ),

    groceryIndex: Number(record.grocery_index),

    rentIndex: Number(record.rent_index),

    utilitiesIndex: Number(
      record.utilities_index
    ),

    transportIndex: Number(
      record.transport_index
    ),
  };
}