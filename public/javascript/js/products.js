/* ========================================
   RECICLAJA - products.js
   Product data, rendering, filtering, search
   ======================================== */

// ---------- Demo Products ----------
const demoProducts = [
    {
        id: 1,
        brand: 'Nike',
        name: 'Oversized Streetwear T-Shirt',
        category: 'T-Shirts',
        gender: 'Men',
        price: 799,
        originalPrice: 1499,
        condition: 'Like New',
        conditionClass: 'badge-like-new',
        type: 'pre-owned',
        sizes: ['M', 'L', 'XL'],
        color: 'Black',
        colors: ['Black', 'White'],
        material: '100% Cotton',
        rating: 4.8,
        reviews: 124,
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
        seller: {
            name: 'Rahul Sharma',
            rating: 4.9,
            itemsSold: 45,
            location: 'Delhi'
        },
        purchaseYear: 2023,
        usage: 'Worn 3-4 times',
        reasonForSelling: 'Does not fit anymore'
    },
    {
        id: 2,
        brand: 'Adidas',
        name: 'Originals Track Jacket',
        category: 'Jackets',
        gender: 'Men',
        price: 1499,
        originalPrice: 2999,
        condition: 'Good',
        conditionClass: 'badge-good',
        type: 'pre-owned',
        sizes: ['M', 'L'],
        color: 'Blue',
        colors: ['Blue', 'Black'],
        material: 'Polyester',
        rating: 4.5,
        reviews: 89,
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&h=500&fit=crop',
        seller: {
            name: 'Priya Patel',
            rating: 4.7,
            itemsSold: 28,
            location: 'Mumbai'
        },
        purchaseYear: 2022,
        usage: 'Worn occasionally',
        reasonForSelling: 'Style changed'
    },
    {
        id: 3,
        brand: 'Zara',
        name: 'Floral Midi Dress',
        category: 'Dresses',
        gender: 'Women',
        price: 1299,
        originalPrice: 2499,
        condition: 'Like New',
        conditionClass: 'badge-like-new',
        type: 'pre-owned',
        sizes: ['S', 'M'],
        color: 'Multicolor',
        colors: ['Multicolor'],
        material: 'Viscose',
        rating: 4.9,
        reviews: 56,
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=500&fit=crop',
        seller: {
            name: 'Ananya Reddy',
            rating: 4.8,
            itemsSold: 32,
            location: 'Bangalore'
        },
        purchaseYear: 2023,
        usage: 'Worn once',
        reasonForSelling: 'Did not suit me'
    },
    {
        id: 4,
        brand: 'Levi\'s',
        name: '501 Original Jeans',
        category: 'Jeans',
        gender: 'Men',
        price: 999,
        originalPrice: 2499,
        condition: 'Fair',
        conditionClass: 'badge-fair',
        type: 'pre-owned',
        sizes: ['32', '34', '36'],
        color: 'Blue',
        colors: ['Blue', 'Black'],
        material: 'Denim',
        rating: 4.2,
        reviews: 210,
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop',
        seller: {
            name: 'Vikram Singh',
            rating: 4.3,
            itemsSold: 67,
            location: 'Delhi'
        },
        purchaseYear: 2021,
        usage: 'Worn regularly',
        reasonForSelling: 'Too big now'
    },
    {
        id: 5,
        brand: 'H&M',
        name: 'Oversized Blazer',
        category: 'Jackets',
        gender: 'Women',
        price: 899,
        originalPrice: 1999,
        condition: 'Good',
        conditionClass: 'badge-good',
        type: 'new',
        sizes: ['S', 'M', 'L'],
        color: 'Beige',
        colors: ['Beige', 'Black'],
        material: 'Polyester Blend',
        rating: 4.6,
        reviews: 78,
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1548625140-3fdb9e42fb3f?w=400&h=500&fit=crop',
        seller: {
            name: 'Fashion Hub',
            rating: 4.7,
            itemsSold: 150,
            location: 'Chennai'
        },
        purchaseYear: 2024,
        usage: 'Brand New',
        reasonForSelling: 'Stock clearance'
    },
    {
        id: 6,
        brand: 'Puma',
        name: 'RS-X Sneakers',
        category: 'Shoes',
        gender: 'Men',
        price: 1999,
        originalPrice: 3999,
        condition: 'Like New',
        conditionClass: 'badge-like-new',
        type: 'pre-owned',
        sizes: ['8', '9', '10'],
        color: 'White',
        colors: ['White', 'Black'],
        material: 'Synthetic Leather',
        rating: 4.7,
        reviews: 134,
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
        seller: {
            name: 'Amit Kumar',
            rating: 4.9,
            itemsSold: 23,
            location: 'Hyderabad'
        },
        purchaseYear: 2023,
        usage: 'Worn 5-6 times',
        reasonForSelling: 'Need a different size'
    },
    {
        id: 7,
        brand: 'Uniqlo',
        name: 'Ultra Light Down Jacket',
        category: 'Jackets',
        gender: 'Unisex',
        price: 1599,
        originalPrice: 2999,
        condition: 'Good',
        conditionClass: 'badge-good',
        type: 'pre-owned',
        sizes: ['M', 'L', 'XL'],
        color: 'Navy',
        colors: ['Navy', 'Black'],
        material: 'Nylon',
        rating: 4.8,
        reviews: 92,
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1548625140-3fdb9e42fb3f?w=400&h=500&fit=crop',
        seller: {
            name: 'Sarah Khan',
            rating: 4.6,
            itemsSold: 41,
            location: 'Delhi'
        },
        purchaseYear: 2022,
        usage: 'Worn occasionally',
        reasonForSelling: 'Moving to warmer city'
    },
    {
        id: 8,
        brand: 'Roadster',
        name: 'Biker Denim Jacket',
        category: 'Jackets',
        gender: 'Men',
        price: 699,
        originalPrice: 1499,
        condition: 'Fair',
        conditionClass: 'badge-fair',
        type: 'pre-owned',
        sizes: ['L', 'XL'],
        color: 'Blue',
        colors: ['Blue'],
        material: 'Denim',
        rating: 4.0,
        reviews: 156,
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1516257984-3f8bb3c0f9c9?w=400&h=500&fit=crop',
        seller: {
            name: 'Rohit Mehta',
            rating: 4.2,
            itemsSold: 55,
            location: 'Pune'
        },
        purchaseYear: 2020,
        usage: 'Worn regularly',
        reasonForSelling: 'Too small now'
    },
    {
        id: 9,
        brand: 'Bewakoof',
        name: 'Graphic Printed T-Shirt',
        category: 'T-Shirts',
        gender: 'Men',
        price: 399,
        originalPrice: 799,
        condition: 'New',
        conditionClass: 'badge-new',
        type: 'new',
        sizes: ['S', 'M', 'L', 'XL'],
        color: 'White',
        colors: ['White', 'Black'],
        material: '100% Cotton',
        rating: 4.3,
        reviews: 203,
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
        seller: {
            name: 'Bewakoof Official',
            rating: 4.5,
            itemsSold: 500,
            location: 'Mumbai'
        },
        purchaseYear: 2024,
        usage: 'Brand New',
        reasonForSelling: 'New collection'
    },
    {
        id: 10,
        brand: 'FabIndia',
        name: 'Handloom Cotton Kurta',
        category: 'Ethnic Wear',
        gender: 'Women',
        price: 1299,
        originalPrice: 1999,
        condition: 'Like New',
        conditionClass: 'badge-like-new',
        type: 'pre-owned',
        sizes: ['M', 'L'],
        color: 'Ivory',
        colors: ['Ivory', 'Blue'],
        material: '100% Cotton',
        rating: 4.9,
        reviews: 67,
        location: 'Jaipur',
        image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=400&h=500&fit=crop',
        seller: {
            name: 'Meera Sharma',
            rating: 4.9,
            itemsSold: 18,
            location: 'Jaipur'
        },
        purchaseYear: 2023,
        usage: 'Worn twice',
        reasonForSelling: 'Not my style'
    },
    {
        id: 11,
        brand: 'Nike',
        name: 'Air Max 270',
        category: 'Shoes',
        gender: 'Men',
        price: 2999,
        originalPrice: 5999,
        condition: 'Good',
        conditionClass: 'badge-good',
        type: 'pre-owned',
        sizes: ['9', '10'],
        color: 'Red',
        colors: ['Red', 'Black'],
        material: 'Synthetic',
        rating: 4.6,
        reviews: 178,
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
        seller: {
            name: 'Sports Gear',
            rating: 4.5,
            itemsSold: 120,
            location: 'Bangalore'
        },
        purchaseYear: 2022,
        usage: 'Worn occasionally',
        reasonForSelling: 'Not using enough'
    },
    {
        id: 12,
        brand: 'Zara',
        name: 'Tailored Wool Coat',
        category: 'Jackets',
        gender: 'Women',
        price: 2499,
        originalPrice: 4999,
        condition: 'Like New',
        conditionClass: 'badge-like-new',
        type: 'pre-owned',
        sizes: ['S', 'M'],
        color: 'Grey',
        colors: ['Grey', 'Black'],
        material: 'Wool Blend',
        rating: 4.9,
        reviews: 45,
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=500&fit=crop',
        seller: {
            name: 'Winter Wardrobe',
            rating: 4.8,
            itemsSold: 34,
            location: 'Delhi'
        },
        purchaseYear: 2023,
        usage: 'Worn 3 times',
        reasonForSelling: 'Doesn\'t fit well'
    },
    {
        id: 13,
        brand: 'Adidas',
        name: 'Track Pants with Stripes',
        category: 'Sportswear',
        gender: 'Men',
        price: 599,
        originalPrice: 1499,
        condition: 'Good',
        conditionClass: 'badge-good',
        type: 'pre-owned',
        sizes: ['M', 'L'],
        color: 'Black',
        colors: ['Black', 'Blue'],
        material: 'Polyester',
        rating: 4.2,
        reviews: 98,
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&h=500&fit=crop',
        seller: {
            name: 'Fitness Hub',
            rating: 4.3,
            itemsSold: 75,
            location: 'Chennai'
        },
        purchaseYear: 2022,
        usage: 'Worn regularly',
        reasonForSelling: 'Need new size'
    },
    {
        id: 14,
        brand: 'Levi\'s',
        name: 'Classic Denim Shirt',
        category: 'Shirts',
        gender: 'Men',
        price: 899,
        originalPrice: 1999,
        condition: 'Like New',
        conditionClass: 'badge-like-new',
        type: 'pre-owned',
        sizes: ['M', 'L'],
        color: 'Blue',
        colors: ['Blue'],
        material: 'Denim',
        rating: 4.5,
        reviews: 89,
        location: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
        seller: {
            name: 'Denim Store',
            rating: 4.6,
            itemsSold: 92,
            location: 'Mumbai'
        },
        purchaseYear: 2023,
        usage: 'Worn 4-5 times',
        reasonForSelling: 'Too many denim shirts'
    },
    {
        id: 15,
        brand: 'H&M',
        name: 'Linen Blend Blazer',
        category: 'Jackets',
        gender: 'Women',
        price: 1499,
        originalPrice: 2999,
        condition: 'New',
        conditionClass: 'badge-new',
        type: 'new',
        sizes: ['S', 'M', 'L'],
        color: 'Cream',
        colors: ['Cream', 'Black'],
        material: 'Linen Blend',
        rating: 4.7,
        reviews: 56,
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1548625140-3fdb9e42fb3f?w=400&h=500&fit=crop',
        seller: {
            name: 'Fashion Loft',
            rating: 4.8,
            itemsSold: 200,
            location: 'Delhi'
        },
        purchaseYear: 2024,
        usage: 'Brand New',
        reasonForSelling: 'New arrival'
    },
    {
        id: 16,
        brand: 'Puma',
        name: 'Graphic Hoodie',
        category: 'T-Shirts',
        gender: 'Unisex',
        price: 899,
        originalPrice: 1999,
        condition: 'Good',
        conditionClass: 'badge-good',
        type: 'pre-owned',
        sizes: ['M', 'L', 'XL'],
        color: 'Grey',
        colors: ['Grey', 'Black'],
        material: 'Cotton Blend',
        rating: 4.3,
        reviews: 112,
        location: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&h=500&fit=crop',
        seller: {
            name: 'Street Style',
            rating: 4.4,
            itemsSold: 65,
            location: 'Hyderabad'
        },
        purchaseYear: 2022,
        usage: 'Worn often',
        reasonForSelling: 'Changing style'
    },
    {
        id: 17,
        brand: 'Uniqlo',
        name: 'Airism T-Shirt Set',
        category: 'T-Shirts',
        gender: 'Men',
        price: 699,
        originalPrice: 1299,
        condition: 'New',
        conditionClass: 'badge-new',
        type: 'new',
        sizes: ['S', 'M', 'L'],
        color: 'White',
        colors: ['White', 'Black'],
        material: 'Airism Fabric',
        rating: 4.8,
        reviews: 234,
        location: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
        seller: {
            name: 'Uniqlo India',
            rating: 4.9,
            itemsSold: 450,
            location: 'Bangalore'
        },
        purchaseYear: 2024,
        usage: 'Brand New',
        reasonForSelling: 'New collection'
    },
    {
        id: 18,
        brand: 'Roadster',
        name: 'Cargo Joggers',
        category: 'Jeans',
        gender: 'Men',
        price: 799,
        originalPrice: 1499,
        condition: 'Fair',
        conditionClass: 'badge-fair',
        type: 'pre-owned',
        sizes: ['32', '34'],
        color: 'Olive',
        colors: ['Olive', 'Black'],
        material: 'Cotton Blend',
        rating: 4.0,
        reviews: 145,
        location: 'Pune',
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop',
        seller: {
            name: 'Urban Wear',
            rating: 4.1,
            itemsSold: 88,
            location: 'Pune'
        },
        purchaseYear: 2021,
        usage: 'Worn regularly',
        reasonForSelling: 'Upgrading wardrobe'
    },
    {
        id: 19,
        brand: 'FabIndia',
        name: 'Batik Print Saree',
        category: 'Ethnic Wear',
        gender: 'Women',
        price: 1999,
        originalPrice: 3999,
        condition: 'Like New',
        conditionClass: 'badge-like-new',
        type: 'pre-owned',
        sizes: ['Free Size'],
        color: 'Multicolor',
        colors: ['Multicolor'],
        material: 'Cotton',
        rating: 4.9,
        reviews: 34,
        location: 'Jaipur',
        image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=400&h=500&fit=crop',
        seller: {
            name: 'Ethnic Treasures',
            rating: 4.9,
            itemsSold: 25,
            location: 'Jaipur'
        },
        purchaseYear: 2023,
        usage: 'Worn once',
        reasonForSelling: 'Gift but didn\'t like'
    },
    {
        id: 20,
        brand: 'Nike',
        name: 'Dri-FIT Training Shorts',
        category: 'Sportswear',
        gender: 'Men',
        price: 499,
        originalPrice: 1199,
        condition: 'Good',
        conditionClass: 'badge-good',
        type: 'pre-owned',
        sizes: ['M', 'L'],
        color: 'Black',
        colors: ['Black', 'Grey'],
        material: 'Polyester',
        rating: 4.3,
        reviews: 156,
        location: 'Delhi',
        image: 'https://images.unsplash.com/photo-1516257984-3f8bb3c0f9c9?w=400&h=500&fit=crop',
        seller: {
            name: 'Active Life',
            rating: 4.4,
            itemsSold: 102,
            location: 'Delhi'
        },
        purchaseYear: 2022,
        usage: 'Worn occasionally',
        reasonForSelling: 'No longer workout'
    }
];

