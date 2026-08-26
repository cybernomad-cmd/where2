import { useEffect, useState } from "react";
import "./AuthApp.css";

import {
  getCurrentUser,
  login,
  logout,
  signup,
} from "./api";

function AuthApp({ onAuthenticated }) {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getCurrentUser()
      .then((currentUser) => {
        if (!mounted) return;

        setUser(currentUser);
        setStatus("ready");

        if (currentUser && onAuthenticated) {
          onAuthenticated(currentUser);
        }
      })
      .catch((requestError) => {
        console.error(
          "Failed to restore authentication session:",
          requestError
        );

        if (!mounted) return;

        setUser(null);
        setStatus("ready");
      });

    return () => {
      mounted = false;
    };
  }, [onAuthenticated]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");

    setForm((currentForm) => ({
      ...currentForm,
      username: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setStatus("submitting");
    setError("");

    try {
      let authenticatedUser;

      if (mode === "login") {
        authenticatedUser = await login(
          form.email,
          form.password
        );
      } else {
        authenticatedUser = await signup(
          form.username,
          form.email,
          form.password
        );
      }

      /*
       * Authentication is handled by the Flask API.
       *
       * The root App.jsx is responsible for switching
       * from AuthApp to the authenticated WHERE2 dashboard.
       */
      setUser(authenticatedUser);
      setStatus("ready");

      if (onAuthenticated) {
        onAuthenticated(authenticatedUser);
      }
    } catch (requestError) {
      console.error("Authentication failed:", requestError);

      setError(
        requestError?.message ||
          "Unable to complete authentication."
      );

      setStatus("ready");
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (requestError) {
      console.error(
        "Logout failed:",
        requestError
      );
    } finally {
      setUser(null);
    }
  }

  function handleGoogleLogin() {
    setError(
      "Google sign-in will be connected after the core authentication flow is complete."
    );
  }

  if (status === "loading") {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="auth-intro">
            <div className="auth-brand">
              <div className="auth-brand-mark">
                <span>W</span>
              </div>

              <span className="auth-brand-name">
                where<span>2</span>
              </span>
            </div>

            <div className="auth-intro-content">
              <p className="auth-eyebrow">
                Where2
              </p>

              <h1 className="auth-heading">
                Find your
                <br />
                next great
                <br />
                <span className="auth-heading-accent">
                  place.
                </span>
              </h1>
            </div>
          </div>

          <div className="auth-form-panel">
            <div className="auth-form-container">
              <div className="auth-form-header">
                <h2>
                  Loading your account
                </h2>

                <p>
                  Connecting securely to Where2.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (user) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="auth-intro">
            <div className="auth-brand">
              <div className="auth-brand-mark">
                <span>W</span>
              </div>

              <span className="auth-brand-name">
                where<span>2</span>
              </span>
            </div>

            <div className="auth-intro-content">
              <p className="auth-eyebrow">
                Welcome back
              </p>

              <h1 className="auth-heading">
                Ready to find
                <br />
                your next
                <br />
                <span className="auth-heading-accent">
                  place?
                </span>
              </h1>

              <p className="auth-description">
                You're signed in and ready to
                explore cities, compare places,
                and discover where you could
                live your best life.
              </p>
            </div>
          </div>

          <div className="auth-form-panel">
            <div className="auth-form-container">
              <div className="auth-form-header">
                <h2>
                  Welcome back,
                  {" "}
                  {user.username}.
                </h2>

                <p>
                  Your Where2 account is
                  connected.
                </p>
              </div>

              <button
                type="button"
                className="auth-submit"
                onClick={() => {
                  if (onAuthenticated) {
                    onAuthenticated(user);
                  }
                }}
              >
                Continue to Where2
              </button>

              <button
                type="button"
                className="auth-google"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card">

        {/* =================================================
            LEFT: WHERE2 PURPOSE
            ================================================= */}

        <div className="auth-intro">

          <div className="auth-brand">
            <div className="auth-brand-mark">
              <span>W</span>
            </div>

            <span className="auth-brand-name">
              where<span>2</span>
            </span>
          </div>

          <div className="auth-intro-content">

            <p className="auth-eyebrow">
              Find your place
            </p>

            <h1 className="auth-heading">
              Find your
              <br />
              next great
              <br />
              <span className="auth-heading-accent">
                place to live.
              </span>
            </h1>

            <p className="auth-description">
              Discover and compare cities
              around the world based on
              cost of living, weather,
              lifestyle, and what matters
              most to you.
            </p>

            <div className="auth-purpose">
              <span className="auth-purpose-dot" />

              <span>
                Make a more informed decision
                about where you live.
              </span>
            </div>

          </div>
        </div>


        {/* =================================================
            RIGHT: AUTH FORM
            ================================================= */}

        <div className="auth-form-panel">

          <div className="auth-form-container">

            <div className="auth-form-header">

              <h2>
                {mode === "login"
                  ? "Welcome back."
                  : "Create your account."}
              </h2>

              <p>
                {mode === "login"
                  ? "Sign in to continue exploring Where2."
                  : "Create an account to save and personalize your city discoveries."}
              </p>

            </div>


            {/* MODE SWITCHER */}

            <div
              className="auth-mode-switcher"
              role="tablist"
              aria-label="Authentication mode"
            >

              <button
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                className={`auth-mode-button ${
                  mode === "login"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  switchMode("login")
                }
              >
                Log in
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={mode === "signup"}
                className={`auth-mode-button ${
                  mode === "signup"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  switchMode("signup")
                }
              >
                Create account
              </button>

            </div>


            {/* FORM */}

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >

              {mode === "signup" && (
                <div className="auth-field">

                  <label htmlFor="username">
                    Username
                  </label>

                  <input
                    id="username"
                    className="auth-input"
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    autoComplete="username"
                    required
                  />

                </div>
              )}


              <div className="auth-field">

                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  className="auth-input"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />

              </div>


              <div className="auth-field">

                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  className="auth-input"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  minLength={8}
                  required
                />

              </div>


              {mode === "login" && (
                <div className="auth-form-options">

                  <label className="auth-remember">

                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) =>
                        setRememberMe(
                          event.target.checked
                        )
                      }
                    />

                    <span>
                      Remember me
                    </span>

                  </label>

                  <button
                    type="button"
                    className="auth-forgot"
                    onClick={() =>
                      setError(
                        "Password recovery will be added in the next authentication step."
                      )
                    }
                  >
                    Forgot password?
                  </button>

                </div>
              )}


              {error && (
                <p
                  className="auth-error"
                  role="alert"
                >
                  {error}
                </p>
              )}


              <button
                className="auth-submit"
                type="submit"
                disabled={
                  status === "submitting"
                }
              >
                {status === "submitting"
                  ? "Connecting..."
                  : mode === "login"
                    ? "Log in"
                    : "Create account"}
              </button>

            </form>


            {/* GOOGLE */}

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <button
              type="button"
              className="auth-google"
              onClick={handleGoogleLogin}
            >
              <span className="auth-google-icon">
                G
              </span>

              Continue with Google
            </button>


            {/* TERMS */}

            <p className="auth-terms">
              By continuing, you agree to
              Where2's{" "}
              <strong>
                Terms of Service
              </strong>{" "}
              and{" "}
              <strong>
                Privacy Policy
              </strong>.
            </p>

          </div>

        </div>

      </section>
    </main>
  );
}

export default AuthApp;