/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import {Text} from "domelementtype";
import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';

import '../ProductItem/ProductItem.css';

import { useCart, useProducts, useSensor, useStore } from '../../context';
import NoImage from '../../icons/NoImage.svg';
import {
  AddToCartState,
  Brand,
  CustomerPrice,
  Product,
  ProductViewMedia,
  RedirectRouteFunc,
  RefinedProduct,
} from '../../types/interface';
import { SEARCH_UNIT_ID } from '../../utils/constants';
import {
  generateOptimizedImages,
  getProductImageURLs,
} from '../../utils/getProductImage';
import { htmlStringDecode } from '../../utils/htmlStringDecode';
import { AddToCartButton } from '../AddToCartButton';
import ButtonShimmer from '../ButtonShimmer';
import CustomerPriceShimmer from '../CustomerPriceShimmer';
import DiscountShimmer from '../DiscountShimmer';
import { ImageCarousel } from '../ImageCarousel';
import { Image } from '../ImageCarousel/Image';
import { SwatchButtonGroup } from '../SwatchButtonGroup';
import ProductPrice from './ProductPrice';

export interface ProductProps {
  item: Product;
  currencySymbol: string;
  currencyRate?: string;
  setRoute?: RedirectRouteFunc | undefined;
  refineProduct: (optionIds: string[], sku: string) => any;
  setCartUpdated: (cartUpdated: boolean) => void;
  setItemAdded: (itemAdded: string) => void;
  setError: (error: boolean) => void;
  addToCart?: (
    sku: string,
    options: [],
    quantity: number
  ) => Promise<void | undefined>;
  customerPrice?: CustomerPrice | undefined | null;
}

