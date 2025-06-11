import ProtectedRoute from "./components/ProtectedRoute";
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Chatbot from "./components/Chatbot";
import Applications      from "./pages/employer/Application";
import ApplicationDetail from "./pages/employer/ApplicationDetail";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ViewListing from './pages/ViewListing';
import Reset from "./pages/Reset";

import UserDashboard from "./pages/user/Dashboard";
import AppliedJobs from "./pages/user/AppliedJobs";
import UserResume from "./pages/user/UserResume";

import EmployerDashboard from "./pages/employer/Dashboard";
import EmployerListings from "./pages/employer/Listings";
import NewListing from "./pages/employer/NewListing";
import EditListing from "./pages/employer/EditListing";

function AppRoutes({ token, logout, setToken, setUser, setLastSearch }) {
  const location = useLocation();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = user?.role || "user";

  const showProfileEditor = location.pathname === "/dashboard/profile";

  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Welcome token={token} logout={logout} />} />
      <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
      <Route path="/signup" element={<Signup setToken={setToken} setUser={setUser} />} />
      <Route path="/reset" element={<Reset />} />
      <Route
        path="/home"
        element={<Home token={token} logout={logout} onSearch={term => setLastSearch(term)} />}
      />
      <Route path="/listing/:id" element={<ViewListing />} />

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

      {/* User protected routes */}
      <Route
        path="/user/applications"
        element={
          <ProtectedRoute token={token} role={role} requiredRole={"user"}>
            <AppliedJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume"
        element={
          <ProtectedRoute token={token} role={role} requiredRole={"user"}>
            <UserResume />
          </ProtectedRoute>
        }
      />

      {/* Employer protected routes */}
      <Route
        path="/listings"
        element={
          <ProtectedRoute token={token} role={role} requiredRole={"employer"}>
            <EmployerListings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/newlisting"
        element={
          <ProtectedRoute token={token} role={role} requiredRole={"employer"}>
            <NewListing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/editlisting/:listingId"
        element={
          <ProtectedRoute token={token} role={role} requiredRole={"employer"}>
            <EditListing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/applications" 
        element={
          <ProtectedRoute token={token} role={role} requiredRole={"employer"}>
            <Applications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/applications/:id" 
        element={
          <ProtectedRoute token={token} role={role} requiredRole={"employer"}>
            <ApplicationDetail />
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

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [lastSearch, setLastSearch] = useState("");

  useEffect(() => {
    const h = () => {
      setToken(localStorage.getItem("token"));
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
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
      <AppRoutes
        token={token}
        logout={logout}
        setToken={setToken}
        setUser={setUser}
        setLastSearch={setLastSearch}
      />
      <Chatbot lastSearch={lastSearch} />
    </BrowserRouter>
  );
}
