import { useState } from "react";
import "./App.css";

import {
  login,
  signup,
} from "./api";

function AuthApp({ onAuthenticated }) {
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [status, setStatus] = useState("ready");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
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
       * Do NOT redirect to localhost:5173.
       *
       * Instead, tell the parent App that authentication
       * succeeded. App.jsx will then render Where2App.
       */
      onAuthenticated(authenticatedUser);
    } catch (requestError) {
      setError(requestError.message);
      setStatus("ready");
    }
  }

  return (
    <main className="app-shell">
      <section className="auth-panel">
        <div className="intro">
          <p className="eyebrow">FocusFlow</p>

          <h1>
            Make room for focused work.
          </h1>

          <p className="muted">
            Sign in to manage your projects and keep
            momentum visible.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mode-switcher">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => {
                setMode("login");
                setError("");
              }}
            >
              Log in
            </button>

            <button
              type="button"
              className={mode === "signup" ? "active" : ""}
              onClick={() => {
                setMode("signup");
                setError("");
              }}
            >
              Create account
            </button>
          </div>

          {mode === "signup" && (
            <label>
              Username

              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </label>
          )}

          <label>
            Email

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </label>

          {error && (
            <p
              className="error"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            className="submit-button"
            type="submit"
            disabled={status === "submitting"}
          >
            {status === "submitting"
              ? "Connecting..."
              : mode === "login"
                ? "Log in"
                : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AuthApp;