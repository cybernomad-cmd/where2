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
  LogOut,
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
  user,
  onLogout,
  aiAdvisor = true,
  savedCities = [],
  preferences,
  recommendation,
  onRemoveCity,
  onSelectSavedCity,
}) {
  /* =====================================================
     STATE
  ===================================================== */

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  /* =====================================================
     USER INFORMATION
  ===================================================== */

  const username = user?.username || "User";
  const email = user?.email || "";

  function getInitials(name = "") {
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  const initials = getInitials(username);

  /* =====================================================
     NAVIGATION
  ===================================================== */

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

  /* =====================================================
     LOGOUT
  ===================================================== */

  async function handleLogout() {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);

    if (!onLogout) {
      return;
    }

    try {
      await onLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  /* =====================================================
     CLOSE MOBILE MENU
  ===================================================== */

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="where2-dashboard">

      {/* =================================================
          DESKTOP SIDEBAR
      ================================================= */}

      <aside
        className={`where2-sidebar ${
          mobileMenuOpen
            ? "where2-sidebar-open"
            : ""
        }`}
      >

        {/* =================================================
            SIDEBAR TOP
        ================================================= */}

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
            onClick={closeMobileMenu}
          >
            <X size={20} />
          </button>

        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

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

                <span>
                  {label}
                </span>

              </button>
            )
          )}

        </nav>

        {/* =================================================
            SIDEBAR BOTTOM
        ================================================= */}

        <div className="where2-sidebar-bottom">

          {/* =================================================
              PROFILE
          ================================================= */}

          <div className="where2-profile-wrapper">

            <button
              type="button"
              className="where2-profile-card"
              onClick={() =>
                setProfileMenuOpen(
                  (current) => !current
                )
              }
              aria-expanded={profileMenuOpen}
              aria-label="Open profile menu"
            >

              <div className="where2-avatar">
                {initials}
              </div>

              <div className="where2-profile-info">

                <strong>
                  {username}
                </strong>

                <span>
                  Premium{" "}
                  <Star size={11} />
                </span>

              </div>

              <ChevronDown size={16} />

            </button>

            {/* =================================================
                SIDEBAR PROFILE DROPDOWN
            ================================================= */}

            {profileMenuOpen && (
              <div className="where2-profile-menu">

                <div className="where2-profile-menu-user">

                  <strong>
                    {username}
                  </strong>

                  {email && (
                    <span>
                      {email}
                    </span>
                  )}

                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                >

                  <LogOut size={16} />

                  <span>
                    Log out
                  </span>

                </button>

              </div>
            )}

          </div>

          {/* =================================================
              PREMIUM
          ================================================= */}

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

          {/* =================================================
              SIDEBAR LINKS
          ================================================= */}

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

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="where2-sidebar-footer">

            <span>
              © 2026 where2
            </span>

            <span>
              All rights reserved
            </span>

          </div>

        </div>

      </aside>

      {/* =================================================
          MOBILE SIDEBAR OVERLAY
      ================================================= */}

      {mobileMenuOpen && (
        <button
          type="button"
          className="where2-sidebar-overlay"
          aria-label="Close navigation"
          onClick={closeMobileMenu}
        />
      )}

      {/* =================================================
          MAIN DASHBOARD AREA
      ================================================= */}

      <div className="where2-dashboard-main">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <header className="where2-topbar">

          {/* =================================================
              MOBILE BRAND
          ================================================= */}

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

          {/* =================================================
              TOPBAR ACTIONS
          ================================================= */}

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

            {/* =================================================
                USER PROFILE
            ================================================= */}

            <div className="where2-user-menu">

              <button
                type="button"
                className="where2-user-button"
                onClick={() =>
                  setProfileMenuOpen(
                    (current) => !current
                  )
                }
                aria-expanded={profileMenuOpen}
                aria-label="Open user menu"
              >

                <span className="where2-avatar">
                  {initials}
                </span>

                <ChevronDown size={16} />

              </button>

              {/* =================================================
                  TOPBAR PROFILE DROPDOWN
              ================================================= */}

              {profileMenuOpen && (
                <div className="where2-user-dropdown">

                  <div className="where2-user-dropdown-header">

                    <div className="where2-avatar">
                      {initials}
                    </div>

                    <div>

                      <strong>
                        {username}
                      </strong>

                      {email && (
                        <span>
                          {email}
                        </span>
                      )}

                    </div>

                  </div>

                  <div className="where2-user-dropdown-divider" />

                  <button
                    type="button"
                    className="where2-logout-button"
                    onClick={handleLogout}
                  >

                    <LogOut size={17} />

                    <span>
                      Log out
                    </span>

                  </button>

                </div>
              )}

            </div>

          </div>

        </header>

        {/* =================================================
            DASHBOARD CONTENT
        ================================================= */}

        <div className="where2-dashboard-content">

          {/* Main Column */}

          <section className="where2-main-column">

            {children}

          </section>

          {/* Right Intelligence Sidebar */}

          {aiAdvisor && (
            <AICityAdvisor
              savedCities={savedCities}
              preferences={preferences}
              recommendation={recommendation}
              onRemoveCity={onRemoveCity}
              onSelectSavedCity={onSelectSavedCity}
            />
          )}

        </div>

      </div>

    </div>
  );
}

export default DashboardShell;