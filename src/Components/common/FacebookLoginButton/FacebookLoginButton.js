import React, { useContext } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { store as loginStore } from "../../Login/LoginContainer";
import { store as registerStore } from "../../Register/RegisterContainer";
import { ReactComponent as FacebookLogoIcon } from "../../../assets/facebook-logo.svg";
import { HANDLE_SOCIAL_LOGIN } from "../../../utils/action-types";
import { getPageOrDefaultLanguage } from "../../../utils/utils";

export const FacebookLoginButton = ({
  label = "Facebook",
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

  return facebookLoginEnabled ? (
    <FacebookLogin
      appId={window.Pelcro.site.read().facebook_app_id}
      language={getPageOrDefaultLanguage()}
      fields="first_name,last_name,email,picture"
      callback={onSuccess}
      onFailure={onFailure}
      render={(renderProps) => (
        <button
          onClick={renderProps.onClick}
          className="group flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100">
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#1877F2"
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
          {label}
        </button>

      )}
    />
  ) : null;
};
