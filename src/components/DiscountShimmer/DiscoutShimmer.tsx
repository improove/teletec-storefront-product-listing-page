/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import '../DiscountShimmer/DiscountShimmer.css';

export const DiscoutShimmer: FunctionComponent = () => {
  return (
    <>
      <div className="visma-discount-holder ds-plp-facets ds-plp-facets--loading shimmer-animation">
        <span className="label">Rabatt: </span>
        <span className="visma-discount value"></span>
      </div>
    </>
  );
};

export default DiscoutShimmer;
