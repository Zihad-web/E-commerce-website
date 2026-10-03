import { products } from "./products.js";

const ordersGrid = document.querySelector(".orders-grid");

const cartQuantityElement = document.querySelector(".cart-quantity");

function getOrders() {
  const savedOrders = JSON.parse(localStorage.getItem("orders"));

  if (!Array.isArray(savedOrders)) {
    return [];
  }

  return savedOrders;
}

function getCartQuantity() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  return cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
}

function updateCartQuantity() {
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = getCartQuantity();
  }
}

function renderOrders() {
  const orders = getOrders();

  ordersGrid.innerHTML = "";

  if (orders.length === 0) {
    ordersGrid.innerHTML = `

      <div class="no-orders">

        <h2>
          You don't have any orders yet.
        </h2>

        <a href="amazon.html">
          Continue shopping
        </a>

      </div>

    `;

    return;
  }

  orders.forEach((order) => {
    let productsHTML = "";

    order.products.forEach((orderProduct) => {
      const product = products.find((product) => {
        return product.id === orderProduct.productId;
      });

      if (!product) {
        return;
      }

      productsHTML += `

          <div class="order-details-grid">

            <div class="product-image-container">

              <img
                src="${product.image}"
              >

            </div>


            <div class="product-details">

              <div class="product-name">
                ${product.name}
              </div>

              <div class="product-delivery-date">
                Arriving on: ${order.deliveryDate}
              </div>

              <div class="product-quantity">
                Quantity: ${orderProduct.quantity}
              </div>

              <button
                class="buy-again-button button-primary"
                data-product-id="${product.id}"
              >

                <img
                  src="images/icons/buy-again.png"
                >

                Buy it again

              </button>

            </div>


            <div class="product-actions">

            <a
            href="tracking.html?orderId=${order.id}&productId=${product.id}"
          >

                <button
                  class="track-package-button button-secondary"
                >
                  Track package
                </button>

              </a>

            </div>

          </div>

        `;
    });

    ordersGrid.innerHTML += `

      <div class="order-container">

        <div class="order-header">

          <div class="order-header-left-section">

            <div class="order-header-label">
              Order Placed:
            </div>

            <div>
              ${order.orderDate}
            </div>

          </div>


          <div class="order-header-left-section">

            <div class="order-header-label">
              Total:
            </div>

            <div>
              $${order.total.toFixed(2)}
            </div>

          </div>


          <div class="order-header-left-section">

            <div class="order-header-label">
              Order ID:
            </div>

            <div>
              ${order.id}
            </div>

          </div>


          <div class="order-header-right-section">

            <div class="order-header-label">
              Order Details
            </div>

            <a href="#">
              View order
            </a>

          </div>

        </div>

        ${productsHTML}

      </div>

    `;
  });

  addBuyAgainEvents();
}

function addBuyAgainEvents() {
  document.querySelectorAll(".buy-again-button").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;

      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingItem = cart.find((item) => {
        return item.productId === productId;
      });

      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({
          productId: productId,

          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      updateCartQuantity();
    });
  });
}

updateCartQuantity();

renderOrders();
