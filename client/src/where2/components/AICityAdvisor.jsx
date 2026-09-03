import { useState } from "react";

import {
  ArrowRight,
  Bookmark,
  Check,
  Compass,
  Info,
  MapPin,
  MessageCircle,
  RefreshCw,
  Send,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

function AICityAdvisor({
  savedCities = [],
  preferences = {
    climate: "",
    lifestyle: "",
    priorities: [],
  },
  recommendation,
  onRemoveCity,
  onSelectSavedCity,
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /*
   * =========================================================
   * AI SUGGESTIONS
   * =========================================================
   */

  const suggestions = [
    "Find warm cities under $1,500/month",
    "Compare Cape Town vs Nairobi",
    "Best cities for digital nomads",
    "Where can I live near the beach?",
  ];

  /*
   * =========================================================
   * DEMO CITY RESULTS
   * =========================================================
   *
   * These are currently local/demo responses.
   * They can later be replaced with a real AI/API response.
   */

  const cityResults = [
    {
      id: "nairobi",
      name: "Nairobi, Kenya",
      match: "91% match",
      description:
        "Warm, affordable, growing technology hub.",
      initial: "N",
    },
    {
      id: "cape-town",
      name: "Cape Town, South Africa",
      match: "87% match",
      description:
        "Great lifestyle, climate and coastal surroundings.",
      initial: "C",
    },
    {
      id: "lisbon",
      name: "Lisbon, Portugal",
      match: "83% match",
      description:
        "Strong technology ecosystem and European connectivity.",
      initial: "L",
    },
    {
      id: "bangkok",
      name: "Bangkok, Thailand",
      match: "78% match",
      description:
        "Affordable, vibrant and well connected.",
      initial: "B",
    },
  ];

  /*
   * =========================================================
   * MESSAGE HELPERS
   * =========================================================
   */

  function createMessageId(type, index, text) {
    return `${type}-${index}-${text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 30)}`;
  }

  /*
   * =========================================================
   * ADVISOR RESPONSE
   * =========================================================
   */

  function createAdvisorResponse(userText) {
    const normalizedText = userText.toLowerCase();

    if (
      normalizedText.includes("nairobi") ||
      normalizedText.includes("kenya")
    ) {
      return {
        text:
          "Nairobi could be a strong match if you value affordability, a growing technology ecosystem, and warm weather.",
        results: [cityResults[0]],
      };
    }

    if (
      normalizedText.includes("cape town") ||
      normalizedText.includes("cape")
    ) {
      return {
        text:
          "Cape Town is a strong lifestyle option with a pleasant climate, beautiful surroundings, and an established technology community.",
        results: [cityResults[1]],
      };
    }

    if (
      normalizedText.includes("lisbon") ||
      normalizedText.includes("portugal")
    ) {
      return {
        text:
          "Lisbon is worth considering if technology opportunities, European connectivity, and lifestyle are important to you.",
        results: [cityResults[2]],
      };
    }

    if (
      normalizedText.includes("bangkok") ||
      normalizedText.includes("thailand")
    ) {
      return {
        text:
          "Bangkok offers a vibrant lifestyle and relatively affordable living costs, making it an interesting option for flexible workers.",
        results: [cityResults[3]],
      };
    }

    if (
      normalizedText.includes("beach") ||
      normalizedText.includes("coast")
    ) {
      return {
        text:
          "If being close to the beach is a priority, I would start by comparing coastal cities based on affordability, climate, safety, and connectivity.",
        results: [
          {
            id: "cape-town-beach",
            name: "Cape Town, South Africa",
            match: "87% match",
            description:
              "Strong lifestyle and coastal location.",
            initial: "C",
          },
          {
            id: "bangkok-beach",
            name: "Bangkok, Thailand",
            match: "78% match",
            description:
              "Affordable regional base with access to beaches.",
            initial: "B",
          },
        ],
      };
    }

    if (
      normalizedText.includes("digital nomad") ||
      normalizedText.includes("remote")
    ) {
      return {
        text:
          "For digital nomads, I would prioritize reliable internet, cost of living, visa flexibility, safety, and access to a strong community.",
        results: cityResults.slice(0, 3),
      };
    }

    if (
      normalizedText.includes("warm") ||
      normalizedText.includes("affordable") ||
      normalizedText.includes("1500") ||
      normalizedText.includes("1,500")
    ) {
      return {
        text:
          "Based on those priorities, these cities are good starting points for your comparison.",
        results: cityResults,
      };
    }

    if (normalizedText.includes("compare")) {
      return {
        text:
          "Absolutely. Tell me the two cities you want to compare and I can help you evaluate climate, affordability, lifestyle, weather, and other factors.",
        results: [],
      };
    }

    return {
      text:
        "I can help you discover and compare cities based on weather, cost of living, lifestyle, climate, priorities, and location.",
      results: cityResults.slice(0, 3),
    };
  }

  /*
   * =========================================================
   * SEND MESSAGE
   * =========================================================
   */

  function sendMessage(messageText = inputValue) {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    const userMessage = {
      id: createMessageId(
        "user",
        messages.length,
        trimmedMessage
      ),
      type: "user",
      text: trimmedMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    const response = createAdvisorResponse(
      trimmedMessage
    );

    const advisorMessage = {
      id: createMessageId(
        "advisor",
        messages.length + 1,
        trimmedMessage
      ),
      type: "advisor",
      text: response.text,
      results: response.results,
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
    ]);

    setInputValue("");
    setIsLoading(true);

    window.setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        advisorMessage,
      ]);

      setIsLoading(false);
    }, 450);
  }

  /*
   * =========================================================
   * EVENT HANDLERS
   * =========================================================
   */

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  function handleSuggestionClick(suggestion) {
    sendMessage(suggestion);
  }

  function handleRefresh() {
    setMessages([]);
    setInputValue("");
    setIsLoading(false);
  }

  function scrollToSection(selector) {
    const section = document.querySelector(selector);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  /*
   * =========================================================
   * PREFERENCE HELPERS
   * =========================================================
   */

  function formatPreference(value) {
    if (!value) {
      return "Not set";
    }

    return (
      value.charAt(0).toUpperCase() +
      value.slice(1)
    );
  }

  const priorityCount = Array.isArray(
    preferences?.priorities
  )
    ? preferences.priorities.length
    : 0;

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <aside className="where2-ai-column">
      {/* =====================================================
          AI CITY ADVISOR
      ===================================================== */}

      <div className="where2-ai-card where2-ai-card-enhanced">
        {/* Header */}

        <div className="where2-ai-header">
          <div className="where2-ai-title">
            <Sparkles size={18} />

            <strong>AI City Advisor</strong>

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

        <div
  className="where2-ai-ambient"
  aria-hidden="true"
>
  <span className="where2-ai-orb where2-ai-orb-one" />
  <span className="where2-ai-orb where2-ai-orb-two" />
  <span className="where2-ai-orb where2-ai-orb-three" />

  <span className="where2-ai-spark where2-ai-spark-one">
    <Sparkles size={13} />
  </span>

  <span className="where2-ai-spark where2-ai-spark-two">
    <Sparkles size={10} />
  </span>

  <span className="where2-ai-core">
    <Sparkles size={20} />
  </span>
</div>

        {/* Introduction */}

        {messages.length === 0 && (
          <>
            <div className="where2-ai-introduction">
              <h2>Hi there!</h2>

              <p>
                I'm your AI City Advisor.
                <br />
                How can I help you today?
              </p>
            </div>

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
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Conversation */}

        <div className="where2-ai-conversation">
          {messages.map((message) => (
            <div key={message.id}>
              {message.type === "user" && (
                <div className="where2-ai-user-message">
                  {message.text}

                  {message.time && (
                    <span>
                      {message.time} ✓✓
                    </span>
                  )}
                </div>
              )}

              {message.type === "advisor" && (
                <div className="where2-ai-response">
                  <p>{message.text}</p>

                  {message.results &&
                    message.results.length > 0 && (
                      <>
                        {message.results.map(
                          (result) => (
                            <div
                              className="where2-ai-result"
                              key={result.id}
                            >
                              <div className="where2-ai-result-image">
                                {result.initial}
                              </div>

                              <div>
                                <strong>
                                  {result.name}
                                </strong>

                                <span>
                                  {result.match}
                                </span>

                                <p>
                                  {
                                    result.description
                                  }
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </>
                    )}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="where2-ai-response">
              <p>
                Finding the best city matches...
              </p>
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
          />

          <button
            type="button"
            aria-label="Voice input"
            title="Voice input"
            onClick={() =>
              setInputValue(
                "Help me find the best city for me."
              )
            }
          >
            <MessageCircle size={18} />
          </button>

          <button
            type="submit"
            className="where2-ai-send"
            aria-label="Send message"
            disabled={
              !inputValue.trim() || isLoading
            }
          >
            <Send size={14} />
          </button>
        </form>

        {/* Voice CTA */}

        <button
          type="button"
          className="where2-ai-voice"
          onClick={() =>
            setInputValue(
              "Help me find the best city for me."
            )
          }
        >
          <Sparkles size={18} />

          <span>Speak with Where2</span>
        </button>

        {/* Disclaimer */}

        <p className="where2-ai-disclaimer">
          AI responses can make mistakes. Learn more.
        </p>
      </div>

      {/* =====================================================
          YOUR SHORTLIST
      ===================================================== */}

      <section className="where2-sidebar-shortlist">
        <div className="where2-sidebar-section-header">
          <div>
            <p className="where2-sidebar-eyebrow">
              YOUR SHORTLIST
            </p>

            <h2>Your saved cities</h2>

            <p>
              Cities you're currently considering.
            </p>
          </div>

          <Bookmark size={19} />
        </div>

        {savedCities.length === 0 ? (
          <div className="where2-sidebar-empty">
            <div className="where2-sidebar-empty-icon">
              <Bookmark size={18} />
            </div>

            <div>
              <strong>No saved cities yet</strong>

              <p>
                Search for a city and save it to
                build your shortlist.
              </p>
            </div>
          </div>
        ) : (
          <div className="where2-sidebar-saved-list">
            {savedCities
              .slice(0, 3)
              .map((city) => (
                <article
                  key={city.id}
                  className="where2-sidebar-saved-city"
                >
                  <button
                    type="button"
                    className="where2-sidebar-saved-city-main"
                    onClick={() =>
                      onSelectSavedCity?.(city)
                    }
                  >
                    <div className="where2-sidebar-city-icon">
                      {city.name?.charAt(0) || "?"}
                    </div>

                    <div>
                      <strong>
                        {city.name}
                      </strong>

                      <span>
                        {city.country}
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="where2-sidebar-remove"
                    aria-label={`Remove ${city.name}`}
                    onClick={() =>
                      onRemoveCity?.(city.id)
                    }
                  >
                    ×
                  </button>
                </article>
              ))}
          </div>
        )}

        {savedCities.length > 3 && (
          <button
            type="button"
            className="where2-sidebar-view-all"
            onClick={() =>
              scrollToSection(
                ".where2-saved-cities"
              )
            }
          >
            <span>
              View all {savedCities.length} saved
              cities
            </span>

            <ArrowRight size={15} />
          </button>
        )}
      </section>

      {/* =====================================================
          YOUR PREFERENCES
      ===================================================== */}

      <section className="where2-sidebar-preferences">
        <div className="where2-sidebar-section-header">
          <div>
            <p className="where2-sidebar-eyebrow">
              YOUR PREFERENCES
            </p>

            <h2>What matters to you</h2>

            <p>
              Your current profile for city matching.
            </p>
          </div>

          <SlidersHorizontal size={19} />
        </div>

        <div className="where2-sidebar-preference-list">
          <div>
            <span>Climate</span>

            <strong>
              {formatPreference(
                preferences?.climate
              )}
            </strong>
          </div>

          <div>
            <span>Lifestyle</span>

            <strong>
              {formatPreference(
                preferences?.lifestyle
              )}
            </strong>
          </div>

          <div>
            <span>Priorities</span>

            <strong>
              {priorityCount > 0
                ? `${priorityCount} selected`
                : "Not set"}
            </strong>
          </div>
        </div>

        <button
          type="button"
          className="where2-sidebar-edit-preferences"
          onClick={() =>
            scrollToSection(
              "#where2-preferences"
            )
          }
        >
          <span>Edit preferences</span>

          <ArrowRight size={16} />
        </button>
      </section>

      {/* =====================================================
          CURRENT MATCH
      ===================================================== */}

      {recommendation && (
        <section className="where2-sidebar-match">
          <div className="where2-sidebar-match-header">
            <div>
              <p className="where2-sidebar-eyebrow">
                YOUR WHERE2 MATCH
              </p>

              <h2>
                {recommendation.label ||
                  "Possible fit"}
              </h2>
            </div>

            <div className="where2-sidebar-match-score">
              {recommendation.score ?? 0}
            </div>
          </div>

          <p className="where2-sidebar-match-description">
            Based on your preferences and the
            available city information.
          </p>

          {recommendation.reasons?.length > 0 && (
            <ul className="where2-sidebar-match-reasons">
              {recommendation.reasons
                .slice(0, 3)
                .map((reason) => (
                  <li key={reason}>
                    <Check size={13} />

                    <span>{reason}</span>
                  </li>
                ))}
            </ul>
          )}
        </section>
      )}

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section className="where2-sidebar-actions">
        <div className="where2-sidebar-section-header">
          <div>
            <p className="where2-sidebar-eyebrow">
              QUICK ACTIONS
            </p>

            <h2>Continue exploring</h2>
          </div>

          <Sparkles size={19} />
        </div>

        <div className="where2-sidebar-action-list">
          {/* Compare cities */}

          <button
            type="button"
            onClick={() =>
              scrollToSection(
                "#where2-discover"
              )
            }
          >
            <div>
              <Compass size={17} />
            </div>

            <span>
              <strong>Compare cities</strong>

              <small>
                See which place fits you better
              </small>
            </span>

            <ArrowRight size={16} />
          </button>

          {/* Find my match */}

          <button
            type="button"
            onClick={() =>
              scrollToSection(
                "#where2-preferences"
              )
            }
          >
            <div>
              <Sparkles size={17} />
            </div>

            <span>
              <strong>Find my match</strong>

              <small>
                Refine your city preferences
              </small>
            </span>

            <ArrowRight size={16} />
          </button>

          {/* Explore neighborhoods */}

          <button
            type="button"
            onClick={() =>
              scrollToSection(
                ".where2-selected-dashboard"
              )
            }
          >
            <div>
              <MapPin size={17} />
            </div>

            <span>
              <strong>
                Explore neighborhoods
              </strong>

              <small>
                Discover what life is like there
              </small>
            </span>

            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </aside>
  );
}

export default AICityAdvisor;