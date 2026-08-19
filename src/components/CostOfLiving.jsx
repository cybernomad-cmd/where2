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
        const data = await getCostOfLiving(city.name);

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

  function formatPrice(value) {
    if (!Number.isFinite(Number(value))) {
      return "Not available";
    }

    return `$${Number(value).toFixed(2)}`;
  }

  function formatCategory(category) {
    if (!category) {
      return "Other";
    }

    return category
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
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
            Explore everyday prices to get a better
            sense of what living in this city may cost.
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

        {status === "success" &&
          costOfLiving &&
          costOfLiving.prices.length > 0 && (
            <div className="cost-of-living-content">
              <div className="cost-of-living-summary">
                <div>
                  <span>City</span>

                  <strong>
                    {costOfLiving.city}
                  </strong>
                </div>

                <div>
                  <span>Country</span>

                  <strong>
                    {costOfLiving.country ||
                      city.country}
                  </strong>
                </div>

                <div>
                  <span>Currency</span>

                  <strong>
                    {costOfLiving.currency ||
                      "USD"}
                  </strong>
                </div>
              </div>

              <div className="cost-of-living-grid">
                {costOfLiving.prices.map(
                  (price, index) => (
                    <article
                      className="cost-of-living-card"
                      key={`${price.name}-${index}`}
                    >
                      <div className="cost-of-living-card-top">
                        <span>
                          {formatCategory(
                            price.category
                          )}
                        </span>
                      </div>

                      <h3>{price.name}</h3>

                      <strong>
                        {formatPrice(price.usd)}
                      </strong>

                      {Number.isFinite(
                        Number(price.local)
                      ) && (
                        <p>
                          Local price:{" "}
                          {Number(price.local).toFixed(
                            2
                          )}{" "}
                          {price.currency || ""}
                        </p>
                      )}
                    </article>
                  )
                )}
              </div>
            </div>
          )}

        {status === "success" &&
          costOfLiving &&
          costOfLiving.prices.length === 0 && (
            <div className="search-state">
              <h3>
                No price information available.
              </h3>

              <p>
                We couldn't find detailed cost-of-living
                information for {city.name} yet.
              </p>
            </div>
          )}
      </div>
    </section>
  );
}

export default CostOfLiving;