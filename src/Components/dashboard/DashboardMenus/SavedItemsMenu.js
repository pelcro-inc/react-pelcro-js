import React, { useState } from "react";
import { default as ReactGA1 } from "react-ga";
import { default as ReactGA4 } from "react-ga4";
import { useTranslation } from "react-i18next";
import { ReactComponent as XIcon } from "../../../assets/x-icon.svg";
import { usePelcro } from "../../../hooks/usePelcro";
import { Button } from "../../../SubComponents/Button";
import { Link } from "../../../SubComponents/Link";
import { Card } from "../Card";

const ReactGA = window?.Pelcro?.uiSettings?.enableReactGA4 ? ReactGA4 : ReactGA1;

export const SavedItemsMenu = () => {
  const { t } = useTranslation("dashboard");
  const [userMetadata, setUserMetadata] = useState(
    window.Pelcro.user.read().metadata
  );

  const userSavedItems = userMetadata
    ? Object.entries(userMetadata)
        // only get metadata related to saved items
        .filter(
          ([categoryTitle, value]) =>
            categoryTitle.startsWith("metadata_saved_") &&
            value?.length
        )
        // drop the "metadata_saved_" from the category title
        .map(([categoryTitle, value]) => [
          categoryTitle.replace("metadata_saved_", ""),
          value
        ])
    : null;

  return (
    <Card
      id="pelcro-dashboard-saved-menu"
      className="plc-max-w-100% md:plc-max-w-80% plc-m-auto"
      title={t("labels.savedItems.label")}
    >
      <SavedItems items={userSavedItems} setItems={setUserMetadata} />
    </Card>
  );
};

export const SavedItems = ({ items, setItems }) => {
  const { t } = useTranslation("dashboard");
  const [isLoading, setLoading] = useState(false);
  const { isAuthenticated } = usePelcro();

  const removeItemFromMetadata = (category, title) => {
    const user = window.Pelcro.user.read();
    const oldValue = user.metadata[`metadata_saved_${category}`];

    const newMetadataValue = oldValue.filter(
      (metadata) => !(metadata?.title === title)
    );

    if (isAuthenticated()) {
      setLoading(true);
      window.Pelcro.user.saveToMetaData(
        {
          key: `saved_${category}`,
          value: newMetadataValue,
          auth_token: window.Pelcro.user.read().auth_token
        },
        (error, response) => {
          setLoading(false);
          if (error) {
            return;
          }

          setItems(response?.data?.metadata);
          ReactGA?.event?.({
            category: "ACTIONS",
            action: "Unsave/Unfollow",
            label: title
          });
        }
      );
    }
  };

  return !items?.length ? (
    <tbody>
      <tr>
        <td colSpan="2" className="plc-text-center plc-text-gray-500">
          {t("labels.savedItems.noSavedItems")}
        </td>
      </tr>
    </tbody>
  ) : (
    items.map(([categoryTitle, item]) => {
      return (
        <React.Fragment key={categoryTitle}>
          <>
            {item.map((item) => {
              return (
                <div
                  key={item.title}
                  className={`plc-py-2 plc-px-4 plc-mt-5 plc-flex plc-items-center plc-justify-between last:plc-mb-0 plc-text-gray-900 plc-bg-white plc-border-b-2`}
                >
                  <div>
                    <Link
                      className="plc-text-gray-700 plc-no-underline"
                      href={item.link}
                      isButton={true}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="plc-flex plc-items-center plc-py-2 plc-space-x-2 sm:plc-p-2">
                        {item?.image && (
                          <img
                            className="plc-w-12 plc-h-12 pelcro-saved-item-image"
                            alt={`image of ${item.title}`}
                            src={item?.image}
                          />
                        )}

                        <span className="plc-font-semibold">
                          {item.title}
                        </span>
                      </div>
                    </Link>
                  </div>
                  <Button
                    variant="ghost"
                    type="button"
                    className="plc-text-gray-500 plc-rounded-2xl"
                    onClick={()=> removeItemFromMetadata(
                      categoryTitle,
                      item.title,
                      setItems
                    )}
                  >
                    <XIcon className="plc-fill-current" />
                  </Button>
                </div>
              );
            })}
          </>
        </React.Fragment>
      );
    })
  );
};
