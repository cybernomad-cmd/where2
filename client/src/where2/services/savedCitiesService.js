const STORAGE_KEY = "where2_saved_cities";

/* =====================================================
   READ SAVED CITIES
===================================================== */

function readSavedCities() {
  try {
    const storedCities =
      localStorage.getItem(STORAGE_KEY);

    if (!storedCities) {
      return [];
    }

    const parsedCities =
      JSON.parse(storedCities);

    return Array.isArray(parsedCities)
      ? parsedCities
      : [];
  } catch {
    return [];
  }
}

/* =====================================================
   WRITE SAVED CITIES
===================================================== */

function writeSavedCities(cities) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(cities)
  );
}

/* =====================================================
   NORMALIZE CITY
===================================================== */

function normalizeCity(city) {
  if (!city) {
    return city;
  }

  const countryCodeMap = {
    Kenya: "KE",
    "South Africa": "ZA",
    Portugal: "PT",
    Canada: "CA",
    Japan: "JP",
    Tanzania: "TZ",
    "United States": "US",
    Indonesia: "ID",
    Montenegro: "ME",
    "Democratic Republic of Congo": "CD",
  };

  return {
    ...city,

    countryCode:
      city.countryCode ||
      countryCodeMap[city.country] ||
      "",

    temperature:
      city.temperature ?? null,

    condition:
      city.condition || "",

    match:
      city.match ?? null,

    image:
      city.image || null,
  };
}

/* =====================================================
   GET SAVED CITIES
===================================================== */

export function getSavedCities() {
  const savedCities =
    readSavedCities();

  return savedCities.map(normalizeCity);
}

/* =====================================================
   CHECK IF CITY IS SAVED
===================================================== */

export function isCitySaved(cityId) {
  const savedCities =
    readSavedCities();

  return savedCities.some(
    (city) => city.id === cityId
  );
}

/* =====================================================
   SAVE CITY
===================================================== */

export function saveCity(city) {
  if (!city || !city.id) {
    throw new Error(
      "A valid city is required."
    );
  }

  const savedCities =
    readSavedCities();

  const alreadySaved =
    savedCities.some(
      (savedCity) =>
        savedCity.id === city.id
    );

  if (alreadySaved) {
    return savedCities.map(
      normalizeCity
    );
  }

  const normalizedCity =
    normalizeCity(city);

  const updatedCities = [
    ...savedCities,
    normalizedCity,
  ];

  writeSavedCities(updatedCities);

  return updatedCities.map(
    normalizeCity
  );
}

/* =====================================================
   UPDATE SAVED CITY
===================================================== */

export function updateSavedCity(
  cityId,
  updates
) {
  if (!cityId || !updates) {
    return getSavedCities();
  }

  const savedCities =
    readSavedCities();

  const updatedCities =
    savedCities.map((city) => {
      if (city.id !== cityId) {
        return city;
      }

      return normalizeCity({
        ...city,
        ...updates,
      });
    });

  writeSavedCities(updatedCities);

  return updatedCities;
}

/* =====================================================
   REMOVE SAVED CITY
===================================================== */

export function removeSavedCity(cityId) {
  const savedCities =
    readSavedCities();

  const updatedCities =
    savedCities.filter(
      (city) => city.id !== cityId
    );

  writeSavedCities(updatedCities);

  return updatedCities.map(
    normalizeCity
  );
}

/* =====================================================
   TOGGLE SAVED CITY
===================================================== */

export function toggleSavedCity(city) {
  if (!city || !city.id) {
    throw new Error(
      "A valid city is required."
    );
  }

  if (isCitySaved(city.id)) {
    return removeSavedCity(
      city.id
    );
  }

  return saveCity(city);
}

/* =====================================================
   CLEAR SAVED CITIES
===================================================== */

export function clearSavedCities() {
  localStorage.removeItem(
    STORAGE_KEY
  );

  return [];
}