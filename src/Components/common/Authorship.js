import React from "react";
import { ReactComponent as AuthorshipIcon } from "../../assets/pelcro-authorship.svg";

const Authorship = () => {
  return (
    <a
      href={`https://www.pelcro.com/?utm_source=${window.location.hostname}&utm_medium=direct&utm_campaign=powered_by_pelcro`}
      rel="noopener noreferrer nofollow"
      target="_blank"
      className="plc-inline-flex plc-flex-row plc-items-center plc-mt-6"
    >
      <span className="plc-inline-flex plc-text-gray-400 plc-mr-2 pelcro-authorship">
        Powered by
      </span>
      <AuthorshipIcon className="pelcro-authorship" />
    </a>
  );
};

export default Authorship;
