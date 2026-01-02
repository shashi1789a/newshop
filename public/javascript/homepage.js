// Countdown timer
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minsEl = document.getElementById("mins");
const secondsEl = document.getElementById("seconds");

const newYears = " 9 Aug 2025";

function countdown() {
  const newYearsDate = new Date(newYears);
  const currentDate = new Date();

  const totalSeconds = (newYearsDate - currentDate) / 1000;

  const days = Math.floor(totalSeconds / 3600 / 24);
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const mins = Math.floor(totalSeconds / 60) % 60;
  const seconds = Math.floor(totalSeconds) % 60;

  daysEl.innerHTML = days;
  hoursEl.innerHTML = formatTime(hours);
  minsEl.innerHTML = formatTime(mins);
  secondsEl.innerHTML = formatTime(seconds);
}

function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

// initial call
countdown();
setInterval(countdown, 500);

// Product fetching and display
async function loadProducts() {
  try {
    const products = await api.getProducts();
    displayProducts(products);
  } catch (error) {
    console.error("Error loading products:", error);
    // You might want to show an error message to the user here
  }
}

function displayProducts(products) {
  const productsContainer = document.querySelector(".products-container");
  if (!productsContainer) return;

  products.forEach((product) => {
    const productElement = createProductElement(product);
    productsContainer.appendChild(productElement);
  });
}

function createProductElement(product) {
  const div = document.createElement("div");
  div.className = "product";
  div.innerHTML = `
        <div class="product-img">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-text">
            <a href="#" class="product-title">${product.name}</a>
            <p class="product-price">$${product.price}</p>
        </div>
        <button class="add-to-cart" onclick="addToCart('${product._id}')">
            Add to Cart
        </button>
    `;
  return div;
}

async function addToCart(productId) {
  try {
    const result = await api.addToCart(productId, 1);
    if (result.success) {
      // Show success message
      alert("Product added to cart successfully!");
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert("Failed to add product to cart. Please try again.");
  }
}

// Load products when the page loads
document.addEventListener("DOMContentLoaded", loadProducts);
