// Initialize cart from localStorage or create empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Product data with local image paths
let products = [
    {
        id: 1,
        name: "Apple",
        price: 100,
        image: "images/Products/apple.png",
        quantity: 1
    },
    {
        id: 2,
        name: "Baby Cream",
        price: 150,
        image: "images/Products/Baby Cream.jpg",
        quantity: 1
    },
    {
        id: 3,
        name: "Baby Powder",
        price: 120,
        image: "images/Products/Baby Powder.jpg",
        quantity: 1
    },
    {
        id: 4,
        name: "Baby Shampoo",
        price: 180,
        image: "images/Products/Baby Shampoo.jpg",
        quantity: 1
    },
    {
        id: 5,
        name: "Baby Wipes",
        price: 200,
        image: "images/Products/Baby Wipes.jpg",
        quantity: 1
    },
    {
        id: 6,
        name: "Beard Oil",
        price: 250,
        image: "images/Products/Beard Oil.jpg",
        quantity: 1
    },
    {
        id: 7,
        name: "Chili",
        price: 80,
        image: "images/Products/chili.png",
        quantity: 1
    },
    {
        id: 8,
        name: "Face Cream",
        price: 300,
        image: "images/Products/Face Cream.jpg",
        quantity: 1
    },
    {
        id: 9,
        name: "Garlic",
        price: 60,
        image: "images/Products/garlic.png",
        quantity: 1
    },
    {
        id: 10,
        name: "Onion",
        price: 70,
        image: "images/Products/onion.png",
        quantity: 1
    }
];

function addToCart(name, price, image, quantity) {
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Add new item to cart
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1,
            unit: quantity
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show success message
    alert('Product added to cart successfully!');
    
    // Redirect to cart page
    window.location.href = 'Shopping Cart HTML.html';
}

// Function to update cart display
function updateCartDisplay() {
    const cartItems = document.querySelector('.products');
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    let totalPrice = 0;
    let totalItems = 0;
    let totalSavings = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        totalItems += item.quantity;
        
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='images/Products/default.jpg'">
            <div class="product-info">
                <h3 class="product-name">${item.name}</h3>
                <h4 class="product-price">Rs. ${item.price}</h4>
                <div class="product-quantity">
                    <button onclick="decreaseQuantity('${item.name}')">-</button>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.name}', this.value)">
                    <button onclick="increaseQuantity('${item.name}')">+</button>
                </div>
                <p class="product-remove" onclick="removeFromCart('${item.name}')">
                    <i class="fas fa-trash-alt"></i>
                    <span class="remove">Remove</span>
                </p>
            </div>
        `;
        cartItems.appendChild(productDiv);
    });
    
    // Update cart totals
    const cartTotal = document.querySelector('.cart-total');
    if (cartTotal) {
        cartTotal.querySelectorAll('p span')[1].innerText = `Rs. ${totalPrice.toFixed(2)}`;
        cartTotal.querySelectorAll('p span')[3].innerText = totalItems;
        cartTotal.querySelectorAll('p span')[5].innerText = `Rs. ${totalSavings.toFixed(2)}`;
    }
}

// Function to update item quantity
function updateQuantity(name, newQuantity) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity = parseInt(newQuantity) || 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Function to remove item from cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Function to render products in the cart
function renderCart() {
    const productsContainer = document.querySelector('.products');
    productsContainer.innerHTML = '';

    // Only show items that are in the cart
    cart.forEach(item => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='images/Products/default.jpg'">
            <div class="product-info">
                <h3 class="product-name">${item.name}</h3>
                <p class="product-price">Rs. ${item.price}</p>
                <div class="product-quantity">
                    <button onclick="decreaseQuantity('${item.name}')">-</button>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.name}', this.value)">
                    <button onclick="increaseQuantity('${item.name}')">+</button>
                </div>
                <button class="product-remove" onclick="removeFromCart('${item.name}')">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });

    updateCartTotal();
}

// Function to remove a product
function removeProduct(productId) {
    products = products.filter(product => product.id !== productId);
    renderCart();
}

// Function to increase quantity
function increaseQuantity(name) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Function to decrease quantity
function decreaseQuantity(name) {
    const item = cart.find(item => item.name === name);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Function to update quantity directly from input
function updateQuantity(productId, newQuantity) {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.quantity = Math.max(1, parseInt(newQuantity) || 1);
        renderCart();
    }
}

// Function to update cart total
function updateCartTotal() {
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    document.querySelector('.cart-total p:nth-child(1) span:last-child').textContent = `Rs. ${totalPrice}`;
    document.querySelector('.cart-total p:nth-child(2) span:last-child').textContent = totalItems;
}

// Initialize the cart when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
}); 