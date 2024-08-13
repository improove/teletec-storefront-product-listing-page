/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

import { useTranslation } from '../../context/translation';
import { useAccessibleDropdown } from '../../hooks/useAccessibleDropdown';
import Chevron from '../../icons/chevron.svg';
import SortIcon from '../../icons/sort.svg';
import { SortOption } from '../../types/interface';

export interface SortDropdownProps {
  value: string;
  sortOptions: SortOption[];
  onChange: (sortBy: string) => void;
  screenSize: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
    columns: number;
  };
}

export const SortDropdown: FunctionComponent<SortDropdownProps> = ({
  value,
  sortOptions,
  screenSize,
  onChange,
}: SortDropdownProps) => {
  const sortOptionButton = useRef<HTMLButtonElement | null>(null);
  const sortOptionMenu = useRef<HTMLDivElement | null>(null);

  const selectedOption = sortOptions.find((e) => e.value === value);

  const translation = useTranslation();
  const sortOptionTranslation = translation.SortDropdown.option;
  const sortOption = sortOptionTranslation.replace(
    '{selectedOption}',
    `${selectedOption?.label}`
  );

  const {
    isDropdownOpen,
    setIsDropdownOpen,
    activeIndex,
    setActiveIndex,
    select,
    setIsFocus,
    listRef,
  } = useAccessibleDropdown({
    options: sortOptions,
    value,
    onChange,
  });

  useEffect(() => {
    const menuRef = sortOptionMenu.current;
    const handleBlur = () => {
      setIsFocus(false);
      setIsDropdownOpen(false);
    };

    const handleFocus = () => {
      if (menuRef?.parentElement?.querySelector(':hover') !== menuRef &&
        menuRef?.parentElement?.querySelector('.selectric-items:hover') === null
      ) {
        setIsFocus(false);
        setIsDropdownOpen(false);
      }
    };

    menuRef?.addEventListener('blur', handleBlur);
    menuRef?.addEventListener('focusin', handleFocus);
    menuRef?.addEventListener('focusout', handleFocus);

    return () => {
      menuRef?.removeEventListener('blur', handleBlur);
      menuRef?.removeEventListener('focusin', handleFocus);
      menuRef?.removeEventListener('focusout', handleFocus);
    };
  }, [sortOptionMenu]);

  return (
    <>
      <div className={`selectric-wrapper selectric-sorter-options ${isDropdownOpen ? 'selectric-open' : ''} ${screenSize.mobile ? 'selectric-above' : 'selectric-below'}`} >
        <div
          ref={sortOptionMenu}
          class="selectric"
        >
          <button
            className="group flex justify-center items-center font-normal text-sm text-gray-700 rounded-md hover:cursor-pointer border-none bg-transparent hover:border-none hover:bg-transparent focus:border-none focus:bg-transparent active:border-none active:bg-transparent active:shadow-none h-full w-full px-sm"
            ref={sortOptionButton}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onFocus={() => setIsFocus(false)}
            onBlur={() => setIsFocus(false)}
          >
            {screenSize.mobile && (
              <span className="label">{translation.SortDropdown.title}</span>
            )}
            {!screenSize.mobile && (
              <span className="label">{selectedOption ? sortOption : translation.SortDropdown.title}</span>
            )}

            <Chevron
              className={`flex-shrink-0 m-auto ml-sm h-md w-md stroke-1 stroke-gray-600 ${
                isDropdownOpen ? '' : 'rotate-180'
              }`}
            />
          </button>
        </div>
        {isDropdownOpen && (
          <div className="selectric-items">
            <div className="selectric-scroll">
              <ul>
                {sortOptions.map((option, i) => (
                  <li
                    key={i}
                    aria-selected={option.value === selectedOption?.value}
                    onMouseOver={() => setActiveIndex(i)}
                    className={`${i === activeIndex ? 'selected highlighted' : ''}`}
                  >
                    <a onClick={() => {console.log('clicked'); select(option.value);}}>
                      {option.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
