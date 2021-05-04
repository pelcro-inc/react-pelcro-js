import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Main } from "./Main";
import "./i18n";
import { withTranslation } from "react-i18next";

const root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);

// const AppWithTrans = withTranslation("common")(App);
ReactDOM.render(<Main />, root);
