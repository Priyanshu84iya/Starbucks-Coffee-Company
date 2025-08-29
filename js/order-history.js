// Order History functionality

let currentOrderDetails = null;

// Initialize order history page
document.addEventListener('DOMContentLoaded', function() {
    updateNavigationForAuth();
    loadOrderHistory();
});

// Load order history
function loadOrderHistory() {
    const currentUser = getCurrentUser();
    const userEmail = currentUser ? currentUser.email : 'guest';
    
    let orderHistory = JSON.parse(localStorage.getItem(`orderHistory_${userEmail}`)) || [];
    
    // If logged in user, also load guest orders if any
    if (currentUser) {
        const guestOrders = JSON.parse(localStorage.getItem('orderHistory_guest')) || [];
        orderHistory = [...orderHistory, ...guestOrders];
        orderHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    displayOrderHistory(orderHistory);
}

// Display order history
function displayOrderHistory(orders) {
    const orderHistoryList = document.getElementById('orderHistoryList');
    const noOrdersMessage = document.getElementById('noOrdersMessage');
    
    if (orders.length === 0) {
        orderHistoryList.innerHTML = '';
        noOrdersMessage.style.display = 'block';
        return;
    }
    
    noOrdersMessage.style.display = 'none';
    
    const ordersHTML = orders.map(order => {
        const orderDate = new Date(order.date);
        const statusBadgeClass = getStatusBadgeClass(order.status);
        
        return `
            <div class="order-item border-bottom p-4" data-order-id="${order.id}">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <h6 class="fw-bold mb-1">Order #${order.id}</h6>
                        <p class="text-muted small mb-1">${formatDate(orderDate)} • ${order.orderType === 'pickup' ? 'Pickup' : 'Delivery'}</p>
                        <p class="mb-1">${order.items.length} item(s) • ${order.total}</p>
                        <span class="badge ${statusBadgeClass}">${order.status}</span>
                    </div>
                    <div class="col-md-3">
                        <div class="text-muted small">
                            <div><strong>Payment:</strong> ${getPaymentMethodText(order.paymentMethod)}</div>
                            <div><strong>Estimated:</strong> ${order.estimatedTime}</div>
                        </div>
                    </div>
                    <div class="col-md-3 text-end">
                        <button class="btn btn-outline-success btn-sm me-2" onclick="viewOrderDetails('${order.id}')">
                            View Details
                        </button>
                        <button class="btn btn-success btn-sm" onclick="reorderFromHistory('${order.id}')">
                            Reorder
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    orderHistoryList.innerHTML = ordersHTML;
}

// Get status badge class
function getStatusBadgeClass(status) {
    switch (status.toLowerCase()) {
        case 'preparing':
            return 'bg-warning';
        case 'ready':
            return 'bg-info';
        case 'completed':
            return 'bg-success';
        case 'cancelled':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

// Get payment method text
function getPaymentMethodText(method) {
    switch (method) {
        case 'credit':
            return 'Credit/Debit Card';
        case 'upi':
            return 'UPI Payment';
        case 'cod':
            return 'Cash on Delivery';
        default:
            return 'Unknown';
    }
}

// Format date
function formatDate(date) {
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// View order details
function viewOrderDetails(orderId) {
    const currentUser = getCurrentUser();
    const userEmail = currentUser ? currentUser.email : 'guest';
    
    let orderHistory = JSON.parse(localStorage.getItem(`orderHistory_${userEmail}`)) || [];
    
    // If logged in user, also check guest orders
    if (currentUser) {
        const guestOrders = JSON.parse(localStorage.getItem('orderHistory_guest')) || [];
        orderHistory = [...orderHistory, ...guestOrders];
    }
    
    const order = orderHistory.find(o => o.id === orderId);
    
    if (!order) {
        showNotification('Order not found', 'error');
        return;
    }
    
    currentOrderDetails = order;
    
    const orderDetailsContent = document.getElementById('orderDetailsContent');
    const orderDate = new Date(order.date);
    
    const detailsHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6 class="fw-bold mb-3">Order Information</h6>
                <div class="mb-2"><strong>Order ID:</strong> ${order.id}</div>
                <div class="mb-2"><strong>Date:</strong> ${formatDate(orderDate)}</div>
                <div class="mb-2"><strong>Type:</strong> ${order.orderType === 'pickup' ? 'Pickup' : 'Delivery'}</div>
                <div class="mb-2"><strong>Status:</strong> <span class="badge ${getStatusBadgeClass(order.status)}">${order.status}</span></div>
                <div class="mb-2"><strong>Estimated Time:</strong> ${order.estimatedTime}</div>
                <div class="mb-3"><strong>Total:</strong> ${order.total}</div>
                
                <h6 class="fw-bold mb-3">Payment Details</h6>
                <div class="mb-2"><strong>Method:</strong> ${getPaymentMethodText(order.paymentMethod)}</div>
                <div class="mb-2"><strong>Phone:</strong> ${order.customerInfo?.phone || 'Not provided'}</div>
                <div class="mb-3"><strong>Email:</strong> ${order.customerInfo?.email || 'Not provided'}</div>
            </div>
            
            <div class="col-md-6">
                <h6 class="fw-bold mb-3">Order Items</h6>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                            <div>
                                <div class="fw-semibold">${item.name}</div>
                                <small class="text-muted">Quantity: ${item.quantity}</small>
                            </div>
                            <div class="fw-bold">₹${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="border-top pt-3 mt-3">
                    <div class="d-flex justify-content-between fw-bold">
                        <span>Total Amount</span>
                        <span>${order.total}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    orderDetailsContent.innerHTML = detailsHTML;
    
    const orderDetailsModal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    orderDetailsModal.show();
}

// Reorder items from order details modal
function reorderItems() {
    if (!currentOrderDetails) return;
    
    // Add items to cart
    let cart = JSON.parse(localStorage.getItem('starbucksCart')) || [];
    
    currentOrderDetails.items.forEach(item => {
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
        
        if (existingItemIndex !== -1) {
            // Update quantity
            cart[existingItemIndex].quantity += item.quantity;
        } else {
            // Add new item with new ID
            cart.push({
                ...item,
                id: Date.now() + Math.random()
            });
        }
    });
    
    localStorage.setItem('starbucksCart', JSON.stringify(cart));
    updateCartCounter();
    
    // Hide modal and redirect to cart
    bootstrap.Modal.getInstance(document.getElementById('orderDetailsModal')).hide();
    showNotification('Items added to cart!', 'success');
    
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 1000);
}

// Reorder from history list
function reorderFromHistory(orderId) {
    const currentUser = getCurrentUser();
    const userEmail = currentUser ? currentUser.email : 'guest';
    
    let orderHistory = JSON.parse(localStorage.getItem(`orderHistory_${userEmail}`)) || [];
    
    // If logged in user, also check guest orders
    if (currentUser) {
        const guestOrders = JSON.parse(localStorage.getItem('orderHistory_guest')) || [];
        orderHistory = [...orderHistory, ...guestOrders];
    }
    
    const order = orderHistory.find(o => o.id === orderId);
    
    if (!order) {
        showNotification('Order not found', 'error');
        return;
    }
    
    // Add items to cart
    let cart = JSON.parse(localStorage.getItem('starbucksCart')) || [];
    
    order.items.forEach(item => {
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
        
        if (existingItemIndex !== -1) {
            // Update quantity
            cart[existingItemIndex].quantity += item.quantity;
        } else {
            // Add new item with new ID
            cart.push({
                ...item,
                id: Date.now() + Math.random()
            });
        }
    });
    
    localStorage.setItem('starbucksCart', JSON.stringify(cart));
    updateCartCounter();
    
    showNotification('Items added to cart!', 'success');
    
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 1000);
}

// Lookup order for guests
function lookupOrder() {
    const orderId = document.getElementById('orderIdInput').value.trim();
    const phone = document.getElementById('phoneInput').value.trim();
    
    if (!orderId || !phone) {
        showNotification('Please enter both Order ID and Phone Number', 'error');
        return;
    }
    
    // Search in guest orders
    const guestOrders = JSON.parse(localStorage.getItem('orderHistory_guest')) || [];
    const order = guestOrders.find(o => 
        o.id.toLowerCase() === orderId.toLowerCase() && 
        o.customerInfo?.phone === phone
    );
    
    if (order) {
        viewOrderDetails(order.id);
        // Clear the search fields
        document.getElementById('orderIdInput').value = '';
        document.getElementById('phoneInput').value = '';
    } else {
        showNotification('Order not found. Please check your Order ID and Phone Number.', 'error');
    }
}

// Create some sample orders for demonstration
function createSampleOrders() {
    const currentUser = getCurrentUser();
    const userEmail = currentUser ? currentUser.email : 'guest';
    
    const existingOrders = JSON.parse(localStorage.getItem(`orderHistory_${userEmail}`)) || [];
    
    if (existingOrders.length === 0) {
        const sampleOrders = [
            {
                id: 'SB' + Date.now().toString().slice(-6) + '001',
                items: [
                    { name: 'Grande Caffè Latte', price: 285, quantity: 1 },
                    { name: 'Blueberry Muffin', price: 195, quantity: 1 }
                ],
                total: '₹564.60',
                orderType: 'pickup',
                paymentMethod: 'credit',
                status: 'Completed',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                estimatedTime: '15-20 minutes',
                customerInfo: {
                    phone: '+91 98765 43210',
                    email: 'customer@example.com'
                }
            },
            {
                id: 'SB' + Date.now().toString().slice(-6) + '002',
                items: [
                    { name: 'Venti Frappuccino', price: 395, quantity: 2 }
                ],
                total: '₹929.40',
                orderType: 'delivery',
                paymentMethod: 'upi',
                status: 'Preparing',
                date: new Date().toISOString(),
                estimatedTime: '30-45 minutes',
                customerInfo: {
                    phone: '+91 98765 43210',
                    email: 'customer@example.com'
                }
            }
        ];
        
        localStorage.setItem(`orderHistory_${userEmail}`, JSON.stringify(sampleOrders));
        loadOrderHistory();
    }
}