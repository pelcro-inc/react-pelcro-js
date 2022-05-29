import React, { useContext, useEffect } from "react";
import { Loader } from "../../SubComponents/Loader";
import { LINK_TOKEN_VERIFY } from "../../utils/action-types";
import { store } from "./VerifyLinkTokenContainer";

export const VerifyLinkTokenLoader = () => {
  useEffect(()=>{
    dispatch({ type: LINK_TOKEN_VERIFY });
  },[])

  const {
    dispatch,
    state: {  isLoading }
  } = useContext(store);

  if (isLoading) {
    return <Loader width={60} height={100} />;
  }

  return (
    <div className="plc-max-h-80 plc-overflow-y-auto pelcro-newsletters-wrapper">
    </div>
  );
};
