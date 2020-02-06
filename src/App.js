import React from "react";
import ReactGA from "react-ga";
import {
  LoginView,
  RegisterView,
  PelcroContainer,
  DashboardModal
} from "./components";

function App() {
  return (
    <PelcroContainer>
      <div id="pelcro-app">
        <div id="list">
          <h2>Pelcro Elements Demo</h2>{" "}
          <span>{window.Pelcro.user.isAuthenticated() && "Authenticated"}</span>
          <div style={{ border: "1px solid black" }}>
            <h3>Login Component</h3>
            <LoginView />
          </div>
          <div style={{ border: "1px solid black" }}>
            <h3>Registeration Component</h3>
            <RegisterView />
          </div>
          <DashboardModal ReactGA={ReactGA} />
        </div>
      </div>
    </PelcroContainer>
  );
}

export default App;
