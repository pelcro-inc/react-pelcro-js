import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { store } from "./GiftCreateContainer";
import { Loader } from "../../SubComponents/Loader";
import { SET_GIFT_MESSAGE } from "../../utils/action-types";
import { TextArea } from "../../SubComponents/TextArea";

/**
 *
 */
export function GiftCreateMessage(props) {
  const { t } = useTranslation("register");
  const { dispatch, state } = useContext(store);

  const handleInputChange = (value) => {
    dispatch({ type: SET_GIFT_MESSAGE, payload: value });
  };

  if (state.loading) {
    return <Loader />;
  }

  return (
    <TextArea
      onChange={(e) => handleInputChange(e.target.value)}
      value={state.giftMessage}
      maxLength="500"
      rows={3}
      tooltipText={t("gift.messages.giftMessageInfo")}
      {...props}
    />
  );
}
