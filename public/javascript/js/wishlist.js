/* ========================================
   RECICLAJA - wishlist.js
   Wishlist functionality
   ======================================== */

const WISHLIST_STORAGE_KEY = 'reciclaja_wishlist';

// ---------- Wishlist State ----------
function getWishlist() {
    return getStorage(WISHLIST_STORAGE_KEY, []);
}

function saveWishlist(wishlist) {
    setStorage(WISHLIST_STORAGE_KEY, wishlist);
}

// ---------- Toggle Wishlist ----------
function toggleWishlist(productId) {
    let wishlist = getWishlist();
    const index = wishlist.indexOf(productId);

    if (index > -1) {
        wishlist.splice(index, 1);
        showToast('Removed from wishlist', 'info');
    } else {
        wishlist.push(productId);
        const product = getProductById(productId);
        showToast(`${product ? product.brand + ' ' + product.name : 'Item'} added to wishlist ❤️`, 'success');
    }

    saveWishlist(wishlist);
    updateWishlistBadge();
    renderWishlistPage();
    updateProductWishlistButtons();
}

// ---------- Is In Wishlist ----------
function isInWishlist(productId) {
    const wishlist = getWishlist();
    return wishlist.includes(productId);
}

// ---------- Get Wishlist Items ----------
function getWishlistItems() {
    const wishlist = getWishlist();
    return wishlist.map(id => getProductById(id)).filter(p => p);
}

// ---------- Update Wishlist Badge ----------
function updateWishlistBadge() {
    const count = getWishlist().length;
    const badge = document.querySelector('.header-actions .wishlist-badge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// ---------- Update Product Wishlist Buttons ----------
function updateProductWishlistButtons() {
    document.querySelectorAll('.product-card-wishlist').forEach(btn => {
        const card = btn.closest('.product-card');
        if (card) {
            const id = parseInt(card.dataset.productId);
            if (!isNaN(id)) {
                const isWishlisted = isInWishlist(id);
                btn.innerHTML = isWishlisted ? '❤' : '♡';
                btn.classList.toggle('active', isWishlisted);
                btn.setAttribute('aria-label', isWishlisted ? 'Remove from wishlist' : 'Add to wishlist');
            }
        }
    });
}

// ---------- Render Wishlist Page ----------
function renderWishlistPage() {
    const container = document.getElementById('wishlist-grid');
    if (!container) return;

    const items = getWishlistItems();

    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 60px 0;">
                <h3>Your wishlist is empty</h3>
                <p style="color: var(--color-text-muted);">Save your favorite items here.</p>
                <a href="shop.html" class="btn btn-primary" style="margin-top: 20px;">Explore Fashion</a>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    items.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

// ---------- Move to Cart ----------
function moveWishlistToCart(productId) {
    const product = getProductById(productId);
    if (product) {
        addToCart(productId);
        // Remove from wishlist
        let wishlist = getWishlist();
        wishlist = wishlist.filter(id => id !== productId);
        saveWishlist(wishlist);
        updateWishlistBadge();
        renderWishlistPage();
        showToast('Moved to cart!', 'success');
    }
}

// ---------- Initialize ----------
document.addEventListener('DOMContentLoaded', () => {
    updateWishlistBadge();
    if (document.getElementById('wishlist-grid')) {
        renderWishlistPage();
    }
});

// Export
window.wishlist = {
    getWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistItems,
    updateWishlistBadge,
    renderWishlistPage,
    moveWishlistToCart
};