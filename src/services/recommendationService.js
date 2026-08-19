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

  if (preferences.climate) {
    const range = CLIMATE_RANGES[preferences.climate];

    if (
      range &&
      temperature >= range.min &&
      temperature <= range.max
    ) {
      score += 3;

      reasons.push(
        `The current temperature fits your ${preferences.climate} climate preference.`
      );
    }
  }

  if (preferences.lifestyle) {
    const lifestyleScore =
      LIFESTYLE_SCORES[preferences.lifestyle];

    if (lifestyleScore) {
      score += lifestyleScore.weather;

      reasons.push(
        `The current conditions are being considered against your ${preferences.lifestyle} lifestyle preference.`
      );
    }
  }

  if (Array.isArray(preferences.priorities)) {
    preferences.priorities.forEach((priority) => {
      if (PRIORITY_WEIGHTS[priority]) {
        score += PRIORITY_WEIGHTS[priority];
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