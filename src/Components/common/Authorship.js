import React from "react";
import { ReactComponent as AuthorshipIcon } from "../../assets/pelcro-authorship.svg";

const Authorship = () => {
  return (
    <a
      href={`https://www.pelcro.com/?utm_source=${window.location.hostname}&utm_medium=direct&utm_campaign=powered_by_pelcro`}
      rel="noopener noreferrer nofollow"
      target="_blank"
      className="plc-inline-flex plc-flex-row plc-items-center plc-px-4 plc-py-2 plc-border plc-border-gray-200 plc-rounded-lg hover:plc-bg-gray-50 plc-transition-colors"
    >
      <span className="plc-text-gray-500 plc-text-sm plc-mr-2 pelcro-authorship">Powered by</span>
      <AuthorshipIcon className="pelcro-authorship plc-h-4" />
    </a>
  );
};

export default Authorship;
