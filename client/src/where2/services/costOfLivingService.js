const COST_OF_LIVING_API_URL =
  "https://getwherenext.com/api/data/cost-of-living";

export async function getCostOfLiving(city) {
  if (!city) {
    throw new Error(
      "A city is required to load cost-of-living information."
    );
  }

  try {
    const response = await fetch(
      COST_OF_LIVING_API_URL,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Cost-of-living service returned HTTP ${response.status}.`
      );
    }

    const payload = await response.json();

    if (
      !payload ||
      !Array.isArray(payload.data)
    ) {
      throw new Error(
        "The cost-of-living service returned an unexpected response."
      );
    }

    const cityCountryCode =
      city.country_code?.toUpperCase();

    if (!cityCountryCode) {
      throw new Error(
        `No country code is available for ${city.name}.`
      );
    }

    const record = payload.data.find(
      (item) =>
        item.country_code?.toUpperCase() ===
        cityCountryCode
    );

    if (!record) {
      throw new Error(
        `No cost-of-living data found for ${city.name}.`
      );
    }

    return {
      city: city.name,
      country: record.country,
      country_code: record.country_code,
      region: record.region,

      estimated_monthly_cost:
        Number(record.monthly_estimate_usd),

      cost_index:
        Number(record.cost_index),

      groceries:
        Number(record.grocery_index),

      rent:
        Number(record.rent_index),

      utilities:
        Number(record.utilities_index),

      transport:
        Number(record.transport_index),
    };
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw error;
    }

    throw new Error(
      "Unable to load cost-of-living data right now.",
      {
        cause: error,
      }
    );
  }
}