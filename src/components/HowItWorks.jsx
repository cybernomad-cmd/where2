import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function HowItWorks() {
  const sectionRef = useRef(null);

  const steps = [
    {
      number: "01",
      title: "Tell us about you",
      description:
        "Share your budget, career, lifestyle, climate preferences, family needs, and what matters most to you.",
    },
    {
      number: "02",
      title: "We compare what matters",
      description:
        "WHERE2 combines your priorities with real-world information about cities around the world.",
    },
    {
      number: "03",
      title: "Discover your best matches",
      description:
        "Explore cities ranked around your needs and compare the places that could fit your life.",
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
            ".how-it-works-eyebrow",
            ".how-it-works-title",
            ".how-it-works-description",
            ".step-card",
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
        .from(".how-it-works-eyebrow", {
          y: 24,
          opacity: 0,
          duration: 0.6,
        })
        .from(
          ".how-it-works-title",
          {
            y: 36,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.35"
        )
        .from(
          ".how-it-works-description",
          {
            y: 24,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.4"
        )
        .from(
          ".step-card",
          {
            y: 36,
            opacity: 0,
            duration: 0.7,
            stagger: 0.15,
          },
          "-=0.25"
        );
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="how-it-works">
      <div className="page-container">
        <div className="how-it-works-heading">
          <div>
            <p className="eyebrow how-it-works-eyebrow">
              How WHERE2 works
            </p>

            <h2 className="section-title how-it-works-title">
              Your life is unique.
              <br />
              Your city should be too.
            </h2>
          </div>

          <p className="section-description how-it-works-description">
            WHERE2 turns the things that matter to you into
            a clearer picture of where you could live, work,
            and build your life.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step) => (
            <article className="step-card" key={step.number}>
              <span className="step-number">
                {step.number}
              </span>

              <div className="step-content">
                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;