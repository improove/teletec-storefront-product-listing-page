/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import { useTranslation } from '../../context/translation';
import {AddToCartState} from '../../types/interface';

export interface AddToCartButtonProps {
  onClick: (e: any) => any;
  addToCartState?: AddToCartState;
}

export const AddToCartButton: FunctionComponent<AddToCartButtonProps> = ({
  onClick,
  addToCartState,
}: AddToCartButtonProps) => {
  const translation = useTranslation();

  return (
      <button
          className="action tocart"
          onClick={onClick}
      >
        {(() => {
          switch (addToCartState) {
            case "idle":   return translation.ProductCard.addToCart;
            case "loading": return translation.ProductCard.addingToCart;
            case "success":  return translation.ProductCard.addedToCart;
            case "error":  return translation.ProductCard.error;
            default:      return translation.ProductCard.addToCart;
          }
        })()}
        {/*{addToCartState === 'loading' ? translation.ProductCard.addingToCart : translation.ProductCard.addToCart}*/}
      </button>
  );
};
