import React from "react";
import {
  LoginContainer,
  Email,
  Password,
  LoginButton,
  LoginWrapper
} from "../../components";

export default function Login(props) {
  return (
    <LoginContainer {...props}>
      <label htmlFor="email">Email: </label>
      <LoginWrapper>
        <Email placeholder="Email Address" id="email" />
      </LoginWrapper>
      <label htmlFor="password">Password: </label>
      <Password id="password" />
      <LoginButton style={{ width: 150, marginLeft: 20 }} name="Login here" />
    </LoginContainer>
  );
}
