import React from "react";
import { store } from "./RegisterContainer";
import { Email } from "../../SubComponents/Email";

export const RegisterEmail = props => <Email store={store} {...props} />;
