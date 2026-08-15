import { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "../api/api.js";

const AuthContext = createContext(null);

const STORAGE_KEY = "watchtrack_auth";

function loadStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadStoredAuth);

  // Refresh the stored user on startup. This keeps fields such as `role` in
  // sync for sessions that were created before those fields existed.
  useEffect(() => {
    if (!auth.token || !auth.user?._id) return;

    let cancelled = false;
    getUser(auth.user._id, auth.token)
      .then((user) => {
        if (cancelled) return;
        const next = {
          token: auth.token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role || "user",
          },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setAuth(next);
      })
      .catch(() => {
        // Keep the current session during a temporary API/network failure.
      });

    return () => {
      cancelled = true;
    };
  }, [auth.token, auth.user?._id]);

  const login = ({ token, user }) => {
    const next = { token, user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAuth(next);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
