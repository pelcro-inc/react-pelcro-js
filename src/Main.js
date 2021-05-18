import React from "react";
import { usePelcro } from "./hooks/usePelcro";
import { PelcroModalController } from "./Components/PelcroModalController/PelcroModalController";
import { LoginModal } from "./Components/Login/LoginModal";
import { RegisterModal } from "./Components/Register/RegisterModal";
import { AddressUpdateModal } from "./Components/AddressUpdate/AddressUpdateModal";
import { SelectModalWithHook as SelectModal } from "./Components/Select/SelectModal";
import { DashboardWithHook as Dashboard } from "./Components/dashboard/Dashboard";
import { UserUpdateModal } from "./Components/UserUpdate/UserUpdateModal";
import { ProfilePicChangeModal } from "./Components/ProfilePicChange/ProfilePicChangeModal";

usePelcro.override((set) => {
  return {
    switchView: (view) => {
      console.log("switching to", view);
      set({ view });
    }
  };
});

export const Main = () => {
  const { resetView } = usePelcro();

  return (
    <PelcroModalController>
      <LoginModal
        onSuccess={() => {
          resetView();
        }}
      />

      <RegisterModal
        onSuccess={() => {
          console.log("registeration succeded");
          return false;
        }}
      />

      <UserUpdateModal />
      <ProfilePicChangeModal />

      <SelectModal />

      <Dashboard />

      <AddressUpdateModal />
    </PelcroModalController>
  );
};
