import React, { useContext } from "react";
import Button from "./Button";

const LoginButton = props => {
  const {
    state: { email, password }
  } = useContext(props.store);

  let isDisabled = !email && !password;

  const handleLogin = () => {
    isDisabled = true;
    window.Pelcro.user.login({ email, password }, (err, res) => {
      if (!err) {
        alert("Logged In! ", res);
      } else {
        console.log("Error! ", err);
      }
    });
  };

  return (
    <Button {...props} onClick={() => handleLogin()} disabled={isDisabled}>
      {props.name || "Login"}
    </Button>
  );
};

export default LoginButton;
