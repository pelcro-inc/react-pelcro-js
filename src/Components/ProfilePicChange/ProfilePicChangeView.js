import React from "react";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { ProfilePicChangeContainer } from "./ProfilePicChangeContainer";
import { ProfilePicChangeWrapper } from "./ProfilePicChangeWrapper";

export const ProfilePicChangeView = (props) => {
  return (
    <div id="pelcro-profile-picture-view">
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <ProfilePicChangeContainer {...props}>
          <AlertWithContext />
          <ProfilePicChangeWrapper />
        </ProfilePicChangeContainer>
      </form>
    </div>
  );
};
