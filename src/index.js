import React from "react";
import ReactDOM from "react-dom";
import "./scss/index.scss";
import App from "./App";
import "./i18n";

const root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);

ReactDOM.render(<App />, root);
