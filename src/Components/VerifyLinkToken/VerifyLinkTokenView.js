import React from "react";
import { VerifyLinkTokenContainer } from "./VerifyLinkTokenContainer";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { VerifyLinkTokenLoader } from "./VerifyLinkTokenLoader";

export function VerifyLinkTokenView(props) {
  return (
    <div id="pelcro-login-view">
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <VerifyLinkTokenContainer {...props}>
          <VerifyLinkTokenLoader />
          <AlertWithContext />
        </VerifyLinkTokenContainer>
      </form>
    </div>
  );
}
