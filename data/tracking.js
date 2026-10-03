import { products } from "./products.js";

const orders = JSON.parse(localStorage.getItem("orders")) || [];

const urlParams = new URLSearchParams(window.location.search);

const orderId = urlParams.get("orderId");

const productId = urlParams.get("productId");

const trackingDeliveryDate = document.querySelector(".tracking-delivery-date");

const trackingProductName = document.querySelector(".tracking-product-name");

const trackingProductQuantity = document.querySelector(
  ".tracking-product-quantity",
);

const trackingProductImage = document.querySelector(".tracking-product-image");

const cartQuantityElement = document.querySelector(".cart-quantity");

function updateCartQuantity() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const quantity = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = quantity;
  }
}

function getOrder() {
  return orders.find((order) => {
    return order.id === orderId;
  });
}

function renderTracking() {
  const order = getOrder();

  if (!order) {
    trackingProductName.innerHTML = "Order not found.";

    return;
  }

  const orderProduct = order.products.find((item) => {
    return item.productId === productId;
  });

  if (!orderProduct) {
    trackingProductName.innerHTML = "Product not found.";

    return;
  }

  const product = products.find((product) => {
    return product.id === orderProduct.productId;
  });

  if (!product) {
    trackingProductName.innerHTML = "Product not found.";

    return;
  }

  trackingDeliveryDate.innerHTML = order.deliveryDate;

  trackingProductName.innerHTML = product.name;

  trackingProductQuantity.innerHTML = orderProduct.quantity;

  trackingProductImage.src = product.image;
}

updateCartQuantity();

renderTracking();
