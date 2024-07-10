/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { JSXInternal } from 'preact/src/jsx';

import CloseIcon from '../../icons/plus.svg';
export interface PillProps {
  label: string;
  attribute?: string|null;
  onClick: () => void;
  CTA?: JSXInternal.Element;
  classes?: string;
  type?: string;
}

const defaultIcon = (
  <CloseIcon className="h-[12px] w-[12px] rotate-45 inline-block ml-sm cursor-pointer  fill-gray-700" />
);

// TODO: add support later to pass classes to the container div
export const Pill: FunctionComponent<PillProps> = ({
  label,
  attribute,
  onClick,
}) => {
  return (
    <>
      <li className={`item am-shopby-item`} key={label}>
        {attribute && <span className={`filter-label`}>{attribute}:</span>}
        <span className={`filter-value am-filter-value`}>{label}</span>
        <a href={`#`} onClick={onClick} className={`action remove`}><span>Ta bort denna produkt</span></a>
      </li>
    </>
  );
};
