import React from "react";
import { usePelcro } from "./hooks/usePelcro";
import { PelcroModalController } from "./Components/PelcroModalController/PelcroModalController";
import { LoginModal } from "./Components/Login/LoginModal";
import { RegisterModal } from "./Components/Register/RegisterModal";
import { SelectModalWithHook as SelectModal } from "./Components/Select/SelectModal";

export const Main = () => {
  const { resetView, switchView } = usePelcro();
  return (
    <PelcroModalController>
      <LoginModal
        onSuccess={() => {
          resetView();
        }}
        onCreateAccountClick={() => {
          console.log("clicked on create account");
          switchView("register");
          return false;
        }}
      />

      <RegisterModal
        onSuccess={() => {
          console.log("registeration succeded");
          return false;
        }}
      />

      <SelectModal />
    </PelcroModalController>
  );
};
