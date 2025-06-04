import React, { useState, useEffect } from "react";
import { Loader } from "../../SubComponents/Loader";
import { useTranslation } from "react-i18next";

export const EmailPreferencesMenu = (props) => {
  const { t } = useTranslation("dashboard");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState({});
  const [alert, setAlert] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const options = window.Pelcro?.uiSettings?.newsletters || [];
    const email =
      window.Pelcro.user.read()?.email ??
      window.Pelcro.helpers.getURLParameter("email");
    setIsLoading(true);
    window.Pelcro.newsletter.getByEmail(email, (err, res) => {
      if (err) {
        setIsLoading(false);
        setError(
          t("messages.error") || "Failed to load preferences."
        );
        return;
      }
      const selectedIds = res?.data?.lists?.split(",") ?? [];
      setOptions(
        options.map((opt) => ({
          ...opt,
          id: String(opt.id),
          selected: selectedIds.includes(String(opt.id))
        }))
      );
      setIsLoading(false);
      setError(null);
    });
  }, [t]);

  const handleCheckboxChange = (id) => (e) => {
    const checked = e.target.checked;
    setOptions((prevOptions) => {
      const newOptions = prevOptions.map((opt) =>
        opt.id === id ? { ...opt, selected: checked } : opt
      );
      // Set loading for this checkbox
      setLoading((prev) => ({ ...prev, [id]: true }));
      setAlert((prev) => ({ ...prev, [id]: null }));
      // Save to backend
      const selectedIds = newOptions
        .filter((opt) => opt.selected)
        .map((opt) => opt.id);

      const email =
        window.Pelcro.user.read()?.email ??
        window.Pelcro.helpers.getURLParameter("email");
      const requestData = {
        email,
        source: "web",
        lists: selectedIds.join(",")
      };

      // Check if this is a new subscription
      window.Pelcro.newsletter.getByEmail(email, (err, res) => {
        if (err) {
          setLoading((prev) => ({ ...prev, [id]: false }));
          setAlert((prev) => ({
            ...prev,
            [id]: "Error checking subscription status"
          }));
          return;
        }

        const didSubToNewslettersBefore = Boolean(res.data.email);
        const callback = (err) => {
          setLoading((prev) => ({ ...prev, [id]: false }));
          setAlert((prev) => ({
            ...prev,
            [id]: err ? "Error saving" : "Saved!"
          }));
        };

        if (didSubToNewslettersBefore) {
          window.Pelcro.newsletter.update(requestData, callback);
        } else {
          window.Pelcro.newsletter.create(requestData, callback);
        }
      });

      return newOptions;
    });
  };

  if (isLoading)
    return (
      <div className="plc-flex plc-justify-center plc-items-center plc-h-32">
        <Loader width={60} height={100} />
      </div>
    );
  if (error)
    return <div className="plc-text-red-600 plc-p-4">{error}</div>;
  return (
    <div>
      <div className="plc-mb-4 plc-text-sm plc-text-gray-600">
        {t("labels.emailPreferences.description") ||
          "Select which email updates you would like to receive."}
      </div>
      {options.map((opt) => (
        <div
          key={opt.id}
          className="plc-flex plc-items-center plc-mb-2"
        >
          <input
            type="checkbox"
            id={`email-pref-${opt.id}`}
            checked={!!opt.selected}
            onChange={handleCheckboxChange(opt.id)}
            disabled={loading[opt.id]}
            className="plc-mr-2"
          />
          <label
            htmlFor={`email-pref-${opt.id}`}
            className="plc-text-base"
          >
            {opt.label}
          </label>
        </div>
      ))}
    </div>
  );
};
