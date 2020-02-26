import "./i18n";
import "./scss/index.scss";
import { LoginContainer } from "./Components/Login/LoginContainer";
import { Email } from "./SubComponents/Email";
import { Password } from "./SubComponents/Password";
import { ConfirmPassword } from "./SubComponents/ConfirmPassword";
import { Logout } from "./SubComponents/Logout";
import { LoginButton } from "./Components/Login/LoginButton";
import { LoginEmail } from "./Components/Login/LoginEmail";
import { LoginPassword } from "./Components/Login/LoginPassword";
import { LoginView } from "./Components/Login/LoginView";
import { RegisterContainer } from "./Components/Register/RegisterContainer";
import { RegisterView } from "./Components/Register/RegisterView";
import { RegisterEmail } from "./Components/Register/RegisterEmail";
import { RegisterPassword } from "./Components/Register/RegisterPassword";
import { RegisterButton } from "./Components/Register/RegisterButton";
import { PelcroContainer } from "./Components/PelcroContainer";
import { DashboardModal } from "./Components/Dashboard/DashboardModal";
import { LoginModal } from "./Components/Login/LoginModal";
import { RegisterModal } from "./Components/Register/RegisterModal";
import { SelectModal } from "./Components/Select/SelectModal";
import { UpdatePaymentMethodModal } from "./Components/UpdatePaymentMethod/UpdatePaymentMethodModal";
import { UpdatePaymentMethodView } from "./Components/UpdatePaymentMethod/UpdatePaymentMethodView";
import { PaymentSuccessModal } from "./Components/PaymentSuccess/PaymentSuccessModal";
import { PaymentSuccessView } from "./Components/PaymentSuccess/PaymentSuccessView";
import { NewsLetter } from "./Components/NewsLetter/NewsLetter";
import { MeterModal } from "./Components/Meter/MeterModal";
import { MeterView } from "./Components/Meter/MeterView";
import { DashboardMenu } from "./Components/Dashboard/DashboardMenu";
import {
  init as initButtons,
  authenticatedButtons,
  unauthenticatedButtons
} from "./Components/common/Buttons";

export {
  LoginContainer,
  PaymentSuccessView,
  PaymentSuccessModal,
  Email,
  Password,
  ConfirmPassword,
  LoginButton,
  LoginEmail,
  LoginPassword,
  LoginView,
  RegisterContainer,
  RegisterView,
  RegisterButton,
  RegisterEmail,
  RegisterPassword,
  PelcroContainer,
  DashboardModal,
  Logout,
  RegisterModal,
  LoginModal,
  SelectModal,
  UpdatePaymentMethodModal,
  UpdatePaymentMethodView,
  NewsLetter,
  MeterView,
  MeterModal,
  DashboardMenu,
  initButtons,
  authenticatedButtons,
  unauthenticatedButtons
};