// ---------- Products State ----------
let currentProducts = [...demoProducts];
let currentFilters = {
    category: 'All',
    type: 'all',
    gender: 'all',
    condition: 'all',
    minPrice: 0,
    maxPrice: 10000,
    sortBy: 'popular'
};

// ---------- Product Card Generator ----------
function createProductCard(product, isCompact = false) {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const isWishlisted = isInWishlist(product.id);

    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;

    const conditionBadge = product.type === 'new' ? 'badge-new' : product.conditionClass;

    card.innerHTML = `
        <div class="product-card-image" onclick="window.location.href='product.html?id=${product.id}'">
            <img src="${product.image}" alt="${product.brand} ${product.name}" loading="lazy">
            <div class="product-card-badges">
                <span class="badge ${conditionBadge}">${product.type === 'new' ? 'Brand New' : product.condition}</span>
                ${discount > 0 ? `<span class="badge badge-discount">${discount}% OFF</span>` : ''}
            </div>
            <button class="product-card-wishlist ${isWishlisted ? 'active' : ''}" 
                    onclick="toggleWishlist(${product.id})" 
                    aria-label="${isWishlisted ? 'Remove from' : 'Add to'} wishlist">
                ${isWishlisted ? '❤' : '♡'}
            </button>
        </div>
        <div class="product-card-info" onclick="window.location.href='product.html?id=${product.id}'">
            <div class="product-card-brand">${product.brand}</div>
            <div class="product-card-name">${product.name}</div>
            <div class="product-card-rating">
                <span class="stars">${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 >= 0.5 ? '★' : ''}</span>
                <span>(${product.reviews})</span>
            </div>
            <div class="product-card-meta">
                <span>${product.condition}</span>
                <span>•</span>
                <span>${product.sizes.join(', ')}</span>
                <span>•</span>
                <span>${product.color}</span>
            </div>
            <div class="product-card-price">
                <span class="current">${formatPrice(product.price)}</span>
                ${product.originalPrice > product.price ? `<span class="original">${formatPrice(product.originalPrice)}</span>` : ''}
                ${discount > 0 ? `<span class="discount">${discount}% OFF</span>` : ''}
            </div>
            <div class="product-card-location">📍 ${product.location}</div>
        </div>
        <div class="product-card-actions">
            <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `;

    return card;
}

