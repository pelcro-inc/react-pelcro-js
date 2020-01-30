import React from "react";
import {
  LoginContainer,
  Password,
  LoginButton,
  LoginEmail
} from "../../components";

export function LoginView(props) {
  return (
    <LoginContainer {...props}>
      <label htmlFor="email">Email: </label>
      <LoginEmail placeholder="Email Address" id="email" />
      <label htmlFor="password">Password: </label>
      <Password id="password" />
      <LoginButton style={{ width: 150, marginLeft: 20 }} name="Login here" />
    </LoginContainer>
  );
}

// Look into having classnames generated automatically in react. Maybe CSS in JS.
