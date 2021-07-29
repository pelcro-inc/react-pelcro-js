import React, { useContext } from "react";
import { GoogleLogin } from "react-google-login";
import { store as loginStore } from "../../Login/LoginContainer";
import { store as registerStore } from "../../Register/RegisterContainer";
import { ReactComponent as GoogleLogoIcon } from "../../../assets/google-logo.svg";
import { HANDLE_SOCIAL_LOGIN } from "../../../utils/action-types";

export const GoogleLoginButton = ({
  className = "",
  labelClassName = "",
  iconClassName = ""
}) => {
  const googleLoginEnabled = window.Pelcro.site.read()?.google_app_id;

  const { dispatch: loginDispatch } = useContext(loginStore);
  const { dispatch: registerDispatch } = useContext(registerStore);

  const onSuccess = (response) => {
    const profile = response.getBasicProfile();
    const accessToken = response.getAuthResponse()?.id_token;

    loginDispatch?.({
      type: HANDLE_SOCIAL_LOGIN,
      payload: {
        idpName: "google",
        idpToken: accessToken,
        email: profile.getEmail?.(),
        firstName: profile.getGivenName?.(),
        lastName: profile.getFamilyName?.()
      }
    });

    registerDispatch?.({
      type: HANDLE_SOCIAL_LOGIN,
      payload: {
        idpName: "google",
        idpToken: accessToken,
        email: profile.getEmail?.(),
        firstName: profile.getGivenName?.(),
        lastName: profile.getFamilyName?.()
      }
    });
  };

  const onFailure = (error) => {
    console.error(error);
  };

  return (
    googleLoginEnabled && (
      <GoogleLogin
        clientId={window.Pelcro.site.read().google_app_id}
        onSuccess={onSuccess}
        onFailure={onFailure}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            className={`plc-flex plc-items-center plc-justify-center plc-w-full plc-p-3 plc-space-x-3 plc-text-gray-700 plc-border plc-border-gray-200 plc-rounded-3xl hover:plc-bg-gray-200 pelcro-google-login ${className}`}
          >
            <GoogleLogoIcon
              className={`plc-w-6 plc-h-auto pelcro-google-login-icon" ${iconClassName}`}
            />
            <p
              className={`pelcro-google-login-label ${labelClassName}`}
            >
              Google
            </p>
          </button>
        )}
      />
    )
  );
};
