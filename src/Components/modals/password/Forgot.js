// Newsletter view.
// The emaill form. Allows users to get free articles by entering their email.

import React, { Component } from "react";
import ErrMessage from "../../common/ErrMessage";
import AlertSuccess from "../../common/AlertSuccess";
import PropTypes from "prop-types";
import localisation from "../../../utils/localisation";
import { getErrorMessages } from "../../common/Helpers";

import {
  showError,
  showSuccess
} from "../../../utils/showing-error";

import Header from "../../common/Header";
import Authorship from "../../common/Authorship";
import Submit from "../../common/Submit";

class Forgot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disableSubmit: false,
      email: ""
    };

    this.locale = localisation("password-forgot").getLocaleData();

    this.submitForgotPassword = this.submitForgotPassword.bind(this);
    this.displayLoginView = this.displayLoginView.bind(this);

    this.site = window.Pelcro.site.read();
    this.closeButton = window.Pelcro.paywall.displayCloseButton();

    this.onEmailChange = this.onEmailChange.bind(this);
  }

  componentDidMount = () => {
    document.addEventListener("keydown", this.handleSubmit);

    this.props.ReactGA.event({
      category: "VIEWS",
      action: "Forgot Password Modal Viewed",
      nonInteraction: true
    });
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleSubmit);
  };

  handleSubmit = e => {
    if (e.key === "Enter" && !this.state.disableSubmit)
      this.submitForgotPassword();
  };

  // inserting error message into modal window
  showError = message => {
    showError(message, "pelcro-error-password-forgot");
  };

  showSuccess = message => {
    showSuccess(message, "pelcro-success-password-forgot");
  };

  displayLoginView = () => {
    this.props.setView("login");
  };

  submitForgotPassword = function() {
    this.setState({ disableSubmit: true });

    window.Pelcro.password.forgot(
      { email: this.state.email },
      (err, res) => {
        this.setState({ disableSubmit: false });

        if (err) return this.showError(getErrorMessages(err));

        this.showSuccess(this.locale.passwordResetEmailSent);
      }
    );
  };

  onEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  render() {
    return (
      <div className="pelcro-prefix-view">
        <div
          className="pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show"
          id="pelcro-view-password-forgot"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div
            className="pelcro-prefix-modal-dialog pelcro-prefix-modal-dialog-centered"
            role="document"
          >
            <div className="pelcro-prefix-modal-content">
              <Header
                closeButton={this.closeButton}
                resetView={this.props.resetView}
                site={this.site}
              ></Header>
              <div className="pelcro-prefix-modal-body">
                <div className="pelcro-prefix-title-block">
                  <h4>{this.locale.title}</h4>
                  <p>{this.locale.subtitle}</p>
                </div>

                <ErrMessage name="password-forgot" />
                <AlertSuccess name="password-forgot" />
                <div className="pelcro-prefix-form">
                  <div className="pelcro-prefix-form-group">
                    <label
                      htmlFor="pelcro-input-email"
                      className="pelcro-prefix-label"
                    >
                      {this.locale.email} *
                    </label>
                    <input
                      id="pelcro-input-email"
                      onChange={this.onEmailChange}
                      type="text"
                      className="pelcro-prefix-input pelcro-prefix-form-control"
                      placeholder={this.locale.email}
                    ></input>
                  </div>

                  <Submit
                    onClick={this.submitForgotPassword}
                    text={this.locale.submit}
                    disabled={this.state.disableSubmit}
                  ></Submit>
                  <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
                    * {this.locale.required}
                  </small>
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
                </small>
                <Authorship></Authorship>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Forgot.propTypes = {
  setView: PropTypes.func,
  resetView: PropTypes.func
};

export default Forgot;
