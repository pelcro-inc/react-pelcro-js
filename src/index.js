import React from "react";
import ReactDOM from "react-dom";
import { Main } from "./Main";
import "./index.css";
import "./i18n";
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'

// Start Bugsnag first...
Bugsnag.start({
  apiKey: "e8f6852b322540e8c25386048b99ab01",
  plugins: [new BugsnagPluginReact()],
});

// Create the error boundary...
const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React)

const ErrorView = () => (
  <div>
    <p>Inform users of an error in the component tree.</p>
  </div>
);

const root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);

ReactDOM.render(
  <ErrorBoundary FallbackComponent={ErrorView}>
    <Main />
  </ErrorBoundary>,
  root
);
