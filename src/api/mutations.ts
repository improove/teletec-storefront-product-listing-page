const CREATE_EMPTY_CART = `
  mutation createEmptyCart($input: createEmptyCartInput) {
    createEmptyCart(input: $input)
  }
`;

const ADD_TO_CART = `
  mutation addProductsToCart(
    $cartId: String!
    $cartItems: [CartItemInput!]!
  ) {
      addProductsToCart(
        cartId: $cartId
        cartItems: $cartItems
      ) {
          cart {
            items {
              product {
                name
                sku
              }
              quantity
            }
          }
          user_errors {
            code
            message
          }
      }
  }
`;

const ADD_TO_COMPARE = `
  mutation addProductsToCompareList(
    $input: AddProductsToCompareListInput
  ) {
      addProductsToCompareList(
        input: $input
      ) {
          uid,
          item_count
      }
  }
`;

const CREATE_COMPARE_LIST = `
  mutation createCompareList(
    $input: CreateCompareListInput
  ) {
      createCompareList(
        input: $input
      ) {
          uid,
          item_count
      }
  }
`;

export { ADD_TO_CART, CREATE_EMPTY_CART, ADD_TO_COMPARE, CREATE_COMPARE_LIST };
