function CostOfLiving({ data, cityName }) {
  if (!data) {
    return (
      <section className="cost-of-living-section">
        <div className="cost-of-living-container">
          <p className="eyebrow">Cost of living</p>
          <h2>Cost of living information unavailable</h2>
          <p className="cost-of-living-intro">
            We couldn't load cost of living information for this location.
          </p>
        </div>
      </section>
    );
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

  const locationName = cityName || data.city || "this city";

  const primaryMetrics = [
    {
      label: "Estimated monthly cost",
      value: estimated_monthly_cost,
      modifier: "primary",
    },
    {
      label: "Cost index",
      value: cost_index,
    },
    {
      label: "Region",
      value: region,
    },
  ];

  const breakdownMetrics = [
    {
      label: "Groceries",
      value: groceries,
      description: "Grocery cost index",
    },
    {
      label: "Rent",
      value: rent,
      description: "Rent cost index",
    },
    {
      label: "Utilities",
      value: utilities,
      description: "Utilities cost index",
    },
    {
      label: "Transport",
      value: transport,
      description: "Transport cost index",
    },
  ];

  return (
    <section className="cost-of-living-section">
      <div className="cost-of-living-container">
        <div className="cost-of-living-header">
          <p className="eyebrow">Cost of living</p>

          <h2>What does life cost in {locationName}?</h2>

          <p className="cost-of-living-intro">
            Explore estimated monthly costs and category indexes to better
            understand the affordability of this location.
          </p>
        </div>

        <div className="cost-primary-grid">
          {primaryMetrics.map((metric) => (
            <article
              key={metric.label}
              className={`cost-primary-card ${
                metric.modifier ? `cost-primary-card-${metric.modifier}` : ""
              }`}
            >
              <span className="cost-card-label">{metric.label}</span>

              <strong className="cost-primary-value">
                {metric.value}
              </strong>
            </article>
          ))}
        </div>

        <div className="cost-breakdown-header">
          <p className="eyebrow">Cost breakdown</p>
          <h3>Where your money goes</h3>
        </div>

        <div className="cost-breakdown-grid">
          {breakdownMetrics.map((metric) => (
            <article className="cost-breakdown-card" key={metric.label}>
              <div className="cost-breakdown-top">
                <span className="cost-card-label">{metric.label}</span>

                <span className="cost-card-icon" aria-hidden="true">
                  +
                </span>
              </div>

              <strong className="cost-breakdown-value">
                {metric.value}
              </strong>

              <p>{metric.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CostOfLiving;