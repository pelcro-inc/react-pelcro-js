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
import { GiftCreateModal } from "./Components/GiftCreate/GiftCreateModal";
import { GiftRedeemModal } from "./Components/GiftRedeem/GiftRedeemModal";

usePelcro.override((set, get) => {
  return {
    switchView: (view) => {
      console.log("switching from", get().view, "to", view);
      set({ view });
    }
  };
});

export const Main = () => {
  const {} = usePelcro();

  return (
    <PelcroModalController>
      <LoginModal />

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

      <GiftCreateModal />
      <GiftRedeemModal />
    </PelcroModalController>
  );
};
