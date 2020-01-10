import React from "react";
import "./App.css";
import LoginContainer from "./Components/Login/LoginContainer";
import Email from "./SubComponents/Email";
import Password from "./SubComponents/Password";
import LoginButton from "./SubComponents/LoginButton";

function App() {
  return (
    <div className="App">
      <h2>Pelcro Elements Demo</h2>
      <h3>Login Component</h3>
      <LoginContainer styles={{ border: "1px solid blue" }}>
        <label htmlFor="email">Email: </label>
        <Email
          placeholder="Email Address"
          style={{ color: "red" }}
          id="email"
        />
        <label htmlFor="password">Password: </label>
        <Password id="password" />
        <LoginButton style={{ width: 150, marginLeft: 20 }} name="Login here" />
      </LoginContainer>
    </div>
  );
}

export default App;
