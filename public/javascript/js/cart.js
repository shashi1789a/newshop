/* ========================================
   RECICLAJA - cart.js
   Shopping cart functionality
   ======================================== */

const CART_STORAGE_KEY = 'reciclaja_cart';

// ---------- Cart State ----------
function getCart() {
    return getStorage(CART_STORAGE_KEY, []);
}

function saveCart(cart) {
    setStorage(CART_STORAGE_KEY, cart);
}

// ---------- Add to Cart ----------
function addToCart(productId, size = null, quantity = 1) {
    const product = getProductById(productId);
    if (!product) {
        showToast('Product not found', 'error');
        return false;
    }

    let cart = getCart();
    const existingItem = cart.find(item => 
        item.productId === productId && item.size === (size || product.sizes[0])
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            size: size || product.sizes[0],
            quantity: quantity,
            addedAt: Date.now()
        });
    }

    saveCart(cart);
    updateCartBadge();
    showToast(`${product.brand} ${product.name} added to cart!`, 'success');
    return true;
}

// ---------- Remove from Cart ----------
function removeFromCart(productId, size) {
    let cart = getCart();
    cart = cart.filter(item => !(item.productId === productId && item.size === size));
    saveCart(cart);
    updateCartBadge();
    renderCartPage();
    showToast('Item removed from cart', 'info');
}

// ---------- Update Cart Quantity ----------
function updateCartQuantity(productId, size, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId, size);
        return;
    }

    let cart = getCart();
    const item = cart.find(item => item.productId === productId && item.size === size);
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
        updateCartBadge();
        renderCartPage();
    }
}

// ---------- Get Cart Items with Product Data ----------
function getCartItems() {
    const cart = getCart();
    return cart.map(item => {
        const product = getProductById(item.productId);
        return {
            ...item,
            product,
            total: product ? product.price * item.quantity : 0
        };
    }).filter(item => item.product);
}

// ---------- Get Cart Total ----------
function getCartTotal() {
    const items = getCartItems();
    return items.reduce((sum, item) => sum + item.total, 0);
}

// ---------- Get Cart Count ----------
function getCartCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// ---------- Update Cart Badge ----------
function updateCartBadge() {
    const count = getCartCount();
    const badge = document.querySelector('.header-actions .cart-badge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// ---------- Render Cart Page ----------
function renderCartPage() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    const items = getCartItems();

    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 60px 0;">
                <h3>Your cart is empty</h3>
                <p style="color: var(--color-text-muted);">Looks like you haven't added anything to your cart yet.</p>
                <a href="shop.html" class="btn btn-primary" style="margin-top: 20px;">Start Shopping</a>
            </div>
        `;
        document.getElementById('cart-summary').style.display = 'none';
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="cart-item" data-product-id="${item.productId}" data-size="${item.size}">
            <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4>${item.product.brand} ${item.product.name}</h4>
                <div class="meta">
                    <span>Size: ${item.size}</span>
                    <span>•</span>
                    <span>${item.product.condition}</span>
                </div>
                <div style="font-weight: 600; margin-top: 4px;">${formatPrice(item.product.price)}</div>
            </div>
            <div class="cart-item-actions" style="display: flex; align-items: center; gap: var(--spacing-md);">
                <div class="cart-item-quantity">
                    <button onclick="updateCartQuantity(${item.productId}, '${item.size}', ${item.quantity - 1})">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity(${item.productId}, '${item.size}', ${item.quantity + 1})">+</button>
                </div>
                <button class="btn-icon" onclick="removeFromCart(${item.productId}, '${item.size}')" aria-label="Remove item">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');

    // Update summary
    const subtotal = getCartTotal();
    const deliveryFee = subtotal > 0 ? (subtotal > 999 ? 0 : 99) : 0;
    const total = subtotal + deliveryFee;

    document.getElementById('cart-subtotal').textContent = formatPrice(subtotal);
    document.getElementById('cart-delivery').textContent = deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee);
    document.getElementById('cart-total').textContent = formatPrice(total);

    document.getElementById('cart-summary').style.display = 'block';
}

// ---------- Apply Coupon ----------
function applyCoupon() {
    const input = document.getElementById('coupon-input');
    const code = input.value.trim().toUpperCase();

    if (code === 'SAVE10') {
        showToast('Coupon applied! 10% off your order.', 'success');
        const subtotal = getCartTotal();
        const discount = subtotal * 0.1;
        document.getElementById('cart-discount').textContent = formatPrice(discount);
        document.getElementById('cart-total').textContent = formatPrice(subtotal + (subtotal > 999 ? 0 : 99) - discount);
        input.disabled = true;
    } else if (code === '') {
        showToast('Please enter a coupon code', 'warning');
    } else {
        showToast('Invalid coupon code', 'error');
    }
}

// ---------- Initialize Cart Page ----------
function initCartPage() {
    renderCartPage();
    updateCartBadge();

    const couponBtn = document.getElementById('apply-coupon');
    if (couponBtn) {
        couponBtn.addEventListener('click', applyCoupon);
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const items = getCartItems();
            if (items.length === 0) {
                showToast('Your cart is empty', 'warning');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }
}

// ---------- Initialize ----------
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    if (document.getElementById('cart-items')) {
        initCartPage();
    }
});

// Export
window.cart = {
    getCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartItems,
    getCartTotal,
    getCartCount,
    updateCartBadge,
    renderCartPage
};