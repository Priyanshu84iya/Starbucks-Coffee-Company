// Starbucks Universal Button Functionality
// This script provides common button functionality across all pages

// Shopping Cart functionality
let cart = JSON.parse(localStorage.getItem('starbucksCart')) || [];

// Update cart display
function updateCartCounter() {
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
        cartCounter.textContent = cart.length;
        cartCounter.style.display = cart.length > 0 ? 'inline' : 'none';
    }
}

// Add item to cart
function addToCart(itemName, price, image) {
    const item = {
        id: Date.now(),
        name: itemName,
        price: price,
        image: image,
        quantity: 1
    };
    
    cart.push(item);
    localStorage.setItem('starbucksCart', JSON.stringify(cart));
    updateCartCounter();
    
    // Show success feedback
    showNotification(`${itemName} added to cart!`, 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type === 'success' ? 'success' : 'info'} position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 250px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Modal functionality
function showModal(title, content) {
    // Remove existing modal
    const existingModal = document.querySelector('#dynamicModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'dynamicModal';
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title">${title}</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-success" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    // Clean up when modal is hidden
    modal.addEventListener('hidden.bs.modal', () => {
        modal.remove();
    });
}

// Common button functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update cart counter on page load
    updateCartCounter();
    
    // Add to Cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.textContent === 'Add to Cart') {
            e.preventDefault();
            const card = e.target.closest('.card');
            if (card) {
                const itemName = card.querySelector('.card-title, h6')?.textContent || 'Starbucks Item';
                const priceText = card.querySelector('.text-muted, .price')?.textContent || '$5.95';
                const price = priceText.match(/\$[\d.]+/)?.[0] || '$5.95';
                const image = card.querySelector('img')?.src || '';
                
                addToCart(itemName, price, image);
            }
        }
    });
    
    // Learn More buttons
    document.addEventListener('click', function(e) {
        if (e.target.textContent.includes('Learn more') || e.target.textContent.includes('Learn about')) {
            e.preventDefault();
            const buttonText = e.target.textContent;
            
            let title = 'Learn More';
            let content = '';
            
            if (buttonText.includes('heritage')) {
                title = 'Our Heritage';
                content = `
                    <p>Since 1971, Starbucks Coffee Company has been committed to ethically sourcing and roasting high-quality arabica coffee.</p>
                    <p>From our humble beginnings in Seattle's Pike Place Market to becoming a global coffee leader, our heritage is built on:</p>
                    <ul>
                        <li>Passion for coffee excellence</li>
                        <li>Commitment to our partners (employees)</li>
                        <li>Creating a welcoming third place experience</li>
                        <li>Building strong communities</li>
                    </ul>
                    <p>Every cup tells a story of dedication, craftsmanship, and the pursuit of the perfect coffee experience.</p>
                `;
            } else if (buttonText.includes('C.A.F.E. Practices')) {
                title = 'C.A.F.E. Practices';
                content = `
                    <p>Coffee and Farmer Equity (C.A.F.E.) Practices is our comprehensive coffee buying program.</p>
                    <p>Our program ensures:</p>
                    <ul>
                        <li>Economic accountability and transparency</li>
                        <li>Social responsibility in coffee communities</li>
                        <li>Environmental leadership</li>
                        <li>Quality coffee standards</li>
                    </ul>
                    <p>Through C.A.F.E. Practices, we support farmers and their communities while ensuring the highest quality coffee for our customers.</p>
                `;
            } else {
                content = `
                    <p>At Starbucks, we're committed to inspiring and nurturing the human spirit – one person, one cup and one neighborhood at a time.</p>
                    <p>Discover more about our initiatives, values, and commitment to making a positive impact in communities worldwide.</p>
                `;
            }
            
            showModal(title, content);
        }
    });
    
    // Join in the app button
    document.addEventListener('click', function(e) {
        if (e.target.textContent.includes('Join in the app')) {
            e.preventDefault();
            showModal('Download the Starbucks App', `
                <div class="text-center">
                    <p class="mb-4">Join Starbucks Rewards through our mobile app and unlock exclusive benefits!</p>
                    <div class="row justify-content-center">
                        <div class="col-md-6 mb-3">
                            <a href="#" class="btn btn-dark btn-lg d-flex align-items-center justify-content-center">
                                <i class="bi bi-apple me-2 fs-4"></i>
                                <div class="text-start">
                                    <small>Download on the</small><br>
                                    <strong>App Store</strong>
                                </div>
                            </a>
                        </div>
                        <div class="col-md-6 mb-3">
                            <a href="#" class="btn btn-dark btn-lg d-flex align-items-center justify-content-center">
                                <i class="bi bi-google-play me-2 fs-4"></i>
                                <div class="text-start">
                                    <small>Get it on</small><br>
                                    <strong>Google Play</strong>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            `);
        }
    });
    
    // Shop coffee button
    document.addEventListener('click', function(e) {
        if (e.target.textContent.includes('Shop coffee')) {
            e.preventDefault();
            showModal('Shop Our Coffee', `
                <div class="text-center">
                    <p class="mb-4">Explore our premium coffee collection and bring the Starbucks experience home.</p>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="card">
                                <div class="card-body text-center">
                                    <h6>Whole Bean Coffee</h6>
                                    <p class="small text-muted">Premium roasted coffee beans</p>
                                    <a href="menu.html" class="btn btn-outline-success btn-sm">Browse Selection</a>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="card">
                                <div class="card-body text-center">
                                    <h6>Ground Coffee</h6>
                                    <p class="small text-muted">Ready-to-brew ground coffee</p>
                                    <a href="menu.html" class="btn btn-outline-success btn-sm">Browse Selection</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }
    });
    
    // Get involved / Read impact report buttons
    document.addEventListener('click', function(e) {
        const buttonText = e.target.textContent;
        if (buttonText.includes('Get involved') || buttonText.includes('impact report') || buttonText.includes('Read our stories')) {
            e.preventDefault();
            
            let title = 'Social Impact';
            let content = `
                <p>Starbucks is committed to creating positive change in communities around the world.</p>
                <p>Our impact initiatives include:</p>
                <ul>
                    <li>Supporting coffee farming communities</li>
                    <li>Environmental sustainability programs</li>
                    <li>Youth employment and education</li>
                    <li>Community store partnerships</li>
                </ul>
                <p>Together, we can make a difference one cup, one community at a time.</p>
            `;
            
            if (buttonText.includes('impact report')) {
                title = 'Our Impact Report';
                content = `
                    <p>Discover the positive impact Starbucks is making worldwide through our comprehensive annual report.</p>
                    <div class="text-center mt-4">
                        <button class="btn btn-success" onclick="showNotification('Report download would start here', 'info')">Download Full Report (PDF)</button>
                    </div>
                `;
            }
            
            showModal(title, content);
        }
    });
    
    // Customer service interactions
    document.addEventListener('click', function(e) {
        const buttonText = e.target.textContent;
        
        if (buttonText.includes('Start Chat')) {
            e.preventDefault();
            showModal('Customer Support Chat', `
                <div class="text-center">
                    <p>Our customer support team is here to help!</p>
                    <p><strong>Chat Hours:</strong> Monday - Friday, 5 AM - 8 PM PST</p>
                    <div class="mt-4">
                        <button class="btn btn-success" onclick="showNotification('Chat feature would launch here', 'info')">Launch Chat</button>
                    </div>
                </div>
            `);
        } else if (buttonText.includes('Send Email')) {
            e.preventDefault();
            showModal('Email Support', `
                <div>
                    <p>Send us an email and we'll get back to you within 24 hours.</p>
                    <form class="mt-4">
                        <div class="mb-3">
                            <label class="form-label">Subject</label>
                            <input type="text" class="form-control" placeholder="How can we help?">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Message</label>
                            <textarea class="form-control" rows="4" placeholder="Tell us about your experience..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-success" onclick="event.preventDefault(); showNotification('Email sent successfully!', 'success')">Send Email</button>
                    </form>
                </div>
            `);
        }
    });
});

// Form submission handlers
function handleFormSubmission(formElement, successMessage) {
    formElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        const inputs = formElement.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
            }
        });
        
        if (isValid) {
            showNotification(successMessage, 'success');
            formElement.reset();
        } else {
            showNotification('Please fill in all required fields', 'error');
        }
    });
}

// Initialize form handlers
document.addEventListener('DOMContentLoaded', function() {
    // Handle sign in form
    const signInForm = document.querySelector('#signInForm');
    if (signInForm) {
        handleFormSubmission(signInForm, 'Successfully signed in!');
    }
    
    // Handle join form
    const joinForm = document.querySelector('#joinForm');
    if (joinForm) {
        handleFormSubmission(joinForm, 'Account created successfully!');
    }
    
    // Handle customer service search
    const searchForm = document.querySelector('.customer-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = this.querySelector('input').value;
            if (query.trim()) {
                showNotification(`Searching for: "${query}"`, 'info');
            }
        });
    }
});

// Password visibility toggle
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'bi bi-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'bi bi-eye';
    }
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Company-specific buttons
    document.addEventListener('click', function(e) {
        const buttonText = e.target.textContent;
        
        if (buttonText.includes('View Reports') || buttonText.includes('View Earnings') || buttonText.includes('View Presentations')) {
            e.preventDefault();
            showModal('Investor Relations', `
                <div class="text-center">
                    <p>Access our latest ${buttonText.toLowerCase().replace('view ', '')} and financial information.</p>
                    <div class="mt-4">
                        <button class="btn btn-success" onclick="showNotification('Document access would be provided here', 'info')">Access Documents</button>
                    </div>
                </div>
            `);
        } else if (buttonText.includes('View Live Chart')) {
            e.preventDefault();
            showModal('Stock Information', `
                <div class="text-center">
                    <p>View real-time Starbucks Corporation (SBUX) stock information.</p>
                    <div class="mt-4">
                        <button class="btn btn-success" onclick="showNotification('Stock chart would load here', 'info')">View Chart</button>
                    </div>
                </div>
            `);
        } else if (buttonText.includes('Get Help')) {
            e.preventDefault();
            showModal('Customer Support', `
                <div>
                    <p>How can we assist you today?</p>
                    <div class="row g-3 mt-3">
                        <div class="col-6">
                            <button class="btn btn-outline-success w-100" onclick="showNotification('Live chat starting...', 'info')">Live Chat</button>
                        </div>
                        <div class="col-6">
                            <button class="btn btn-outline-success w-100" onclick="showNotification('FAQ section would open', 'info')">View FAQ</button>
                        </div>
                    </div>
                </div>
            `);
        } else if (buttonText.includes('View Jobs') || buttonText.includes('Start Your Application')) {
            e.preventDefault();
            showModal('Career Opportunities', `
                <div class="text-center">
                    <p>Discover exciting career opportunities at Starbucks!</p>
                    <div class="mt-4">
                        <div class="row g-3">
                            <div class="col-6">
                                <button class="btn btn-outline-success w-100" onclick="showNotification('Job search would open', 'info')">Browse Jobs</button>
                            </div>
                            <div class="col-6">
                                <button class="btn btn-success w-100" onclick="showNotification('Application portal would open', 'info')">Apply Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        } else if (buttonText.includes('Access Portal') || buttonText.includes('Find Contact')) {
            e.preventDefault();
            showModal('Ethics & Compliance', `
                <div class="text-center">
                    <p>Access ethics resources and compliance information.</p>
                    <div class="mt-4">
                        <button class="btn btn-success" onclick="showNotification('Ethics portal would open', 'info')">Access Resources</button>
                    </div>
                </div>
            `);
        } else if (buttonText.includes('Submit Privacy Request')) {
            e.preventDefault();
            showModal('Privacy Request', `
                <div>
                    <p>Submit a privacy-related request or inquiry.</p>
                    <form class="mt-4" onsubmit="event.preventDefault(); showNotification('Privacy request submitted successfully!', 'success');">
                        <div class="mb-3">
                            <label class="form-label">Request Type</label>
                            <select class="form-select" required>
                                <option value="">Select request type</option>
                                <option value="data-access">Data Access Request</option>
                                <option value="data-deletion">Data Deletion Request</option>
                                <option value="privacy-inquiry">Privacy Inquiry</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <textarea class="form-control" rows="3" placeholder="Describe your request..." required></textarea>
                        </div>
                        <button type="submit" class="btn btn-success">Submit Request</button>
                    </form>
                </div>
            `);
        }
    });
});

