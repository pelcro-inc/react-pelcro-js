import React, { useContext } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { store as loginStore } from "../../Login/LoginContainer";
import { store as registerStore } from "../../Register/RegisterContainer";
import { ReactComponent as FacebookLogoIcon } from "../../../assets/facebook-logo.svg";
import { HANDLE_SOCIAL_LOGIN } from "../../../utils/action-types";

export const FacebookLoginButton = ({
  className = "",
  labelClassName = "",
  iconClassName = ""
}) => {
  const facebookLoginEnabled =
    window.Pelcro.site.read()?.facebook_app_id;

  const { dispatch: loginDispatch } = useContext(loginStore);
  const { dispatch: registerDispatch } = useContext(registerStore);

  const onSuccess = (facebookUser) => {
    loginDispatch?.({
      type: HANDLE_SOCIAL_LOGIN,
      payload: {
        idpName: "facebook",
        idpToken: facebookUser?.accessToken,
        email: facebookUser?.email,
        firstName: facebookUser?.first_name,
        lastName: facebookUser?.last_name
      }
    });

    registerDispatch?.({
      type: HANDLE_SOCIAL_LOGIN,
      payload: {
        idpName: "facebook",
        idpToken: facebookUser?.accessToken,
        email: facebookUser?.email,
        firstName: facebookUser?.first_name,
        lastName: facebookUser?.last_name
      }
    });
  };

  const onFailure = (error) => {
    console.error(error);
  };

  return (
    facebookLoginEnabled && (
      <FacebookLogin
        appId={window.Pelcro.site.read().facebook_app_id}
        language={window.Pelcro.site.read().default_locale ?? "en_US"}
        fields="first_name,last_name,email,picture"
        callback={onSuccess}
        onFailure={onFailure}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            className={`plc-flex plc-items-center plc-justify-center plc-w-full plc-p-3 plc-space-x-3 plc-text-gray-700 plc-border plc-border-gray-200 plc-rounded-3xl hover:plc-bg-gray-200 pelcro-facebook-login ${className}`}
          >
            <FacebookLogoIcon
              className={`plc-w-3 plc-h-auto pelcro-facebook-login-icon ${iconClassName}`}
            />
            <p
              className={`pelcro-facebook-login-label ${labelClassName}`}
            >
              Facebook
            </p>
          </button>
        )}
      />
    )
  );
};
