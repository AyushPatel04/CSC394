import ProtectedRoute from "./components/ProtectedRoute";
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import UserDashboard from "./pages/user/Dashboard";
import EmployerDashboard from "./pages/employer/Dashboard";

function AppRoutes({ token, logout }) {
  const location = useLocation();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = user?.role || "user"; // fallback to "user"

  const showProfileEditor = location.pathname === "/dashboard/profile";

  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Welcome token={token} logout={logout} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />

      {/* Protected dashboards */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute token={token}>
            {role === "employer" ? (
              <EmployerDashboard logout={logout} />
            ) : (
              <UserDashboard logout={logout} showProfileEditor={showProfileEditor} />
            )}
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
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
    localStorage.removeItem("user");
    setToken(null);
  };

  return (
    <BrowserRouter>
      <AppRoutes token={token} logout={logout} />
    </BrowserRouter>
  );
}

