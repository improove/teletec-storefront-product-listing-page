/*
Copyright 2024 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useProducts, useTranslation } from 'src/context';
import { handleViewType } from 'src/utils/handleUrlFilters';

export const ViewSwitcher: FunctionComponent = () => {
  const { viewType, setViewType } = useProducts();

  const translation = useTranslation();

  const handleClick = (viewType: string): void => {
    handleViewType(viewType);
    setViewType(viewType);
  };

  return (
    <div className="modes">
      {(viewType === 'gridView') &&
        <>
          <strong className={`modes-mode mode-grid active`}>
              <span>{translation.ViewSwitcher.grid}</span>
          </strong>

          <span className={`modes-mode_label active`}>
            <span>{translation.ViewSwitcher.grid}</span>
          </span>

          <a className={`modes-mode mode-list`} onClick={() => handleClick('listView')}>
            <span>{translation.ViewSwitcher.list}</span>
          </a>
        </>
      }
      {
        (viewType === 'listView') &&
          <>
            <a className={`modes-mode mode-grid`} onClick={() => handleClick('gridView')}>
              <span>{translation.ViewSwitcher.grid}</span>
            </a>
            <span className={`modes-mode_label active`}>
              <span>{translation.ViewSwitcher.list}</span>
            </span>
            <strong className={`modes-mode mode-list active`}>
              <span>{translation.ViewSwitcher.list}</span>
            </strong>
          </>
      }
    </div>
  );
};
