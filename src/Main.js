import React from "react";
import { PelcroModalController } from "./Components/PelcroModalController/PelcroModalController";
import { LoginModal } from "./Components/Login/LoginModal";
import { VerifyLinkTokenModal } from "./Components/VerifyLinkToken/VerifyLinkTokenModal";
import { RegisterModal } from "./Components/Register/RegisterModal";
import { AddressUpdateModal } from "./Components/AddressUpdate/AddressUpdateModal";
import { SelectModalWithHook as SelectModal } from "./Components/Select/SelectModal";
import { DonationModalWithHook as DonationModal } from "./Components/Donation/DonationModal";
import { DashboardWithHook as Dashboard } from "./Components/dashboard/Dashboard";
import { UserUpdateModal } from "./Components/UserUpdate/UserUpdateModal";
import { ProfilePicChangeModal } from "./Components/ProfilePicChange/ProfilePicChangeModal";
import { PaymentMethodUpdateModal } from "./Components/PaymentMethodUpdate/PaymentMethodUpdateModal";
import { PaymentMethodSelectModal } from "./Components/PaymentMethodSelect/PaymentMethodSelectModal";
import { GiftCreateModal } from "./Components/GiftCreate/GiftCreateModal";
import { GiftRedeemModal } from "./Components/GiftRedeem/GiftRedeemModal";
import { PasswordForgotModal } from "./Components/PasswordForgot/PasswordForgotModal";
import { PasswordlessRequestModal } from "./Components/PasswordlessRequest/PasswordlessRequestModal";
import { PasswordChangeModal } from "./Components/PasswordChange/PasswordChangeModal";
import { PasswordResetModal } from "./Components/PasswordReset/PasswordResetModal";
import { MeterModal } from "./Components/Meter/MeterModal";
import { DashboardOpenButton } from "./Components/dashboard/DashboardOpenButton";
import { NewsletterWithHook as Newsletter } from "./Components/NewsLetter/NewsLetter";
import { NewsletterUpdateModal } from "./Components/NewsletterUpdate/NewsletterUpdateModal";
import { AddressCreateModal } from "./Components/AddressCreate/AddressCreateModal";
import { AddressSelectModal } from "./Components/AddressSelect/AddressSelectModal";
import { CartModal } from "./Components/Cart/CartModal";
import { ShopView } from "./Components/Shop/ShopView";
import { SubscriptionCreateModal } from "./Components/SubscriptionCreate/SubscriptionCreateModal";
import { SubscriptionRenewModal } from "./Components/SubscriptionRenew/SubscriptionRenewModal";
import { SubscriptionCancelModal } from "./Components/SubscriptionCancel/SubscriptionCancelModal";
import { SubscriptionSuspendModal } from "./Components/SubscriptionSuspend/SubscriptionSuspendModal";
import { PaymentSuccessModal } from "./Components/PaymentSuccess/PaymentSuccessModal";
import { OrderCreateModal } from "./Components/OrderCreate/OrderCreateModal";
import { OrderConfirmModal } from "./Components/OrderConfirm/OrderConfirmModal";
import { Notification } from "./SubComponents/Notification";
import { EmailVerifyModal } from "./Components/EmailVerify/EmailVerifyModal";
import { InvoiceDetailsModal } from "./Components/InvoiceDetails/InvoiceDetailsModal";
import { InvoicePaymentModal } from "./Components/InvoicePayment/InvoicePaymentModal";
import { QrCodeModal } from "./Components/QrCode/QrCodeModal";
import { SubscriptionManageMembersModal } from "./components";
import { PaymentMethodDeleteModal } from "./Components/PaymentMethodDelete/PaymentMethodDeleteModal";

export const Main = () => {
  return (
    <PelcroModalController>
      <MeterModal />
      <EmailVerifyModal />
      <LoginModal />
      <VerifyLinkTokenModal />
      <RegisterModal />

      <UserUpdateModal />
      <Dashboard />
      <DashboardOpenButton />
      <ProfilePicChangeModal />
      <PasswordForgotModal />
      <PasswordlessRequestModal />
      <PasswordChangeModal />
      <PasswordResetModal />

      <PaymentMethodUpdateModal />
      <PaymentMethodSelectModal />
      <PaymentMethodDeleteModal />

      <SelectModal />
      <DonationModal />
      <Newsletter />
      <NewsletterUpdateModal />

      <AddressCreateModal />
      <AddressSelectModal />
      <AddressUpdateModal />

      <SubscriptionCreateModal />
      <SubscriptionRenewModal />
      <SubscriptionCancelModal />
      <SubscriptionSuspendModal />
      <SubscriptionManageMembersModal />
      <PaymentSuccessModal />

      <GiftCreateModal />
      <GiftRedeemModal />

      <ShopView />
      <CartModal />
      <OrderCreateModal />
      <OrderConfirmModal />

      <InvoicePaymentModal />
      <InvoiceDetailsModal />

      <QrCodeModal />

      <Notification />
    </PelcroModalController>
  );
};
