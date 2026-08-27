function Nav() {
  return (
    <header className="navbar">
      <div className="page-container navbar-inner">
        <a
          href="/"
          className="brand"
          aria-label="WHERE2 home"
        >
          WHERE<span>2</span>
        </a>

        <nav
          className="navbar-links"
          aria-label="Main navigation"
        >
          <a href="#discover">
            Discover
          </a>

          <a href="#how-it-works">
            How it works
          </a>

          <a href="#cities">
            Cities
          </a>
        </nav>

        <div className="navbar-actions">
          <a
            href="/login"
            className="nav-login"
          >
            Log in
          </a>

          <a
            href="/signup"
            className="button button-primary nav-cta"
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}

export default Nav;