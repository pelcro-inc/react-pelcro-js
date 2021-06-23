

<p align="center">
  <img src="https://docs-react-elements.pelcro.com/img/logo.png" width="100px" alt="Pelcro logo"/>
</p>

<h1 align="center" style="border-bottom: none;">Pelcro React Elements</h1>

<p align="center">
  Customize your <a href="https://www.pelcro.com/">Pelcro</a> experience for your clients needs using our React components 
</p>

<p align="center">
    <img src="https://badgen.net/bundlephobia/tree-shaking/@pelcro/react-pelcro-js">
    <img src="https://github.com/pelcro-inc/react-pelcro-js/actions/workflows/release.yml/badge.svg">
    <img src="https://github.com/pelcro-inc/react-pelcro-js/actions/workflows/tests.yml/badge.svg?branch=next">
    <img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg">
    </br>
    <img src="https://img.shields.io/npm/v/@pelcro/react-pelcro-js/latest">
    <img src="https://img.shields.io/npm/v/@pelcro/react-pelcro-js/next">
</p>


## Features

- Integrates with our JS SDK out-of-the-box 
- Supports different levels of customization, need modal-level control? use [Modals](https://docs-react-elements.pelcro.com/Modals/introduction), want fine-grained control? use [Containers](https://docs-react-elements.pelcro.com/Containers/introduction)
- Provides [`usePelcro` hook](https://docs-react-elements.pelcro.com/usePelcro) which provides a global store for all Pelcro related data and actions
- Consistent UX across different browsers
- Easy styling customization using `className` prop and regular CSS
- First-class Localization support using [react-i18next](https://react.i18next.com/)
## Documentation

For a complete reference with live examples, check the
[React Pelcro elements docs](https://docs-react-elements.pelcro.com/)

  
## Installation 

To use Pelcro components, all you need to do is install the `@pelcro/react-pelcro-js` package

```bash 
  yarn add @pelcro/react-pelcro-js

  or

  npm install @pelcro/react-pelcro-js
```
    
## Minimal example

```javascript
import React from "react";
import {
  PelcroModalController,
  Dashboard,
  DashboardOpenButton,
  SelectModal,
  LoginModal,
  RegisterModal,
  PaymentMethodUpdateModal,
  SubscriptionCreateModal,
  SubscriptionRenewModal,
  NewsLetter,
  PaymentSuccessModal,
  MeterModal,
  UserUpdateModal,
  AddressCreateModal,
  AddressUpdateModal,
  PasswordResetModal,
  PasswordForgotModal,
  CartModal,
  ShopView,
  OrderConfirmModal,
  OrderCreateModal,
  GiftCreateModal,
  GiftRedeemModal,
  PasswordChangeModal,
  AddressSelectModal,
  ProfilePicChangeModal
} from "@pelcro/react-pelcro-js";
import "@pelcro/react-pelcro-js/dist/pelcro.css";

export default function Main() {
  return (
    <>
      <button className="pelcro-login-button">Login</button>
      <button className="pelcro-subscribe-button">Subscribe</button>

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
        <NewsLetter />
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
    </>
  );
}

```

  
## License

[MIT](https://choosealicense.com/licenses/mit/)

  
