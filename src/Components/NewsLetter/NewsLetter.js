import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { getErrorMessages } from "../common/Helpers";
import Authorship from "../common/Authorship";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { Alert } from "../../SubComponents/Alert";
import { Button } from "../../SubComponents/Button";
import { Input } from "../../SubComponents/Input";
import { Link } from "../../SubComponents/Link";

class DefaultNewsLetter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disableSubmit: false,
      email: "",
      firstName: "",
      lastName: "",
      postalCode: "",
      alert: {
        type: "error",
        content: ""
      }
    };

    this.product =
      this.props.product || window.Pelcro.paywall.getProduct();
    this.closeButton = window.Pelcro.paywall.displayCloseButton();

    const { t } = this.props;
    this.title = this.props.product
      ? this.props.product?.paywall?.newsletter_title
      : t("title");
    this.subtitle = this.props.product
      ? this.props.product?.paywall?.newsletter_subtitle
      : t("subtitle");
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

  handleSubmit = (e) => {
    if (e.key === "Enter" && !this.state.disableSubmit)
      this.submitNewsletter();
  };

  displayLoginView = () => {
    this.props.setView("login");
  };

  displaySelectView = () => {
    this.props.setView("select");
  };

  submitNewsletter = () => {
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
        consent_text: this.subtitle,
        consent_type: "explicit"
      },
      (err, res) => {
        this.setState({ disableSubmit: false });
        if (err)
          return this.setState({
            alert: { type: "error", content: getErrorMessages(err) }
          });

        try {
          this.postSubmit();
        } catch {
          this.props.setView("meter");
        }
      }
    );
  };

  postSubmit = () => {
    window.Pelcro.paywall.decrementPageViewFrequency(
      this.product?.paywall?.newsletter_extra_visits,
      this.product?.paywall?.frequency_limit
    );
    this.props.setView("meter");
  };

  onEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  onFirstNameChange = (event) => {
    this.setState({ firstName: event.target.value });
  };

  onLastNameChange = (event) => {
    this.setState({ lastName: event.target.value });
  };

  onPostalCodeChange = (event) => {
    this.setState({ postalCode: event.target.value });
  };

  render() {
    const { t } = this.props;

    return (
      <Modal
        hideCloseButton={!this.closeButton}
        onClose={this.props.onClose}
        hideHeaderLogo={this.props.hideHeaderLogo}
        id="pelcro-newsletter-modal"
      >
        <ModalBody>
          <div id="pelcro-newsletter-view">
            <div className="plc-mb-6 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
              <h4 className="plc-text-2xl plc-font-semibold">
                {this.title}
              </h4>
              <p>{this.subtitle}</p>
            </div>
            <form
              action="javascript:void(0);"
              className="plc-mt-2 pelcro-form"
            >
              {this.state.alert.content && (
                <Alert type={this.state.alert.type}>
                  {this.state.alert.content}
                </Alert>
              )}
              <div className="plc-flex plc-items-start">
                <Input
                  value={this.state.first_name}
                  onChange={this.onFirstNameChange}
                  autoComplete="first-name"
                  id="pelcro-input-first-name"
                  label={t("labels.firstName")}
                  autoFocus={true}
                />
                <Input
                  wrapperClassName="plc-ml-3"
                  value={this.state.last_name}
                  onChange={this.onLastNameChange}
                  autoComplete="last-name"
                  id="pelcro-input-last-name"
                  label={t("labels.lastName")}
                />
              </div>
              <Input
                id="pelcro-input-email"
                errorId="pelcro-input-email-error"
                onChange={this.onEmailChange}
                type="email"
                label={t("labels.email")}
                required
              />
              <Input
                value={this.state.postal_code}
                onChange={this.onPostalCodeChange}
                autoComplete="postal-code"
                id="pelcro-input-postal-code"
                errorId="pelcro-input-postal-code-error"
                label={t("labels.postalCode")}
              />
              <p className="plc-text-gray-900 pelcro-footnote">
                * {t("labels.required")}
              </p>
              <Button
                role="submit"
                className="plc-mt-2 plc-w-full"
                id="pelcro-submit"
                onClick={this.submitNewsletter}
                disabled={this.state.disableSubmit}
                isLoading={this.state.disableSubmit}
              >
                {t("labels.submit")}
              </Button>
            </form>
          </div>
        </ModalBody>
        <ModalFooter>
          <p>
            {t("messages.alreadyHaveAccount") + " "}
            <Link onClick={this.displayLoginView}>
              {t("messages.loginHere")}
            </Link>
          </p>
          <p>
            {t("messages.createAnAccount")}
            <Link onClick={this.displaySelectView}>
              {t("messages.here")}
            </Link>
          </p>
          <Authorship />
        </ModalFooter>
      </Modal>
    );
  }
}

DefaultNewsLetter.propTypes = {
  product: PropTypes.object,
  setView: PropTypes.func,
  onClose: PropTypes.func
};

export const NewsLetter = withTranslation("newsletter")(
  DefaultNewsLetter
);
