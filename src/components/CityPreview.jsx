function CityPreview() {
  const cities = [
    {
      name: "Nairobi",
      country: "Kenya",
      match: "87%",
      description:
        "A growing city with a strong tech ecosystem, diverse lifestyles, and opportunities across multiple industries.",
    },
    {
      name: "Lisbon",
      country: "Portugal",
      match: "91%",
      description:
        "A relaxed European city known for its climate, growing remote-work community, and coastal lifestyle.",
    },
    {
      name: "Kuala Lumpur",
      country: "Malaysia",
      match: "84%",
      description:
        "A modern international city offering relatively affordable living, excellent connectivity, and diverse culture.",
    },
  ];

  return (
    <section className="city-preview" id="cities">
      <div className="page-container">
        <div className="city-preview-heading">
          <div>
            <p className="eyebrow">Explore possibilities</p>

            <h2 className="section-title">
              Cities that could
              <br />
              fit your life.
            </h2>
          </div>

          <p className="section-description">
            Every person has different priorities. WHERE2
            helps you look beyond popular destinations and
            discover places that make sense for you.
          </p>
        </div>

        <div className="city-grid">
          {cities.map((city) => (
            <article className="city-card" key={city.name}>
              <div className="city-card-top">
                <span className="city-country">
                  {city.country}
                </span>

                <span className="match-score">
                  {city.match}
                </span>
              </div>

              <div className="city-card-content">
                <h3>{city.name}</h3>

                <p>{city.description}</p>
              </div>

              <button
                type="button"
                className="city-card-link"
              >
                Explore city →
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CityPreview;