export function getCityDetails(city) {
  if (!city) {
    return null;
  }

  return {
    name: city.name ?? "Unknown city",
    country: city.country ?? "Unknown country",
    countryCode: city.country_code ?? "",
    region: city.admin1 ?? "",
    latitude: Number(city.latitude),
    longitude: Number(city.longitude),
    elevation: Number(city.elevation),
    timezone: city.timezone ?? "",
    population: Number(city.population) || 0,
  };
}