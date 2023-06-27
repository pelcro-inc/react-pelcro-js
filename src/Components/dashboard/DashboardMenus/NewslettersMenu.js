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
      className="plc-max-w-100% md:plc-max-w-60% plc-m-auto"
      title={t("labels.Newsletters")}
      requestStates={requestStates}
    >
      <NewsLettersItems
        handleChange={handleChange}
        newsletters={newsletters}
      />
      <div className="plc-flex plc-justify-center">
        <Button
          onClick={handleSubmit}
          disabled={requestStates.loading}
        >
          SUBMIT
        </Button>
      </div>
    </Card>
  );
};

const NewsLettersItems = ({ newsletters, handleChange }) => {
  const { t } = useTranslation("dashboard");

  if (newsletters.length === 0) return null;

  return newsletters.map((newsletter) => {
    return (
      <>
        <div
          key={newsletter.id}
          className={`plc-border-b-2 plc-flex plc-items-center plc-justify-between plc-w-full plc-pb-4 plc-mb-4`}
        >
          <div>
            {newsletter.label && (
              <>
                <span className="plc-font-semibold plc-text-gray-500 pelcro-newsletters-plan">
                  {newsletter.label}
                </span>
              </>
            )}
          </div>
          <div className="plc-flex plc-items-center">
            <ToggleSwitch
              isActive={newsletter.selected}
              handleChange={() => handleChange(newsletter.id)}
            />
          </div>
        </div>
      </>
    );
  });
};
