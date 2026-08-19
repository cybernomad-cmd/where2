const CLIMATE_RANGES = {
  warm: {
    min: 24,
    max: 35,
  },
  mild: {
    min: 18,
    max: 28,
  },
  cool: {
    min: 10,
    max: 22,
  },
};

const LIFESTYLE_SCORES = {
  quiet: 1,
  balanced: 2,
  vibrant: 3,
};

const PRIORITY_WEIGHTS = {
  affordability: 1,
  "career opportunities": 1,
  "outdoor activities": 1,
  "culture and entertainment": 1,
};

function normalizePreference(value) {
  return value.trim().toLowerCase();
}

export function calculateRecommendation(
  preferences,
  weather
) {
  if (!preferences || !weather) {
    return {
      score: 0,
      label: "Not enough information",
      reasons: [],
    };
  }

  const temperature = Number(weather.temperature_2m);

  if (!Number.isFinite(temperature)) {
    return {
      score: 0,
      label: "Not enough information",
      reasons: [],
    };
  }

  let score = 0;
  const reasons = [];

  const climatePreference = normalizePreference(
    preferences.climate || ""
  );

  const lifestylePreference = normalizePreference(
    preferences.lifestyle || ""
  );

  if (climatePreference) {
    const range = CLIMATE_RANGES[climatePreference];

    if (
      range &&
      temperature >= range.min &&
      temperature <= range.max
    ) {
      score += 3;

      reasons.push(
        `The current temperature fits your ${climatePreference} climate preference.`
      );
    }
  }

  if (lifestylePreference) {
    const lifestyleScore =
      LIFESTYLE_SCORES[lifestylePreference];

    if (lifestyleScore) {
      score += lifestyleScore;

      reasons.push(
        `The current conditions are being considered against your ${lifestylePreference} lifestyle preference.`
      );
    }
  }

  if (Array.isArray(preferences.priorities)) {
    preferences.priorities.forEach((priority) => {
      const normalizedPriority =
        normalizePreference(priority);

      if (PRIORITY_WEIGHTS[normalizedPriority]) {
        score += PRIORITY_WEIGHTS[normalizedPriority];
      }
    });
  }

  let label = "Possible fit";

  if (score >= 7) {
    label = "Great fit";
  } else if (score <= 3) {
    label = "Needs consideration";
  }

  return {
    score,
    label,
    reasons,
  };
}