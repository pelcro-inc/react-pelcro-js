// Register view.
// Sign up form. It is displayed after the plan is selected (after Select view) if user is not authenticated.

import React, { Component } from "react";
import ErrMessage from "../common/ErrMessage";
import PropTypes from "prop-types";
import { getErrorMessages } from "../common/Helpers";

import localisation from "../../utils/localisation";
import { showError } from "../../utils/showing-error";

import Header from "../common/Header";
import Authorship from "../common/Authorship";
import Submit from "../common/Submit";

import { RegisterView } from "./RegisterView";

export class RegisterModal extends Component {
  constructor(props) {
    super(props);

    this.locale = localisation("register").getLocaleData();
    this.state = {
      disableSubmit: false,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      title: props.product
        ? this.props.product.paywall.register_title
        : this.locale.title,
      subtitle: props.product
        ? this.props.product.paywall.register_subtitle
        : this.locale.subtitle
    };

    this.closeButton = window.Pelcro.paywall.displayCloseButton();

    this.register = this.register.bind(this);
    this.displayLoginView = this.displayLoginView.bind(this);
    this.displaySelectView = this.displaySelectView.bind(this);

    // States change
    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this);
  }

  componentDidMount = () => {
    window.Pelcro.insight.track("Modal Displayed", {
      name: "register"
    });

    this.props.ReactGA.event({
      category: "VIEWS",
      action: "Register Modal Viewed",
      nonInteraction: true
    });

    document.addEventListener("keydown", this.handleSubmit);
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleSubmit);
  };

  handleSubmit = e => {
    if (e.key === "Enter" && !this.state.disableSubmit) this.register();
  };

  // inserting error message into modal window
  showError = message => {
    showError(message, "pelcro-error-register");
  };

  register = () => {
    this.setState({ disableSubmit: true });

    window.Pelcro.user.register(
      {
        email: this.state.email,
        password: this.state.password
      },
      (err, res) => {
        this.setState({ disableSubmit: false });

        if (err) return this.showError(getErrorMessages(err));

        this.props.ReactGA.event({
          category: "ACTIONS",
          action: "Registered",
          nonInteraction: true
        });

        this.props.loggedIn();

        // If product and plan are not selected
        if (!this.props.product && !this.props.order && !this.props.giftCode) {
          return this.props.resetView();
        }

        // If this is a redeem gift
        if (this.props.giftCode) {
          return this.props.setView("address");
        } else {
          // Check if the subscription is meant as a gift (if so, gather recipients info)
          if (!this.props.isGift) {
            if (this.props.order) {
              this.props.setView("address");
            } else {
              if (
                this.props.product.address_required ||
                this.props.site.taxes_enabled
              ) {
                return this.props.setView("address");
              } else {
                this.props.setView("payment");
              }
            }
          } else {
            this.props.setView("gift");
          }
        }
      }
    );
  };

  displayLoginView = () => {
    this.props.setView("login");
  };

  displaySelectView = () => {
    this.props.setView("select");
  };

  onFirstNameChange(event) {
    this.setState({ firstName: event.target.value });
  }

  onLastNameChange(event) {
    this.setState({ lastName: event.target.value });
  }

  onEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  onPasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  onConfirmPasswordChange(event) {
    this.setState({ confirmPassword: event.target.value });
  }

  render() {
    return (
      <div className="pelcro-prefix-view">
        <div
          className="pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show"
          id="pelcro-view-register"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div className="pelcro-prefix-modal-dialog pelcro-prefix-modal-dialog-centered">
            <div className="pelcro-prefix-modal-content" role="document">
              <Header
                closeButton={this.closeButton}
                resetView={this.props.resetView}
                site={this.props.site}
              ></Header>
              <div className="pelcro-prefix-modal-body">
                <div className="pelcro-prefix-title-block">
                  <h4>{this.state.title}</h4>
                  <p>{this.state.subtitle}</p>
                </div>

                <ErrMessage name="register" />

                <div className="pelcro-prefix-form">
                  <div className="pelcro-prefix-row">
                    <RegisterView />

                    <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
                      * {this.locale.labels.required}
                    </small>

                    <p className="pelcro-prefix-small-text">
                      {this.locale.messages.iAgree.iAgree + " "}
                      <a
                        className="pelcro-prefix-link"
                        target="new"
                        href="https://www.pelcro.com/terms"
                      >
                        {this.locale.messages.iAgree.terms}
                      </a>{" "}
                      {this.locale.messages.iAgree.and}{" "}
                      <a
                        className="pelcro-prefix-link"
                        target="new"
                        href="https://www.pelcro.com/privacy"
                      >
                        {this.locale.messages.iAgree.privacy}
                      </a>
                    </p>
                  </div>
                </div>
                <div className="pelcro-prefix-modal-footer">
                  <small>
                    {this.locale.messages.alreadyHaveAccount + " "}
                    <button
                      className="pelcro-prefix-link"
                      onClick={this.displayLoginView}
                    >
                      {this.locale.messages.loginHere}
                    </button>
                    {" " + this.locale.messages.selectPlan}
                    <button
                      className="pelcro-prefix-link"
                      onClick={this.displaySelectView}
                    >
                      {this.locale.messages.here}
                    </button>
                  </small>
                  <Authorship></Authorship>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RegisterModal.propTypes = {
  site: PropTypes.object,
  plan: PropTypes.object,
  product: PropTypes.object,
  isGift: PropTypes.bool,
  setView: PropTypes.func,
  resetView: PropTypes.func,
  loggedIn: PropTypes.func,
  giftCode: PropTypes.string
};
