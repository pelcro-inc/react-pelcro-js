import React from "react";
import { store } from "./LoginContainer";
import { Password } from "../../SubComponents/Password";

export const LoginPassword = props => <Password store={store} {...props} />;
