export const cart = [];

export function addToCart(productId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  // when adding a product, instead of increasing the quantity by 1,
  // we'll increase the quantity by the number in the selector
  const selectorQty = Number(
    document.querySelector(`.js-quantity-selector-${productId}`).value
  );

  if (matchingItem) {
    matchingItem.quantity += selectorQty;
  } else {
    cart.push({
      productId,
      quantity: selectorQty,
    });
  }
}