// Authentication System
// Initialize fake user database
function initializeUserDatabase() {
    if (!localStorage.getItem('starbucksUsers')) {
        const sampleUsers = [
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                password: 'password123',
                phone: '+1 (555) 123-4567',
                birthdate: '1990-05-15',
                address: '123 Main Street, Delhi, India',
                stars: 1250,
                memberStatus: 'Gold Member',
                totalOrders: 47,
                joinDate: '2023-01-15'
            },
            {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@email.com',
                password: 'password123',
                phone: '+1 (555) 987-6543',
                birthdate: '1988-08-22',
                address: '456 Oak Avenue, Mumbai, India',
                stars: 850,
                memberStatus: 'Silver Member',
                totalOrders: 23,
                joinDate: '2023-03-10'
            }
        ];
        localStorage.setItem('starbucksUsers', JSON.stringify(sampleUsers));
    }
}

// Sign in function
function signIn(email, password) {
    const users = JSON.parse(localStorage.getItem('starbucksUsers')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user: user };
    } else {
        return { success: false, message: 'Invalid email or password' };
    }
}

// Sign up function
function signUp(userData) {
    const users = JSON.parse(localStorage.getItem('starbucksUsers')) || [];
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
        return { success: false, message: 'An account with this email already exists' };
    }
    
    // Create new user
    const newUser = {
        ...userData,
        stars: 0,
        memberStatus: 'Green Member',
        totalOrders: 0,
        joinDate: new Date().toISOString().split('T')[0]
    };
    
    users.push(newUser);
    localStorage.setItem('starbucksUsers', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return { success: true, user: newUser };
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Sign out function
function signOut() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Handle sign-in form submission
function handleSignIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const result = signIn(email, password);
    
    if (result.success) {
        showNotification('Welcome back, ' + result.user.firstName + '!', 'success');
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
    } else {
        showNotification(result.message, 'error');
    }
}

