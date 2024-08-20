/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import FilterButton from 'src/components/FilterButton';
import Loading from 'src/components/Loading';
import Shimmer from 'src/components/Shimmer';

import { CategoryFilters } from '../components/CategoryFilters';
import { SelectedFilters } from '../components/Facets';
import {
  useProducts,
  useSearch,
  useSensor,
  useStore,
  useTranslation,
} from '../context';
import { ProductsContainer } from './ProductsContainer';
import { ProductsHeader } from './ProductsHeader';

export const App: FunctionComponent = () => {
  const searchCtx = useSearch();
  const productsCtx = useProducts();
  const { screenSize } = useSensor();
  const translation = useTranslation();
  const { displayMode } = useStore().config;
  const [showFilters, setShowFilters] = useState(false);

  const loadingLabel = translation.Loading.title;

  let title = productsCtx.categoryName || '';
  if (productsCtx.variables.phrase) {
    const text = translation.CategoryFilters.results;
    title = text.replace('{phrase}', `"${productsCtx.variables.phrase ?? ''}"`);
  }
  const getResults = (totalCount: number) => {
    const resultsTranslation = translation.CategoryFilters.products;
    const results = resultsTranslation.replace('{totalCount}', `${totalCount}`);
    return results;
  };

  return (
    <>
      {productsCtx.loading ? (
        screenSize.mobile ? (
          <Loading label={loadingLabel}/>
        ) : (
          <Shimmer />
        )
      ) : (
        <>
          {!(displayMode === 'PAGE') &&
            (productsCtx.facets.length > 0 ? (
              <div className="ds-widgets">
                <div>
                  <CategoryFilters
                    loading={productsCtx.loading}
                    pageLoading={productsCtx.pageLoading}
                    facets={productsCtx.facets}
                    totalCount={productsCtx.totalCount}
                    categoryName={productsCtx.categoryName ?? ''}
                    phrase={productsCtx.variables.phrase ?? ''}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    filterCount={searchCtx.filterCount}
                  />
                  <div className="column main">
                    <SelectedFilters />
                    <ProductsContainer showFilters={showFilters} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="ds-widgets bg-body py-2">
                <div className="flex flex-col">
                  <div className="ds-widgets_results flex flex-col items-center w-full h-full">
                    <div className="flex w-full h-full">
                      {!(productsCtx.totalCount > 1) &&
                          <ProductsHeader
                              facets={productsCtx.facets}
                              totalCount={productsCtx.totalCount}
                              screenSize={screenSize}
                          />
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </>
      )}
    </>
  );
};

export default App;
