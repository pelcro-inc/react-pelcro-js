import React from "react";
import {
  RegisterContainer,
  RegisterEmail,
  RegisterPassword,
  RegisterButton
} from "../../components";

export function RegisterView(props) {
  return (
    <RegisterContainer {...props}>
      <label htmlFor="email">Email: </label>
      <RegisterEmail placeholder="Email Address" id="email" />
      <label htmlFor="password">Password: </label>
      <RegisterPassword id="password" />
      <RegisterButton
        style={{ width: 150, marginLeft: 20 }}
        name="Register here"
      />
    </RegisterContainer>
  );
}
