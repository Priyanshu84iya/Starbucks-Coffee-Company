// Profile page functionality

// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!checkAuthStatus()) {
        window.location.href = 'signin.html';
        return;
    }
    
    loadUserProfile();
    initializeProfileEvents();
    loadOrderHistory();
});

// Check authentication status
function checkAuthStatus() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser !== null;
}

// Load user profile data
function loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Update profile information
    document.getElementById('navUserName').textContent = currentUser.firstName + ' ' + currentUser.lastName;
    document.getElementById('profileUserName').textContent = currentUser.firstName + ' ' + currentUser.lastName;
    document.getElementById('profileEmail').textContent = currentUser.email;
    
    // Update form fields
    document.getElementById('editFirstName').value = currentUser.firstName;
    document.getElementById('editLastName').value = currentUser.lastName;
    document.getElementById('editEmail').value = currentUser.email;
    document.getElementById('editPhone').value = currentUser.phone || '+1 (555) 123-4567';
    document.getElementById('editBirthdate').value = currentUser.birthdate || '1990-05-15';
    document.getElementById('editAddress').value = currentUser.address || '123 Main Street, Delhi, India';
    
    // Update stats
    document.getElementById('starBalance').textContent = currentUser.stars || '1,250';
    document.getElementById('memberSince').textContent = currentUser.memberStatus || 'Gold Member';
    document.getElementById('totalOrders').textContent = currentUser.totalOrders || '47';
}

// Initialize profile page events
function initializeProfileEvents() {
    // Profile form submission
    document.getElementById('profileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateProfile();
    });
    
    // Password change form
    const passwordForm = document.getElementById('passwordChangeForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            changePassword();
        });
    }
}

// Show profile section
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.add('d-none'));
    
    // Show selected section
    document.getElementById(sectionName + '-section').classList.remove('d-none');
    
    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
}

// Edit profile function
function editProfile() {
    // Scroll to personal info section
    showSection('personal-info');
    document.getElementById('editFirstName').focus();
}

// Update profile
function updateProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get form data
    const updatedUser = {
        ...currentUser,
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        birthdate: document.getElementById('editBirthdate').value,
        address: document.getElementById('editAddress').value
    };
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update users database
    let users = JSON.parse(localStorage.getItem('starbucksUsers')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('starbucksUsers', JSON.stringify(users));
    }
    
    // Reload profile display
    loadUserProfile();
    
    // Show success message
    showNotification('Profile updated successfully!', 'success');
}

// Change password
function changePassword() {
    const currentPassword = document.querySelector('#passwordChangeForm input[type="password"]:nth-child(1)').value;
    const newPassword = document.querySelector('#passwordChangeForm input[type="password"]:nth-child(2)').value;
    const confirmPassword = document.querySelector('#passwordChangeForm input[type="password"]:nth-child(3)').value;
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match!', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters long!', 'error');
        return;
    }
    
    // Update password in localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        currentUser.password = newPassword;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update users database
        let users = JSON.parse(localStorage.getItem('starbucksUsers')) || [];
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('starbucksUsers', JSON.stringify(users));
        }
    }
    
    // Clear form
    document.getElementById('passwordChangeForm').reset();
    
    showNotification('Password updated successfully!', 'success');
}

