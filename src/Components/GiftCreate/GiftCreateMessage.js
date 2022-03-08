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

  const MAX_CHARS_COUNT = 200;
  const remainingCharsCount =
    MAX_CHARS_COUNT - state.giftMessage?.length ?? 0;

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
      maxLength="200"
      rows={3}
      label={t("gift.labels.giftMessage", {
        count: remainingCharsCount
      })}
      tooltipText={t("gift.messages.giftMessageInfo")}
      {...props}
    />
  );
}