// ---------- Render Products ----------
function renderProducts(products, containerId = 'product-grid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    products.forEach(product => {
        container.appendChild(createProductCard(product));
    });
}

// ---------- Filter Products ----------
function filterProducts() {
    let filtered = [...demoProducts];

    // Category filter
    if (currentFilters.category !== 'All') {
        filtered = filtered.filter(p => p.category === currentFilters.category);
    }

    // Type filter (new/pre-owned)
    if (currentFilters.type !== 'all') {
        filtered = filtered.filter(p => p.type === currentFilters.type);
    }

    // Gender filter
    if (currentFilters.gender !== 'all') {
        filtered = filtered.filter(p => p.gender === currentFilters.gender || p.gender === 'Unisex');
    }

    // Condition filter
    if (currentFilters.condition !== 'all') {
        filtered = filtered.filter(p => p.condition === currentFilters.condition);
    }

    // Price filter
    filtered = filtered.filter(p => 
        p.price >= currentFilters.minPrice && p.price <= currentFilters.maxPrice
    );

    // Sorting
    switch (currentFilters.sortBy) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'popular':
        default:
            filtered.sort((a, b) => b.reviews - a.reviews);
            break;
    }

    currentProducts = filtered;
    return filtered;
}

// ---------- Search Products ----------
function searchProducts(query) {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return demoProducts;

    return demoProducts.filter(product => {
        const searchable = `${product.brand} ${product.name} ${product.category} ${product.color} ${product.gender}`.toLowerCase();
        return searchable.includes(searchTerm);
    });
}

