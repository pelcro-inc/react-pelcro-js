import React, { useState, useEffect } from "react";
import { Button } from "../../../SubComponents/Button";
import { useTranslation } from "react-i18next";
import { Card } from "../Card";
import { ToggleSwitch } from "../../../SubComponents/ToggleSwitch";

export const NewslettersMenu = (props) => {
  const { t } = useTranslation("dashboard");
  const defaultStatues = {
    loading: false,
    success: false,
    failed: false
  };

  const settingsNewsletters =
    window.Pelcro?.uiSettings?.newsletters ?? [];
  const email =
    window.Pelcro.user.read()?.email ??
    window.Pelcro.helpers.getURLParameter("email");

  const [newsletters, setNewsletters] = useState([]);
  const [didSubToNewslettersBefore, setDidSubToNewslettersBefore] =
    useState(false);
  const [requestStates, setRequestStates] = useState(defaultStatues);

  const removeStatues = (timeout) => {
    setTimeout(() => {
      setRequestStates(defaultStatues);
    }, timeout);
  };

  const handleChange = (id) => {
    const newNewsLetters = newsletters.map((newsletter) => {
      if (newsletter.id === id) {
        return {
          ...newsletter,
          selected: !newsletter.selected
        };
      }
      return newsletter;
    });
    setNewsletters(newNewsLetters);
  };

  const handleSubmit = () => {
    const callback = (err, res) => {
      if (err) {
        setRequestStates((prev) => ({
          ...prev,
          success: false,
          loading: false,
          failed: true
        }));
      } else {
        setRequestStates((prev) => ({
          ...prev,
          success: true,
          loading: false,
          failed: false
        }));
        if (!didSubToNewslettersBefore) {
          setDidSubToNewslettersBefore(true);
        }
      }
      removeStatues(3000);
    };

    const requestData = {
      email: email,
      source: "web",
      lists: newsletters
        .filter((newsletter) => newsletter.selected)
        .map((newsletter) => newsletter.id)
        .join(",")
    };

    setRequestStates((prev) => ({
      ...prev,
      success: false,
      loading: true,
      failed: false
    }));

    if (didSubToNewslettersBefore) {
      window.Pelcro.newsletter.update(requestData, callback);
    } else {
      window.Pelcro.newsletter.create(requestData, callback);
    }
  };

  useEffect(() => {
    window.Pelcro.newsletter.getByEmail(email, (err, res) => {
      if (err) {
      }
      const selectedNewsletters = res.data.lists?.split(",") ?? [];
      const allNewslettersWithSelectedField = settingsNewsletters.map(
        (newsletter) => ({
          ...newsletter,
          id: String(newsletter.id),
          selected: selectedNewsletters.includes(
            String(newsletter.id)
          )
        })
      );
      setNewsletters(allNewslettersWithSelectedField);
      setDidSubToNewslettersBefore(Boolean(res.data.email));
    });
  }, []);

  return (
    <Card
      id="pelcro-dashboard-newsletters-menu"
      className="plc-profile-menu-width"
      title={t("labels.Newsletters")}
      description={t("descriptions.newsletterPreferences", "Select which newsletters you'd like to receive")}
      requestStates={requestStates}
    >
      <div className="">
        <NewsLettersItems
          handleChange={handleChange}
          newsletters={newsletters}
        />
        <div className="plc-flex plc-justify-center plc-mt-8">
          <Button
            onClick={handleSubmit}
            disabled={requestStates.loading}
            className="plc-bg-primary plc-text-white plc-px-8 plc-py-2 plc-rounded-full plc-font-medium plc-transition-all plc-hover:plc-bg-primary-dark plc-flex plc-items-center plc-gap-2"
          >
            {requestStates.loading ? (
              <>
                <span className="plc-animate-spin plc-inline-block plc-h-4 plc-w-4 plc-border-2 plc-border-white plc-border-t-transparent plc-rounded-full"></span>
                <span>{t("buttons.processing", "Processing...")}</span>
              </>
            ) : (
              t("buttons.saveChanges", "Save Changes")
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

const NewsLettersItems = ({ newsletters, handleChange }) => {
  const { t } = useTranslation("dashboard");

  if (newsletters.length === 0) return null;

  return (
    <div className="plc-space-y-4">
      {newsletters.map((newsletter) => (
        <div
          key={newsletter.id}
          className="plc-bg-gray-50 plc-rounded-lg plc-p-4 plc-transition-all plc-hover:plc-bg-gray-100 plc-flex plc-items-center plc-justify-between plc-w-full"
        >
          <div className="plc-flex-1">
            {newsletter.label && (
              <div className="plc-flex plc-flex-col">
                <span className="plc-font-medium plc-text-gray-800 pelcro-newsletters-plan">
                  {newsletter.label}
                </span>
                {newsletter.description && (
                  <span className="plc-text-sm plc-text-gray-500 plc-mt-1">
                    {newsletter.description}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="plc-ml-4">
            <ToggleSwitch
              isActive={newsletter.selected}
              handleChange={() => handleChange(newsletter.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

NewslettersMenu.viewId = "newsletters";
