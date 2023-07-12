import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as ChevronRightIcon } from "../../../assets/chevron-right.svg";
import { usePelcro } from "../../../hooks/usePelcro";
import { Button } from "../../../SubComponents/Button";
import { Link } from "../../../SubComponents/Link";
import { Accordion } from "../Accordion";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";

const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;

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
    <table className="plc-w-full plc-py-4 plc-table-fixed ">
      <thead className="plc-text-xs plc-font-semibold plc-tracking-wider plc-text-gray-400 plc-uppercase ">
        <tr>
          <th className="plc-w-10/12 plc-pl-2">
            {t("labels.savedItems.categories")}
          </th>
          <th className="plc-w-2/12">
            {t("labels.savedItems.details")}
          </th>
        </tr>
      </thead>
      {/* Spacer */}
      <tbody>
        <tr className="plc-h-4"></tr>
      </tbody>
      <Accordion>
        <SavedItems
          items={userSavedItems}
          setItems={setUserMetadata}
        />
      </Accordion>
      <tbody>
        <tr className="plc-h-4"></tr>
      </tbody>
    </table>
  );
};

export const SavedItems = ({
  items,
  setItems,
  activeMenu,
  toggleActiveMenu
}) => {
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
          if (enableReactGA4) {
            ReactGA4.gtag("event", "Unsave/Unfollow", {
              event_category: "ACTIONS",
              event_action: "Unsave/Unfollow",
              event_label: title
            });
          } else {
            ReactGA?.event?.({
              category: "ACTIONS",
              action: "Unsave/Unfollow",
              label: title
            });
          }
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
      const isActive = activeMenu === categoryTitle;

      return (
        <React.Fragment key={categoryTitle}>
          {/* Accordion header */}
          <tbody>
            <tr
              onClick={() => toggleActiveMenu(categoryTitle)}
              key={"dashboard-saved-category-" + categoryTitle}
              className={`plc-w-full plc-text-gray-500 plc-align-middle plc-cursor-pointer accordion-header ${
                isActive ? "plc-bg-gray-100" : "hover:plc-bg-gray-50"
              }`}
            >
              <td className="plc-py-4 plc-pl-2">
                <span className="plc-text-xl plc-font-semibold plc-uppercase ">
                  {categoryTitle}
                </span>
              </td>

              <td>
                <div
                  className={`plc-flex plc-items-center plc-justify-center plc-transition-transform plc-ease-out plc-transform plc-rounded-full plc-w-7 plc-h-7 ${
                    isActive
                      ? "plc-flex plc-place-items-center plc-w-7 plc-h-7 plc-p-1 plc-bg-primary-400 plc-rounded-full"
                      : "accordion-chevron"
                  }`}
                >
                  <span
                    className={`plc-transition plc-ease-out  ${
                      isActive &&
                      "plc-text-white plc-transform plc-rotate-90"
                    }`}
                  >
                    <ChevronRightIcon />
                  </span>
                </div>
              </td>
            </tr>
          </tbody>

          {/* Accordion active menu */}
          <tbody>
            {isActive && (
              <>
                {item.map((item) => {
                  return (
                    <tr
                      key={item.title}
                      className="plc-text-lg plc-text-gray-500 pelcro-saved-items-details-row "
                    >
                      <td>
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
                      </td>

                      <td>
                        <Button
                          variant="ghost"
                          className="plc-text-red-500 plc-uppercase focus:plc-ring-red-500"
                          disabled={isLoading}
                          onClick={() =>
                            removeItemFromMetadata(
                              categoryTitle,
                              item.title,
                              setItems
                            )
                          }
                        >
                          {t("labels.savedItems.removeItem")}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td colSpan="3">
                    <hr className="plc-mt-4" />
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </React.Fragment>
      );
    })
  );
};
