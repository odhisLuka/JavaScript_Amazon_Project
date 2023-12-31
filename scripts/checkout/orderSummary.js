import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import {
  deliveryOptions,
  getDeliveryOption,
  calculateDeliveryDate,
} from "../../data/deliveryOptions.js";

import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
  // generate HTML
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    // search for other product details of cartItem using its productId
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
        <div class="cart-item-container js-cart-item-container-${
          matchingProduct.id
        }">
          <div class="delivery-date">
            Delivery date: ${dateString}
          </div>

          <div class="cart-item-details-grid">
            <img class="product-image" src="${matchingProduct.image}">

            <div class="cart-item-details">
              <div class="product-name">
                ${matchingProduct.name}
              </div>
              <div class="product-price">
                ${formatCurrency(matchingProduct.priceCents)}
              </div>
              <div class="product-quantity">
                <span>
                  Quantity: <span class="quantity-label js-quantity-label-${
                    matchingProduct.id
                  }">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-quantity-link"  data-product-id="${
                  matchingProduct.id
                }">
                  Update
                </span>
                <input type="text" class="quantity-input js-update-quantity-${
                  matchingProduct.id
                }"">
                <span class="save-quantity-link link-primary" data-product-id="${
                  matchingProduct.id
                }">Save</span>
                <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
                  matchingProduct.id
                }">
                  Delete
                </span>
              </div>
            </div>

            <div class="delivery-options">
              <div class="delivery-options-title">
                Choose a delivery option:
              </div>

              ${deliveryOptionsHTML(matchingProduct, cartItem)}

            </div>
          </div>
        </div>
            `;
  });

  // generating HTML for delivery options dates
  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";

    deliveryOptions.forEach((deliveryOption) => {
      const dateString = calculateDeliveryDate(deliveryOption);

      const shippingPrice =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
      html += `
      <div class="delivery-option js-delivery-option"
      data-product-id="${matchingProduct.id}"
      data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" 
          ${isChecked ? "checked" : ""}
          class="delivery-option-input" 
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${shippingPrice} Shipping
          </div>
        </div>
      </div>
    `;
    });
    return html;
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  // make update link interactive
  document.querySelectorAll(".js-update-quantity-link").forEach((link) => {
    link.addEventListener("click", () => {
      const { productId } = link.dataset;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.add("is-editing-quantity");
    });
  });

  document.querySelectorAll(".save-quantity-link").forEach((savelink) => {
    savelink.addEventListener("click", () => {
      const { productId } = savelink.dataset;

      // get the user input value and update it as new user quantity
      // using updateQuantity(productId, newQuantity);
      const quantityInput = document.querySelector(
        `.js-update-quantity-${productId}`
      );
      const newQuantity = Number(quantityInput.value);

      if (newQuantity < 0 || newQuantity >= 1000) {
        alert("Quantity must be at least 0 and less than 1000");
        return;
      }
      updateQuantity(productId, newQuantity);

      // switch between save link and update link
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.remove("is-editing-quantity");

      // update the updated quantity in the HTML
      const quantityLabel = document.querySelector(
        `.js-quantity-label-${productId}`
      );
      quantityLabel.innerHTML = newQuantity;

      updateCartQuantity();
      renderPaymentSummary();
    });
  });

  // make delete link interactive
  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const { productId } = link.dataset;
      removeFromCart(productId);
      updateCartQuantity();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  // update number of items in the checkout header
  function updateCartQuantity() {
    const cartQty = calculateCartQuantity();
    const itemQuantity = document.querySelector(".js-return-to-home-link");
    itemQuantity.innerHTML = `${cartQty} items`;
  }
  updateCartQuantity();

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
