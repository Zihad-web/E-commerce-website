import { products } from "./products.js";

let savedCart = JSON.parse(localStorage.getItem("cart"));

if (!Array.isArray(savedCart)) {
  savedCart = [];
}

// Convert old cart format to the new quantity-based format
const normalizedCart = [];

savedCart.forEach((item) => {
  // Old format:
  // { id: "...", name: "...", priceCents: ... }

  if (item.id && !item.productId) {
    const existingItem = normalizedCart.find((cartItem) => {
      return cartItem.productId === item.id;
    });

    if (existingItem) {
      existingItem.quantity++;
    } else {
      normalizedCart.push({
        productId: item.id,
        quantity: 1,
      });
    }
  }

  // New format:
  // { productId: "...", quantity: 2 }
  else if (item.productId) {
    const existingItem = normalizedCart.find((cartItem) => {
      return cartItem.productId === item.productId;
    });

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      normalizedCart.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    }
  }
});

export const cart = normalizedCart;

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getCartQuantity() {
  return cart.reduce((total, cartItem) => {
    return total + cartItem.quantity;
  }, 0);
}

function updateCartQuantity() {
  const cartQuantityShower = document.querySelector(".cart-quantity");

  if (cartQuantityShower) {
    cartQuantityShower.innerHTML = getCartQuantity();
  }
}

document.querySelectorAll(".add-to-cart-button").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.dataset.productId;

    const product = products.find((product) => {
      return product.id === productId;
    });

    if (!product) {
      console.log("Product not found:", productId);
      return;
    }

    const existingItem = cart.find((cartItem) => {
      return cartItem.productId === productId;
    });

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({
        productId: productId,
        quantity: 1,
      });
    }

    saveCart();

    updateCartQuantity();

    console.log(cart);
  });
});

saveCart();

updateCartQuantity();
