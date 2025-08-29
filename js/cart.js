// Cart functionality with fake payment and order history

// Initialize cart page
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    updateNavigationForAuth();
    initializeCartEvents();
});

// Initialize cart events
function initializeCartEvents() {
    // Order type radio buttons
    document.querySelectorAll('input[name="orderType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            toggleOrderType();
            calculateTotal();
        });
    });

    // Payment method radio buttons
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            togglePaymentMethod();
        });
    });
}

// Toggle between pickup and delivery
function toggleOrderType() {
    const orderType = document.querySelector('input[name="orderType"]:checked').value;
    const storeSelection = document.getElementById('storeSelection');
    const deliveryAddress = document.getElementById('deliveryAddress');
    
    if (orderType === 'pickup') {
        storeSelection.classList.remove('d-none');
        deliveryAddress.classList.add('d-none');
    } else {
        storeSelection.classList.add('d-none');
        deliveryAddress.classList.remove('d-none');
    }
}

// Toggle payment method details
function togglePaymentMethod() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const cardDetails = document.getElementById('cardDetails');
    const upiDetails = document.getElementById('upiDetails');
    
    cardDetails.classList.add('d-none');
    upiDetails.classList.add('d-none');
    
    if (paymentMethod === 'credit') {
        cardDetails.classList.remove('d-none');
    } else if (paymentMethod === 'upi') {
        upiDetails.classList.remove('d-none');
    }
}

// Load cart items
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('starbucksCart')) || [];
    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = '';
        emptyCartMessage.classList.remove('d-none');
        checkoutBtn.disabled = true;
        return;
    }
    
    emptyCartMessage.classList.add('d-none');
    checkoutBtn.disabled = false;
    
    const cartHTML = cart.map(item => `
        <div class="cart-item border-bottom p-4" data-id="${item.id}">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${item.image || 'imagens/featured-drinks.jpg'}" class="img-fluid rounded" alt="${item.name}">
                </div>
                <div class="col-md-4">
                    <h6 class="fw-bold mb-1">${item.name}</h6>
                    <p class="text-muted small mb-0">Customizable • Hot</p>
                </div>
                <div class="col-md-3">
                    <div class="d-flex align-items-center">
                        <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity(${item.id}, -1)">
                            <i class="bi bi-dash"></i>
                        </button>
                        <span class="mx-3 fw-bold">${item.quantity}</span>
                        <button class="btn btn-outline-secondary btn-sm" onclick="updateQuantity(${item.id}, 1)">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-2 text-center">
                    <div class="fw-bold">₹${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div class="col-md-1 text-end">
                    <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${item.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    cartItemsList.innerHTML = cartHTML;
    calculateTotal();
}

// Update item quantity
function updateQuantity(itemId, change) {
    let cart = JSON.parse(localStorage.getItem('starbucksCart')) || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        localStorage.setItem('starbucksCart', JSON.stringify(cart));
        loadCartItems();
        updateCartCounter();
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    let cart = JSON.parse(localStorage.getItem('starbucksCart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    
    localStorage.setItem('starbucksCart', JSON.stringify(cart));
    loadCartItems();
    updateCartCounter();
    showNotification('Item removed from cart', 'info');
}

// Calculate total
function calculateTotal() {
    const cart = JSON.parse(localStorage.getItem('starbucksCart')) || [];
    const orderType = document.querySelector('input[name="orderType"]:checked')?.value || 'pickup';
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18; // 18% GST
    const deliveryFee = orderType === 'delivery' ? 30 : 0;
    const total = subtotal + tax + deliveryFee;
    
    document.getElementById('subtotalAmount').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('taxAmount').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('deliveryFee').textContent = orderType === 'delivery' ? '₹30.00' : 'Free';
    document.getElementById('totalAmount').textContent = `₹${total.toFixed(2)}`;
}

// Proceed to checkout
function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('starbucksCart')) || [];
    
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Populate checkout modal with order summary
    const checkoutOrderSummary = document.getElementById('checkoutOrderSummary');
    const orderType = document.querySelector('input[name="orderType"]:checked').value;
    const selectedStore = document.getElementById('selectedStore').value;
    const deliveryAddress = document.querySelector('#deliveryAddress textarea').value;
    
    const orderSummaryHTML = `
        <div class="mb-3">
            <h6 class="fw-bold">Order Type</h6>
            <p class="mb-1">${orderType === 'pickup' ? 'Pickup' : 'Delivery'}</p>
            ${orderType === 'pickup' ? 
                `<small class="text-muted">${document.querySelector(`#selectedStore option[value="${selectedStore}"]`).textContent}</small>` :
                `<small class="text-muted">${deliveryAddress || 'Address not provided'}</small>`
            }
        </div>
        <div class="mb-3">
            <h6 class="fw-bold">Items (${cart.length})</h6>
            ${cart.map(item => `
                <div class="d-flex justify-content-between mb-1">
                    <span>${item.quantity}x ${item.name}</span>
                    <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
        <div class="border-top pt-2">
            <div class="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>${document.getElementById('totalAmount').textContent}</span>
            </div>
        </div>
    `;
    
    checkoutOrderSummary.innerHTML = orderSummaryHTML;
    
    // Show checkout modal
    const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    checkoutModal.show();
}

// Process payment (fake payment simulation)
function processPayment() {
    // Get form data
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const phone = document.querySelector('#paymentForm input[type="tel"]').value;
    const email = document.querySelector('#paymentForm input[type="email"]').value;
    
    // Validate required fields
    if (!phone || !email) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate payment method specific fields
    if (paymentMethod === 'credit') {
        const cardNumber = document.querySelector('#cardDetails input[placeholder="1234 5678 9012 3456"]').value;
        const expiryDate = document.querySelector('#cardDetails input[placeholder="MM/YY"]').value;
        const cvv = document.querySelector('#cardDetails input[placeholder="123"]').value;
        const cardholderName = document.querySelector('#cardDetails input[placeholder="John Doe"]').value;
        
        if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
            showNotification('Please fill in all card details', 'error');
            return;
        }
    } else if (paymentMethod === 'upi') {
        const upiId = document.querySelector('#upiDetails input[placeholder="yourname@paytm"]').value;
        if (!upiId) {
            showNotification('Please enter UPI ID', 'error');
            return;
        }
    }
    
    // Simulate payment processing
    showNotification('Processing payment...', 'info');
    
    setTimeout(() => {
        // Generate order
        const orderId = generateOrderId();
        const cart = JSON.parse(localStorage.getItem('starbucksCart')) || [];
        const total = document.getElementById('totalAmount').textContent;
        const orderType = document.querySelector('input[name="orderType"]:checked').value;
        
        const order = {
            id: orderId,
            items: [...cart],
            total: total,
            orderType: orderType,
            paymentMethod: paymentMethod,
            status: 'Preparing',
            date: new Date().toISOString(),
            estimatedTime: orderType === 'pickup' ? '15-20 minutes' : '30-45 minutes',
            customerInfo: {
                phone: phone,
                email: email
            }
        };
        
        // Save order to history
        saveOrderToHistory(order);
        
        // Clear cart
        localStorage.removeItem('starbucksCart');
        updateCartCounter();
        
        // Hide checkout modal
        bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
        
        // Show confirmation modal
        showOrderConfirmation(order);
        
    }, 2000);
}

// Generate unique order ID
function generateOrderId() {
    const prefix = 'SB';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
}

// Save order to history
function saveOrderToHistory(order) {
    const currentUser = getCurrentUser();
    const userEmail = currentUser ? currentUser.email : 'guest';
    
    let orderHistory = JSON.parse(localStorage.getItem(`orderHistory_${userEmail}`)) || [];
    orderHistory.unshift(order); // Add to beginning of array
    
    // Keep only last 50 orders
    if (orderHistory.length > 50) {
        orderHistory = orderHistory.slice(0, 50);
    }
    
    localStorage.setItem(`orderHistory_${userEmail}`, JSON.stringify(orderHistory));
    
    // Update user's total orders count if logged in
    if (currentUser) {
        currentUser.totalOrders = (currentUser.totalOrders || 0) + 1;
        currentUser.stars = (currentUser.stars || 0) + Math.floor(parseFloat(order.total.replace('₹', '')) / 10);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update in users database
        let users = JSON.parse(localStorage.getItem('starbucksUsers')) || [];
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('starbucksUsers', JSON.stringify(users));
        }
    }
}

