import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { Button } from "../../SubComponents/Button";

export const ShopPurchaseButton = ({ itemId, ...otherProps }) => {
  const { purchaseItem } = usePelcro();

  const { t } = useTranslation("shop");

  return (
    <Button
      {...otherProps}
      data-sku-id={itemId}
      id={`pelcro-shop-purchase-${itemId}`}
      onClick={() => purchaseItem(itemId)}
    >
      {t("buttons.purchase")}
    </Button>
  );
};
