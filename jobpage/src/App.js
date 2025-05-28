import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Chatbot from "./components/Chatbot";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import UserDashboard from "./pages/user/Dashboard";
import EmployerDashboard from "./pages/employer/Dashboard";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [lastSearch, setLastSearch] = useState("");

  useEffect(() => {
    const h = () => {
      setToken(localStorage.getItem("token"));
      const u = localStorage.getItem("user");
      setUser(u ? JSON.parse(u) : null);
    };
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
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
        <Route
          path="/login"
          element={<Login setToken={setToken} setUser={setUser} />}
        />
        <Route
          path="/signup"
          element={<Signup setToken={setToken} setUser={setUser} />}
        />
        <Route
          path="/search"
          element={
            <Home
              logout={token ? logout : () => {}}
              onSearch={term => setLastSearch(term)}
            />
          }
        />
        
        {/*
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute token={token}>
              <Dashboard user={user} logout={logout} setUser={setUser} />
            </ProtectedRoute>
          }
        />
        */}

        {/* protected user dashboard */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute token={token}>
              <UserDashboard user={user} logout={logout} setUser={setUser} />
            </ProtectedRoute>
          }
        />

        {/* protected employer dashboard */}
        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute token={token}>
              <EmployerDashboard user={user} logout={logout} setUser={setUser} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Chatbot lastSearch={lastSearch} />
    </BrowserRouter>
  );
}