// Show order confirmation
function showOrderConfirmation(order) {
    document.getElementById('confirmationOrderId').textContent = order.id;
    document.getElementById('confirmationTotal').textContent = order.total;
    document.getElementById('estimatedTime').textContent = order.estimatedTime;
    
    const confirmationModal = new bootstrap.Modal(document.getElementById('orderConfirmationModal'));
    confirmationModal.show();
    
    showNotification('Order placed successfully!', 'success');
}

// View order history
function viewOrderHistory() {
    if (isLoggedIn()) {
        window.location.href = 'profile.html#orders';
    } else {
        window.location.href = 'order-history.html';
    }
}

// Add some sample items to cart for demo (only if cart is empty)
function addSampleItems() {
    const cart = JSON.parse(localStorage.getItem('starbucksCart')) || [];
    
    if (cart.length === 0) {
        const sampleItems = [
            {
                id: Date.now(),
                name: 'Grande Caffè Latte',
                price: 285,
                image: 'imagens/featured-drinks.jpg',
                quantity: 1
            },
            {
                id: Date.now() + 1,
                name: 'Venti Frappuccino',
                price: 395,
                image: 'imagens/featured-drinks.jpg',
                quantity: 2
            }
        ];
        
        localStorage.setItem('starbucksCart', JSON.stringify(sampleItems));
        updateCartCounter();
        loadCartItems();
    }
}

// Card number formatting
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.querySelector('#cardDetails input[placeholder="1234 5678 9012 3456"]');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    const expiryInput = document.querySelector('#cardDetails input[placeholder="MM/YY"]');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
});