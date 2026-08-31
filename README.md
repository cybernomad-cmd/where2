# WHERE2

### A City Discovery and Relocation Decision Platform

> Find the place that fits your life, your income, your priorities, and the way you want to live.

WHERE2 is a React-based city discovery and relocation decision platform designed to help people make more informed decisions about where they could live.

Instead of searching across multiple websites for information about different cities, WHERE2 brings important factors such as location, weather, cost of living, lifestyle, and personal preferences into one experience.

The platform allows users to search for cities, explore geographic information, view weather conditions and forecasts, review cost-of-living information, save cities they are considering, and evaluate locations based on their preferences.

---

## Live Application

**Website:** [(https://where2-4n3a.vercel.app/)](https://where2-4n3a.vercel.app/)

---

## GitHub Repository

**Repository:** https://github.com/cybernomad-cmd/where2

---

## Problem Statement

Choosing a city to live in or relocate to can require researching information from many different sources.

Users may need to separately investigate:

- Weather
- Cost of living
- Rent
- Groceries
- Transportation
- Utilities
- Lifestyle
- Career opportunities
- Outdoor activities
- Culture and entertainment

This can make the relocation decision time-consuming and difficult.

WHERE2 addresses this problem by bringing relevant city information together into a single platform and helping users explore locations according to their individual preferences.

---

## Solution

WHERE2 provides a centralized platform where users can search for cities and explore information that may influence their relocation decision.

The application combines location data, weather information, cost-of-living information, and user preferences to create a more convenient city discovery experience.

Instead of manually researching several websites, users can use WHERE2 to explore important information about potential destinations from one interface.

---

## Key Features

### City Search

Users can search for a city and retrieve geographic information including:

- City name
- Country
- Region
- Latitude
- Longitude

The city search functionality uses geographic coordinates to connect the selected location with other services such as weather information.

---

### Weather Information

WHERE2 uses weather data to provide information about a selected location.

Users can access information such as:

- Current temperature
- Weather conditions
- Feels-like temperature
- Humidity
- Wind information
- Weather forecasts

Weather information is retrieved dynamically based on the selected city's geographic coordinates.

---

### Cost of Living

The application provides cost-of-living information for supported locations.

The cost-of-living section includes:

- Estimated monthly cost
- Overall cost index
- Grocery index
- Rent index
- Utilities index
- Transport index
- Region

The information is displayed using structured metric cards to make the data easier to understand.

---

### Personal Preferences

Users can provide preferences that help WHERE2 evaluate locations according to factors such as:

- Climate
- Lifestyle
- Affordability
- Career opportunities
- Outdoor activities
- Culture and entertainment

This allows users to explore cities based on what matters most to them.

---

### City Recommendations

WHERE2 includes a recommendation scoring system that evaluates locations against user preferences.

The recommendation logic is handled within the application rather than relying on an external AI recommendation service.

The system uses available city information and user preferences to help determine whether a location may be a suitable fit.

---

### Saved Cities

Users can save cities they are considering so they can return to them later.

This allows users to create a shortlist of potential destinations while exploring different locations.

---

### Responsive Design

The application was designed to work across different screen sizes, including:

- Mobile phones
- Tablets
- Laptops
- Desktop computers

Responsive layouts, flexible grids, typography adjustments, and CSS media queries are used to adapt the interface to different devices.

---

## APIs and External Services

WHERE2 integrates external APIs to provide dynamic information rather than relying entirely on hardcoded data.

### Open-Meteo Geocoding API

The Open-Meteo Geocoding API is used for city and location searches.

When a user searches for a city, the geocoding service converts the city name into geographic information such as:

- City name
- Country
- Region
- Latitude
- Longitude

**Endpoint:**

```text
https://geocoding-api.open-meteo.com/v1/search
