import React from "react";
import { ReactComponent as AuthorshipIcon } from "../../assets/pelcro-authorship.svg";

const Authorship = () => {
  return (
    <a
    href={`https://www.pelcro.com/?utm_source=${window.location.hostname}&utm_medium=direct&utm_campaign=powered_by_pelcro`}
    rel="noopener noreferrer nofollow" 
    target="_blank"
    className="inline-flex flex-row items-center px-4 py-2  border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
  >
    <span className="text-gray-500 text-sm mr-2 pelcro-authorship">Powered by</span>
    <AuthorshipIcon className="pelcro-authorship h-4" />
  </a>
  );
};

export default Authorship;
