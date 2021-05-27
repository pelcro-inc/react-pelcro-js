import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { ShopContainer } from "./ShopContainer";
import { ShopSelectProductButton } from "./ShopSelectProductButton";

export const ShopView = (props) => {
  const { t } = useTranslation("shop");
  const { whenEcommerceLoaded } = usePelcro();

  const [products, setProducts] = React.useState([]);

  // temp solution until the ecom refactor
  React.useEffect(() => {
    whenEcommerceLoaded(() => {
      setProducts(
        window.Pelcro.ecommerce.products
          .read()
          .flatMap((prod) => prod.skus.map((sku) => sku))
      );
    });
  }, []);

  return (
    <div id="pelcro-shop-view">
      <ShopContainer {...props}>
        <div className="plc-grid plc-justify-center plc-rounded plc-justify-items-center plc-gap-y-5 plc-gap-x-3 pelcro-shop-products">
          {products.map((product) => {
            return (
              <div
                key={product.id}
                className="plc-flex plc-flex-col plc-items-center plc-p-2 plc-m-3 plc-border plc-border-gray-400 plc-border-solid plc-rounded-md plc-w-max pelcro-shop-product-wrapper"
              >
                {product.image && (
                  <img
                    className="pelcro-shop-product-image"
                    alt={`image of ${product.name}`}
                    src={product.image}
                  />
                )}
                <div className="plc-flex plc-flex-col plc-items-center plc-mt-auto pelcro-shop-product-info-wrapper">
                  <p className="plc-font-bold pelcro-shop-product-name">
                    {product.name}
                  </p>
                  <p className="plc-font-bold pelcro-shop-product-description">
                    {product.description}
                  </p>
                  <ShopSelectProductButton
                    product={product}
                    name={t("buttons.select")}
                    className="plc-mt-2"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </ShopContainer>
    </div>
  );
};

ShopView.viewId = "shop";
