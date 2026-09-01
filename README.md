# WHERE2

### A City Discovery and Relocation Decision Platform

> Find the place that fits your life, your income, your priorities, and the way you want to live.

WHERE2 is a full-stack city discovery and relocation decision platform designed to help people research, compare, and shortlist cities before making a relocation decision.

The application brings city discovery, weather, cost of living, preferences, saved cities, comparisons, planning, and AI-assisted guidance into one authenticated experience.

---

## Live Application

**Frontend:** https://where2-4n3a.vercel.app/

**Backend API:** https://where2-4tcj.onrender.com/

---

## Project Overview

Choosing where to live often requires researching information across several different websites and services.

A user may need to investigate:

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

WHERE2 addresses this problem by bringing relevant city information together into one platform and helping users evaluate locations according to their individual priorities.

---

## Problem Statement

People considering relocation often have to gather information from multiple sources before they can confidently compare possible destinations.

The fragmented process creates several challenges:

- Information is distributed across different platforms.
- Important city factors are difficult to compare consistently.
- Users can lose track of cities they previously researched.
- Personal priorities may not be considered when evaluating locations.
- Moving from research to an actual plan can be difficult.

WHERE2 reduces this friction by combining discovery, comparison, saving, preferences, and planning into one authenticated application.

---

## Solution

WHERE2 provides a centralized platform where users can:

1. Search for cities anywhere in the world.
2. Explore geographic information.
3. View current weather and forecasts.
4. Review cost-of-living information.
5. Set personal preferences.
6. Compare cities.
7. Save cities to a personal shortlist.
8. Create and manage projects and tasks.
9. Receive AI-assisted city guidance.

The goal is to reduce research time and help users make better-informed relocation decisions.

---

# Core Features

## Worldwide City Search

Users can search for cities around the world.

The search uses geocoding data to return information such as:

- City name
- Country
- Region
- Latitude
- Longitude

Search results are ranked to prioritize exact and relevant city matches.

---

## Weather Information

WHERE2 retrieves weather information for selected cities using their geographic coordinates.

Users can view:

- Current temperature
- Weather conditions
- Feels-like temperature
- Humidity
- Wind speed
- Weather outlook
- Multi-day forecasts

The application also provides simplified weather interpretations to make the information easier to understand.

---

## Cost of Living

The cost-of-living experience provides structured estimates and indexes for supported locations.

Information may include:

- Estimated monthly cost
- Overall cost index
- Grocery index
- Rent index
- Utilities index
- Transportation index
- Region

The information is presented through organized metric cards and comparison sections.

---

## Personal Preferences

Users can define priorities that influence their city evaluation.

Preference categories include factors such as:

- Climate
- Lifestyle
- Affordability
- Career opportunities
- Outdoor activities
- Culture and entertainment

These preferences help personalize the recommendation experience.

---

## City Recommendations

WHERE2 includes an application-level recommendation scoring system.

The scoring logic evaluates available city information against user preferences to produce a city match score.

This allows users to identify locations that may align more closely with what matters to them.

---

## Saved Cities

Authenticated users can save cities they are considering.

Saved cities create a personal shortlist that users can revisit later.

Users can manage their saved-city data through the application.

---

## City Comparison

Users can compare selected cities to better understand differences between locations.

Comparison areas include available weather, cost-of-living, and other city information.

---

## Projects and Planning

WHERE2 also supports personal planning through projects and tasks.

Authenticated users can:

- Create projects
- View projects
- Update projects
- Delete projects
- Create tasks
- Update tasks
- Complete tasks
- Delete tasks

Projects and tasks are protected by authentication and ownership rules.

---

## AI City Advisor

The application includes an AI-assisted city guidance experience designed to help users explore relocation questions and interpret available city information.

The AI City Advisor supports the broader goal of helping users make more informed relocation decisions.

---

## Responsive Design

The frontend is designed to work across:

- Mobile phones
- Tablets
- Laptops
- Desktop computers

Responsive layouts use flexible grids, typography scaling, spacing adjustments, and media queries to adapt the interface to different screen sizes.

---

## Light and Dark Mode

WHERE2 includes a user-controlled theme toggle that allows the dashboard interface to switch between light and dark presentation.

The selected theme is persisted locally so the preference can remain after a page refresh.

---

# Authentication and Security

Authentication is implemented using Flask sessions and bcrypt password hashing.

The application supports:

- User registration
- Secure password hashing
- Login
- Session creation
- Session restoration
- Logout
- Protected API routes
- Ownership authorization

Passwords are never stored as plain text.

Protected resources are scoped to the authenticated user, preventing users from modifying resources owned by other accounts.

The Flask application also configures secure session-cookie behavior and CORS for frontend/backend communication.

---

# Technology Stack

## Frontend

- React
- React Router
- Vite
- JavaScript
- React Hooks
- Leaflet
- React Leaflet
- Lucide React
- GSAP

## Backend

- Python
- Flask
- Flask-SQLAlchemy
- Flask-Bcrypt
- Flask-CORS
- SQLAlchemy
- Gunicorn

## Database

- PostgreSQL
- Psycopg2

## Testing

- Pytest

## Deployment

- Vercel — React frontend
- Render — Flask backend

## Version Control

- Git
- GitHub

---

# Architecture

WHERE2 follows a full-stack architecture with a React frontend communicating with a Flask REST API.

```text
USER
  |
  v
REACT FRONTEND
Vite + React
  |
  | HTTP / JSON
  v
FLASK REST API
Authentication
Validation
CRUD
Authorization
  |
  v
SQLALCHEMY ORM
  |
  v
POSTGRESQL
User
SavedCity
Project
Task
