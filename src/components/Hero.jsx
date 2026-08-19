import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

function Hero() {
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;

    if (!hero) {
      return undefined;
    }

    const context = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const animatedElements = [
        ".hero-eyebrow",
        ".hero-heading",
        ".hero-description",
        ".hero-buttons",
        ".hero-feature-pills",
        ".hero-city-card",
      ];

      if (prefersReducedMotion) {
        gsap.set(animatedElements, {
          clearProps: "all",
        });

        return;
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .from(".hero-eyebrow", {
          y: 24,
          opacity: 0,
          duration: 0.6,
        })
        .from(
          ".hero-heading",
          {
            y: 40,
            opacity: 0,
            duration: 0.9,
          },
          "-=0.35"
        )
        .from(
          ".hero-description",
          {
            y: 24,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.45"
        )
        .from(
          ".hero-buttons",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.35"
        )
        .from(
          ".hero-feature-pills",
          {
            y: 18,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.3"
        )
        .from(
          ".hero-city-card",
          {
            y: 30,
            opacity: 0,
            scale: 0.97,
            duration: 0.8,
          },
          "-=0.25"
        );
    }, hero);

    return () => {
      context.revert();
    };
  }, []);

  const features = [
    {
      icon: "☀",
      label: "Live Weather",
    },
    {
      icon: "◉",
      label: "Cost of Living",
    },
    {
      icon: "♡",
      label: "Lifestyle",
    },
    {
      icon: "✓",
      label: "Safety",
    },
    {
      icon: "▣",
      label: "Career",
    },
  ];

  function handleDiscoverCities() {
    document
      .getElementById("city-search")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  function handleExploreHowItWorks() {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  return (
    <section
      ref={heroRef}
      className="hero-section"
      aria-labelledby="hero-heading"
    >
      {/* Hero background image */}
      <div className="hero-background" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=2200&q=85"
          alt=""
        />
      </div>

      {/* Dark overlay for text readability */}
      <div
        className="hero-overlay"
        aria-hidden="true"
      />

      <div className="page-container hero-container">
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow">
            Find the place that fits your life
          </p>

          <h1
            id="hero-heading"
            className="display-heading hero-heading"
          >
            Where could you
            <br />
            live better?
          </h1>

          <p className="lead-text hero-description">
            Find the place that fits your life, your income,
            your priorities, and the way you want to live.
          </p>

          <div className="button-group hero-buttons">
            <button
              type="button"
              className="button button-primary"
              onClick={handleDiscoverCities}
            >
              Discover My Cities →
            </button>

            <button
              type="button"
              className="button button-secondary"
              onClick={handleExploreHowItWorks}
            >
              Explore How It Works
            </button>
          </div>

          <div
            className="hero-feature-pills"
            aria-label="WHERE2 features"
          >
            {features.map((feature) => (
              <span
                className="hero-feature-pill"
                key={feature.label}
              >
                <span
                  className="hero-feature-icon"
                  aria-hidden="true"
                >
                  {feature.icon}
                </span>

                {feature.label}
              </span>
            ))}
          </div>
        </div>

        <div
          className="hero-visual"
          aria-hidden="true"
        >
          <div className="hero-city-card">
            <span className="hero-city-label">
              YOUR NEXT CITY
            </span>

            <strong>
              Could be
              <br />
              anywhere.
            </strong>

            <div className="hero-location">
              <span>●</span>
              <span>Worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;