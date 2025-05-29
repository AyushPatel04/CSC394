import ProtectedRoute from "./components/ProtectedRoute";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/user/Dashboard";

function AppRoutes({ token, logout }) {
  const location = useLocation();

  // Check if route ends in /profile
  const showProfileEditor = location.pathname === "/dashboard/profile";

  return (
    <Routes>
      {/* public pages */}
      <Route path="/" element={<Welcome token={token} logout={logout} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />

      {/* protected routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute token={token}>
            <Dashboard logout={logout} showProfileEditor={showProfileEditor} />
          </ProtectedRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    const h = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <BrowserRouter>
      <AppRoutes token={token} logout={logout} />
    </BrowserRouter>
  );
}

