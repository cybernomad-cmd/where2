import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function CityPreview() {
  const sectionRef = useRef(null);

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

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    const context = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            ".city-preview-eyebrow",
            ".city-preview-title",
            ".city-preview-description",
            ".city-card",
          ],
          {
            clearProps: "all",
          }
        );

        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .from(".city-preview-eyebrow", {
          y: 24,
          opacity: 0,
          duration: 0.6,
        })
        .from(
          ".city-preview-title",
          {
            y: 36,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.35"
        )
        .from(
          ".city-preview-description",
          {
            y: 24,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.4"
        )
        .from(
          ".city-card",
          {
            y: 48,
            opacity: 0,
            scale: 0.97,
            duration: 0.8,
            stagger: 0.16,
          },
          "-=0.25"
        );
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    const context = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        return;
      }

      const cards = gsap.utils.toArray(".city-card");

      cards.forEach((card) => {
        const handleEnter = () => {
          gsap.to(card, {
            y: -6,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const handleLeave = () => {
          gsap.to(card, {
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        };

        card.addEventListener("mouseenter", handleEnter);
        card.addEventListener("mouseleave", handleLeave);

        card._where2Enter = handleEnter;
        card._where2Leave = handleLeave;
      });
    }, section);

    return () => {
      const cards = gsap.utils.toArray(".city-card");

      cards.forEach((card) => {
        if (card._where2Enter) {
          card.removeEventListener(
            "mouseenter",
            card._where2Enter
          );
        }

        if (card._where2Leave) {
          card.removeEventListener(
            "mouseleave",
            card._where2Leave
          );
        }

        delete card._where2Enter;
        delete card._where2Leave;
      });

      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="city-preview"
      id="cities"
    >
      <div className="page-container">
        <div className="city-preview-heading">
          <div>
            <p className="eyebrow city-preview-eyebrow">
              Explore possibilities
            </p>

            <h2 className="section-title city-preview-title">
              Cities that could
              <br />
              fit your life.
            </h2>
          </div>

          <p className="section-description city-preview-description">
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