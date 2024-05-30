/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import { useStore, useSensor } from '../../context';
import { Facet as FacetType, PriceFacet } from '../../types/interface';
import {FilterButton} from "../FilterButton";
import SliderDoubleControl from '../SliderDoubleControl';
import { RangeFacet } from './Range/RangeFacet';
import { ScalarFacet } from './Scalar/ScalarFacet';

interface FacetsProps {
  searchFacets: FacetType[];
  showFilters: boolean;
  setShowFilters: (showFilters: boolean) => void;
}

export const Facets: FunctionComponent<FacetsProps> = ({
  searchFacets,
  showFilters,
  setShowFilters,
}: FacetsProps) => {
  const {
    config: { priceSlider },
  } = useStore();

  const { screenSize } = useSensor();

  return (
    <div className="block active" id="layered-filter-block">
      <FilterButton
        displayFilter={() => setShowFilters(!showFilters)}
        type={(screenSize.mobile) ? 'mobile' : 'desktop'}
        showFilters={showFilters}
      />
      {(!screenSize.mobile || showFilters) &&
      <div className="block-content filter-content">
        <div className="filter-options" id="narrow-by-list">
          <form>
            {searchFacets?.map((facet) => {
              const bucketType = facet?.buckets[0]?.__typename;
              switch (bucketType) {
                case 'ScalarBucket':
                  return <ScalarFacet key={facet.attribute} filterData={facet} />;
                case 'RangeBucket':
                  return priceSlider ? (
                    <SliderDoubleControl filterData={facet as PriceFacet} />
                  ) : (
                    <RangeFacet
                      key={facet.attribute}
                      filterData={facet as PriceFacet}
                    />
                  );
                case 'CategoryView':
                  return <ScalarFacet key={facet.attribute} filterData={facet} />;
                default:
                  return null;
              }
            })}
          </form>
        </div>
      </div>
      }
    </div>
  );
};
