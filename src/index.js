import React from "react";
import ReactDOM from "react-dom/client";
import { Main } from "./Main";
import "./index.css";
import "./i18n";

// Check if the root element exists, if not, create it
const rootElement = document.getElementById("root") || createRootElement();

function createRootElement() {
  const root = document.createElement("div");
  root.id = "root";
  document.body.appendChild(root); // Append it to the body
  return root;
}

// Use React 18's createRoot API
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
