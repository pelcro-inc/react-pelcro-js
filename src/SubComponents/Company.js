import React, {
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import { useTranslation } from "react-i18next";
import {
  SET_COMPANY,
  SET_COMPANY_ERROR
} from "../utils/action-types";
import { Input } from "./Input";

export function Company({
  initWithUserCompany = true,
  store,
  ...otherProps
}) {
  const { t } = useTranslation("common");

  const {
    dispatch,
    state: { company: stateCompany, companyError }
  } = useContext(store);
  const [company, setCompany] = useState(stateCompany);
  const [finishedTyping, setFinishedTyping] = useState(false);

  const handleInputChange = useCallback(
    (value) => {
      setCompany(value);

      if (finishedTyping) {
        if (company?.length) {
          dispatch({
            type: SET_COMPANY,
            payload: company
          });
        } else {
          if (otherProps.required) {
            dispatch({
              type: SET_COMPANY_ERROR,
              payload: t("validation.enterCompany")
            });
          } else {
            dispatch({ type: SET_COMPANY, payload: company });
          }
        }
      }
    },
    [dispatch, company, finishedTyping] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    handleInputChange(company);
  }, [finishedTyping, company, handleInputChange]);

  // Initialize company field with user's company
  const loadCompanyIntoField = () => {
    handleInputChange(
      window.Pelcro?.user?.read()?.organization?.name
    );
    dispatch({
      type: SET_COMPANY,
      payload: window.Pelcro?.user?.read()?.organization?.name
    });
  };

  useEffect(() => {
    if (initWithUserCompany) {
      document.addEventListener("PelcroUserLoaded", () => {
        loadCompanyIntoField();
      });
      loadCompanyIntoField();

      return () => {
        document.removeEventListener(
          "PelcroUserLoaded",
          handleInputChange
        );
      };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Input
      type="text"
      error={companyError}
      value={company}
      onChange={(e) => handleInputChange(e.target.value)}
      onBlur={() => setFinishedTyping(true)}
      onFocus={() => setFinishedTyping(false)}
      {...otherProps}
    />
  );
}
