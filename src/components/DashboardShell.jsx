import { useState } from "react";

import {
  Bell,
  Bookmark,
  ChevronDown,
  Compass,
  Heart,
  History,
  Home,
  Info,
  Lightbulb,
  Map,
  Menu,
  MessageCircle,
  Moon,
  RefreshCw,
  Settings,
  Sparkles,
  Star,
  WalletCards,
  X,
} from "lucide-react";

function DashboardShell({
  children,
  aiAdvisor = true,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const navigationItems = [
    {
      label: "Home",
      icon: Home,
      active: true,
    },
    {
      label: "Explore Cities",
      icon: Compass,
    },
    {
      label: "Compare",
      icon: WalletCards,
    },
    {
      label: "Saved Cities",
      icon: Bookmark,
    },
    {
      label: "Recommendations",
      icon: Sparkles,
    },
    {
      label: "Map Explorer",
      icon: Map,
    },
    {
      label: "Cost of Living",
      icon: WalletCards,
    },
    {
      label: "Guides",
      icon: Lightbulb,
    },
    {
      label: "Watchlist",
      icon: Heart,
    },
    {
      label: "History",
      icon: History,
    },
  ];

  const advisorSuggestions = [
    "Find warm cities under $1,500/month",
    "Compare Cape Town vs Nairobi",
    "Best cities for digital nomads",
    "Where can I live near the beach?",
  ];

  return (
    <div className="where2-dashboard">
      {/* Desktop Sidebar */}

      <aside
        className={`where2-sidebar ${
          mobileMenuOpen
            ? "where2-sidebar-open"
            : ""
        }`}
      >
        <div className="where2-sidebar-top">
          <div className="where2-brand">
            <div className="where2-brand-mark">
              <Map size={21} strokeWidth={2.5} />
            </div>

            <span>
              where<span>2</span>
            </span>
          </div>

          <button
            type="button"
            className="where2-mobile-close"
            aria-label="Close navigation"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          >
            <X size={20} />
          </button>
        </div>

        <nav
          className="where2-sidebar-navigation"
          aria-label="Main navigation"
        >
          {navigationItems.map(
            ({
              label,
              icon: Icon,
              active,
            }) => (
              <button
                type="button"
                key={label}
                className={`where2-nav-item ${
                  active
                    ? "where2-nav-item-active"
                    : ""
                }`}
              >
                <Icon
                  size={18}
                  strokeWidth={1.9}
                />

                <span>{label}</span>
              </button>
            )
          )}
        </nav>

        <div className="where2-sidebar-bottom">
          <div className="where2-profile-card">
            <div className="where2-avatar">
              JM
            </div>

            <div className="where2-profile-info">
              <strong>John Mwangi</strong>
              <span>
                Premium <Star size={11} />
              </span>
            </div>

            <ChevronDown size={16} />
          </div>

          <div className="where2-premium-card">
            <div className="where2-premium-icon">
              <Sparkles size={16} />
            </div>

            <strong>
              Unlock more insights
            </strong>

            <p>
              Upgrade to Premium for advanced
              analytics, alerts, and AI
              recommendations.
            </p>

            <button type="button">
              Upgrade to Premium
            </button>
          </div>

          <div className="where2-sidebar-links">
            <button type="button">
              <Moon size={17} />
              <span>Dark mode</span>

              <span className="where2-toggle">
                <span />
              </span>
            </button>

            <button type="button">
              <Settings size={17} />
              <span>Settings</span>
            </button>

            <button type="button">
              <Info size={17} />
              <span>Help & Support</span>
            </button>
          </div>

          <div className="where2-sidebar-footer">
            <span>© 2025 where2</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          type="button"
          className="where2-sidebar-overlay"
          aria-label="Close navigation"
          onClick={() =>
            setMobileMenuOpen(false)
          }
        />
      )}

      {/* Main Area */}

      <div className="where2-dashboard-main">
        <header className="where2-topbar">
          <div className="where2-mobile-brand">
            <button
              type="button"
              className="where2-menu-button"
              aria-label="Open navigation"
              onClick={() =>
                setMobileMenuOpen(true)
              }
            >
              <Menu size={21} />
            </button>

            <div className="where2-brand">
              <div className="where2-brand-mark">
                <Map
                  size={18}
                  strokeWidth={2.5}
                />
              </div>

              <span>
                where<span>2</span>
              </span>
            </div>
          </div>

          <div className="where2-topbar-actions">
            <button
              type="button"
              className="where2-icon-button"
              aria-label="Notifications"
            >
              <Bell size={20} />

              <span className="where2-notification-dot">
                3
              </span>
            </button>

            <button
              type="button"
              className="where2-icon-button"
              aria-label="Saved cities"
            >
              <Bookmark size={20} />
            </button>

            <button
              type="button"
              className="where2-user-button"
            >
              <span className="where2-avatar">
                JM
              </span>

              <ChevronDown size={16} />
            </button>
          </div>
        </header>

        <div className="where2-dashboard-content">
          <section className="where2-main-column">
            {children}
          </section>

          {aiAdvisor && (
            <aside className="where2-ai-column">
              <div className="where2-ai-card">
                <div className="where2-ai-header">
                  <div className="where2-ai-title">
                    <Sparkles size={18} />

                    <strong>
                      AI City Advisor
                    </strong>

                    <span>BETA</span>

                    <Info size={14} />
                  </div>

                  <button
                    type="button"
                    aria-label="Refresh advisor"
                  >
                    <RefreshCw size={17} />
                  </button>
                </div>

                <div className="where2-ai-introduction">
                  <h2>Hi John!</h2>

                  <p>
                    I'm your AI City Advisor.
                    <br />
                    How can I help you today?
                  </p>
                </div>

                <div className="where2-ai-suggestions">
                  {advisorSuggestions.map(
                    (suggestion) => (
                      <button
                        type="button"
                        key={suggestion}
                      >
                        {suggestion}
                      </button>
                    )
                  )}
                </div>

                <div className="where2-ai-conversation">
                  <div className="where2-ai-user-message">
                    I want to live somewhere warm,
                    affordable, safe, and with a
                    good tech industry.
                    <span>
                      10:24 AM ✓✓
                    </span>
                  </div>

                  <div className="where2-ai-response">
                    <p>
                      Great! I found cities that
                      match your preferences.
                    </p>

                    <div className="where2-ai-result">
                      <div className="where2-ai-result-image">
                        N
                      </div>

                      <div>
                        <strong>
                          1. Nairobi, Kenya
                        </strong>

                        <span>
                          91% match
                        </span>

                        <p>
                          Warm, affordable,
                          growing tech hub.
                        </p>
                      </div>
                    </div>

                    <div className="where2-ai-result">
                      <div className="where2-ai-result-image">
                        C
                      </div>

                      <div>
                        <strong>
                          2. Cape Town, South Africa
                        </strong>

                        <span>
                          87% match
                        </span>

                        <p>
                          Great lifestyle and
                          climate.
                        </p>
                      </div>
                    </div>

                    <div className="where2-ai-result">
                      <div className="where2-ai-result-image">
                        L
                      </div>

                      <div>
                        <strong>
                          3. Lisbon, Portugal
                        </strong>

                        <span>
                          83% match
                        </span>

                        <p>
                          Strong tech ecosystem.
                        </p>
                      </div>
                    </div>

                    <div className="where2-ai-result">
                      <div className="where2-ai-result-image">
                        B
                      </div>

                      <div>
                        <strong>
                          4. Bangkok, Thailand
                        </strong>

                        <span>
                          78% match
                        </span>

                        <p>
                          Affordable and vibrant.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="where2-ai-input">
                  <input
                    type="text"
                    placeholder="Ask me anything..."
                    aria-label="Ask AI City Advisor"
                  />

                  <button
                    type="button"
                    aria-label="Voice input"
                  >
                    <MessageCircle
                      size={18}
                    />
                  </button>

                  <button
                    type="button"
                    className="where2-ai-send"
                    aria-label="Send message"
                  >
                    →
                  </button>
                </div>

                <button
                  type="button"
                  className="where2-ai-voice"
                >
                  <Sparkles size={18} />

                  <span>
                    Speak with Where2
                  </span>
                </button>

                <p className="where2-ai-disclaimer">
                  AI responses can make mistakes.
                  Learn more.
                </p>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardShell;