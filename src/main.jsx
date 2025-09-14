import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { initSync } from "./stores/localProgress";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ProgressProvider } from "./contexts/ProgressContext";

// Get root DOM element
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <ProgressProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ProgressProvider>
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>
);

// Start background sync loop (tries to sync queued items to Supabase when online)
initSync();
