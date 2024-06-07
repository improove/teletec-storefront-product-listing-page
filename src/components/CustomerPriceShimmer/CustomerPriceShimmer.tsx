/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import '../CustomerPriceShimmer/CustomerPriceShimmer.css';

export const CustomerPriceShimmer: FunctionComponent = () => {
  return (
    <>
      <div className="product-tile-price-shimmer ds-plp-facets ds-plp-facets--loading">
        <div className="price-box-shimmer price-final_price shimmer-animation">

        </div>
      </div>
    </>
  );
};

export default CustomerPriceShimmer;
