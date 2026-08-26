import { useEffect, useState } from "react";

import AuthApp from "./AuthApp";
import Where2App from "./where2/Where2App";
import { getCurrentUser, logout } from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getCurrentUser()
      .then((currentUser) => {
        if (mounted) {
          setUser(currentUser);
        }
      })
      .catch((error) => {
        console.error("Failed to restore session:", error);

        if (mounted) {
          setUser(null);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

async function handleLogout() {
  try {
    await logout();
    setUser(null);
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

  if (loading) {
    return (
      <main className="app-loading">
        <p>Connecting to FocusFlow...</p>
      </main>
    );
  }

  if (user) {
    return (
      <Where2App
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <AuthApp
      onAuthenticated={(authenticatedUser) => {
        setUser(authenticatedUser);
      }}
    />
  );
}

export default App;