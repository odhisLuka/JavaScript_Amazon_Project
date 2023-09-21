export let cart = JSON.parse(localStorage.getItem("cart"));
if (!cart) {
  cart = [
    {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
    },
    {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1,
    },
  ];
}

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

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
  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (productId !== cartItem.productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;

  saveToStorage();
}

export function calculateCartQuantity() {
  let cartQty = 0;

  cart.forEach((cartItem) => {
    cartQty += cartItem.quantity;
  });

  return cartQty;
}

// find matching product in the cart and update its quantity to the new quantity
export function updateQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.quantity = newQuantity;
  saveToStorage();
}
