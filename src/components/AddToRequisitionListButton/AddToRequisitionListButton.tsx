
import { FunctionComponent } from 'preact';

import { useTranslation } from '../../context/translation';
import {AddToRequisitionListState} from '../../types/interface';

export interface AddToRequisitionListButtonProps {
  onClick: (e: any) => any;
  addToRequisitionListState?: AddToRequisitionListState;
}

export const AddToRequisitionListButton: FunctionComponent<AddToRequisitionListButtonProps> = ({
  onClick,
  addToRequisitionListState,
}: AddToRequisitionListButtonProps) => {
  const translation = useTranslation();

  return (
    <>
      <div className={"block block-requisition-list social-button"}>
          <div className={"split button requisition-list-action"}>
              <button className={"action requisition-list-button toggle change"}>
                  <span>{translation.ProductCard.addToRequisitionList}</span>
              </button>
          </div>
      </div>
      <a  href="#"
          className="action tocompare"
          onClick={onClick}
      >
        <span>
          {(() => {
            switch (addToRequisitionListState) {
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
    </>
  );
};
