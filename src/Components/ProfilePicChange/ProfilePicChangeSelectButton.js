import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { store } from "./ProfilePicChangeContainer";
import { ReactComponent as PhotoIcon } from "../../assets/photograph.svg";
import { CHANGE_IMAGE_FILE } from "../../utils/action-types";

export const ProfilePicChangeSelectButton = ({
  name,
  ...otherProps
}) => {
  const { dispatch } = useContext(store);

  const { t } = useTranslation("userEdit");

  return (
    <>
      <Button
        icon={<PhotoIcon />}
        isFullWidth={true}
        onClick={browseFiles}
        aria-controls="fileupload"
        {...otherProps}
      >
        {name ?? t("labels.selectImage")}
      </Button>
      <input
        id="pelcro-profile-picture-selector"
        type="file"
        onChange={(e) =>
          dispatch({
            type: CHANGE_IMAGE_FILE,
            payload: e.target.files
          })
        }
        accept="image/*"
        aria-hidden={true}
        className="plc-hidden"
      />
    </>
  );
};

const browseFiles = () => {
  const fileInput = document.getElementById(
    "pelcro-profile-picture-selector"
  );
  if (fileInput) {
    fileInput.click();
  }
};
