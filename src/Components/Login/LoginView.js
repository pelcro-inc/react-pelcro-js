import React from "react";
import {
  LoginContainer,
  LoginPassword,
  LoginButton,
  LoginEmail
} from "../../components";

export function LoginView(props) {
  return (
    <form>
      <LoginContainer {...props}>
        <label htmlFor="email">Email: </label>
        <div>
          <LoginEmail placeholder="Email Address" />
        </div>
        <label htmlFor="password">Password: </label>
        <LoginPassword />
        <LoginButton style={{ width: 150, marginLeft: 20 }} name="Login here" />
      </LoginContainer>
    </form>
  );
}

// Look into having classnames generated automatically in react. Maybe CSS in JS.
