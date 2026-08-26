import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPinned,
  Search,
  Sparkles,
  Heart,
} from "lucide-react";

import "./App.css";

import {
  getCurrentUser,
  login,
  logout,
  signup,
} from "./api";

function AuthApp() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getCurrentUser()
      .then((currentUser) => {
        if (!mounted) return;

        setUser(currentUser);
        setStatus("ready");
      })
      .catch((requestError) => {
        console.error("Failed to restore session:", requestError);

        if (!mounted) return;

        setUser(null);
        setStatus("ready");
      });

    return () => {
      mounted = false;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");

    setForm({
      username: "",
      email: "",
      password: "",
    });
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

      setUser(authenticatedUser);
      setStatus("ready");
    } catch (requestError) {
      console.error("Authentication failed:", requestError);

      setError(
        requestError?.message ||
          "Something went wrong. Please try again."
      );

      setStatus("ready");
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (requestError) {
      console.error("Logout failed:", requestError);
    } finally {
      setUser(null);
    }
  }

  if (status === "loading") {
    return (
      <main className="where2-auth-loading">
        <div className="where2-loading-mark">
          <MapPinned size={28} />
        </div>

        <p>Loading Where2...</p>
      </main>
    );
  }

  if (user) {
    return (
      <main className="where2-authenticated">
        <section className="where2-authenticated-card">
          <div className="where2-authenticated-icon">
            <Check size={28} />
          </div>

          <p className="where2-auth-eyebrow">
            WHERE2
          </p>

          <h1>
            Welcome back, {user.username}.
          </h1>

          <p>
            Your Where2 account is connected and ready.
          </p>

          <button
            type="button"
            onClick={handleLogout}
            className="where2-secondary-button"
          >
            Log out
          </button>
        </section>
      </main>
    );
  }

  const isLogin = mode === "login";

  return (
    <main className="where2-auth-page">

      {/* ==================================================
          LEFT EXPERIENCE
      ================================================== */}

      <section className="where2-auth-visual">

        <div className="where2-auth-image" />

        <div className="where2-auth-overlay" />

        <div className="where2-auth-visual-content">

          {/* Logo */}

          <div className="where2-auth-logo">
            <div className="where2-auth-logo-mark">
              <MapPinned
                size={25}
                strokeWidth={2.5}
              />
            </div>

            <span>
              where<span>2</span>
            </span>
          </div>

          {/* Main message */}

          <div className="where2-auth-message">

            <p className="where2-auth-kicker">
              YOUR NEXT CHAPTER STARTS HERE
            </p>

            <h1>
              Find your next
              <br />
              great <span>place</span>
              <br />
              to live.
            </h1>

            <p className="where2-auth-description">
              Explore cities, compare cost of living,
              discover weather insights, and find
              the place that fits your lifestyle.
            </p>

          </div>

          {/* Feature highlights */}

          <div className="where2-auth-features">

            <div className="where2-auth-feature">
              <div className="where2-feature-icon blue">
                <Search size={19} />
              </div>

              <strong>
                Explore
              </strong>

              <span>
                Cities worldwide
              </span>
            </div>

            <div className="where2-auth-feature">
              <div className="where2-feature-icon green">
                <Sparkles size={19} />
              </div>

              <strong>
                Compare
              </strong>

              <span>
                What matters most
              </span>
            </div>

            <div className="where2-auth-feature">
              <div className="where2-feature-icon yellow">
                <MapPinned size={19} />
              </div>

              <strong>
                Discover
              </strong>

              <span>
                Your perfect match
              </span>
            </div>

            <div className="where2-auth-feature">
              <div className="where2-feature-icon purple">
                <Heart size={19} />
              </div>

              <strong>
                Save
              </strong>

              <span>
                Your favourite cities
              </span>
            </div>

          </div>

          {/* Bottom statement */}

          <div className="where2-auth-quote">

            <div className="where2-quote-icon">
              <MapPinned size={20} />
            </div>

            <div>
              <strong>
                Not sure where to go?
              </strong>

              <span>
                Where2 gives you the data
                to choose with confidence.
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          RIGHT AUTH CARD
      ================================================== */}

      <section className="where2-auth-form-section">

        <div className="where2-auth-form-card">

          {/* Mobile logo */}

          <div className="where2-mobile-auth-logo">
            <div className="where2-auth-logo-mark">
              <MapPinned size={22} />
            </div>

            <span>
              where<span>2</span>
            </span>
          </div>

          {/* Header */}

          <div className="where2-form-header">

            <div className="where2-form-icon">
              <MapPinned size={21} />
            </div>

            <div>
              <h2>
                {isLogin
                  ? "Welcome back"
                  : "Create your account"}
              </h2>

              <p>
                {isLogin
                  ? "Sign in to continue your journey."
                  : "Start discovering places that fit your life."}
              </p>
            </div>

          </div>

          {/* Tabs */}

          <div className="where2-auth-tabs">

            <button
              type="button"
              className={
                isLogin
                  ? "where2-auth-tab active"
                  : "where2-auth-tab"
              }
              onClick={() => switchMode("login")}
            >
              Log in
            </button>

            <button
              type="button"
              className={
                !isLogin
                  ? "where2-auth-tab active"
                  : "where2-auth-tab"
              }
              onClick={() => switchMode("signup")}
            >
              Create account
            </button>

          </div>

          {/* Form */}

          <form
            className="where2-auth-form"
            onSubmit={handleSubmit}
          >

            {!isLogin && (
              <label className="where2-input-group">

                <span>
                  Username
                </span>

                <div className="where2-input-wrapper">

                  <Mail size={18} />

                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    autoComplete="username"
                    required
                  />

                </div>

              </label>
            )}

            <label className="where2-input-group">

              <span>
                Email address
              </span>

              <div className="where2-input-wrapper">

                <Mail size={18} />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />

              </div>

            </label>

            <label className="where2-input-group">

              <span>
                Password
              </span>

              <div className="where2-input-wrapper">

                <LockKeyhole size={18} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete={
                    isLogin
                      ? "current-password"
                      : "new-password"
                  }
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="where2-password-toggle"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword(
                      (visible) => !visible
                    )
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </label>

            {/* Login options */}

            {isLogin && (
              <div className="where2-form-options">

                <label className="where2-checkbox">

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
                  className="where2-forgot-password"
                  onClick={() =>
                    setError(
                      "Password recovery will be available soon."
                    )
                  }
                >
                  Forgot password?
                </button>

              </div>
            )}

            {/* Error */}

            {error && (
              <div
                className="where2-auth-error"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Primary CTA */}

            <button
              type="submit"
              className="where2-primary-button"
              disabled={status === "submitting"}
            >
              <span>
                {status === "submitting"
                  ? "Please wait..."
                  : isLogin
                    ? "Log in"
                    : "Create account"}
              </span>

              {status !== "submitting" && (
                <ArrowRight size={19} />
              )}
            </button>

          </form>

          {/* Divider */}

          <div className="where2-auth-divider">
            <span />
            <p>or</p>
            <span />
          </div>

          {/* Google */}

          <button
            type="button"
            className="where2-google-button"
            onClick={() =>
              setError(
                "Google sign-in is coming soon."
              )
            }
          >
            <span className="where2-google-icon">
              G
            </span>

            <span>
              Continue with Google
            </span>
          </button>

          {/* Footer */}

          <p className="where2-auth-footer">

            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              type="button"
              onClick={() =>
                switchMode(
                  isLogin
                    ? "signup"
                    : "login"
                )
              }
            >
              {isLogin
                ? "Create account"
                : "Log in"}
            </button>

          </p>

          <p className="where2-auth-legal">
            By continuing, you agree to Where2's
            terms and privacy policy.
          </p>

        </div>
      </section>

    </main>
  );
}

export default AuthApp;