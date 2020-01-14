import React, { useContext } from "react";

const PrivacyPolicy = props => {
  const { dispatch, state } = useContext(props.store);

  const handleInputChange = value => {
    dispatch({ type: "setPrivacyPolicy", payload: !!value });
  };

  return (
    <div {...props}>
      <input
        type="checkbox"
        id="pelcro-privacy-policy"
        onChange={e => handleInputChange(e.target.value)}
        defaultChecked={state.privacyPolicy}
        {...props}
      />
      <label
        className="pelcro-prefix-form-check-label control control-checkbox"
        htmlFor="pelcro-privacy-policy"
      >
        {props.label}
      </label>
    </div>
  );
};

export default PrivacyPolicy;
