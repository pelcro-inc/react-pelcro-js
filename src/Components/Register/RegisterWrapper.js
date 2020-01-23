import React from "react";
import { store } from "./RegisterContainer";

export const RegisterWrapper = ({ children }, props) => {
  return (
    <React.Fragment>
      {React.cloneElement(children, { store, ...props })}
    </React.Fragment>
  );
};
