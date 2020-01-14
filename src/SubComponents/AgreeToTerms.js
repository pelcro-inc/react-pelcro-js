import React, { useContext } from "react";

const AgreeToTerms = props => {
  const { dispatch, state } = useContext(props.store);

  const handleInputChange = value => {
    dispatch({ type: "setAgreeToTerms", payload: !!value });
  };

  return (
    <div {...props}>
      <input
        type="checkbox"
        id="pelcro-terms-of-service"
        onChange={e => handleInputChange(e.target.value)}
        defaultChecked={state.agreeToTerms}
        {...props}
      />
      <label
        className="pelcro-prefix-form-check-label control control-checkbox"
        htmlFor="pelcro-terms-of-service"
      >
        {props.label}
      </label>
    </div>
  );
};

export default AgreeToTerms;
