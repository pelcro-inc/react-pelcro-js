// Login view.
// Login form which is shown only if the user is not authenticated.

import React, { Component } from "react";
import ErrMessage from "../common/ErrMessage";
import PropTypes from "prop-types";
import { getErrorMessages } from "../common/Helpers";

import localisation from "../../utils/localisation";
import { showError } from "../../utils/showing-error";

import Header from "../common/Header";
import Authorship from "../common/Authorship";
import Submit from "../common/Submit";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disableSubmit: false,
      email: "",
      password: ""
    };

    this.locale = localisation("login").getLocaleData();
    this.site = window.Pelcro.site.read();
    this.closeButton = window.Pelcro.paywall.displayCloseButton();

    this.login = this.login.bind(this);
    this.onCreateAccountClick = this.onCreateAccountClick.bind(this);

    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
  }

  componentDidMount = () => {
    window.Pelcro.insight.track("Modal Displayed", {
      name: "login"
    });

    document.addEventListener("keydown", this.handleSubmit);
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleSubmit);
  };

  handleSubmit = e => {
    if (e.key === "Enter" && !this.state.disableSubmit) this.login();
  };

  // inserting error message into modal window
  showError = message => {
    showError(message, "pelcro-error-login");
  };

  login = () => {
    // disable the Login button to prevent repeated clicks
    this.setState({ disableSubmit: true });

    window.Pelcro.user.login(
      { email: this.state.email, password: this.state.password },
      (err, res) => {
        this.setState({ disableSubmit: false });

        if (err) return this.showError(getErrorMessages(err));

        this.props.ReactGA.event({
          category: "ACTIONS",
          action: "Logged in",
          nonInteraction: true
        });

        this.props.loggedIn();

        if (window.Pelcro.subscription.isSubscribedToSite()) {
          this.props.setView("dashboard");
        } else {
          this.props.setView("select");
        }
      }
    );
  };

  onCreateAccountClick = () => {
    this.props.setView("select");
  };

  onForgotPassword = () => {
    this.props.setView("password-forgot");
  };

  onEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  onPasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  render() {
    return (
      <div className="pelcro-prefix-view">
        <div
          className="pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show"
          id="pelcro-view-login"
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
                  <h4>{this.locale.messages.loginTo}</h4>
                  <p>{this.locale.messages.welcome}</p>
                </div>

                <ErrMessage name={"login"} />

                <div className="pelcro-prefix-form">
                  <div className="pelcro-prefix-form-group">
                    <label
                      className="pelcro-prefix-label"
                      htmlFor="pelcro-input-email"
                    >
                      {this.locale.labels.email} *
                    </label>
                    <input
                      className="pelcro-prefix-input pelcro-prefix-form-control"
                      id="pelcro-input-email"
                      onChange={this.onEmailChange}
                      required
                      type="email"
                      placeholder={
                        this.locale.labels.emailPlaceholder
                      }
                    ></input>
                  </div>
                  <div className="pelcro-prefix-form-group">
                    <label
                      className="pelcro-prefix-label"
                      htmlFor="pelcro-input-password"
                    >
                      {this.locale.labels.password} *
                    </label>
                    <input
                      className="pelcro-prefix-input pelcro-prefix-form-control"
                      id="pelcro-input-password"
                      onChange={this.onPasswordChange}
                      required
                      type="password"
                      placeholder={
                        this.locale.labels.passwordPlaceholder
                      }
                    ></input>
                  </div>
                  <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
                    * {this.locale.labels.required}
                  </small>
                  <Submit
                    onClick={this.login}
                    text={this.locale.labels.login}
                    id="login-submit"
                    disabled={this.state.disableSubmit}
                  ></Submit>
                </div>
              </div>
              <div className="pelcro-prefix-modal-footer">
                <small>
                  {this.locale.messages.dontHaveAccount + " "}
                  <button
                    className="pelcro-prefix-link"
                    onClick={this.onCreateAccountClick}
                  >
                    {this.locale.messages.createAccount}
                  </button>
                  {" " + this.locale.messages.forgotPassword + " "}{" "}
                  {this.locale.messages.reset.click + " "}
                  <button
                    className="pelcro-prefix-link"
                    onClick={this.onForgotPassword}
                  >
                    {this.locale.messages.reset.here}
                  </button>
                  {" " + this.locale.messages.reset.toReset}
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
Login.propTypes = {
  setView: PropTypes.func,
  resetView: PropTypes.func
};

export default Login;
