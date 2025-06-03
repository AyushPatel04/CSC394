import ViewListing from './components/ViewListing';
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
import AppliedJobs from "./components/AppliedJobs.jsx";
import SavedJobs from "./components/SavedJobs.jsx";
import EmployerListings from "./pages/employer/Listings";
import NewListing from "./pages/employer/NewListing";
import EditListing from "./pages/employer/EditListing";
import Chatbot from "./components/Chatbot";          

function AppRoutes({ token, logout, setToken, setUser }) {
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
      <Route path="/home" element={<Home />} />
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
      <Route path="/dashboard/applied" element={<AppliedJobs />} />
      <Route path="/dashboard/saved" element={<SavedJobs />} />

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
      />

      {
    
    }
      <Chatbot />               {

      }
    </BrowserRouter>
  );
}
