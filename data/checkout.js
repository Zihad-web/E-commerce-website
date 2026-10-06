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

const orderTotalPrice = document.querySelector(".order-total-price");

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
  return cart.reduce((total, cartItem) => {
    const product = products.find((product) => {
      return product.id === cartItem.productId;
    });

    if (!product) {
      return total;
    }

    return total + product.priceCents * cartItem.quantity;
  }, 0);
}

function getShippingCost() {
  let shippingCents = 0;

  document
    .querySelectorAll(".delivery-option-input:checked")
    .forEach((input) => {
      shippingCents += Number(input.dataset.shipping);
    });

  return shippingCents;
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function getDeliveryDate(days) {
  const date = new Date();

  date.setDate(date.getDate() + days);

  return formatDate(date);
}

function updateCheckoutHeader() {
  checkoutItemsQuantity.innerHTML = getCartQuantity();
}

function updatePaymentSummary() {
  const productsPrice = getProductsPrice();

  const shippingCents = getShippingCost();

  const totalBeforeTaxCents = productsPrice + shippingCents;

  const taxCents = Math.round(totalBeforeTaxCents * 0.1);

  const orderTotalCents = totalBeforeTaxCents + taxCents;

  itemsPrice.innerHTML = `Items (${getCartQuantity()}):`;

  itemsPriceValue.innerHTML = `$${(productsPrice / 100).toFixed(2)}`;

  shippingPrice.innerHTML = `$${(shippingCents / 100).toFixed(2)}`;

  totalBeforeTax.innerHTML = `$${(totalBeforeTaxCents / 100).toFixed(2)}`;

  taxPrice.innerHTML = `$${(taxCents / 100).toFixed(2)}`;

  orderTotalPrice.innerHTML = `$${(orderTotalCents / 100).toFixed(2)}`;
}

function renderCheckout() {
  orderSummary.innerHTML = "";

  if (cart.length === 0) {
    orderSummary.innerHTML = `

      <div class="empty-cart">

        <div>
          Your cart is empty.
        </div>

        <a
          class="link-primary"
          href="amazon.html"
        >
          Continue shopping
        </a>

      </div>

    `;

    updateCheckoutHeader();
    updatePaymentSummary();

    return;
  }

  cart.forEach((cartItem) => {
    const product = products.find((product) => {
      return product.id === cartItem.productId;
    });

    if (!product) {
      return;
    }

    orderSummary.innerHTML += `

      <div
        class="cart-item-container"
        data-product-id="${product.id}"
      >

        <div class="delivery-date">

          Delivery date:
          ${getDeliveryDate(3)}

        </div>


        <div class="cart-item-details-grid">

          <img
            class="product-image"
            src="${product.image}"
          >


          <div class="cart-item-info">

            <div class="product-name">
              ${product.name}
            </div>


            <div class="product-price">
              $${(product.priceCents / 100).toFixed(2)}
            </div>


            <div class="product-quantity">

              Quantity:
              <span class="quantity-value">
                ${cartItem.quantity}
              </span>


              <a
                class="update-quantity-link link-primary"
                href="#"
              >
                Update
              </a>


              <a
                class="delete-quantity-link link-primary"
                href="#"
              >
                Delete
              </a>

            </div>

          </div>


          <div class="delivery-options">

            <div class="delivery-options-title">
              Choose a delivery option:
            </div>


            <label class="delivery-option">

              <input
                type="radio"
                class="delivery-option-input"
                name="delivery-${product.id}"
                data-shipping="0"
                checked
              >


              <div>

                <div class="delivery-option-date">
                  ${getDeliveryDate(3)}
                </div>

                <div class="delivery-option-price">
                  FREE Shipping
                </div>

              </div>

            </label>


            <label class="delivery-option">

              <input
                type="radio"
                class="delivery-option-input"
                name="delivery-${product.id}"
                data-shipping="499"
              >


              <div>

                <div class="delivery-option-date">
                  ${getDeliveryDate(2)}
                </div>

                <div class="delivery-option-price">
                  $4.99 - Shipping
                </div>

              </div>

            </label>


            <label class="delivery-option">

              <input
                type="radio"
                class="delivery-option-input"
                name="delivery-${product.id}"
                data-shipping="999"
              >


              <div>

                <div class="delivery-option-date">
                  ${getDeliveryDate(1)}
                </div>

                <div class="delivery-option-price">
                  $9.99 - Shipping
                </div>

              </div>

            </label>

          </div>

        </div>

      </div>

    `;
  });

  updateCheckoutHeader();

  updatePaymentSummary();

  addDeleteEvents();

  addUpdateEvents();

  addDeliveryEvents();
}

function addDeleteEvents() {
  document.querySelectorAll(".delete-quantity-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const container = link.closest(".cart-item-container");

      const productId = container.dataset.productId;

      const cartIndex = cart.findIndex((cartItem) => {
        return cartItem.productId === productId;
      });

      if (cartIndex !== -1) {
        cart.splice(cartIndex, 1);
      }

      saveCart();

      renderCheckout();
    });
  });
}

function addUpdateEvents() {
  document.querySelectorAll(".update-quantity-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const container = link.closest(".cart-item-container");

      const productId = container.dataset.productId;

      const quantityElement = container.querySelector(".quantity-value");

      const currentQuantity = Number(quantityElement.innerHTML);

      const newQuantity = prompt("Enter quantity:", currentQuantity);

      if (newQuantity === null) {
        return;
      }

      const quantity = Number(newQuantity);

      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        alert("Please enter a quantity between 1 and 99.");

        return;
      }

      const cartItem = cart.find((item) => {
        return item.productId === productId;
      });

      if (cartItem) {
        cartItem.quantity = quantity;
      }

      saveCart();

      renderCheckout();
    });
  });
}

function addDeliveryEvents() {
  document.querySelectorAll(".delivery-option-input").forEach((input) => {
    input.addEventListener("change", () => {
      updatePaymentSummary();
    });
  });
}

function getSelectedDeliveryDate() {
  const selectedOption = document.querySelector(
    ".delivery-option-input:checked",
  );

  if (!selectedOption) {
    return getDeliveryDate(3);
  }

  const deliveryOptions = selectedOption.closest(".cart-item-container");

  const date = deliveryOptions.querySelector(".delivery-option-input:checked");

  if (!date) {
    return getDeliveryDate(3);
  }

  return date.closest(".delivery-option").querySelector(".delivery-option-date")
    .innerHTML;
}

function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty.");

    return;
  }

  const productsPrice = getProductsPrice();

  const shippingCents = getShippingCost();

  const totalBeforeTaxCents = productsPrice + shippingCents;

  const taxCents = Math.round(totalBeforeTaxCents * 0.1);

  const orderTotalCents = totalBeforeTaxCents + taxCents;

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const orderId = Date.now().toString();

  const orderDate = formatDate(new Date());

  const deliveryDate = getSelectedDeliveryDate();

  const newOrder = {
    id: orderId,

    orderDate: orderDate,

    deliveryDate: deliveryDate,

    total: orderTotalCents / 100,

    products: cart.map((cartItem) => {
      return {
        productId: cartItem.productId,

        quantity: cartItem.quantity,
      };
    }),
  };

  orders.unshift(newOrder);

  localStorage.setItem("orders", JSON.stringify(orders));

  cart.length = 0;

  saveCart();

  window.location.href = "orders.html";
}

placeOrderButton.addEventListener("click", placeOrder);

renderCheckout();
