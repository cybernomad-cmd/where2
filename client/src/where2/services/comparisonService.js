import { calculateRecommendation } from "./recommendationService";

export function compareCities(
  cityA,
  weatherA,
  cityB,
  weatherB,
  preferences
) {
  if (!cityA || !cityB || !weatherA || !weatherB) {
    return null;
  }

  const recommendationA = calculateRecommendation(
    preferences,
    weatherA
  );

  const recommendationB = calculateRecommendation(
    preferences,
    weatherB
  );

  return {
    cityA: {
      city: cityA,
      weather: weatherA,
      recommendation: recommendationA,
    },
    cityB: {
      city: cityB,
      weather: weatherB,
      recommendation: recommendationB,
    },
  };
}

export function getComparisonWinner(comparison) {
  if (!comparison) {
    return null;
  }

  const scoreA = comparison.cityA.recommendation.score;
  const scoreB = comparison.cityB.recommendation.score;

  if (scoreA === scoreB) {
    return {
      city: null,
      label: "It's a tie",
    };
  }

  if (scoreA > scoreB) {
    return {
      city: comparison.cityA.city,
      label: `${comparison.cityA.city.name} is the better fit`,
    };
  }

  return {
    city: comparison.cityB.city,
    label: `${comparison.cityB.city.name} is the better fit`,
  };
}