// ---------- Get Product By ID ----------
function getProductById(id) {
    return demoProducts.find(p => p.id === id);
}

// ---------- Get Related Products ----------
function getRelatedProducts(productId, limit = 4) {
    const product = getProductById(productId);
    if (!product) return [];

    return demoProducts
        .filter(p => p.id !== productId && p.category === product.category)
        .slice(0, limit);
}

// ---------- Category Tabs ----------
function initCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tabs .tab-btn');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.dataset.category || 'All';
            currentFilters.category = category;
            const filtered = filterProducts();
            renderProducts(filtered);
        });
    });
}

// ---------- Initialize Product Pages ----------
function initProductPage() {
    // Check if we're on a page with a product grid
    const grid = document.getElementById('product-grid');
    if (grid) {
        const filtered = filterProducts();
        renderProducts(filtered);
        initCategoryTabs();
    }

    // Check if we're on the product detail page
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
        renderProductDetail(parseInt(productId));
    }
}

// ---------- Render Product Detail ----------
function renderProductDetail(productId) {
    const product = getProductById(productId);
    if (!product) {
        document.getElementById('main-content').innerHTML = `
            <div class="container" style="padding: 120px 0; text-align: center;">
                <h2>Product Not Found</h2>
                <p>Sorry, the product you're looking for doesn't exist.</p>
                <a href="shop.html" class="btn btn-primary" style="margin-top: 20px;">Back to Shop</a>
            </div>
        `;
        return;
    }

    // This would render the full product detail page
    // For brevity, we'll keep the existing HTML structure and fill it with data
    const isWishlisted = isInWishlist(product.id);
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    // Update page title
    document.title = `${product.brand} ${product.name} - RECICLAJA`;

    // Fill in product details (assuming the HTML structure exists)
    const mainImage = document.getElementById('product-main-image');
    if (mainImage) mainImage.src = product.image;

    const brandEl = document.getElementById('product-brand');
    if (brandEl) brandEl.textContent = product.brand;

    const nameEl = document.getElementById('product-name');
    if (nameEl) nameEl.textContent = product.name;

    const ratingEl = document.getElementById('product-rating');
    if (ratingEl) {
        ratingEl.innerHTML = `${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 >= 0.5 ? '★' : ''} ${product.rating} (${product.reviews} reviews)`;
    }

    const priceEl = document.getElementById('product-price');
    if (priceEl) {
        priceEl.innerHTML = `
            <span class="current">${formatPrice(product.price)}</span>
            ${product.originalPrice > product.price ? `<span class="original">${formatPrice(product.originalPrice)}</span>` : ''}
            ${discount > 0 ? `<span class="discount">${discount}% OFF</span>` : ''}
        `;
    }

    const conditionEl = document.getElementById('product-condition');
    if (conditionEl) conditionEl.textContent = product.condition;

    const sizeEl = document.getElementById('product-sizes');
    if (sizeEl) {
        sizeEl.innerHTML = product.sizes.map(size => 
            `<button class="size-btn" data-size="${size}">${size}</button>`
        ).join('');
    }

    const locationEl = document.getElementById('product-location');
    if (locationEl) locationEl.textContent = product.location;

    const sellerNameEl = document.getElementById('seller-name');
    if (sellerNameEl) sellerNameEl.textContent = product.seller.name;

    const sellerRatingEl = document.getElementById('seller-rating');
    if (sellerRatingEl) sellerRatingEl.textContent = `⭐ ${product.seller.rating}`;

    const sellerItemsEl = document.getElementById('seller-items');
    if (sellerItemsEl) sellerItemsEl.textContent = `${product.seller.itemsSold} items sold`;

    // Wishlist button
    const wishlistBtn = document.getElementById('wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.innerHTML = isWishlisted ? '❤ Remove from Wishlist' : '♡ Add to Wishlist';
        wishlistBtn.onclick = () => {
            toggleWishlist(product.id);
            renderProductDetail(productId);
        };
    }

    // Related products
    const relatedContainer = document.getElementById('related-products');
    if (relatedContainer) {
        const related = getRelatedProducts(product.id);
        relatedContainer.innerHTML = '';
        related.forEach(p => {
            relatedContainer.appendChild(createProductCard(p));
        });
    }
}

// ---------- Initialize ----------
document.addEventListener('DOMContentLoaded', () => {
    initProductPage();
});

// Export for use in other files
window.products = {
    demoProducts,
    currentProducts,
    currentFilters,
    createProductCard,
    renderProducts,
    filterProducts,
    searchProducts,
    getProductById,
    getRelatedProducts,
    initCategoryTabs
};