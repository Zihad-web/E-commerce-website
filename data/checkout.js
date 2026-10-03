import { cart } from "./cart.js";
import { products } from "./products.js";

const orderSummary = document.querySelector(".order-summary");

const checkoutItemsQuantity = document.querySelector(
  ".checkout-items-quantity",
);

const itemsPrice = document.querySelector(".items-price");

const itemsPriceValue = document.querySelector(".items-price-value");

const shippingPrice = document.querySelector(".shipping-price");

const totalBeforeTax = document.querySelector(".total-before-tax");

const taxPrice = document.querySelector(".tax-price");

const orderTotal = document.querySelector(".order-total-price");

const placeOrderButton = document.querySelector(".place-order-button");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getCartQuantity() {
  return cart.reduce((total, cartItem) => {
    return total + cartItem.quantity;
  }, 0);
}

function getProductsPrice() {
  let productsPrice = 0;

  cart.forEach((cartItem) => {
    const product = products.find((product) => {
      return product.id === cartItem.productId;
    });

    if (product) {
      productsPrice += product.priceCents * cartItem.quantity;
    }
  });

  return productsPrice;
}

function getShippingCost() {
  let shipping = 0;

  document.querySelectorAll(".delivery-option-input").forEach((radio) => {
    if (radio.checked) {
      shipping += Number(radio.dataset.shipping);
    }
  });

  return shipping;
}

function updatePaymentSummary() {
  const productsPrice = getProductsPrice();

  const shipping = getShippingCost();

  const beforeTax = productsPrice / 100 + shipping;

  const tax = beforeTax * 0.1;

  const total = beforeTax + tax;

  const totalQuantity = getCartQuantity();

  if (checkoutItemsQuantity) {
    checkoutItemsQuantity.innerHTML = totalQuantity;
  }

  if (itemsPrice) {
    itemsPrice.innerHTML = `Items (${totalQuantity}):`;
  }

  if (itemsPriceValue) {
    itemsPriceValue.innerHTML = `$${(productsPrice / 100).toFixed(2)}`;
  }

  if (shippingPrice) {
    shippingPrice.innerHTML = `$${shipping.toFixed(2)}`;
  }

  if (totalBeforeTax) {
    totalBeforeTax.innerHTML = `$${beforeTax.toFixed(2)}`;
  }

  if (taxPrice) {
    taxPrice.innerHTML = `$${tax.toFixed(2)}`;
  }

  if (orderTotal) {
    orderTotal.innerHTML = `$${total.toFixed(2)}`;
  }

  return {
    productsPrice,
    shipping,
    beforeTax,
    tax,
    total,
  };
}

function renderCheckout() {
  orderSummary.innerHTML = "";

  cart.forEach((cartItem, index) => {
    const product = products.find((product) => {
      return product.id === cartItem.productId;
    });

    if (!product) {
      return;
    }

    const quantity = cartItem.quantity;

    orderSummary.innerHTML += `

      <div class="cart-item-container">

        <div class="delivery-date">
          Delivery date: Tuesday, June 21
        </div>

        <div class="cart-item-details-grid">

          <img
            class="product-image"
            src="${product.image}"
          >

          <div class="cart-item-details">

            <div class="product-name">
              ${product.name}
            </div>

            <div class="product-price">
              $${(product.priceCents / 100).toFixed(2)}
            </div>

            <div class="product-quantity">

              <span>
                Quantity:

                <span class="quantity-label">
                  ${quantity}
                </span>
              </span>

              <span
                class="update-quantity-link link-primary"
                data-product-index="${index}"
              >
                Update
              </span>

              <span
                class="delete-quantity-link link-primary"
                data-product-index="${index}"
              >
                Delete
              </span>

            </div>

          </div>


          <div class="delivery-options">

            <div class="delivery-options-title">
              Choose a delivery option:
            </div>


            <div class="delivery-option">

              <input
                type="radio"
                checked
                class="delivery-option-input"
                name="delivery-option-${index}"
                data-shipping="0"
              >

              <div>

                <div class="delivery-option-date">
                  Tuesday, June 21
                </div>

                <div class="delivery-option-price">
                  FREE Shipping
                </div>

              </div>

            </div>


            <div class="delivery-option">

              <input
                type="radio"
                class="delivery-option-input"
                name="delivery-option-${index}"
                data-shipping="4.99"
              >

              <div>

                <div class="delivery-option-date">
                  Wednesday, June 15
                </div>

                <div class="delivery-option-price">
                  $4.99 - Shipping
                </div>

              </div>

            </div>


            <div class="delivery-option">

              <input
                type="radio"
                class="delivery-option-input"
                name="delivery-option-${index}"
                data-shipping="9.99"
              >

              <div>

                <div class="delivery-option-date">
                  Monday, June 13
                </div>

                <div class="delivery-option-price">
                  $9.99 - Shipping
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    `;
  });

  updatePaymentSummary();

  addDeleteEvents();

  addUpdateEvents();

  addDeliveryEvents();
}

function addDeleteEvents() {
  document.querySelectorAll(".delete-quantity-link").forEach((button) => {
    button.addEventListener("click", () => {
      const productIndex = Number(button.dataset.productIndex);

      cart.splice(productIndex, 1);

      saveCart();

      renderCheckout();
    });
  });
}

function addUpdateEvents() {
  document.querySelectorAll(".update-quantity-link").forEach((button) => {
    button.addEventListener("click", () => {
      const productIndex = Number(button.dataset.productIndex);

      const cartItem = cart[productIndex];

      const quantityLabel =
        button.parentElement.querySelector(".quantity-label");

      quantityLabel.innerHTML = `

          <input
            class="quantity-input"
            type="number"
            min="1"
            value="${cartItem.quantity}"
          >

          <span
            class="save-quantity-link link-primary"
          >
            Save
          </span>

        `;

      button.style.display = "none";

      const input = quantityLabel.querySelector(".quantity-input");

      const saveButton = quantityLabel.querySelector(".save-quantity-link");

      saveButton.addEventListener("click", () => {
        const newQuantity = Number(input.value);

        if (!Number.isInteger(newQuantity) || newQuantity < 1) {
          return;
        }

        cartItem.quantity = newQuantity;

        saveCart();

        renderCheckout();
      });
    });
  });
}

function addDeliveryEvents() {
  document.querySelectorAll(".delivery-option-input").forEach((radio) => {
    radio.addEventListener("change", () => {
      updatePaymentSummary();
    });
  });
}

function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty.");

    return;
  }

  const payment = updatePaymentSummary();

  const orderId = Date.now().toString();

  const today = new Date();

  const orderDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const deliveryDate = new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000);

  const deliveryDateText = deliveryDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const newOrder = {
    id: orderId,

    orderDate: orderDate,

    deliveryDate: deliveryDateText,

    total: payment.total,

    products: cart.map((cartItem) => {
      return {
        productId: cartItem.productId,

        quantity: cartItem.quantity,
      };
    }),
  };

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  orders.unshift(newOrder);

  localStorage.setItem("orders", JSON.stringify(orders));

  cart.length = 0;

  saveCart();

  window.location.href = "orders.html";
}

if (placeOrderButton) {
  placeOrderButton.addEventListener("click", placeOrder);
}

renderCheckout();
