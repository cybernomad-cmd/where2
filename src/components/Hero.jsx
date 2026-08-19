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
            ".hero-features",
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
          y: 25,
          opacity: 0,
          duration: 0.5,
        })
        .from(
          ".hero-heading",
          {
            y: 35,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.25"
        )
        .from(
          ".hero-description",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.35"
        )
        .from(
          ".hero-buttons",
          {
            y: 15,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.25"
        )
        .from(
          ".hero-features",
          {
            y: 15,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.25"
        )
        .from(
          ".hero-city-card",
          {
            y: 25,
            opacity: 0,
            scale: 0.96,
            duration: 0.7,
          },
          "-=0.35"
        );
    }, hero);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="hero-section"
      aria-labelledby="hero-title"
    >
      <div className="hero-background" aria-hidden="true" />

      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-container">
        <div className="hero-main-content">
          <p className="eyebrow hero-eyebrow">
            Find the place that fits your life
          </p>

          <h1 id="hero-title" className="hero-heading">
            Where could you
            <br />
            live better?
          </h1>

          <p className="hero-description">
            Find the place that fits your life, your income,
            your priorities, and the way you want to live.
          </p>

          <div className="hero-buttons">
            <button
              type="button"
              className="button button-primary"
            >
              Discover My Cities →
            </button>

            <button
              type="button"
              className="button button-secondary"
            >
              Explore How It Works
            </button>
          </div>

          <div className="hero-features">
            <span>☀ Live Weather</span>
            <span>● Cost of Living</span>
            <span>♡ Lifestyle</span>
            <span>✓ Safety</span>
            <span>▣ Career</span>
          </div>
        </div>

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
            <span className="hero-location-dot">●</span>
            <span>Worldwide</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;