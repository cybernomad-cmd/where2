const PREFERENCE_OPTIONS = {
  climate: [
    "Warm",
    "Cool",
    "Mild",
  ],
  lifestyle: [
    "Quiet",
    "Balanced",
    "Vibrant",
  ],
  priorities: [
    "Affordability",
    "Career opportunities",
    "Outdoor activities",
    "Culture and entertainment",
  ],
};

function Preferences({
  value,
  onPreferencesChange,
}) {
  const preferences = value;

  function handleClimateChange(event) {
    const climate = event.target.value;

    onPreferencesChange({
      ...preferences,
      climate,
    });
  }

  function handleLifestyleChange(event) {
    const lifestyle = event.target.value;

    onPreferencesChange({
      ...preferences,
      lifestyle,
    });
  }

  function handlePriorityChange(event) {
    const { value: priority, checked } = event.target;

    const priorities = checked
      ? [...preferences.priorities, priority]
      : preferences.priorities.filter(
          (item) => item !== priority
        );

    onPreferencesChange({
      ...preferences,
      priorities,
    });
  }

  return (
    <section
      className="preferences-section"
      id="preferences"
    >
      <div className="page-container">
        <div className="preferences-heading">
          <p className="eyebrow">Make it personal</p>

          <h2 className="section-title">
            What matters to you?
          </h2>

          <p className="section-description">
            Tell us what you're looking for and we'll use
            your preferences to help you explore places that
            fit your lifestyle.
          </p>
        </div>

        <div className="preferences-form">
          <fieldset className="preference-group">
            <legend>
              What kind of climate do you prefer?
            </legend>

            <div className="preference-options">
              {PREFERENCE_OPTIONS.climate.map((option) => (
                <label
                  className="preference-option"
                  key={option}
                >
                  <input
                    type="radio"
                    name="climate"
                    value={option}
                    checked={preferences.climate === option}
                    onChange={handleClimateChange}
                  />

                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="preference-group">
            <legend>
              What kind of lifestyle suits you?
            </legend>

            <div className="preference-options">
              {PREFERENCE_OPTIONS.lifestyle.map((option) => (
                <label
                  className="preference-option"
                  key={option}
                >
                  <input
                    type="radio"
                    name="lifestyle"
                    value={option}
                    checked={
                      preferences.lifestyle === option
                    }
                    onChange={handleLifestyleChange}
                  />

                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="preference-group">
            <legend>
              What are your priorities?
            </legend>

            <div className="preference-options preference-options-multiple">
              {PREFERENCE_OPTIONS.priorities.map((option) => (
                <label
                  className="preference-option"
                  key={option}
                >
                  <input
                    type="checkbox"
                    name="priorities"
                    value={option}
                    checked={preferences.priorities.includes(
                      option
                    )}
                    onChange={handlePriorityChange}
                  />

                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
    </section>
  );
}

export default Preferences;