export const ProductItem: FunctionComponent<ProductProps> = ({
  item,
  currencySymbol,
  currencyRate,
  setRoute,
  refineProduct,
  setCartUpdated,
  setItemAdded,
  setError,
  addToCart,
  customerPrice,
}: ProductProps) => {
  const { product, productView } = item;
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedSwatch, setSelectedSwatch] = useState('');
  const [imagesFromRefinedProduct, setImagesFromRefinedProduct] = useState<
    ProductViewMedia[] | null
  >();
  const [refinedProduct, setRefinedProduct] = useState<RefinedProduct>();
  const [isHovering, setIsHovering] = useState(false);
  const [addToCartState, setAddToCartState] = useState('idle' as AddToCartState);
  const { addToCartGraphQL, refreshCart } = useCart();
  const { viewType } = useProducts();
  const {
    config: {
      optimizeImages,
      imageBaseWidth,
      imageCarousel,
      showPrice,
      listview},
  } = useStore();

  const { screenSize } = useSensor();

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const handleSelection = async (optionIds: string[], sku: string) => {
    const data = await refineProduct(optionIds, sku);
    setSelectedSwatch(optionIds[0]);
    setImagesFromRefinedProduct(data.refineProduct.images);
    setRefinedProduct(data);
    setCarouselIndex(0);
  };

  const isSelected = (id: string) => {
    const selected = selectedSwatch ? selectedSwatch === id : false;
    return selected;
  };

  const { brandsData, imagePlaceholder } = useProducts();

  const productImageArray = imagesFromRefinedProduct
    ? getProductImageURLs(imagesFromRefinedProduct ?? [imagePlaceholder], imageCarousel ? 3 : 1)
    : getProductImageURLs(
        productView.images ?? [],
        imageCarousel ? 3 : 1, // number of images to display in carousel
        product.image?.url ?? imagePlaceholder
      );
  console.log(productImageArray);
  let optimizedImageArray: { src: string; srcset: any }[] = [];

  if (optimizeImages) {
    optimizedImageArray = generateOptimizedImages(
      productImageArray,
      imageBaseWidth ?? 200
    );
  }

  // will have to figure out discount logic for amount_off and percent_off still
  const discount: boolean = refinedProduct
    ? refinedProduct.refineProduct?.priceRange?.minimum?.regular?.amount
        ?.value >
      refinedProduct.refineProduct?.priceRange?.minimum?.final?.amount?.value
    : product?.price_range?.minimum_price?.regular_price?.value >
        product?.price_range?.minimum_price?.final_price?.value ||
      productView?.price?.regular?.amount?.value >
        productView?.price?.final?.amount?.value;
  const isSimple = product?.__typename === 'SimpleProduct';
  const isComplexProductView = productView?.__typename === 'ComplexProductView';
  const isBundle = product?.__typename === 'BundleProduct';
  const isGrouped = product?.__typename === 'GroupedProduct';
  const isGiftCard = product?.__typename === 'GiftCardProduct';
  const isConfigurable = product?.__typename === 'ConfigurableProduct';

  const onProductClick = () => {
    window.magentoStorefrontEvents?.publish.searchProductClick(
      SEARCH_UNIT_ID,
      product?.sku
    );
  };

  const productUrl = setRoute
    ? setRoute({ sku: productView?.sku, urlKey: productView?.urlKey })
    : product?.canonical_url;

  const handleAddToCart = async () => {
    setError(false);
    if (isSimple) {
      if (addToCart) {
        //Custom add to cart function passed in
        setAddToCartState('loading');
        await addToCart(productView.sku, [], 1);
      } else {
        // Add to cart using GraphQL & Luma extension
        setAddToCartState('loading');
        const response = await addToCartGraphQL(productView.sku);

        if (
          response?.errors ||
          response?.data?.addProductsToCart?.user_errors.length > 0
        ) {
          setError(true);
          setAddToCartState('error');
          setTimeout(() => {
            setAddToCartState('idle');
          }, 2000);
          return;
        }
        setItemAdded(product.name);
        refreshCart && refreshCart();
        setCartUpdated(true);
        setAddToCartState('success');
        setTimeout(() => {
          setAddToCartState('idle');
        }, 2000);
      }
      setTimeout(() => {
        setAddToCartState('idle');
      }, 2000);
    } else if (productUrl) {
      window.open(productUrl, '_self');
    }
  };

  const manufacturer = (product: Product) => {
    if (!product.productView.attributes) {
      return null;
    }
    const manufacturer = product.productView.attributes.filter(attribute =>
        attribute.name === "manufacturer"
    );
    if (manufacturer?.[0]) {
      if (typeof manufacturer[0]?.value === 'string') {
        return manufacturer[0]?.value;
      }
    }
    return null;
  };

  const brand = (manufacturerName: string|null) => {
    if (!brandsData) {
      return null;
    }

    const brand = brandsData.filter((brand: Brand) => brand.title === manufacturerName);
    if (brand?.[0]) {
      return brand[0];
    }
    return null;
  };

  const manufacturerData = manufacturer(item);
  const brandData = brand(manufacturerData);

  const productManufacturer = () => {
    const manufacturer = () => {
      return (
          <a href={brandData?.link_url || '#'}>
            {(brandData?.image_url) &&
                <img src={brandData?.image_url} alt={String(brandData?.title)} />
            }
            { !(brandData?.image_url) &&
                <span>{manufacturerData}</span>
            }
          </a>
      );
    }
    return (
        <>
          {(brandData?.link_url) &&
              <a href={brandData?.link_url}>{manufacturer()}</a>
          }
          {(!brandData?.link_url) && manufacturer()}
        </>
    );
  }

  const customerDiscount = (customerPrice?.price) ? (
    Math.round(100 - (customerPrice.price * 100 / item.product.price_range.minimum_price.final_price.value))
  ) : 0;

  const priceFormatter = (price: number) => {
    const formatter = new Intl.NumberFormat(
      'fr-FR',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );
    return price ? `${formatter.format(parseFloat(price.toFixed(2)))}` : '';
  };

  if (listview && viewType === 'listView') {
    return (
      <>
        <li className="item product product-item" key={productView?.id}>
          <div className="product-item-info">
            <a
              href={productUrl as string}
              onClick={onProductClick}
              className="product photo product-item-photo"
            >
              <div className="lazyload-image-wrapper  product-image-wrapper">
                {productImageArray.length ? (
                  <ImageCarousel
                    images={
                      optimizedImageArray.length
                        ? optimizedImageArray
                        : productImageArray
                    }
                    productName={product.name}
                    carouselIndex={carouselIndex}
                    setCarouselIndex={setCarouselIndex}
                  />
                ) : (
                  <NoImage
                    className={`max-h-[45rem] w-full object-cover object-center lg:w-full`}
                  />
                )}
              </div>
            </a>
            <div className="product details product-item-details">
              <div className="product-item-main-info">
                <div className="product-item-sku">
                  <span className="label">Artikelnr</span>
                  <span>{product.sku}</span>
                </div>
                <div className={`product-item-brand`}>
                  <span className="label">Producer</span>
                  <span>{manufacturerData}</span>
                </div>
                <strong className="product name product-item-name">
                  <a
                    href={productUrl as string}
                    onClick={onProductClick}
                    className="product-item-link"
                  >{product.name !== null && htmlStringDecode(product.name)}</a>
                </strong>
                <div className={`product description product-item-description`}>
                  {product.short_description?.html && (
                    <div className={`product description product-item-description`}
                         dangerouslySetInnerHTML={{
                           __html: product.short_description.html,
                         }}>
                    </div>
                  )}
                </div>
                {
                  (showPrice) ? (
                    (customerPrice?.price) ? (
                      <>
                        <div className="product-tile-price">
                          <div className="price-box price-final_price">
                            <span className="price-container price-final_price tax weee price">
                              {priceFormatter(customerPrice.price)} {currencySymbol}
                            </span>
                          </div>
                        </div>
                        <div className="product-tile-stock">
                          <div className="visma-stock-holder">
                            <span className="visma-stock">{customerPrice.stock_qty}</span>
                            <span className="label">Lager: </span>
                            <span className="unit">st</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <CustomerPriceShimmer/>
                    )
                  ) : (<></>)
                }
                <div className="amshopby-option-link">
                  {productManufacturer()}
                </div>
                {showPrice &&
                    <div className="visma-product-data-container">
                        <div className="visma-list-price-holder">
                            <span className="label">Listpris: </span>
                            <span className="visma-list-price value">
                    <ProductPrice
                        item={refinedProduct ?? item}
                        isBundle={isBundle}
                        isGrouped={isGrouped}
                        isGiftCard={isGiftCard}
                        isConfigurable={isConfigurable}
                        isComplexProductView={isComplexProductView}
                        discount={discount}
                        currencySymbol={currencySymbol}
                        currencyRate={currencyRate}
                    />
                  </span>
                        </div>
                      {(customerPrice?.price) ? (
                        <div className="visma-discount-holder">
                          <span className="label">Rabatt: </span>
                          <span className="visma-discount value">
                    {customerDiscount}%
                  </span>
                        </div>
                      ) : (
                        <DiscountShimmer/>
                      )}
                    </div>
                }
              </div>
              <div className="product-item-inner">
                <div className="add-to-container">
                  <div className="product actions product-item-actions">
                    <div className="actions-primary">
                      {product?.price_range?.minimum_price?.final_price?.value ? (
                        <>
                          <AddToCartButton onClick={handleAddToCart} addToCartState={addToCartState}/>
                        </>
                      ) : (<></>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </>
    );
  }

  return (
    <li className="item product product-item" key={productView?.id}>
      <div className="product-item-info">
        <a
          href={productUrl as string}
          onClick={onProductClick}
          className="product photo product-item-photo"
        >
          <div className="lazyload-image-wrapper  product-image-wrapper">
            {productImageArray.length ? (
              <ImageCarousel
                images={
                  optimizedImageArray.length
                    ? optimizedImageArray
                    : productImageArray
                }
                productName={product.name}
                carouselIndex={carouselIndex}
                setCarouselIndex={setCarouselIndex}
              />
          ) : (
            <NoImage
              className={`max-h-[45rem] w-full object-cover object-center lg:w-full`}
            />
          )}
        </div>
      </a>
      <div className="product details product-item-details">
        <div className="product-item-main-info">
          <div className="product-item-sku">
            <span className="label">Artikelnr</span>
            <span>{product.sku}</span>
          </div>
          <strong className="product name product-item-name">
            <a
              href={productUrl as string}
              onClick={onProductClick}
              className="product-item-link"
            >{product.name !== null && htmlStringDecode(product.name)}</a>
          </strong>
          {
            (showPrice) ? (
              (customerPrice?.price) ? (
                <>
                  <div className="product-tile-price">
                    <div className="price-box price-final_price">
                      <span className="price-container price-final_price tax weee price">
                        {priceFormatter(customerPrice.price)} {currencySymbol}
                      </span>
                    </div>
                  </div>
                  <div className="product-tile-stock">
                    <div className="visma-stock-holder">
                      <span className="visma-stock">{customerPrice.stock_qty}</span>
                      <span className="label">Lager: </span>
                      <span className="unit">st</span>
                    </div>
                  </div>
                </>
              ) : (
                <CustomerPriceShimmer/>
              )
            ) : (<></>)
          }
          <div className="amshopby-option-link">
            {productManufacturer()}
          </div>
          { showPrice &&
            <div className="visma-product-data-container">
              <div className="visma-list-price-holder">
                <span className="label">Listpris: </span>
                <span className="visma-list-price value">
                    <ProductPrice
                      item={refinedProduct ?? item}
                      isBundle={isBundle}
                      isGrouped={isGrouped}
                      isGiftCard={isGiftCard}
                      isConfigurable={isConfigurable}
                      isComplexProductView={isComplexProductView}
                      discount={discount}
                      currencySymbol={currencySymbol}
                      currencyRate={currencyRate}
                    />
                  </span>
              </div>
              {(customerPrice?.price) ? (
                <div className="visma-discount-holder">
                  <span className="label">Rabatt: </span>
                  <span className="visma-discount value">
                    {customerDiscount}%
                  </span>
                </div>
              ) : (
                <DiscountShimmer/>
              )}
            </div>
          }

          {/*
            //TODO: Wishlist button to be added later
            {flags.addToWishlist && widgetConfig.addToWishlist.enabled && (
              // TODO: Remove flag during phase 3 MSRCH-4278
              <div className="ds-sdk-wishlist ml-auto mt-md">
                <WishlistButton
                  productSku={item.product.sku}
                  type={widgetConfig.addToWishlist.placement}
                />
              </div>
            )} */}
        </div>
        <div className="product-item-inner">
          <div className="add-to-container">
            <div className="product actions product-item-actions">
              <div className="actions-primary">
                {product?.price_range?.minimum_price?.final_price?.value ? (
                    <>
                      <AddToCartButton onClick={handleAddToCart} addToCartState={addToCartState}/>
                    </>
                ) : (<></>)}
              </div>
            </div>
          </div>
        </div>
      </div>


      {productView?.options && productView.options?.length > 0 && (
          <div className="ds-sdk-product-item__product-swatch flex flex-row mt-sm text-sm text-primary">
            {productView?.options?.map(
                (swatches) =>
                    swatches.id == 'color' && (
                <SwatchButtonGroup
                  key={product?.sku}
                  isSelected={isSelected}
                  swatches={swatches.values ?? []}
                  showMore={onProductClick}
                  productUrl={productUrl as string}
                  onClick={handleSelection}
                  sku={product?.sku}
                />
              )
          )}
        </div>
      )}
    </div>
    </li>
  );
};

export default ProductItem;
