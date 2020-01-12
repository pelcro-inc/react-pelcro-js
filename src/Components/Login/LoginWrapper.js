import React from "react";
import { store } from "./LoginContainer";

const LoginWrapper = ({ children }) => {
  return (
    <React.Fragment>{React.cloneElement(children, { store })}}</React.Fragment>
  );
};

export default LoginWrapper;
