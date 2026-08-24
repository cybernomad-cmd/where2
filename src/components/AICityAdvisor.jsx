import { useState } from "react";

import {
  Info,
  MessageCircle,
  RefreshCw,
  Send,
  Sparkles,
} from "lucide-react";

let messageIdCounter = 0;

function createMessageId(type) {
  messageIdCounter += 1;

  return `${type}-${messageIdCounter}`;
}

function AICityAdvisor({
  preferences = {},
  selectedCity = null,
  weather = null,
  forecast = null,
  costOfLiving = null,
  savedCities = [],
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const suggestions = [
    "Find warm cities under $1,500/month",
    "Compare Cape Town vs Nairobi",
    "Best cities for digital nomads",
    "Where can I live near the beach?",
  ];

  const cityResults = [
    {
      id: "nairobi",
      name: "Nairobi, Kenya",
      match: "91% match",
      description:
        "Warm, affordable, growing tech hub.",
      initial: "N",
    },
    {
      id: "cape-town",
      name: "Cape Town, South Africa",
      match: "87% match",
      description:
        "Great lifestyle, climate, and infrastructure.",
      initial: "C",
    },
    {
      id: "lisbon",
      name: "Lisbon, Portugal",
      match: "83% match",
      description:
        "Strong technology ecosystem and lifestyle.",
      initial: "L",
    },
    {
      id: "bangkok",
      name: "Bangkok, Thailand",
      match: "78% match",
      description:
        "Affordable, vibrant, and well connected.",
      initial: "B",
    },
  ];

  /*
   * LIVE WHERE2 CONTEXT
   *
   * This normalizes the data currently available
   * from the main WHERE2 application.
   */

  const advisorContextSummary = {
    selectedCity: selectedCity?.name || null,

    country: selectedCity?.country || null,

    climatePreference:
      preferences?.climate || null,

    lifestylePreference:
      preferences?.lifestyle || null,

    priorities:
      Array.isArray(preferences?.priorities)
        ? preferences.priorities
        : [],

    temperature:
      weather?.temperature_2m ?? null,

    apparentTemperature:
      weather?.apparent_temperature ?? null,

    humidity:
      weather?.relative_humidity_2m ?? null,

    windSpeed:
      weather?.wind_speed_10m ?? null,

    weatherConditionCode:
      weather?.weather_code ?? null,

    forecastAvailable:
      Boolean(forecast),

    costOfLivingAvailable:
      Boolean(costOfLiving),

    savedCitiesCount:
      Array.isArray(savedCities)
        ? savedCities.length
        : 0,
  };

  function getContextGreeting() {
    if (!advisorContextSummary.selectedCity) {
      return "Tell me what kind of city you're looking for.";
    }

    const cityName =
      advisorContextSummary.selectedCity;

    const country =
      advisorContextSummary.country
        ? `, ${advisorContextSummary.country}`
        : "";

    return `You're currently exploring ${cityName}${country}. I can help you evaluate it based on your preferences and current conditions.`;
  }

  function getWeatherSummary() {
    if (
      advisorContextSummary.temperature === null
    ) {
      return null;
    }

    const temperature = Math.round(
      advisorContextSummary.temperature
    );

    return `${temperature}°C currently`;
  }

  function getPreferenceSummary() {
    const preferencesList = [];

    if (
      advisorContextSummary.climatePreference
    ) {
      preferencesList.push(
        advisorContextSummary.climatePreference
      );
    }

    if (
      advisorContextSummary.lifestylePreference
    ) {
      preferencesList.push(
        advisorContextSummary.lifestylePreference
      );
    }

    if (
      advisorContextSummary.priorities.length > 0
    ) {
      preferencesList.push(
        ...advisorContextSummary.priorities
      );
    }

    return preferencesList;
  }

  function generateAdvisorResponse(message) {
    const normalizedMessage =
      message.toLowerCase();

    const preferenceSummary =
      getPreferenceSummary();

    if (
      normalizedMessage.includes("weather") ||
      normalizedMessage.includes("temperature") ||
      normalizedMessage.includes("hot") ||
      normalizedMessage.includes("warm") ||
      normalizedMessage.includes("cold")
    ) {
      if (
        advisorContextSummary.selectedCity &&
        advisorContextSummary.temperature !== null
      ) {
        return `For ${advisorContextSummary.selectedCity}, the current temperature is ${Math.round(
          advisorContextSummary.temperature
        )}°C. I can use the current conditions and forecast to help you decide whether the city fits your climate preference.`;
      }

      return "Select a city first and I can use its current weather conditions to help you evaluate the climate.";
    }

    if (
      normalizedMessage.includes("saved") ||
      normalizedMessage.includes("bookmark")
    ) {
      const count =
        advisorContextSummary.savedCitiesCount;

      if (count === 0) {
        return "You don't have any saved cities yet. Save cities you're interested in and I can help you compare them.";
      }

      return `You currently have ${count} saved ${
        count === 1 ? "city" : "cities"
      }. I can help you narrow them down based on your preferences.`;
    }

    if (
      normalizedMessage.includes("preference") ||
      normalizedMessage.includes("preferences")
    ) {
      if (preferenceSummary.length === 0) {
        return "You haven't selected any preferences yet. Set your climate, lifestyle, and priorities and I'll use them when evaluating cities.";
      }

      return `Your current preferences include: ${preferenceSummary.join(
        ", "
      )}. I'll use these when helping you evaluate cities.`;
    }

    if (
      normalizedMessage.includes("forecast") ||
      normalizedMessage.includes("rain")
    ) {
      if (
        advisorContextSummary.forecastAvailable
      ) {
        return "I have the 7-day forecast available for the selected city. I can use it alongside your preferences to assess the upcoming conditions.";
      }

      return "Select a city with forecast data available and I'll use the upcoming weather conditions in the recommendation.";
    }

    if (
      normalizedMessage.includes("cost") ||
      normalizedMessage.includes("budget") ||
      normalizedMessage.includes("affordable") ||
      normalizedMessage.includes("cheap")
    ) {
      if (
        advisorContextSummary.costOfLivingAvailable
      ) {
        return "Cost-of-living information is available for your selected city. I can use it to help you evaluate affordability against your priorities.";
      }

      return "Select a city with cost-of-living information available and I can help you evaluate affordability.";
    }

    if (
      normalizedMessage.includes("compare") ||
      normalizedMessage.includes("best city") ||
      normalizedMessage.includes("recommend")
    ) {
      return "I can help compare cities using your climate, lifestyle, priorities, current weather, forecast, affordability, and saved-city information.";
    }

    if (
      advisorContextSummary.selectedCity
    ) {
      return `I'm currently looking at ${advisorContextSummary.selectedCity}. Tell me what matters most to you — climate, lifestyle, affordability, tech opportunities, safety, or another priority — and I'll help you evaluate it.`;
    }

    return "I can help you discover, compare, and evaluate cities. Try asking me about weather, affordability, preferences, saved cities, or city comparisons.";
  }

  function sendMessage(message) {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    const userMessage = {
      id: createMessageId("user"),
      type: "user",
      text: trimmedMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
    ]);

    setInputValue("");
    setIsLoading(true);

    window.setTimeout(() => {
      const responseMessage = {
        id: createMessageId("assistant"),
        type: "assistant",
        text: generateAdvisorResponse(
          trimmedMessage
        ),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        responseMessage,
      ]);

      setIsLoading(false);
    }, 500);
  }

  function handleSubmit(event) {
    event.preventDefault();

    sendMessage(inputValue);
  }

  function handleSuggestionClick(
    suggestion
  ) {
    sendMessage(suggestion);
  }

  function handleRefresh() {
    setMessages([]);
    setInputValue("");
    setIsLoading(false);
  }

  function handleVoiceInput() {
    if (
      typeof window === "undefined" ||
      (!("SpeechRecognition" in window) &&
        !("webkitSpeechRecognition" in window))
    ) {
      setInputValue(
        "Voice input is not supported in this browser."
      );

      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setInputValue(transcript);
    };

    recognition.onerror = () => {
      setInputValue(
        "I couldn't hear that. Please try again."
      );
    };

    recognition.start();
  }

  return (
    <aside className="where2-ai-column">
      <div className="where2-ai-card">
        {/* Header */}

        <div className="where2-ai-header">
          <div className="where2-ai-title">
            <Sparkles size={18} />

            <strong>
              AI City Advisor
            </strong>

            <span>BETA</span>

            <Info size={14} />
          </div>

          <button
            type="button"
            aria-label="Refresh advisor"
            onClick={handleRefresh}
          >
            <RefreshCw size={17} />
          </button>
        </div>

        {/* Introduction */}

        <div className="where2-ai-introduction">
          <h2>Hi John!</h2>

          <p>
            I'm your AI City Advisor.
            <br />
            {getContextGreeting()}
          </p>
        </div>

        {/* Live Context */}

        {(advisorContextSummary.selectedCity ||
          advisorContextSummary.temperature !==
            null ||
          advisorContextSummary.savedCitiesCount >
            0) && (
          <div className="where2-ai-context">
            {advisorContextSummary.selectedCity && (
              <span>
                {advisorContextSummary.selectedCity}
              </span>
            )}

            {getWeatherSummary() && (
              <span>
                {getWeatherSummary()}
              </span>
            )}

            {advisorContextSummary.savedCitiesCount >
              0 && (
              <span>
                {
                  advisorContextSummary
                    .savedCitiesCount
                }{" "}
                saved
              </span>
            )}
          </div>
        )}

        {/* Suggestions */}

        <div className="where2-ai-suggestions">
          {suggestions.map((suggestion) => (
            <button
              type="button"
              key={suggestion}
              onClick={() =>
                handleSuggestionClick(
                  suggestion
                )
              }
              disabled={isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Conversation */}

        <div className="where2-ai-conversation">
          {messages.length === 0 && (
            <div className="where2-ai-empty">
              <Sparkles size={17} />

              <p>
                Ask me anything about where
                you should live.
              </p>
            </div>
          )}

          {messages.map((message) => {
            if (message.type === "user") {
              return (
                <div
                  className="where2-ai-user-message"
                  key={message.id}
                >
                  {message.text}

                  <span>
                    {message.time} ✓✓
                  </span>
                </div>
              );
            }

            return (
              <div
                className="where2-ai-response"
                key={message.id}
              >
                <p>{message.text}</p>

                {message.text.includes(
                  "compare"
                ) && (
                  <div className="where2-ai-results">
                    {cityResults.map(
                      (city) => (
                        <div
                          className="where2-ai-result"
                          key={city.id}
                        >
                          <div className="where2-ai-result-image">
                            {city.initial}
                          </div>

                          <div>
                            <strong>
                              {city.name}
                            </strong>

                            <span>
                              {city.match}
                            </span>

                            <p>
                              {
                                city.description
                              }
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                <small>
                  {message.time}
                </small>
              </div>
            );
          })}

          {isLoading && (
            <div className="where2-ai-response where2-ai-loading">
              <Sparkles size={15} />

              <span>
                Thinking...
              </span>
            </div>
          )}
        </div>

        {/* Input */}

        <form
          className="where2-ai-input"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(event) =>
              setInputValue(event.target.value)
            }
            placeholder="Ask me anything..."
            aria-label="Ask AI City Advisor"
            disabled={isLoading}
          />

          <button
            type="button"
            aria-label="Voice input"
            onClick={handleVoiceInput}
            disabled={isLoading}
          >
            <MessageCircle size={18} />
          </button>

          <button
            type="submit"
            className="where2-ai-send"
            aria-label="Send message"
            disabled={
              isLoading ||
              !inputValue.trim()
            }
          >
            <Send size={15} />
          </button>
        </form>

        {/* Voice */}

        <button
          type="button"
          className="where2-ai-voice"
          onClick={handleVoiceInput}
          disabled={isLoading}
        >
          <Sparkles size={18} />

          <span>
            Speak with Where2
          </span>
        </button>

        {/* Disclaimer */}

        <p className="where2-ai-disclaimer">
          AI responses can make mistakes.
          Learn more.
        </p>
      </div>
    </aside>
  );
}

export default AICityAdvisor;