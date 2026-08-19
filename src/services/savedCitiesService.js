const STORAGE_KEY = "where2_saved_cities";

function readSavedCities() {
  try {
    const storedCities = localStorage.getItem(STORAGE_KEY);

    if (!storedCities) {
      return [];
    }

    const parsedCities = JSON.parse(storedCities);

    return Array.isArray(parsedCities) ? parsedCities : [];
  } catch {
    return [];
  }
}

function writeSavedCities(cities) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(cities)
  );
}

export function getSavedCities() {
  return readSavedCities();
}

export function isCitySaved(cityId) {
  const savedCities = readSavedCities();

  return savedCities.some((city) => city.id === cityId);
}

export function saveCity(city) {
  if (!city || !city.id) {
    throw new Error("A valid city is required.");
  }

  const savedCities = readSavedCities();

  const alreadySaved = savedCities.some(
    (savedCity) => savedCity.id === city.id
  );

  if (alreadySaved) {
    return savedCities;
  }

  const updatedCities = [...savedCities, city];

  writeSavedCities(updatedCities);

  return updatedCities;
}

export function removeSavedCity(cityId) {
  const savedCities = readSavedCities();

  const updatedCities = savedCities.filter(
    (city) => city.id !== cityId
  );

  writeSavedCities(updatedCities);

  return updatedCities;
}

export function toggleSavedCity(city) {
  if (!city || !city.id) {
    throw new Error("A valid city is required.");
  }

  if (isCitySaved(city.id)) {
    return removeSavedCity(city.id);
  }

  return saveCity(city);
}

export function clearSavedCities() {
  localStorage.removeItem(STORAGE_KEY);

  return [];
}