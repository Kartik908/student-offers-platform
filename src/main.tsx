import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import { LazyPostHogProvider } from "./lib/LazyPostHogProvider";

// Environment variables are loaded automatically by Vite

createRoot(document.getElementById("root")!).render(
  <LazyPostHogProvider>
    <App />
  </LazyPostHogProvider>
);