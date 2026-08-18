import "./App.css";
import Nav from "./components/Nav";

function App() {
  return (
    <main className="design-system">
      <Nav />

      <section className="demo-hero">
        <div className="page-container demo-hero-content">
          <p className="eyebrow">
            Find the place that fits your life
          </p>

          <h1 className="display-heading">
            Where could you live that fits your life?
          </h1>

          <p className="lead-text">
            WHERE2 helps people discover and compare cities
            based on their lifestyle, budget, career goals,
            climate preferences, and personal priorities.
          </p>

          <div className="button-group">
            <button
              type="button"
              className="button button-primary"
            >
              Discover your cities
            </button>

            <button
              type="button"
              className="button button-secondary"
            >
              Explore how it works
            </button>
          </div>
        </div>
      </section>

      <section className="component-section">
        <div className="page-container">
          <div className="section-heading">
            <p className="eyebrow">
              Foundation
            </p>

            <h2>
              WHERE2 design system
            </h2>
          </div>

          <div className="component-grid">
            <article className="demo-card">
              <div className="color-sample color-primary" />

              <h3>
                Primary
              </h3>

              <p>
                The main WHERE2 brand color used
                for important actions and highlights.
              </p>
            </article>

            <article className="demo-card">
              <div className="color-sample color-light" />

              <h3>
                Primary Light
              </h3>

              <p>
                A soft supporting color for
                backgrounds, highlights, and
                selected states.
              </p>
            </article>

            <article className="demo-card">
              <div className="color-sample color-surface" />

              <h3>
                Surface
              </h3>

              <p>
                Used for cards, sections, and
                subtle separation from the main
                background.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;