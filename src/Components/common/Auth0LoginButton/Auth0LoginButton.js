import React, { useContext, useState } from "react";
import { store as loginStore } from "../../Login/LoginContainer";
import { store as registerStore } from "../../Register/RegisterContainer";
import { HANDLE_SOCIAL_LOGIN } from "../../../utils/action-types";
import { ReactComponent as Auth0LogoIcon } from "../../../assets/auth0-logo.svg";

export const Auth0LoginButton = ({
  label = "Continue With Auth0",
  className = "",
  labelClassName = "",
  iconClassName = ""
}) => {
  const auth0Enabled = Boolean(
    window.Pelcro.site.read().auth0_client_id &&
      window.Pelcro.site.read().auth0_base_url
  );

  const auth0Script = document.querySelector("#auth0-sdk");
  const [auth0Loaded, setAuth0Loaded] = useState(
    Boolean(window.auth0)
  );

  React.useEffect(() => {
    function handleScriptLoaded() {
      setAuth0Loaded(true);
    }

    if (auth0Enabled && !auth0Loaded) {
      auth0Script.addEventListener("load", handleScriptLoaded);
    }

    return () => {
      auth0Script?.removeEventListener?.("load", handleScriptLoaded);
    };
  }, [auth0Script, auth0Enabled, auth0Loaded]);

  const auth0InstanceRef = React.useRef(null);
  React.useEffect(() => {
    if (
      auth0Enabled &&
      auth0Loaded &&
      auth0InstanceRef.current === null
    ) {
      auth0InstanceRef.current = new window.auth0.WebAuth({
        domain: window.Pelcro.site.read().auth0_base_url,
        clientID: window.Pelcro.site.read().auth0_client_id
      });
    }
  }, [auth0Enabled, auth0Loaded]);

  const { dispatch: loginDispatch } = useContext(loginStore);
  const { dispatch: registerDispatch } = useContext(registerStore);

  function handleClick() {
    if (!auth0Loaded) {
      return console.error(
        "Auth0 sdk script wasn't loaded, you need to load auth0 sdk before rendering the Auth0LoginButton"
      );
    }

    auth0InstanceRef.current?.popup?.authorize?.(
      {
        responseType: "token id_token",
        owp: true // close popup when finished
      },
      function (error, authResult) {
        if (error) {
          return onFailure(error);
        }

        onSuccess(authResult);
      }
    );
  }

  const onSuccess = (authResult) => {
    const { accessToken } = authResult;
    auth0InstanceRef.current?.client?.userInfo?.(
      accessToken,
      (error, user) => {
        if (error) {
          return onFailure(error);
        }

        const {
          email,
          first_name,
          last_name,
          given_name,
          family_name
        } = user;

        loginDispatch?.({
          type: HANDLE_SOCIAL_LOGIN,
          payload: {
            idpName: "auth0",
            idpToken: accessToken,
            ...((first_name || given_name) && {
              firstName: first_name || given_name
            }),
            ...((last_name || family_name) && {
              lastName: last_name || family_name
            }),
            email
          }
        });

        registerDispatch?.({
          type: HANDLE_SOCIAL_LOGIN,
          payload: {
            idpName: "auth0",
            idpToken: accessToken,
            ...((first_name || given_name) && {
              firstName: first_name || given_name
            }),
            ...((last_name || family_name) && {
              lastName: last_name || family_name
            }),
            email
          }
        });
      }
    );
  };

  const onFailure = (error) => {
    console.error(error);
  };

  if (auth0Enabled) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`plc-flex plc-items-center plc-justify-center plc-h-12 plc-px-1 plc-text-gray-700 plc-rounded-md pelcro-google-login plc-shadow-md_dark plc-bg-white hover:plc-bg-transparent plc-text-sm ${className}`}
      >
        <Auth0LogoIcon
          className={`plc-w-5 plc-h-auto pelcro-auth0-login-icon" ${iconClassName}`}
        />
        <p
          className={`pelcro-auth0-login-label plc-ml-2 ${labelClassName}`}
        >
          {label}
        </p>
      </button>
    );
  }
  return null;
};