// Handle join form submission
function handleJoin() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    // Validate password strength
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long!', 'error');
        return;
    }
    
    const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    };
    
    const result = signUp(userData);
    
    if (result.success) {
        showNotification('Welcome to Starbucks Rewards, ' + result.user.firstName + '!', 'success');
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
    } else {
        showNotification(result.message, 'error');
    }
}

// Update navigation for authenticated users
function updateNavigationForAuth() {
    const currentUser = getCurrentUser();
    const authButtons = document.querySelector('.auth-buttons');
    
    if (currentUser && authButtons) {
        // Replace sign in/join buttons with user menu
        authButtons.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-light rounded-pill border-black bg-white py-1 px-3 dropdown-toggle" 
                        type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle"></i> ${currentUser.firstName} ${currentUser.lastName}
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="profile.html"><i class="bi bi-person"></i> My Profile</a></li>
                    <li><a class="dropdown-item" href="#" onclick="showOrderHistory()"><i class="bi bi-clock-history"></i> Order History</a></li>
                    <li><a class="dropdown-item" href="#" onclick="showRewardsBalance()"><i class="bi bi-star"></i> My Rewards</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="signOut()"><i class="bi bi-box-arrow-right"></i> Sign Out</a></li>
                </ul>
            </div>
        `;
    }
}

// Show order history
function showOrderHistory() {
    if (isLoggedIn()) {
        window.location.href = 'profile.html#orders';
    } else {
        showNotification('Please sign in to view your orders', 'info');
    }
}

// Show rewards balance
function showRewardsBalance() {
    if (isLoggedIn()) {
        window.location.href = 'profile.html#rewards';
    } else {
        showNotification('Please sign in to view your rewards', 'info');
    }
}

// Initialize authentication system when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeUserDatabase();
    
    // Update navigation based on auth status
    updateNavigationForAuth();
    
    // Handle sign-in form
    const signInForm = document.getElementById('signin-form');
    if (signInForm) {
        signInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignIn();
        });
    }
    
    // Handle join form
    const joinForm = document.getElementById('join-form');
    if (joinForm) {
        joinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleJoin();
        });
    }
});