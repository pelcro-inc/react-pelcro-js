import React from "react";
import { store } from "./LoginContainer";

export const LoginWrapper = ({ children }, props) => {
  return (
    <React.Fragment>
      {React.cloneElement(children, { store, ...props })}
    </React.Fragment>
  );
};
