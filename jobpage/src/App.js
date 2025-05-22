import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login   from "./pages/Login";
import Signup  from "./pages/Signup";
import Home    from "./pages/Home";

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
      <Routes>
        {/* the welcome page */}
        <Route
          path="/"
          element={<Welcome token={token} setToken={setToken} logout={logout} />}
        />

        <Route path="/login"  element={<Login  setToken={setToken} />} />
        <Route path="/signup" element={<Signup setToken={setToken} />} />

        {/* the search page */}
        <Route
          path="/search"
          element={<Home logout={token ? logout : () => {}} />}
        />

        {/* in case the page drops */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
