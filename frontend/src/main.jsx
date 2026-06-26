import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { API_BASE } from "./api.js";

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
});

async function loadBootstrapCatalog() {
  if (!window.fetch) return;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 900);
  try {
    const url = new URL(`${API_BASE}/catalog`, window.location.origin);
    url.searchParams.set("_fresh", Date.now().toString());
    const response = await fetch(url.toString(), { cache: "no-store", signal: controller.signal });
    if (response.ok) window.__SK_BOOTSTRAP_CATALOG__ = await response.json();
  } catch {
    // Cached/default catalog will render if the backend is waking up.
  } finally {
    window.clearTimeout(timeout);
  }
}

function startApp() {
  createRoot(document.getElementById("root")).render(<App />);

  if ("serviceWorker" in navigator && import.meta.env.PROD) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js")
        .then((registration) => registration.update().catch(() => {}))
        .catch(() => {});
    });
  }
}

loadBootstrapCatalog().finally(startApp);
