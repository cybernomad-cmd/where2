function formatCurrency(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numericValue);
}

function formatIndex(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "Unavailable";
  }

  return numericValue.toFixed(0);
}

function CostOfLiving({ data, cityName }) {
  if (!data) {
    return null;
  }

  const {
    estimated_monthly_cost,
    cost_index,
    region,
    groceries,
    rent,
    utilities,
    transport,
  } = data;

  const locationName =
    cityName || data.city || "this city";

  const primaryMetrics = [
    {
      label: "Estimated monthly cost",
      value: formatCurrency(
        estimated_monthly_cost
      ),
      modifier: "primary",
    },
    {
      label: "Cost index",
      value: formatIndex(cost_index),
    },
    {
      label: "Region",
      value: region || "Unavailable",
    },
  ];

  const breakdownMetrics = [
    {
      label: "Groceries",
      value: Number(groceries),
      description: "Grocery cost index",
    },
    {
      label: "Rent",
      value: Number(rent),
      description: "Rent cost index",
    },
    {
      label: "Utilities",
      value: Number(utilities),
      description: "Utilities cost index",
    },
    {
      label: "Transport",
      value: Number(transport),
      description: "Transport cost index",
    },
  ];

  const validBreakdownMetrics =
    breakdownMetrics.filter((metric) =>
      Number.isFinite(metric.value)
    );

  const highestCostCategory =
    validBreakdownMetrics.length > 0
      ? validBreakdownMetrics.reduce(
          (highest, metric) =>
            metric.value > highest.value
              ? metric
              : highest
        )
      : null;

  function getCostInsight() {
    if (!highestCostCategory) {
      return "Category cost information is currently unavailable.";
    }

    return `${highestCostCategory.label} has the highest cost index in the available data.`;
  }

  function getCostLevel() {
    const numericIndex = Number(cost_index);

    if (!Number.isFinite(numericIndex)) {
      return "Unavailable";
    }

    if (numericIndex >= 70) {
      return "Higher cost";
    }

    if (numericIndex >= 40) {
      return "Moderate cost";
    }

    return "Lower cost";
  }

  return (
    <section
      className="cost-of-living-section"
      aria-labelledby="cost-of-living-title"
    >
      <div className="cost-of-living-container">
        <div className="cost-of-living-header">
          <p className="eyebrow">Cost of living</p>

          <h2 id="cost-of-living-title">
            What does life cost in {locationName}?
          </h2>

          <p className="cost-of-living-intro">
            Explore estimated monthly costs and category
            indexes to better understand the affordability
            of this location.
          </p>
        </div>

        <div className="cost-primary-grid">
          {primaryMetrics.map((metric) => (
            <article
              key={metric.label}
              className={`cost-primary-card ${
                metric.modifier
                  ? `cost-primary-card-${metric.modifier}`
                  : ""
              }`}
            >
              <span className="cost-card-label">
                {metric.label}
              </span>

              <strong className="cost-primary-value">
                {metric.value}
              </strong>
            </article>
          ))}
        </div>

        <div className="cost-insight-card">
          <div>
            <p className="eyebrow">
              Cost insight
            </p>

            <h3>
              {highestCostCategory
                ? `${highestCostCategory.label} is the biggest cost pressure`
                : "Cost pressure unavailable"}
            </h3>

            <p>
              {getCostInsight()}
            </p>
          </div>

          <div className="cost-insight-score">
            <span>Overall level</span>

            <strong>{getCostLevel()}</strong>
          </div>
        </div>

        <div className="cost-breakdown-header">
          <p className="eyebrow">
            Cost breakdown
          </p>

          <h3>Where your money goes</h3>

          <p>
            Compare the relative cost index across the
            main categories.
          </p>
        </div>

        <div className="cost-breakdown-grid">
          {breakdownMetrics.map((metric) => {
            const hasValue =
              Number.isFinite(metric.value);

            const barWidth = hasValue
              ? `${Math.min(
                  Math.max(metric.value, 0),
                  100
                )}%`
              : "0%";

            return (
              <article
                className="cost-breakdown-card"
                key={metric.label}
              >
                <div className="cost-breakdown-top">
                  <span className="cost-card-label">
                    {metric.label}
                  </span>

                  <strong className="cost-breakdown-value">
                    {hasValue
                      ? formatIndex(metric.value)
                      : "Unavailable"}
                  </strong>
                </div>

                <div
                  className="cost-breakdown-bar"
                  aria-hidden="true"
                >
                  <span
                    style={{
                      width: barWidth,
                    }}
                  />
                </div>

                <p>{metric.description}</p>
              </article>
            );
          })}
        </div>

        <p className="cost-data-note">
          Cost estimates are provided in USD and are
          intended as a general comparison rather than a
          personal monthly budget. Available category
          data may represent broader regional or country
          estimates rather than exact individual expenses.
        </p>
      </div>
    </section>
  );
}

export default CostOfLiving;