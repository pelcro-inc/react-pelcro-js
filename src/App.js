import React from "react";
import { LoginView, RegisterView, PelcroContainer } from "./components";

function App() {
  return (
    <PelcroContainer>
      <div className="App">
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
      </div>
    </PelcroContainer>
  );
}

export default App;
