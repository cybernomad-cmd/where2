import { useEffect, useState } from "react";
import { getCostOfLiving } from "../services/costOfLivingService";

function CostOfLiving({ city }) {
  const [costOfLiving, setCostOfLiving] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!city?.name) {
      return;
    }

    let isActive = true;

    async function loadCostOfLiving() {
      setStatus("loading");
      setError("");

      try {
        const data = await getCostOfLiving(city);

        if (!isActive) {
          return;
        }

        setCostOfLiving(data);
        setStatus("success");
      } catch (requestError) {
        if (!isActive) {
          return;
        }

        setCostOfLiving(null);
        setError(
          requestError.message ||
            "Unable to load cost-of-living information."
        );
        setStatus("error");
      }
    }

    loadCostOfLiving();

    return () => {
      isActive = false;
    };
  }, [city]);

  function formatCurrency(value) {
    if (!Number.isFinite(Number(value))) {
      return "Not available";
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }

  function formatIndex(value) {
    if (!Number.isFinite(Number(value))) {
      return "Not available";
    }

    return Number(value).toFixed(0);
  }

  if (!city) {
    return null;
  }

  return (
    <section
      className="cost-of-living"
      id="cost-of-living"
      aria-label={`Cost of living in ${city.name}`}
    >
      <div className="page-container">
        <div className="cost-of-living-heading">
          <p className="eyebrow">Cost of living</p>

          <h2>
            What does life cost in {city.name}?
          </h2>

          <p>
            Explore estimated monthly costs and
            category indexes to better understand the
            affordability of this location.
          </p>
        </div>

        {status === "loading" && (
          <div className="search-state">
            <p>
              Loading cost-of-living information for{" "}
              {city.name}...
            </p>
          </div>
        )}

        {status === "error" && (
          <div
            className="search-state search-state-error"
            role="alert"
          >
            <h3>
              We couldn't load cost-of-living data.
            </h3>

            <p>{error}</p>
          </div>
        )}

        {status === "success" && costOfLiving && (
          <div className="cost-of-living-content">
            <div className="cost-of-living-summary">
              <div>
                <span>Estimated monthly cost</span>

                <strong>
                  {formatCurrency(
                    costOfLiving.monthlyEstimateUsd
                  )}
                </strong>
              </div>

              <div>
                <span>Cost index</span>

                <strong>
                  {formatIndex(
                    costOfLiving.costIndex
                  )}
                </strong>
              </div>

              <div>
                <span>Region</span>

                <strong>
                  {costOfLiving.region ||
                    "Not available"}
                </strong>
              </div>
            </div>

            <div className="cost-of-living-grid">
              <article className="cost-of-living-card">
                <span>Groceries</span>

                <strong>
                  {formatIndex(
                    costOfLiving.groceryIndex
                  )}
                </strong>

                <p>
                  Grocery cost index
                </p>
              </article>

              <article className="cost-of-living-card">
                <span>Rent</span>

                <strong>
                  {formatIndex(
                    costOfLiving.rentIndex
                  )}
                </strong>

                <p>
                  Rent cost index
                </p>
              </article>

              <article className="cost-of-living-card">
                <span>Utilities</span>

                <strong>
                  {formatIndex(
                    costOfLiving.utilitiesIndex
                  )}
                </strong>

                <p>
                  Utilities cost index
                </p>
              </article>

              <article className="cost-of-living-card">
                <span>Transport</span>

                <strong>
                  {formatIndex(
                    costOfLiving.transportIndex
                  )}
                </strong>

                <p>
                  Transport cost index
                </p>
              </article>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default CostOfLiving;