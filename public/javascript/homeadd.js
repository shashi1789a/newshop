// const cart = [];

// document.addEventListener("DOMContentLoaded", () => {
//   const cartButtons = document.querySelectorAll(".cart-btn");

//   cartButtons.forEach((btn) => {
//     btn.addEventListener("click", (e) => {
//       const productBox = e.target.closest(".product-box");
//       const name = productBox.querySelector("strong").innerText;
//       const priceText = productBox.querySelector(".price").innerText;
//       const price = parseInt(priceText.replace("Rs. ", "").trim());

//       addToCart(name, price);
//     });
//   });

//   renderCart();
// });

// function addToCart(name, price) {
//   const existing = cart.find((item) => item.name === name);
//   if (existing) {
//     existing.quantity += 1;
//   } else {
//     cart.push({ name, price, quantity: 1 });
//   }
//   renderCart();
// }

// function removeFromCart(name) {
//   const index = cart.findIndex((item) => item.name === name);
//   if (index !== -1) {
//     cart.splice(index, 1);
//   }
//   renderCart();
// }

// function renderCart() {
//   const cartList = document.getElementById("cart-list");
//   cartList.innerHTML = "";

//   if (cart.length === 0) {
//     cartList.innerHTML = "<li>Your cart is empty.</li>";
//     return;
//   }

//   cart.forEach((item) => {
//     const li = document.createElement("li");
//     li.innerHTML = `
//       ${item.name} - Rs. ${item.price} x ${item.quantity}
//       <button onclick="removeFromCart('${item.name}')">Remove</button>
//     `;
//     cartList.appendChild(li);
//   });
// }




<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Grocery Shop</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }

    .product-heading {
      padding: 20px;
      background-color: #f2f2f2;
    }

    .product-heading h3 {
      margin: 0;
    }

    .product-container {
      display: flex;
      flex-wrap: wrap;
      padding: 20px;
      gap: 20px;
    }

    .product-box {
      border: 1px solid #ddd;
      padding: 10px;
      width: 200px;
      text-align: center;
      border-radius: 5px;
    }

    .product-box img {
      width: 100px;
      height: 100px;
      object-fit: contain;
    }

    .cart-btn, .like-btn, .remove-btn {
      display: inline-block;
      margin-top: 10px;
      padding: 6px 10px;
      border: none;
      background-color: #28a745;
      color: white;
      cursor: pointer;
      border-radius: 3px;
      text-decoration: none;
    }

    .like-btn {
      background-color: #ff4757;
    }

    #cart-section {
      padding: 20px;
      background-color: #f8f8f8;
    }

    #cart-section ul {
      list-style: none;
      padding: 0;
    }

    #cart-section li {
      padding: 8px 0;
    }

    #countdown {
      padding: 20px;
      background-color: #222;
      color: white;
      display: flex;
      justify-content: space-around;
      text-align: center;
    }

    #countdown div {
      flex: 1;
    }

    #countdown span {
      display: block;
      font-size: 24px;
      margin-top: 5px;
    }
  </style>
</head>
<body>

  <!-- Countdown Timer -->
  <div id="countdown">
    <div><strong>Days</strong><span id="days">0</span></div>
    <div><strong>Hours</strong><span id="hours">0</span></div>
    <div><strong>Mins</strong><span id="mins">0</span></div>
    <div><strong>Secs</strong><span id="seconds">0</span></div>
  </div>

  <!-- Product Section -->
  <section id="popular-product">
    <div class="product-heading">
      <h3>Popular Product</h3>
    </div>
    <div class="product-container">
      <div class="product-box">
        <img src="https://via.placeholder.com/100" alt="Apple">
        <strong>Apple</strong>
        <span class="quantity">1 KG</span>
        <span class="price">Rs. 100</span>
        <a class="cart-btn">Add to Cart</a>
        <a class="like-btn">❤</a>
      </div>
      <div class="product-box">
        <img src="https://via.placeholder.com/100" alt="Onion">
        <strong>Onion</strong>
        <span class="quantity">1 KG</span>
        <span class="price">Rs. 50</span>
        <a class="cart-btn">Add to Cart</a>
        <a class="like-btn">❤</a>
      </div>
      <div class="product-box">
        <img src="https://via.placeholder.com/100" alt="Potato">
        <strong>Potato</strong>
        <span class="quantity">1 KG</span>
        <span class="price">Rs. 60</span>
        <a class="cart-btn">Add to Cart</a>
        <a class="like-btn">❤</a>
      </div>
    </div>
  </section>

  <!-- Cart Section -->
  <section id="cart-section">
    <h3>Your Cart</h3>
    <ul id="cart-list"></ul>
  </section>

  <!-- JavaScript -->
  <script>
    const cart = [];

    document.addEventListener("DOMContentLoaded", () => {
      const productContainer = document.querySelector(".product-container");

      productContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("cart-btn")) {
          const productBox = e.target.closest(".product-box");
          const name = productBox.querySelector("strong").innerText.trim();
          const priceText = productBox.querySelector(".price").innerText;
          const price = parseInt(priceText.replace("Rs. ", "").trim());

          addToCart(name, price);
        }
      });

      renderCart();
    });

    function addToCart(name, price) {
      const existing = cart.find((item) => item.name === name);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ name, price, quantity: 1 });
      }
      renderCart();
    }

    function removeFromCart(name) {
      const index = cart.findIndex((item) => item.name === name);
      if (index !== -1) {
        cart.splice(index, 1);
      }
      renderCart();
    }

    function renderCart() {
      const cartList = document.getElementById("cart-list");
      cartList.innerHTML = "";

      if (cart.length === 0) {
        cartList.innerHTML = "<li>Your cart is empty.</li>";
        return;
      }

      let total = 0;

      cart.forEach((item) => {
        total += item.price * item.quantity;
        const li = document.createElement("li");
        li.innerHTML = `
          ${item.name} - Rs. ${item.price} x ${item.quantity}
          <button class="remove-btn" data-name="${item.name}">Remove</button>
        `;
        cartList.appendChild(li);
      });

      const totalItem = document.createElement("li");
      totalItem.innerHTML = `<strong>Total: Rs. ${total}</strong>`;
      cartList.appendChild(totalItem);

      document.querySelectorAll(".remove-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const name = btn.getAttribute("data-name");
          removeFromCart(name);
        });
      });
    }

    // Countdown Timer
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minsEl = document.getElementById("mins");
    const secondsEl = document.getElementById("seconds");

    const newYears = "9 Aug 2025";

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

    countdown();
    setInterval(countdown, 1000);
  </script>
</body>
</html>

