// Newsletter view.
// The emaill form. Allows users to get free articles by entering their email.

import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import ErrMessage from "../common/ErrMessage";
import PropTypes from "prop-types";
import { getErrorMessages } from "../common/Helpers";

import { showError } from "../../utils/showing-error";

import Header from "../common/Header";
import Authorship from "../common/Authorship";
import Submit from "../common/Submit";

class NewsLetter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disableSubmit: false,
      email: "",
      firstName: "",
      lastName: "",
      postalCode: ""
    };

    this.plan = this.props.plan || window.Pelcro.paywall.getProduct().plans[0];
    this.product = this.props.product || window.Pelcro.paywall.getProduct();

    this.site = window.Pelcro.site.read();
    this.closeButton = window.Pelcro.paywall.displayCloseButton();

    this.submitNewsletter = this.submitNewsletter.bind(this);
    this.displayLoginView = this.displayLoginView.bind(this);
    this.postSubmit = this.postSubmit.bind(this);

    this.onEmailChange = this.onEmailChange.bind(this);
    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.onPostalCodeChange = this.onPostalCodeChange.bind(this);
  }

  componentDidMount = () => {
    window.Pelcro.insight.track("Modal Displayed", {
      name: "newsletter"
    });

    document.addEventListener("keydown", this.handleSubmit);
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleSubmit);
  };

  handleSubmit = e => {
    if (e.key === "Enter" && !this.state.disableSubmit) this.submitNewsletter();
  };

  // inserting error message into modal window
  showError = message => {
    showError(message, "pelcro-error-newsletter");
  };

  displayLoginView = () => {
    this.props.setView("login");
  };

  displaySelectView = () => {
    this.props.setView("select");
  };

  submitNewsletter = function() {
    this.setState({ disableSubmit: true });

    window.Pelcro.newsletter.create(
      {
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email: this.state.email,
        postal_code: this.state.postalCode,
        source: "web",
        lists: "default",
        consent_url: window.location.href,
        consent_text: this.product.paywall.newsletter_subtitle,
        consent_type: "explicit"
      },
      (err, res) => {
        this.setState({ disableSubmit: false });

        if (err) return this.showError(getErrorMessages(err));

        this.postSubmit();
      }
    );
  };

  postSubmit = function() {
    window.Pelcro.paywall.decrementPageViewFrequency(
      this.product.paywall.newsletter_extra_visits,
      this.product.paywall.frequency_limit
    );
    this.props.setView("meter");
  };

  onEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  onFirstNameChange(event) {
    this.setState({ firstName: event.target.value });
  }

  onLastNameChange(event) {
    this.setState({ lastName: event.target.value });
  }

  onPostalCodeChange(event) {
    this.setState({ postalCode: event.target.value });
  }

  render() {
    const { t } = this.props;

    return (
      <div className="pelcro-prefix-view">
        <div
          className="pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show"
          id="pelcro-view-newsletter"
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
                  <h4>{this.product.paywall.newsletter_title}</h4>
                  <p>{this.product.paywall.newsletter_subtitle}</p>
                </div>

                <ErrMessage name="newsletter" />
                <div className="pelcro-prefix-form">
                  <div className="pelcro-prefix-row">
                    <div className="col-sm-6">
                      <label
                        className="pelcro-prefix-label"
                        htmlFor="pelcro-input-first_name"
                      >
                        {t("firstName")}
                      </label>
                      <input
                        value={this.state.first_name}
                        onChange={this.onFirstNameChange}
                        className="pelcro-prefix-input pelcro-prefix-form-control"
                        autoComplete="first-name"
                        id="pelcro-input-first_name"
                        type="text"
                        placeholder={t("firstName")}
                      ></input>
                    </div>
                    <div className="col-sm-6">
                      <label
                        className="pelcro-prefix-label"
                        htmlFor="pelcro-input-last_name"
                      >
                        {t("lastName")}
                      </label>
                      <input
                        value={this.state.last_name}
                        onChange={this.onLastNameChange}
                        className="pelcro-prefix-input pelcro-prefix-form-control"
                        autoComplete="last-name"
                        id="pelcro-input-last_name"
                        type="text"
                        placeholder={t("lastName")}
                      ></input>
                    </div>
                  </div>

                  <div className="pelcro-prefix-form-group">
                    <label
                      htmlFor="pelcro-input-email"
                      className="pelcro-prefix-label"
                    >
                      {t("email")} *
                    </label>
                    <input
                      id="pelcro-input-email"
                      onChange={this.onEmailChange}
                      type="text"
                      className="pelcro-prefix-input pelcro-prefix-form-control"
                      placeholder={t("email")}
                    ></input>
                  </div>

                  <div className="pelcro-prefix-row">
                    <div className="col-sm-12">
                      <label
                        className="pelcro-prefix-label"
                        htmlFor="pelcro-input-postal_code"
                      >
                        {t("postalCode")}
                      </label>
                      <input
                        value={this.state.postal_code}
                        onChange={this.onPostalCodeChange}
                        className="pelcro-prefix-input pelcro-prefix-form-control"
                        autoComplete="postal-code"
                        id="pelcro-input-postal_code"
                        type="text"
                        placeholder={t("postalCode")}
                      ></input>
                    </div>
                  </div>

                  <Submit
                    onClick={this.submitNewsletter}
                    text={t("submit")}
                    disabled={this.state.disableSubmit}
                  ></Submit>
                  <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
                    * {t("required")}
                  </small>
                </div>
              </div>
              <div className="pelcro-prefix-modal-footer">
                <small>
                  {t("alreadyHaveAccount") + " "}
                  <button
                    className="pelcro-prefix-link "
                    onClick={this.displayLoginView}
                  >
                    {t("loginHere")}
                  </button>
                  {t("createAnAccount")}
                  <button
                    className="pelcro-prefix-link "
                    onClick={this.displaySelectView}
                  >
                    {t("here")}
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

NewsLetter.propTypes = {
  plan: PropTypes.object,
  product: PropTypes.object,
  setView: PropTypes.func,
  resetView: PropTypes.func
};

export default withTranslation("newsletter")(NewsLetter);
