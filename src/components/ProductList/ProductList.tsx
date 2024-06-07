/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { HTMLAttributes } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';

import './product-list.css';

import { Alert } from '../../components/Alert';
import { ProductsHeader } from '../../containers/ProductsHeader';
import {useProducts, useSensor, useStore} from '../../context';
import {PageInfo, Product} from '../../types/interface';
import { classNames } from '../../utils/dom';
import {handleUrlPagination} from "../../utils/handleUrlFilters";
import {Pagination} from "../Pagination";
import ProductItem from '../ProductItem';

export interface ProductListProps extends HTMLAttributes<HTMLDivElement> {
  products: Array<Product> | null | undefined;
  numberOfColumns: number;
  showFilters: boolean;
  pageInfo?: PageInfo
}

export const ProductList: FunctionComponent<ProductListProps> = ({
  products,
  numberOfColumns,
  showFilters,
}) => {
  const productsCtx = useProducts();
  const {
    currencySymbol,
    currencyRate,
    setRoute,
    refineProduct,
    refreshCart,
    addToCart,
    totalPages,
    setCurrentPage,
    currentPage,
    customerPrices,
  } = productsCtx;

  useEffect(() => {
    if (currentPage < 1) {
      goToPage(1);
    }
  }, []);

  const goToPage = (page: number | string) => {
    if (typeof page === 'number') {
      setCurrentPage(page);
      handleUrlPagination(page);
    }
  };

  const [cartUpdated, setCartUpdated] = useState(false);
  const [itemAdded, setItemAdded] = useState('');
  const { viewType } = useProducts();
  const [error, setError] = useState<boolean>(false);
  const {
    config: { listview },
  } = useStore();

  const className = showFilters
    ? 'ds-sdk-product-list bg-body max-w-full pl-3 pb-2xl sm:pb-24'
    : 'ds-sdk-product-list bg-body w-full mx-auto pb-2xl sm:pb-24';

  const { screenSize } = useSensor();

  useEffect(() => {
    refreshCart && refreshCart();
  }, [itemAdded]);

  return (
    <div
      className='search results'
    >
      {cartUpdated && (
        <div className="mt-8">
          <Alert
            title={`You added ${itemAdded} to your shopping cart.`}
            type="success"
            description=""
            onClick={() => setCartUpdated(false)}
          />
        </div>
      )}
      {error && (
        <div className="mt-8">
          <Alert
            title={`Something went wrong trying to add an item to your cart.`}
            type="error"
            description=""
            onClick={() => setError(false)}
          />
        </div>
      )}

      {listview && viewType === 'listview' ? (
        <div className="w-full">
          <div className="ds-sdk-product-list__list-view-default mt-md grid grid-cols-none pt-[15px] w-full gap-[10px]">
            {products?.map((product) => (
              <ProductItem
                item={product}
                setError={setError}
                key={product?.productView?.id}
                currencySymbol={currencySymbol}
                currencyRate={currencyRate}
                setRoute={setRoute}
                refineProduct={refineProduct}
                setCartUpdated={setCartUpdated}
                setItemAdded={setItemAdded}
                addToCart={addToCart}
                customerPrice={customerPrices?.find(
                  (customerPrice) =>
                    customerPrice.sku === product.productView?.sku
                )}
              />
            ))}
          </div>
        </div>
      ) : (
        <div
          style={{
            gridTemplateColumns: `repeat(${numberOfColumns}, minmax(0, 1fr))`,
          }}
          className=""
          id="amasty-shopby-product-list"
        >
          <ProductsHeader
              facets={productsCtx.facets}
              totalCount={productsCtx.totalCount}
              screenSize={screenSize}
              pageInfo={productsCtx.pageInfo}
          />
          <div className="products wrapper grid products-grid">
            <ol className="products list items product-items">
              {products?.map((product) => (
                <ProductItem
                  item={product}
                  setError={setError}
                  key={product?.productView?.id}
                  currencySymbol={currencySymbol}
                  currencyRate={currencyRate}
                  setRoute={setRoute}
                  refineProduct={refineProduct}
                  setCartUpdated={setCartUpdated}
                  setItemAdded={setItemAdded}
                  addToCart={addToCart}
                  customerPrice={customerPrices?.find(
                    (customerPrice) =>
                      customerPrice.sku === product.productView?.sku
                  )}
                />
              ))}
            </ol>
          </div>
          <div className="toolbar toolbar-products">
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
