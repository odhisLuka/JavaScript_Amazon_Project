// Use product data to generate HTML
let productsHTML = "";
products.forEach((product) => {
  productsHTML += `
    <div class="product-container">
        <div class="product-image-container">
          <img class="product-image" src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars" src="images/ratings/rating-${
            product.rating.stars * 10
          }.png">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${(product.priceCents / 100).toFixed(2)}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart-btn" 
        data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
  `;
});
document.querySelector(".products-grid").innerHTML = productsHTML;

// make add to cart btn interactive
document.querySelectorAll(".js-add-to-cart-btn").forEach((button) => {
  let addedMessageTimeoutId;

  button.addEventListener("click", () => {
    const { productId } = button.dataset;
    let matchingItem;
    cart.forEach((item) => {
      if (productId === item.productId) {
        matchingItem = item;
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
    let cartQty = 0;
    cart.forEach((item) => {
      cartQty += item.quantity;
    });
    document.querySelector(".cart-quantity").innerHTML = cartQty;

    // show added message
    const addedMessage = document.querySelector(
      `.js-added-to-cart-${productId}`
    );
    addedMessage.classList.add("added-to-cart-visible");

    setTimeout(() => {
      if (addedMessageTimeoutId) {
        clearTimeout(addedMessageTimeoutId);
      }

      const timeoutId = setTimeout(() => {
        addedMessage.classList.remove("added-to-cart-visible");
      }, 1500);

      addedMessageTimeoutId = timeoutId;
    });
  });
});
