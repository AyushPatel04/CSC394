import ProtectedRoute from "./components/ProtectedRoute";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Update state if localStorage changes in another tab/window
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // On mount, if token/user are in localStorage but not in state, sync them (for reload)
  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
    if (!user && localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, [token, user]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* public pages */}
        <Route
          path="/"
          element={
            <Welcome
              token={token}
              user={user}
              setToken={setToken}
              setUser={setUser}
              logout={logout}
            />
          }
        />
        <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
        <Route path="/signup" element={<Signup setToken={setToken} setUser={setUser} />} />
        <Route path="/search" element={<Home />} />

        {/* protected dashboard page */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute token={token}>
              <Dashboard user={user} logout={logout} setUser={setUser} />
            </ProtectedRoute>
          }
        />

        {/* fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

