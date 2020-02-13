// Edit user profile view.

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

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: window.Pelcro.user.read().email || "",
      firstName: window.Pelcro.user.read().first_name || "",
      lastName: window.Pelcro.user.read().last_name || "",
      phone: window.Pelcro.user.read().phone || "",
      disableSubmit: false
    };

    this.locale = localisation("userEdit").getLocaleData();

    this.site = window.Pelcro.site.read();
    this.closeButton = window.Pelcro.paywall.displayCloseButton();
  }

  showError = message => {
    showError(message, "pelcro-error-user-edit");
  };

  showSuccess = message => {
    showSuccess(message, "pelcro-success-user-edit");
  };

  displayLoginView = () => {
    this.props.setView("login");
  };

  submitEditUser = () => {
    this.setState({ disableSubmit: true });

    window.Pelcro.user.update(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        phone: this.state.phone,
        metadata: { updated: "updated" }
      },
      (err, res) => {
        this.setState({ disableSubmit: false });

        if (err) return this.showError(getErrorMessages(err));
        else {
          this.showSuccess(`${this.locale.messages.userUpdated}`);
        }
      }
    );
  };

  onEmailChange = event => {
    this.setState({ email: event.target.value });
  };

  onFirstNameChange = event => {
    this.setState({ firstName: event.target.value });
  };

  onLastNameChange = event => {
    this.setState({ lastName: event.target.value });
  };

  onPhoneChange = event => {
    this.setState({ phone: event.target.value });
  };

  render() {
    return (
      <div className="pelcro-prefix-view">
        <div
          className="pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show"
          id="pelcro-view-user-edit"
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
                  <h4>{this.locale.labels.title}</h4>
                  <p>{this.locale.labels.subtitle}</p>
                </div>

                <ErrMessage name="user-edit" />
                <AlertSuccess name="user-edit" />

                <div className="pelcro-prefix-form">
                  <div className="pelcro-prefix-row">
                    <div className="col-md-12">
                      <label
                        className="pelcro-prefix-label"
                        htmlFor="pelcro-input-email"
                      >
                        {this.locale.labels.email}{" "}
                      </label>
                      <input
                        disabled
                        value={this.state.email}
                        onChange={this.onEmailChange}
                        className="pelcro-prefix-input pelcro-prefix-form-control"
                        autoComplete="email"
                        id="pelcro-input-email"
                        type="text"
                        placeholder={this.locale.labels.email}
                      ></input>
                    </div>
                  </div>

                  <div className="pelcro-prefix-row">
                    <div className="col-md-6">
                      <label
                        className="pelcro-prefix-label"
                        htmlFor="pelcro-input-first_name"
                      >
                        {this.locale.labels.firstName}{" "}
                      </label>
                      <input
                        value={this.state.firstName}
                        onChange={this.onFirstNameChange}
                        className="pelcro-prefix-input pelcro-prefix-form-control"
                        autoComplete="first-name"
                        id="pelcro-input-first_name"
                        type="text"
                        placeholder={this.locale.labels.firstName}
                      ></input>
                    </div>
                    <div className="col-md-6">
                      <label
                        className="pelcro-prefix-label"
                        htmlFor="pelcro-input-last_name"
                      >
                        {this.locale.labels.lastName}{" "}
                      </label>
                      <input
                        value={this.state.lastName}
                        onChange={this.onLastNameChange}
                        className="pelcro-prefix-input pelcro-prefix-form-control"
                        autoComplete="last-name"
                        id="pelcro-input-last_name"
                        type="text"
                        placeholder={this.locale.labels.lastName}
                      ></input>
                    </div>
                  </div>

                  <div className="pelcro-prefix-row">
                    <div className="col-md-12">
                      <label
                        className="pelcro-prefix-label"
                        htmlFor="pelcro-input-phone"
                      >
                        {this.locale.labels.phone}{" "}
                      </label>
                      <input
                        value={this.state.phone}
                        onChange={this.onPhoneChange}
                        className="pelcro-prefix-input pelcro-prefix-form-control"
                        autoComplete="phone"
                        id="pelcro-input-phone"
                        type="text"
                        placeholder={this.locale.labels.phone}
                      ></input>
                    </div>
                  </div>

                  <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
                    * {this.locale.labels.required}
                  </small>
                  <Submit
                    onClick={this.submitEditUser}
                    text={this.locale.labels.submit}
                    id="edit-submit"
                    disabled={this.state.disableSubmit}
                  ></Submit>
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

Edit.propTypes = {
  setView: PropTypes.func,
  resetView: PropTypes.func
};

export default Edit;
