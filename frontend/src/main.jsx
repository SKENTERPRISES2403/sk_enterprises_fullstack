import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
});

createRoot(document.getElementById("root")).render(<App />);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then((registration) => registration.update().catch(() => {}))
      .catch(() => {});
  });
}
