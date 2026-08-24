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
  Moon,
  Settings,
  Sparkles,
  Star,
  WalletCards,
  X,
} from "lucide-react";

import AICityAdvisor from "./AICityAdvisor";

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

          {/* Brand */}

          <div className="where2-brand">
            <div className="where2-brand-mark">
              <Map
                size={21}
                strokeWidth={2.5}
              />
            </div>

            <span>
              where<span>2</span>
            </span>
          </div>

          {/* Mobile Close */}

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

        {/* Navigation */}

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

        {/* Sidebar Bottom */}

        <div className="where2-sidebar-bottom">

          {/* Profile */}

          <div className="where2-profile-card">
            <div className="where2-avatar">
              JM
            </div>

            <div className="where2-profile-info">
              <strong>
                John Mwangi
              </strong>

              <span>
                Premium{" "}
                <Star size={11} />
              </span>
            </div>

            <ChevronDown size={16} />
          </div>

          {/* Premium */}

          <div className="where2-premium-card">
            <div className="where2-premium-icon">
              <Sparkles size={16} />
            </div>

            <strong>
              Unlock more insights
            </strong>

            <p>
              Upgrade to Premium for
              advanced analytics, alerts,
              and AI recommendations.
            </p>

            <button type="button">
              Upgrade to Premium
            </button>
          </div>

          {/* Sidebar Links */}

          <div className="where2-sidebar-links">

            <button type="button">
              <Moon size={17} />

              <span>
                Dark mode
              </span>

              <span className="where2-toggle">
                <span />
              </span>
            </button>

            <button type="button">
              <Settings size={17} />

              <span>
                Settings
              </span>
            </button>

            <button type="button">
              <Info size={17} />

              <span>
                Help & Support
              </span>
            </button>

          </div>

          {/* Footer */}

          <div className="where2-sidebar-footer">
            <span>
              © 2025 where2
            </span>

            <span>
              All rights reserved
            </span>
          </div>

        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}

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

      {/* Main Dashboard Area */}

      <div className="where2-dashboard-main">

        {/* Topbar */}

        <header className="where2-topbar">

          {/* Mobile Brand */}

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

          {/* Topbar Actions */}

          <div className="where2-topbar-actions">

            {/* Notifications */}

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

            {/* Saved Cities */}

            <button
              type="button"
              className="where2-icon-button"
              aria-label="Saved cities"
            >
              <Bookmark size={20} />
            </button>

            {/* User */}

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

        {/* Dashboard Content */}

        <div className="where2-dashboard-content">

          {/* Main Column */}

          <section className="where2-main-column">
            {children}
          </section>

          {/* AI City Advisor */}

          {aiAdvisor && (
            <AICityAdvisor />
          )}

        </div>
      </div>
    </div>
  );
}

export default DashboardShell;