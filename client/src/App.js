import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") === "dark";
    setIsDarkMode(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
  };

  return (
    <div className="min-h-screen relative bg-gray-100 dark:bg-gray-900">
      <div className="absolute top-6 right-4 z-50">
        <button
          onClick={toggleDarkMode}
          className="bg-gray-200 dark:bg-[#17202a] text-gray-900 dark:text-gray-100 p-3 rounded-full shadow-lg hover:bg-gray-300 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-300"
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19)",
          }}
        >
          {isDarkMode ? <MdOutlineLightMode size={24} /> : <MdOutlineDarkMode size={24} />}
        </button>
      </div>

      {/* Routes */}
      <Router>
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
