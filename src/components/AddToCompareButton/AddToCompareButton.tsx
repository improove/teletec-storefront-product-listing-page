
import { FunctionComponent } from 'preact';

import { useTranslation } from '../../context/translation';
import {AddToCompareState} from '../../types/interface';

export interface AddToCompareButtonProps {
  onClick: (e: any) => any;
  addToCompareState?: AddToCompareState;
}

export const AddToCompareButton: FunctionComponent<AddToCompareButtonProps> = ({
  onClick,
  addToCompareState,
}: AddToCompareButtonProps) => {
  const translation = useTranslation();

  return (
      <a  href="#"
          className="action tocompare"
          onClick={onClick}
      >
        <span>
          {(() => {
            switch (addToCompareState) {
              case "idle":   return translation.ProductCard.addToCompare;
              case "loading": return translation.ProductCard.addingToCompare;
              case "success":  return translation.ProductCard.addedToCompare;
              case "error":  return translation.ProductCard.errorToCompare;
              default:      return translation.ProductCard.addToCompare;
            }
          })()}
        </span>
        {/*{addToCartState === 'loading' ? translation.ProductCard.addingToCart : translation.ProductCard.addToCart}*/}
      </a>
  );
};
