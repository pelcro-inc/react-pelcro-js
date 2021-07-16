import React from "react";
import { PelcroModalController } from "./Components/PelcroModalController/PelcroModalController";
import { LoginModal } from "./Components/Login/LoginModal";
import { RegisterModal } from "./Components/Register/RegisterModal";
import { AddressUpdateModal } from "./Components/AddressUpdate/AddressUpdateModal";
import { SelectModalWithHook as SelectModal } from "./Components/Select/SelectModal";
import { DashboardWithHook as Dashboard } from "./Components/dashboard/Dashboard";
import { UserUpdateModal } from "./Components/UserUpdate/UserUpdateModal";
import { ProfilePicChangeModal } from "./Components/ProfilePicChange/ProfilePicChangeModal";
import { PaymentMethodUpdateModal } from "./Components/PaymentMethodUpdate/PaymentMethodUpdateModal";
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
import { OrderConfirmModal } from "./Components/OrderConfirm/OrderConfirmModal";
import { Toaster } from "./SubComponents/Toast";

export const Main = () => {
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
      <PaymentMethodUpdateModal />

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

      <Toaster />
    </PelcroModalController>
  );
};
