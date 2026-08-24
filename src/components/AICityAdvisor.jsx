import { useState } from "react";
import {
  Info,
  MessageCircle,
  RefreshCw,
  Send,
  Sparkles,
} from "lucide-react";

function AICityAdvisor() {
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
        "Great lifestyle and climate.",
      initial: "C",
    },
    {
      id: "lisbon",
      name: "Lisbon, Portugal",
      match: "83% match",
      description:
        "Strong tech ecosystem.",
      initial: "L",
    },
    {
      id: "bangkok",
      name: "Bangkok, Thailand",
      match: "78% match",
      description:
        "Affordable and vibrant.",
      initial: "B",
    },
  ];

  function createMessageId(type, index, text) {
    return `${type}-${index}-${text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 30)}`;
  }

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
              "Affordable regional base near beaches.",
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

    if (
      normalizedText.includes("compare")
    ) {
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

  return (
    <aside className="where2-ai-column">
      <div className="where2-ai-card">
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

        {/* Introduction */}

        {messages.length === 0 && (
          <>
            <div className="where2-ai-introduction">
              <h2>Hi John!</h2>

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
    </aside>
  );
}

export default AICityAdvisor;