// Load order history
function loadOrderHistory() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get user's real orders from cart system
    let orders = JSON.parse(localStorage.getItem(`orderHistory_${currentUser.email}`)) || [];
    
    // If no real orders, create sample data
    if (orders.length === 0) {
        orders = [
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
                    phone: currentUser.phone || '+91 98765 43210',
                    email: currentUser.email
                }
            },
            {
                id: 'SB' + Date.now().toString().slice(-6) + '002',
                items: [
                    { name: 'Venti Frappuccino', price: 395, quantity: 1 },
                    { name: 'Chocolate Croissant', price: 225, quantity: 1 }
                ],
                total: '₹731.40',
                orderType: 'delivery',
                paymentMethod: 'upi',
                status: 'Completed',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                estimatedTime: '30-45 minutes',
                customerInfo: {
                    phone: currentUser.phone || '+91 98765 43210',
                    email: currentUser.email
                }
            }
        ];
        localStorage.setItem(`orderHistory_${currentUser.email}`, JSON.stringify(orders));
    }
    
    // Generate order history HTML
    const orderHistoryHTML = orders.map(order => {
        const orderDate = new Date(order.date);
        const statusBadgeClass = getStatusBadgeClass(order.status);
        
        return `
        <div class="card border mb-3">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h6 class="card-title mb-1">Order #${order.id}</h6>
                        <p class="text-muted small mb-1">${formatOrderDate(orderDate)} • ${order.orderType === 'pickup' ? 'Pickup' : 'Delivery'}</p>
                        <p class="mb-1">${order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}</p>
                        <span class="badge ${statusBadgeClass}">${order.status}</span>
                    </div>
                    <div class="col-md-4 text-md-end">
                        <h6 class="mb-1">${order.total}</h6>
                        <button class="btn btn-outline-success btn-sm" onclick="reorderItems('${order.id}')">
                            Reorder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    }).join('');
    
    document.getElementById('orderHistoryList').innerHTML = orderHistoryHTML;
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

// Format order date
function formatOrderDate(date) {
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Reorder items
function reorderItems(orderId) {
    showNotification('Items added to cart!', 'success');
    // In a real app, this would add the items to the cart
}

// Show order history modal
function showOrderHistory() {
    showSection('orders');
}

// Show rewards balance modal
function showRewardsBalance() {
    showSection('rewards');
}

// Add payment method
function addPaymentMethod() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = 
        '<div class="modal-dialog">' +
            '<div class="modal-content">' +
                '<div class="modal-header">' +
                    '<h5 class="modal-title">Add Payment Method</h5>' +
                    '<button type="button" class="btn-close" data-bs-dismiss="modal"></button>' +
                '</div>' +
                '<div class="modal-body">' +
                    '<form id="addPaymentForm">' +
                        '<div class="mb-3">' +
                            '<label class="form-label">Card Number</label>' +
                            '<input type="text" class="form-control" placeholder="1234 5678 9012 3456" required>' +
                        '</div>' +
                        '<div class="row mb-3">' +
                            '<div class="col-6">' +
                                '<label class="form-label">Expiry Date</label>' +
                                '<input type="text" class="form-control" placeholder="MM/YY" required>' +
                            '</div>' +
                            '<div class="col-6">' +
                                '<label class="form-label">CVV</label>' +
                                '<input type="text" class="form-control" placeholder="123" required>' +
                            '</div>' +
                        '</div>' +
                        '<div class="mb-3">' +
                            '<label class="form-label">Cardholder Name</label>' +
                            '<input type="text" class="form-control" required>' +
                        '</div>' +
                        '<div class="form-check">' +
                            '<input class="form-check-input" type="checkbox" id="setPrimary">' +
                            '<label class="form-check-label" for="setPrimary">' +
                                'Set as primary payment method' +
                            '</label>' +
                        '</div>' +
                    '</form>' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>' +
                    '<button type="button" class="btn btn-success" onclick="savePaymentMethod()">Add Card</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    
    document.body.appendChild(modal);
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

// Save payment method
function savePaymentMethod() {
    showNotification('Payment method added successfully!', 'success');
    bootstrap.Modal.getInstance(document.querySelector('.modal')).hide();
}

// Change profile picture
function changeProfilePicture() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // In a real app, this would upload the image
                showNotification('Profile picture updated!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// Sign out function
function signOut() {
    if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'alert alert-' + (type === 'error' ? 'danger' : type) + ' alert-dismissible fade show position-fixed';
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    notification.innerHTML = 
        message +
        '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}