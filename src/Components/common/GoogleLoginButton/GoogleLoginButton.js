import React, { useContext } from "react";
// import { GoogleLogin } from "react-google-login";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { store as loginStore } from "../../Login/LoginContainer";
import { store as registerStore } from "../../Register/RegisterContainer";
import { ReactComponent as GoogleLogoIcon } from "../../../assets/google-logo.svg";
import { HANDLE_SOCIAL_LOGIN } from "../../../utils/action-types";

export const GoogleLoginButton = ({
  label = "Google",
  className = "",
  labelClassName = "",
  iconClassName = ""
}) => {
  const googleLoginEnabled = window.Pelcro.site.read()?.google_app_id;

  const { dispatch: loginDispatch } = useContext(loginStore);
  const { dispatch: registerDispatch } = useContext(registerStore);

  const onSuccess = (response) => {
    console.log(response);
    fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
      headers: {
        Authorization: `Bearer ${response.access_token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        loginDispatch?.({
          type: HANDLE_SOCIAL_LOGIN,
          payload: {
            idpName: "google",
            idpToken: response.access_token,
            email: data.email,
            firstName: data.given_name,
            lastName: data.family_name
          }
        });

        registerDispatch?.({
          type: HANDLE_SOCIAL_LOGIN,
          payload: {
            idpName: "google",
            idpToken: response.access_token,
            email: data.email,
            firstName: data.given_name,
            lastName: data.family_name
          }
        });
      });
  };

  const onFailure = (error) => {
    console.error(error);
  };

  const login = useGoogleLogin({
    onSuccess: onSuccess,
    onError: onFailure,
  });

  return googleLoginEnabled ? (
    <button
      onClick={login}
      className={`plc-flex plc-items-center plc-justify-center plc-p-3 plc-space-x-3 plc-text-gray-700 plc-border plc-border-gray-200 plc-rounded-3xl hover:plc-bg-gray-200 pelcro-google-login ${className}`}
    >
      <GoogleLogoIcon
        className={`plc-w-6 plc-h-auto pelcro-google-login-icon" ${iconClassName}`}
      />
      <p className={`pelcro-google-login-label ${labelClassName}`}>
        {label}
      </p>
    </button>
  ) : null;
};
