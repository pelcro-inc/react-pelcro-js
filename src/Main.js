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
import { PasswordForgotModal } from "./Components/PasswordForgot/PasswordForgotModal";
import { PasswordChangeModal } from "./Components/PasswordChange/PasswordChangeModal";
import { PasswordResetModal } from "./Components/PasswordReset/PasswordResetModal";
import { MeterModal } from "./Components/Meter/MeterModal";
import { DashboardOpenButton } from "./Components/dashboard/DashboardOpenButton";
import { NewsletterWithHook as Newsletter } from "./Components/NewsLetter/NewsLetter";
import { AddressCreateModal } from "./Components/AddressCreate/AddressCreateModal";
import { AddressSelectModal } from "./Components/AddressSelect/AddressSelectModal";
import { CartModal } from "./Components/Cart/CartModal";
import { ShopView } from "./Components/Shop/ShopView";
import { SubscriptionCreateModal } from "./Components/SubscriptionCreate/SubscriptionCreateModal";
import { SubscriptionRenewModal } from "./Components/SubscriptionRenew/SubscriptionRenewModal";
import { PaymentSuccessModal } from "./Components/PaymentSuccess/PaymentSuccessModal";
import { OrderCreateModal } from "./Components/OrderCreate/OrderCreateModal";
import { OrderConfirmModalWithHook as OrderConfirmModal } from "./components/OrderConfirm/OrderConfirmModal";

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
      <MeterModal />
      <LoginModal />
      <RegisterModal />

      <UserUpdateModal />
      <Dashboard />
      <DashboardOpenButton />
      <ProfilePicChangeModal />
      <PasswordForgotModal />
      <PasswordChangeModal />
      <PasswordResetModal />

      <SelectModal />
      <Newsletter />

      <AddressCreateModal />
      <AddressSelectModal />
      <AddressUpdateModal />

      <SubscriptionCreateModal />
      <SubscriptionRenewModal />
      <PaymentSuccessModal />

      <GiftCreateModal />
      <GiftRedeemModal />

      <ShopView />
      <CartModal />
      <OrderCreateModal />
      <OrderConfirmModal />
    </PelcroModalController>
  );
};
