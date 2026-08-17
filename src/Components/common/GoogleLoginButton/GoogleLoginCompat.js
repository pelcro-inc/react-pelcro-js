import React from 'react';
import { useGoogleLogin } from '../../../hooks/useGoogleLogin';

export const GoogleLogin = ({ clientId, onSuccess, onFailure, render }) => {
  const { createLogin, isGoogleLoaded, isLoading } = useGoogleLogin();

  const loginProps = createLogin(onSuccess, onFailure, clientId);

  // If render prop is provided, use it (maintains compatibility)
  if (render && typeof render === 'function') {
    return render({
      onClick: loginProps.onClick,
      disabled: loginProps.disabled || isLoading
    });
  }

  // Fallback button if no render prop (shouldn't happen in current usage)
  return (
    <button
      onClick={loginProps.onClick}
      disabled={loginProps.disabled || isLoading}
      className="google-login-button"
    >
      {isLoading ? 'Loading...' : 'Sign in with Google'}
    </button>
  );
};
