import React from "react";
import { ReactComponent as AuthorshipIcon } from "../../assets/pelcro-authorship.svg";

const Authorship = () => {
  return (
    <a
      href={`https://www.pelcro.com/?utm_source=${window.location.hostname}&utm_medium=direct&utm_campaign=powered_by_pelcro`}
      rel="noopener noreferrer nofollow"
      target="_blank"
    >
      <AuthorshipIcon className="plc-h-12 pelcro-authorship" />
    </a>
  );
};

export default Authorship;
