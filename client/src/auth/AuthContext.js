// src/auth/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [didRefresh, setDidRefresh] = useState(false); // 🟡 prevents infinite loops

  /* ======================================================
     REFRESH TOKEN
  ====================================================== */
  async function refreshSession() {
    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) return false;
      return true;
    } catch (err) {
      return false;
    }
  }

  /* ======================================================
     CHECK SESSION ON LOAD
  ====================================================== */
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        // ✅ SUCCESS: user logged in
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            setLoading(false);
            return;
          }
        }

        // ❌ /me failed — try refresh ONCE
        if (!didRefresh) {
          const refreshed = await refreshSession();
          setDidRefresh(true);

          if (refreshed) {
            return checkSession(); // retry only once
          }
        }

        // ❌ Login still invalid → logout
        setUser(null);
        setLoading(false);
      } catch (err) {
        setUser(null);
        setLoading(false);
      }
    }

    checkSession();
  }, [didRefresh]); // tracks refresh attempt

  /* ======================================================
     LOGIN
  ====================================================== */
  async function login(email, password) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message);

    setUser(data.user);
    return data.user;
  }

  /* ======================================================
     LOGOUT
  ====================================================== */
  async function logout() {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
