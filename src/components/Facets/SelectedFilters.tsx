/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import { useProducts, useSearch, useSensor, useTranslation } from '../../context';
import Pill from '../Pill';
import { formatBinaryLabel, formatRangeLabel } from './format';

export const SelectedFilters: FunctionComponent = ({}) => {
  const searchCtx = useSearch();
  const productsCtx = useProducts();
  const { screenSize } = useSensor();
  const translation = useTranslation();

  return (
    (searchCtx.filters?.length > 0 && !screenSize.mobile) ? (
      <>
        <div className="filter-current am-filter-current">
          <ol className={'items'}>
            {searchCtx.filters.map((filter) => (
              <div key={filter.attribute}>
                {filter.in?.map((option) => (
                  <Pill
                    key={formatBinaryLabel(
                      filter,
                      option,
                      searchCtx.categoryNames,
                      productsCtx.categoryPath
                    )}
                    label={formatBinaryLabel(
                      filter,
                      option,
                      searchCtx.categoryNames,
                      productsCtx.categoryPath
                    )}
                    attribute={filter.attribute}
                    type="transparent"
                    onClick={() => searchCtx.updateFilterOptions(filter, option)}
                  />
                ))}
                {filter.range && (
                  <Pill
                    label={formatRangeLabel(
                      filter,
                      productsCtx.currencyRate,
                      productsCtx.currencySymbol
                    )}
                    attribute={filter.attribute}
                    type="transparent"
                    onClick={() => {
                      searchCtx.removeFilter(filter.attribute);
                    }}
                  />
                )}
              </div>
            ))}
          </ol>
        </div>
        <div className="block-actions filter-actions">
          <a href={`#`} className={`action clear filter-clear`} onClick={() => searchCtx.clearFilters()}>
            <span>Töm alla</span>
          </a>
        </div>
      </>
  )
:
  <></>
)
  ;
};
