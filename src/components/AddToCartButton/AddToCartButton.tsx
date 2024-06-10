/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import { useTranslation } from '../../context/translation';

export interface AddToCartButtonProps {
  onClick: (e: any) => any;
}

export const AddToCartButton: FunctionComponent<AddToCartButtonProps> = ({
  onClick,
}: AddToCartButtonProps) => {
  const translation = useTranslation();

  return (
      <button
          className="action tocart"
          onClick={onClick}
      >
        {translation.ProductCard.addToCart}
      </button>
  );
};
