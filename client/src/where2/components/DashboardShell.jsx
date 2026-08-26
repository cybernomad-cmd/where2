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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarProfileOpen, setSidebarProfileOpen] = useState(false);
  const [topbarProfileOpen, setTopbarProfileOpen] = useState(false);

  const username = user?.username || "User";
  const email = user?.email || "";

  function getInitials(name = "") {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
      return "U";
    }

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return parts
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  }

  const initials = getInitials(username);

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

  async function handleLogout() {
    setSidebarProfileOpen(false);
    setTopbarProfileOpen(false);
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

  function handleMobileOpen() {
    setMobileMenuOpen(true);
  }

  function handleMobileClose() {
    setMobileMenuOpen(false);
  }

  function toggleSidebarProfile() {
    setSidebarProfileOpen((current) => !current);
    setTopbarProfileOpen(false);
  }

  function toggleTopbarProfile() {
    setTopbarProfileOpen((current) => !current);
    setSidebarProfileOpen(false);
  }

  return (
    <div className="where2-dashboard">

      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <aside
        className={`where2-sidebar ${
          mobileMenuOpen ? "where2-sidebar-open" : ""
        }`}
      >
        {/* Sidebar Header */}

        <div className="where2-sidebar-top">
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

          <button
            type="button"
            className="where2-mobile-close"
            aria-label="Close navigation"
            onClick={handleMobileClose}
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

          {/* =================================================
              SIDEBAR PROFILE
          ================================================= */}

          <div className="where2-profile-wrapper">

            <button
              type="button"
              className="where2-profile-card"
              onClick={toggleSidebarProfile}
              aria-expanded={sidebarProfileOpen}
              aria-label="Open profile menu"
            >
              <div className="where2-avatar">
                {initials}
              </div>

              <div className="where2-profile-info">
                <strong>{username}</strong>

                <span>
                  Premium{" "}
                  <Star size={11} />
                </span>
              </div>

              <ChevronDown size={16} />
            </button>

            {sidebarProfileOpen && (
              <div className="where2-profile-menu">

                <div className="where2-profile-menu-user">
                  <strong>{username}</strong>

                  {email && (
                    <span>{email}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />

                  <span>Log out</span>
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

          {/* Footer */}

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

      {/* =====================================================
          MOBILE SIDEBAR OVERLAY
      ===================================================== */}

      {mobileMenuOpen && (
        <button
          type="button"
          className="where2-sidebar-overlay"
          aria-label="Close navigation"
          onClick={handleMobileClose}
        />
      )}

      {/* =====================================================
          MAIN DASHBOARD
      ===================================================== */}

      <div className="where2-dashboard-main">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <header className="where2-topbar">

          {/* Mobile Brand */}

          <div className="where2-mobile-brand">

            <button
              type="button"
              className="where2-menu-button"
              aria-label="Open navigation"
              onClick={handleMobileOpen}
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
                TOPBAR PROFILE
            ================================================= */}

            <div className="where2-topbar-profile">

              <button
                type="button"
                className="where2-topbar-profile-button"
                aria-label="Open user menu"
                aria-expanded={topbarProfileOpen}
                onClick={toggleTopbarProfile}
              >
                <span className="where2-topbar-avatar">
                  {initials}
                </span>

                <ChevronDown
                  size={16}
                  strokeWidth={2}
                />
              </button>

              {topbarProfileOpen && (
                <div
                  className="where2-topbar-profile-dropdown"
                  role="menu"
                >

                  <div className="where2-topbar-profile-header">

                    <div className="where2-topbar-profile-avatar">
                      {initials}
                    </div>

                    <div className="where2-topbar-profile-information">

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

                  <div className="where2-topbar-profile-divider" />

                  <button
                    type="button"
                    className="where2-topbar-logout"
                    onClick={handleLogout}
                    role="menuitem"
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