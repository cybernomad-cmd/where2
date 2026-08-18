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

      if (prefersReducedMotion) {
        gsap.set(
          [
            ".hero-eyebrow",
            ".hero-heading",
            ".hero-description",
            ".hero-buttons",
            ".hero-city-card",
          ],
          {
            clearProps: "all",
          }
        );

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
          ".hero-city-card",
          {
            y: 40,
            opacity: 0,
            scale: 0.96,
            duration: 0.9,
          },
          "-=0.35"
        );
    }, hero);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section ref={heroRef} className="hero-section">
      <div className="page-container hero-container">
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow">
            Find the place that fits your life
          </p>

          <h1 className="display-heading hero-heading">
            Where could you live that fits your life?
          </h1>

          <p className="lead-text hero-description">
            WHERE2 helps you discover and compare cities based
            on your lifestyle, budget, career goals, climate
            preferences, and personal priorities.
          </p>

          <div className="button-group hero-buttons">
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

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-city-card">
            <span className="hero-city-label">
              YOUR NEXT CITY
            </span>

            <strong>Could be anywhere.</strong>

            <div className="hero-location">
              <span>◉</span>
              <span>Worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;