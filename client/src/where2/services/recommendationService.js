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
  quiet: {
    weather: 1,
  },
  balanced: {
    weather: 2,
  },
  vibrant: {
    weather: 3,
  },
};

const PRIORITY_WEIGHTS = {
  affordability: 1,
  career: 1,
  outdoors: 1,
  culture: 1,
};

const PRIORITY_KEYS = {
  Affordability: "affordability",
  "Career opportunities": "career",
  "Outdoor activities": "outdoors",
  "Culture and entertainment": "culture",
};

function normalizeClimate(climate) {
  return climate?.toLowerCase();
}

function normalizeLifestyle(lifestyle) {
  return lifestyle?.toLowerCase();
}

function normalizePriority(priority) {
  return PRIORITY_KEYS[priority];
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

  let score = 0;
  const reasons = [];

  const temperature = Number(weather.temperature_2m);

  if (!Number.isFinite(temperature)) {
    return {
      score: 0,
      label: "Not enough information",
      reasons: [],
    };
  }

  const climate = normalizeClimate(preferences.climate);

  if (climate) {
    const range = CLIMATE_RANGES[climate];

    if (
      range &&
      temperature >= range.min &&
      temperature <= range.max
    ) {
      score += 3;

      reasons.push(
        `The current temperature fits your ${climate} climate preference.`
      );
    }
  }

  const lifestyle = normalizeLifestyle(
    preferences.lifestyle
  );

  if (lifestyle) {
    const lifestyleScore =
      LIFESTYLE_SCORES[lifestyle];

    if (lifestyleScore) {
      score += lifestyleScore.weather;

      reasons.push(
        `The current conditions are being considered against your ${lifestyle} lifestyle preference.`
      );
    }
  }

  if (Array.isArray(preferences.priorities)) {
    preferences.priorities.forEach((priority) => {
      const normalizedPriority =
        normalizePriority(priority);

      if (normalizedPriority) {
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