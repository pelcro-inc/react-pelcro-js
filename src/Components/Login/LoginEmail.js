import React from "react";
import { store } from "./LoginContainer";
import { Email } from "../../SubComponents/Email";

export const LoginEmail = props => <Email store={store} {...props} />;
