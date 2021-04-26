import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { SET_ZOOM } from "../../utils/action-types";
import { store } from "./ProfilePicChangeContainer";

export const ProfilePicChangeZoom = ({
  className = "",
  ...otherProps
}) => {
  const {
    state: { zoom },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("userEdit");

  return (
    <div
      className={`plc-flex plc-flex-col plc-items-center ${className}`}
    >
      <label
        htmlFor="pelcro-picture-zoom-input"
        className="plc-text-gray-700"
      >
        {t("labels.zoom")}
      </label>
      <input
        type="range"
        id="pelcro-picture-zoom-input"
        min="1"
        max="4"
        step="0.1"
        value={zoom}
        onChange={(e) =>
          dispatch({
            type: SET_ZOOM,
            payload: Number(e.target.value)
          })
        }
        {...otherProps}
      />
    </div>
  );
};
