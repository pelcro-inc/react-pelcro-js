import React from "react";
import "./App.css";
import { LoginContainer } from "./Components/Login/LoginContainer";
import Email from "./SubComponents/Email";
import Password from "./SubComponents/Password";
import LoginButton from "./SubComponents/LoginButton";
import LoginWrapper from "./Components/Login/LoginWrapper";

function App() {
  return (
    <div className="App">
      <h2>Pelcro Elements Demo</h2>
      <h3>Login Component</h3>
      <LoginContainer>
        <label htmlFor="email">Email: </label>
        <LoginWrapper>
          <Email placeholder="Email Address" id="email" />
        </LoginWrapper>
        <label htmlFor="password">Password: </label>
        <Password id="password" />
        <LoginButton style={{ width: 150, marginLeft: 20 }} name="Login here" />
      </LoginContainer>
    </div>
  );
}

export default App;
