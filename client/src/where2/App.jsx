import { useEffect, useState } from "react";
import "./App.css";

import DashboardShell from "./components/DashboardShell";
import DashboardHome from "./components/DashboardHome";

import { getCurrentWeather } from "./services/weatherApi";
import { getWeatherForecast } from "./services/forecastApi";
import { getCityDetails } from "./services/cityDetailsService";
import { getCostOfLiving } from "./services/costOfLivingService";

import {
  calculateRecommendation,
} from "./services/recommendationService";

import {
  compareCities,
  getComparisonWinner,
} from "./services/comparisonService";

import {
  getSavedCities,
  isCitySaved,
  toggleSavedCity,
  removeSavedCity,
} from "./services/savedCitiesService";


function App({
  user,
  onLogout,
}) {
  /* =====================================================
     PREFERENCES
  ===================================================== */

  const [preferences, setPreferences] = useState({
    climate: "",
    lifestyle: "",
    priorities: [],
  });


  /* =====================================================
     SAVED CITIES
  ===================================================== */

  const [savedCities, setSavedCities] = useState(
    () => getSavedCities()
  );


  /* =====================================================
     SELECTED CITY
  ===================================================== */

  const [selectedCity, setSelectedCity] = useState(null);


  /* =====================================================
     COMPARISON CITY
  ===================================================== */

  const [comparisonCity, setComparisonCity] = useState(null);


  /* =====================================================
     CURRENT WEATHER
  ===================================================== */

  const [weather, setWeather] = useState(null);

  const [weatherStatus, setWeatherStatus] =
    useState("idle");

  const [weatherError, setWeatherError] =
    useState("");


  /* =====================================================
     7-DAY FORECAST
  ===================================================== */

  const [forecast, setForecast] = useState(null);

  const [forecastStatus, setForecastStatus] =
    useState("idle");

  const [forecastError, setForecastError] =
    useState("");


  /* =====================================================
     COST OF LIVING
  ===================================================== */

  const [
    costOfLiving,
    setCostOfLiving,
  ] = useState(null);

  const [
    costOfLivingStatus,
    setCostOfLivingStatus,
  ] = useState("idle");

  const [
    costOfLivingError,
    setCostOfLivingError,
  ] = useState("");


  /* =====================================================
     COMPARISON WEATHER
  ===================================================== */

  const [
    comparisonWeather,
    setComparisonWeather,
  ] = useState(null);

  const [
    comparisonWeatherStatus,
    setComparisonWeatherStatus,
  ] = useState("idle");

  const [
    comparisonWeatherError,
    setComparisonWeatherError,
  ] = useState("");


  /* =====================================================
     CURRENT WEATHER
  ===================================================== */

  useEffect(() => {
    if (!selectedCity) {
      return undefined;
    }

    let active = true;

    async function loadWeather() {
      setWeatherStatus("loading");
      setWeatherError("");

      try {
        const data = await getCurrentWeather(
          selectedCity.latitude,
          selectedCity.longitude
        );

        if (!active) {
          return;
        }

        setWeather(data);
        setWeatherStatus("success");
      } catch (error) {
        if (!active) {
          return;
        }

        setWeather(null);
        setWeatherStatus("error");

        setWeatherError(
          error.message ||
            "Unable to load current weather."
        );
      }
    }

    loadWeather();

    return () => {
      active = false;
    };
  }, [selectedCity]);


  /* =====================================================
     7-DAY FORECAST
  ===================================================== */

  useEffect(() => {
    if (!selectedCity) {
      return undefined;
    }

    let active = true;

    async function loadForecast() {
      setForecastStatus("loading");
      setForecastError("");

      try {
        const data = await getWeatherForecast(
          selectedCity.latitude,
          selectedCity.longitude
        );

        if (!active) {
          return;
        }

        setForecast(data);
        setForecastStatus("success");
      } catch (error) {
        if (!active) {
          return;
        }

        setForecast(null);
        setForecastStatus("error");

        setForecastError(
          error.message ||
            "Unable to load the weather forecast."
        );
      }
    }

    loadForecast();

    return () => {
      active = false;
    };
  }, [selectedCity]);


  /* =====================================================
     COST OF LIVING
  ===================================================== */

  useEffect(() => {
    if (!selectedCity) {
      return undefined;
    }

    let active = true;

    async function loadCostOfLiving() {
      setCostOfLivingStatus("loading");
      setCostOfLivingError("");

      try {
        const data = await getCostOfLiving(
          selectedCity
        );

        if (!active) {
          return;
        }

        setCostOfLiving(data);
        setCostOfLivingStatus("success");
      } catch (error) {
        if (!active) {
          return;
        }

        setCostOfLiving(null);
        setCostOfLivingStatus("error");

        setCostOfLivingError(
          error.message ||
            "Unable to load cost-of-living information."
        );
      }
    }

    loadCostOfLiving();

    return () => {
      active = false;
    };
  }, [selectedCity]);


  /* =====================================================
     COMPARISON WEATHER
  ===================================================== */

  useEffect(() => {
    if (!comparisonCity) {
      return undefined;
    }

    let active = true;

    async function loadComparisonWeather() {
      setComparisonWeatherStatus("loading");
      setComparisonWeatherError("");

      try {
        const data = await getCurrentWeather(
          comparisonCity.latitude,
          comparisonCity.longitude
        );

        if (!active) {
          return;
        }

        setComparisonWeather(data);
        setComparisonWeatherStatus("success");
      } catch (error) {
        if (!active) {
          return;
        }

        setComparisonWeather(null);
        setComparisonWeatherStatus("error");

        setComparisonWeatherError(
          error.message ||
            "Unable to load comparison weather."
        );
      }
    }

    loadComparisonWeather();

    return () => {
      active = false;
    };
  }, [comparisonCity]);


  /* =====================================================
     PREFERENCES
  ===================================================== */

  function handlePreferencesChange(
    updatedPreferences
  ) {
    setPreferences(updatedPreferences);
  }


  /* =====================================================
     CITY SELECTION
  ===================================================== */

  function handleCitySelect(city) {
    if (!city) {
      return;
    }

    /*
     * No city selected yet.
     * This becomes the primary city.
     */

    if (!selectedCity) {
      setSelectedCity(city);
      setComparisonCity(null);

      return;
    }


    /*
     * Same city.
     */

    if (selectedCity.id === city.id) {
      return;
    }


    /*
     * If there is no comparison city,
     * use this city as the comparison.
     */

    if (!comparisonCity) {
      setComparisonCity(city);

      return;
    }


    /*
     * Otherwise replace the comparison city.
     */

    setComparisonCity(city);
  }


  /* =====================================================
     SAVE CITY
  ===================================================== */

  function handleSaveCity(city) {
    if (!city) {
      return;
    }

    const enrichedCity = {
      ...city,

      weather:
        weather ||
        city.weather ||
        null,

      temperature:
        weather?.temperature_2m ??
        city.temperature ??
        null,

      condition:
        weather?.condition ||
        weather?.weather_description ||
        weather?.description ||
        city.condition ||
        "",

      match:
        recommendation?.score ??
        city.match ??
        null,
    };

    const updatedCities =
      toggleSavedCity(enrichedCity);

    setSavedCities(updatedCities);
  }


  /* =====================================================
     REMOVE CITY
  ===================================================== */

  function handleRemoveCity(cityId) {
    const updatedCities =
      removeSavedCity(cityId);

    setSavedCities(updatedCities);
  }


  /* =====================================================
     SELECT SAVED CITY
  ===================================================== */

  function handleSavedCitySelect(city) {
    if (!city) {
      return;
    }

    setSelectedCity(city);
    setComparisonCity(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  /* =====================================================
     RECOMMENDATION
  ===================================================== */

  const recommendation =
    calculateRecommendation(
      preferences,
      weather
    );


  /* =====================================================
     COMPARISON
  ===================================================== */

  const comparison =
    comparisonWeatherStatus === "success"
      ? compareCities(
          selectedCity,
          weather,
          comparisonCity,
          comparisonWeather,
          preferences
        )
      : null;


  const comparisonWinner =
    comparison
      ? getComparisonWinner(comparison)
      : null;


  /* =====================================================
     CITY DETAILS
  ===================================================== */

  const cityDetails =
    selectedCity
      ? getCityDetails(selectedCity)
      : null;


  /* =====================================================
     SAVED STATUS
  ===================================================== */

  const selectedCityIsSaved =
    selectedCity
      ? isCitySaved(selectedCity.id)
      : false;


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <DashboardShell
      user={user}
      onLogout={onLogout}
      savedCities={savedCities}
      preferences={preferences}
      recommendation={recommendation}
      onRemoveCity={handleRemoveCity}
      onSelectSavedCity={handleSavedCitySelect}
    >

      <DashboardHome

        preferences={
          preferences
        }

        onPreferencesChange={
          handlePreferencesChange
        }

        onCitySelect={
          handleCitySelect
        }

        savedCities={
          savedCities
        }

        onRemoveCity={
          handleRemoveCity
        }

        onSelectSavedCity={
          handleSavedCitySelect
        }

        selectedCity={
          selectedCity
        }

        selectedCityIsSaved={
          selectedCityIsSaved
        }

        onSaveCity={
          handleSaveCity
        }

        weather={
          weather
        }

        weatherStatus={
          weatherStatus
        }

        weatherError={
          weatherError
        }

        forecast={
          forecast
        }

        forecastStatus={
          forecastStatus
        }

        forecastError={
          forecastError
        }

        costOfLiving={
          costOfLiving
        }

        costOfLivingStatus={
          costOfLivingStatus
        }

        costOfLivingError={
          costOfLivingError
        }

        comparisonCity={
          comparisonCity
        }

        comparisonWeatherStatus={
          comparisonWeatherStatus
        }

        comparisonWeatherError={
          comparisonWeatherError
        }

        comparison={
          comparison
        }

        comparisonWinner={
          comparisonWinner
        }

        cityDetails={
          cityDetails
        }

        recommendation={
          recommendation
        }

      />

    </DashboardShell>
  );
}


export default App;