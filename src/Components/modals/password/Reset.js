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

class Reset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disableSubmit: false,
      email: "",
      token: "",
      password: "",
      passwordConfirmation: ""
    };

    this.locale = localisation("password-reset").getLocaleData();

    this.submitResetPassword = this.submitResetPassword.bind(this);
    this.displayLoginView = this.displayLoginView.bind(this);

    this.site = window.Pelcro.site.read();

    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onPasswordConfirmationChange = this.onPasswordConfirmationChange.bind(
      this
    );
  }

  componentDidMount = () => {
    this.setState({
      email: window.Pelcro.helpers.getURLParameter("email")
    });
    this.setState({
      token: window.Pelcro.helpers.getURLParameter("token")
    });
    document.addEventListener("keydown", this.handleSubmit);
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleSubmit);
  };

  handleSubmit = e => {
    if (e.key === "Enter" && !this.state.disableSubmit)
      this.submitResetPassword();
  };

  // inserting error message into modal window
  showError = message => {
    showError(message, "pelcro-error-password-reset");
  };

  showSuccess = message => {
    showSuccess(message, "pelcro-success-password-reset");
  };

  displayLoginView = () => {
    this.props.setView("login");
  };

  submitResetPassword = function() {
    this.setState({ disableSubmit: true });

    window.Pelcro.password.reset(
      {
        email: this.state.email,
        password: this.state.password,
        password_confirmation: this.state.passwordConfirmation,
        token: this.state.token
      },
      (err, res) => {
        this.setState({ disableSubmit: false });

        if (err) return this.showError(getErrorMessages(err));

        this.showSuccess(this.locale.passwordUpdated);
      }
    );
  };

  onPasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  onPasswordConfirmationChange(event) {
    this.setState({ passwordConfirmation: event.target.value });
  }

  render() {
    return (
      <div className="pelcro-prefix-view">
        <div
          className="pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show"
          id="pelcro-view-password-reset"
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
                closeButton={true}
                resetView={this.props.resetView}
                site={this.site}
              ></Header>
              <div className="pelcro-prefix-modal-body">
                <div className="pelcro-prefix-title-block">
                  <h4>{this.locale.title}</h4>
                  <p>{this.locale.subtitle}</p>
                </div>

                <ErrMessage name="password-reset" />
                <AlertSuccess name="password-reset" />
                <div className="pelcro-prefix-form">
                  <div className="pelcro-prefix-form-group">
                    <label
                      htmlFor="pelcro-input-email"
                      className="pelcro-prefix-label"
                    >
                      {this.locale.email} *
                    </label>
                    <input
                      value={this.state.email}
                      id="pelcro-input-email"
                      type="text"
                      className="pelcro-prefix-input pelcro-prefix-form-control"
                      placeholder={this.locale.email}
                      disabled
                    ></input>
                  </div>

                  <div className="pelcro-prefix-form-group">
                    <label
                      htmlFor="pelcro-input-password"
                      className="pelcro-prefix-label"
                    >
                      {this.locale.password} *
                    </label>
                    <input
                      type="password"
                      id="pelcro-input-password"
                      onChange={this.onPasswordChange}
                      className="pelcro-prefix-input pelcro-prefix-form-control"
                      placeholder={this.locale.password}
                    ></input>
                  </div>

                  <div className="pelcro-prefix-form-group">
                    <label
                      htmlFor="pelcro-input-confirm_password"
                      className="pelcro-prefix-label"
                    >
                      {this.locale.confirmPassword} *
                    </label>
                    <input
                      type="password"
                      id="pelcro-input-confirm_password"
                      onChange={this.onPasswordConfirmationChange}
                      className="pelcro-prefix-input pelcro-prefix-form-control"
                      placeholder={this.locale.confirmPassword}
                    ></input>
                  </div>

                  <Submit
                    onClick={this.submitResetPassword}
                    text={this.locale.submit}
                    disabled={this.state.disableSubmit}
                  ></Submit>
                  <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
                    * {this.locale.required}
                  </small>
                </div>
              </div>
              <div className="pelcro-prefix-modal-footer">
                <Authorship></Authorship>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Reset.propTypes = {
  setView: PropTypes.func,
  resetView: PropTypes.func
};

export default Reset;
