// Get cart items from localStorage
const cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to create order item HTML
function createOrderItem(order) {
    return `
        <div class="order-item">
            <div class="order-header">
                <div>
                    <span class="order-id">Order #${order.id}</span>
                    <span class="order-date">${formatDate(order.date)}</span>
                </div>
                <span class="order-status status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            </div>
            <div class="order-details">
                ${order.items.map(item => `
                    <div class="product-item">
                        <img src="${item.image}" alt="${item.name}" class="product-image">
                        <div class="product-info">
                            <div class="product-name">${item.name}</div>
                            <div class="product-price">Rs. ${item.price} x ${item.quantity}</div>
                        </div>
                    </div>
                `).join('')}
                <div class="order-total">
                    Total: Rs. ${order.total}
                </div>
            </div>
        </div>
    `;
}

// Function to render orders
function renderOrders(filteredOrders = orders) {
    const ordersList = document.querySelector('.orders-list');
    ordersList.innerHTML = filteredOrders.map(order => createOrderItem(order)).join('');
}

// Function to filter orders
function filterOrders(status) {
    if (status === 'all') {
        renderOrders();
    } else {
        const filteredOrders = orders.filter(order => order.status === status);
        renderOrders(filteredOrders);
    }
}

// Convert cart items to orders format
const orders = cart.map((item, index) => ({
    id: `ORD${String(index + 1).padStart(3, '0')}`,
    date: new Date().toISOString(),
    status: 'pending',
    items: [{
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
    }],
    total: item.price * item.quantity
}));

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial render
    renderOrders();

    // Filter change event
    const orderStatusSelect = document.getElementById('orderStatus');
    orderStatusSelect.addEventListener('change', (e) => {
        filterOrders(e.target.value);
    });
}); 