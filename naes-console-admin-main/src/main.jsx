import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom"; // 切回 BrowserRouter
import App from "./App";
import "./index.css";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
