import React from "react";
import ReactDOM from "react-dom";
import { Main } from "./Main";
import "./index.css";
import "./i18n";
import Bugsnag from "@bugsnag/js";

Bugsnag.start({
  apiKey: "e8f6852b322540e8c25386048b99ab01",
  autoDetectErrors: false,
  enabledReleaseStages: ["development"],
  redactedKeys: [
    "security_key",
    "password",
    "password_confirmation",
    "auth_token",
    "token"
  ]
});

const root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);

ReactDOM.render(<Main />, root);
