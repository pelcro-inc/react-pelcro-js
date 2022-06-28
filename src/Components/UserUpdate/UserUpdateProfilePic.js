import React from "react";
import userSolidIcon from "../../assets/user-solid.svg";
import { ReactComponent as EditIcon } from "../../assets/edit.svg";
import { Button } from "../../SubComponents/Button";

export const UserUpdateProfilePic = ({ onClick, ...otherProps }) => {
  const profilePicture =
    window.Pelcro.user.read().profile_photo ?? userSolidIcon;

  return (
    <div className="plc-flex plc-justify-center">
      <div className="plc-relative">
        <img
          className="plc-border-white plc-border-2 plc-border-solid plc-rounded-full plc-mr-2 sm:plc-ml-2 plc-w-36 plc-h-36 plc-bg-gray-300 plc-cursor-pointer pelcro-user-update-picture"
          src={profilePicture}
          alt="profile picture"
          onClick={onClick}
          {...otherProps}
        />
        <Button
          variant="icon"
          className="plc-absolute plc-bg-gray-500 plc-text-white plc-w-10 plc-h-10 plc-top-24 plc-right-2 hover:plc-bg-gray-600 hover:plc-text-white"
          icon={<EditIcon />}
          id={"pelcro-user-update-picture-button"}
          onClick={onClick}
        />
      </div>
    </div>
  );
};
