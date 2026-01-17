import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 👈 IMPORT THIS
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext"; // 👈 IMPORT THIS
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 1. Router must be the outermost parent */}
    <BrowserRouter>
      {/* 2. AuthProvider must be inside Router (because it uses navigation) */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
