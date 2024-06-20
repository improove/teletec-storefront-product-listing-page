/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import ViewSwitcher from 'src/components/ViewSwitcher';

import Facets from '../components/Facets';
import { FilterButton } from '../components/FilterButton';
import { SearchBar } from '../components/SearchBar';
import { SortDropdown } from '../components/SortDropdown';
import {
  useAttributeMetadata,
  useProducts,
  useSearch,
  useStore,
  useTranslation,
} from '../context';
import { Facet, PageInfo } from '../types/interface';
import { getValueFromUrl, handleUrlSort } from '../utils/handleUrlFilters';
import {
  defaultSortOptions,
  generateGQLSortInput,
  getSortOptionsfromMetadata,
} from '../utils/sort';

interface Props {
  facets: Facet[];
  totalCount: number;
  screenSize: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
    columns: number;
  };
  pageInfo?: PageInfo;
}
export const ProductsHeader: FunctionComponent<Props> = ({
  facets,
  totalCount,
  screenSize,
  pageInfo,
}) => {
  const searchCtx = useSearch();
  const storeCtx = useStore();
  const attributeMetadata = useAttributeMetadata();
  const productsCtx = useProducts();
  const translation = useTranslation();

  const [showMobileFacet, setShowMobileFacet] = useState(
    !!productsCtx.variables.filter?.length
  );
  const [sortOptions, setSortOptions] = useState(defaultSortOptions());

  const getSortOptions = useCallback(() => {
    setSortOptions(
      getSortOptionsfromMetadata(
        translation,
        attributeMetadata?.sortable,
        storeCtx?.config?.displayOutOfStock,
        storeCtx?.config?.currentCategoryUrlPath
      )
    );
  }, [storeCtx, translation, attributeMetadata]);

  useEffect(() => {
    getSortOptions();
  }, [getSortOptions]);

  const defaultSortOption = storeCtx.config?.currentCategoryUrlPath
    ? 'position_ASC'
    : 'relevance_DESC';
  const sortFromUrl = getValueFromUrl('product_list_order');
  const sortByDefault = sortFromUrl ? sortFromUrl : defaultSortOption;
  const [sortBy, setSortBy] = useState<string>(sortByDefault);
  const onSortChange = (sortOption: string) => {
    setSortBy(sortOption);
    searchCtx.setSort(generateGQLSortInput(sortOption));
    handleUrlSort(sortOption);
  };

  const resultsTranslation = translation.CategoryFilters.productsShown;
  const from = ( pageInfo) ? (pageInfo?.current_page * productsCtx.pageSize - productsCtx.pageSize + 1) : 0;
  const to = ( pageInfo) ? (pageInfo?.current_page * productsCtx.pageSize - productsCtx.pageSize + pageInfo.page_size) : 0;
  const results = resultsTranslation
      .replace('{from}', from)
      .replace('{to}', to)
      .replace('{totalCount}', `${totalCount}`);

  return (
    <div className="toolbar toolbar-products">
        <div className="modes-amount-container">
          {storeCtx?.config?.listview && <ViewSwitcher/>}
          {(totalCount > 0) && <p className="toolbar-amount" id="toolbar-amount">{results}</p>}
        </div>
        <div>
          {storeCtx.config.displaySearchBox && ! (productsCtx.totalCount > 0) && (
              <SearchBar
                  phrase={searchCtx.phrase}
                  onKeyPress={(e: any) => {
                    if (e.key === 'Enter') {
                      searchCtx.setPhrase(e?.target?.value);
                    }
                  }}
                  onClear={() => searchCtx.setPhrase('')}
                  placeholder={translation.SearchBar.placeholder}
              />
          )}

        {totalCount > 0 && (
            <>
              <div className="toolbar-sorter sorter">
                <SortDropdown
                  sortOptions={sortOptions}
                  value={sortBy}
                  screenSize={screenSize}
                  onChange={onSortChange}
                />
              </div>
            </>
        )}
      </div>
      {screenSize.mobile && showMobileFacet && facets && <></>}
    </div>
  );
};
