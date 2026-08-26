import {
  ArrowRight,
  Bookmark,
  Check,
  Compass,
  Map,
  Settings2,
  Sparkles,
} from "lucide-react";

const climateLabels = {
  warm: "Warm",
  cool: "Cool",
  mild: "Mild",
};

const lifestyleLabels = {
  quiet: "Quiet",
  balanced: "Balanced",
  vibrant: "Vibrant",
};

const priorityLabels = {
  Affordability: "Affordability",
  "Career opportunities": "Career",
  "Outdoor activities": "Outdoors",
  "Culture and entertainment": "Culture",
};

function scrollToSection(selector) {
  const element = document.querySelector(selector);

  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

function DashboardRightSidebar({
  savedCities = [],
  preferences = {},
  onRemoveCity,
  onSelectSavedCity,
}) {
  const climate =
    climateLabels[preferences.climate] ||
    "Not set";

  const lifestyle =
    lifestyleLabels[preferences.lifestyle] ||
    "Not set";

  const priorities = Array.isArray(
    preferences.priorities
  )
    ? preferences.priorities
        .map(
          (priority) =>
            priorityLabels[priority] || priority
        )
        .filter(Boolean)
    : [];

  function handleCompareCities() {
    const selectedDashboard = document.querySelector(
      ".where2-selected-dashboard"
    );

    if (selectedDashboard) {
      selectedDashboard.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      return;
    }

    scrollToSection(".where2-discovery-card");
  }

  function handleFindMatch() {
    scrollToSection(".where2-preferences");
  }

  function handleExploreNeighborhoods() {
    const selectedDashboard = document.querySelector(
      ".where2-selected-dashboard"
    );

    if (selectedDashboard) {
      selectedDashboard.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      return;
    }

    scrollToSection(".where2-discovery-card");
  }

  return (
    <div className="where2-right-sidebar">
      {/* =====================================================
          YOUR SHORTLIST
      ===================================================== */}

      <section className="where2-sidebar-card">
        <div className="where2-sidebar-card-header">
          <div>
            <p className="where2-sidebar-eyebrow">
              YOUR SHORTLIST
            </p>

            <h3>Your saved cities</h3>

            <p>
              Cities you're currently considering.
            </p>
          </div>

          <Bookmark
            size={18}
            strokeWidth={1.8}
          />
        </div>

        {savedCities.length === 0 ? (
          <div className="where2-sidebar-empty">
            <div className="where2-sidebar-empty-icon">
              <Bookmark
                size={17}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <strong>
                No saved cities yet
              </strong>

              <p>
                Save cities while exploring to
                build your shortlist.
              </p>
            </div>
          </div>
        ) : (
          <div className="where2-sidebar-city-list">
            {savedCities
              .slice(0, 4)
              .map((city) => {
                const match =
                  typeof city.match ===
                  "number"
                    ? city.match
                    : null;

                const countryCode =
                  city.countryCode ||
                  city.country_code ||
                  "";

                return (
                  <article
                    className="where2-sidebar-city"
                    key={city.id}
                  >
                    <button
                      type="button"
                      className="where2-sidebar-city-main"
                      onClick={() =>
                        onSelectSavedCity(city)
                      }
                    >
                      <div className="where2-sidebar-city-avatar">
                        {city.name
                          ?.charAt(0)
                          ?.toUpperCase() || "C"}
                      </div>

                      <div className="where2-sidebar-city-info">
                        <strong>
                          {city.name}
                        </strong>

                        <span>
                          {city.country}
                          {countryCode
                            ? ` · ${countryCode}`
                            : ""}
                        </span>
                      </div>
                    </button>

                    <div className="where2-sidebar-city-actions">
                      <span
                        className={`where2-sidebar-match ${
                          match === null
                            ? "where2-sidebar-match-empty"
                            : ""
                        }`}
                      >
                        {match !== null
                          ? `${match}%`
                          : "—"}
                      </span>

                      <button
                        type="button"
                        className="where2-sidebar-remove"
                        onClick={() =>
                          onRemoveCity(city.id)
                        }
                        aria-label={`Remove ${city.name}`}
                      >
                        ×
                      </button>
                    </div>
                  </article>
                );
              })}
          </div>
        )}

        {savedCities.length > 0 && (
          <button
            type="button"
            className="where2-sidebar-link"
            onClick={() =>
              scrollToSection(
                ".where2-shortlist-card"
              )
            }
          >
            <span>
              View all saved cities
            </span>

            <ArrowRight size={14} />
          </button>
        )}
      </section>

      {/* =====================================================
          YOUR PREFERENCES
      ===================================================== */}

      <section className="where2-sidebar-card">
        <div className="where2-sidebar-card-header">
          <div>
            <p className="where2-sidebar-eyebrow">
              YOUR PREFERENCES
            </p>

            <h3>What matters to you</h3>

            <p>
              Your current profile for city matching.
            </p>
          </div>

          <Settings2
            size={18}
            strokeWidth={1.8}
          />
        </div>

        <div className="where2-sidebar-preferences">
          <div className="where2-sidebar-preference">
            <span>Climate</span>
            <strong>{climate}</strong>
          </div>

          <div className="where2-sidebar-preference">
            <span>Lifestyle</span>
            <strong>{lifestyle}</strong>
          </div>

          <div className="where2-sidebar-preference where2-sidebar-preference-wide">
            <span>Priorities</span>

            <div className="where2-sidebar-tags">
              {priorities.length > 0 ? (
                priorities
                  .slice(0, 3)
                  .map((priority) => (
                    <span key={priority}>
                      {priority}
                    </span>
                  ))
              ) : (
                <span>Not set</span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="where2-sidebar-outline-button"
          onClick={handleFindMatch}
        >
          <span>Edit preferences</span>
          <ArrowRight size={14} />
        </button>
      </section>

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section className="where2-sidebar-card where2-sidebar-actions-card">
        <div className="where2-sidebar-card-header">
          <div>
            <p className="where2-sidebar-eyebrow">
              QUICK ACTIONS
            </p>

            <h3>Continue exploring</h3>
          </div>

          <Sparkles
            size={18}
            strokeWidth={1.8}
          />
        </div>

        <div className="where2-sidebar-quick-actions">
          <button
            type="button"
            onClick={handleCompareCities}
          >
            <span className="where2-sidebar-action-icon">
              <Compass size={16} />
            </span>

            <span className="where2-sidebar-action-text">
              <strong>
                Compare cities
              </strong>

              <small>
                See which place fits you better
              </small>
            </span>

            <ArrowRight size={14} />
          </button>

          <button
            type="button"
            onClick={handleFindMatch}
          >
            <span className="where2-sidebar-action-icon">
              <Sparkles size={16} />
            </span>

            <span className="where2-sidebar-action-text">
              <strong>
                Find my match
              </strong>

              <small>
                Refine your city preferences
              </small>
            </span>

            <ArrowRight size={14} />
          </button>

          <button
            type="button"
            onClick={handleExploreNeighborhoods}
          >
            <span className="where2-sidebar-action-icon">
              <Map size={16} />
            </span>

            <span className="where2-sidebar-action-text">
              <strong>
                Explore neighborhoods
              </strong>

              <small>
                Discover what life is like there
              </small>
            </span>

            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* =====================================================
          TRUST NOTE
      ===================================================== */}

      <div className="where2-sidebar-trust">
        <Check size={14} />

        <span>
          Your preferences are used to personalize
          your WHERE2 recommendations.
        </span>
      </div>
    </div>
  );
}

export default DashboardRightSidebar;