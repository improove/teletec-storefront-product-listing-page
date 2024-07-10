/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import { useTranslation } from '../../context/translation';
// import AdjustmentsIcon from '../../icons/adjustments.svg';

export interface FilterButtonProps {
  displayFilter: () => void;
  type: string;
  showFilters: boolean;
}
export const FilterButton: FunctionComponent<FilterButtonProps> = ({
  displayFilter,
  type,
  showFilters,
}: FilterButtonProps) => {
  const translation = useTranslation();

  return type == 'mobile' ? (
    <button className="block-title filter-title"
            onClick={displayFilter}>
      <strong>{showFilters ? translation.Filter.hideTitle : translation.Filter.showTitle}</strong>
    </button>
  ) : (
    <div className="block-title filter-title ds-sdk-filter-button-desktop">
      <strong
        className="flex items-center"
      >
        {translation.Filter.title}
      </strong>
    </div>
  );
};
