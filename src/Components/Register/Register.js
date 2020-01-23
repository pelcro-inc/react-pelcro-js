import React from "react";
import {
  RegisterContainer,
  Email,
  Password,
  RegisterButton,
  RegisterWrapper
} from "../../components";

export function Register(props) {
  return (
    <RegisterContainer {...props}>
      <label htmlFor="email">Email: </label>
      <RegisterWrapper>
        <Email placeholder="Email Address" id="email" />
      </RegisterWrapper>
      <label htmlFor="password">Password: </label>
      <Password id="password" />
      <RegisterButton
        style={{ width: 150, marginLeft: 20 }}
        name="Register here"
      />
    </RegisterContainer>
  );
}
