# ☕ Starbucks Coffee Company - Complete Website Clone

![Starbucks Logo](imagens/starbucks-nav-logo.svg)

A comprehensive, fully functional Starbucks website clone built with modern web technologies. This project includes complete user authentication, shopping cart functionality, payment processing sim[...]

## 🌟 Features Overview

### 🔐 Authentication System
- **User Registration & Login** - Complete sign-up and sign-in functionality
- **User Profiles** - Comprehensive profile management with editable information
- **Session Management** - Persistent login state across browser sessions
- **Sample Accounts** - Pre-loaded demo accounts for testing

### 🛒 Shopping Cart & E-commerce
- **Interactive Cart** - Add/remove items, update quantities, real-time counter
- **Order Types** - Pickup and delivery options with location selection
- **Payment Processing** - Multiple payment methods (Credit/Debit, UPI, Cash on Delivery)
- **Order Tracking** - Unique order IDs with status tracking
- **Order History** - Complete order management with reorder functionality

### 🎨 User Interface
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Bootstrap 5** - Modern, accessible UI components
- **Custom Styling** - Starbucks-branded design elements
- **Interactive Elements** - Modals, notifications, and smooth animations

### 📱 Pages & Navigation
- **Homepage** - Hero sections, featured products, company information
- **Menu** - Complete product catalog with categories and pricing
- **Rewards** - Loyalty program information and benefits
- **Our Coffee** - Product stories and coffee education
- **Social Impact** - Company initiatives and community programs
- **Store Locator** - Find nearby Starbucks locations
- **User Profile** - Account management and order history
- **Cart & Checkout** - Complete shopping experience

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local development server)
- Basic understanding of HTML, CSS, and JavaScript

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Priyanshu84iya/Starbucks-Coffee-Company.git
   cd Starbucks-Coffee-Company
   ```

2. **Start Local Server**
   ```bash
   python -m http.server 8000
   ```

3. **Open in Browser**
   Navigate to `http://localhost:8000` in your web browser

### Demo Accounts
For testing the authentication system, use these pre-configured accounts:

**Account 1:**
- Email: `john.doe@email.com`
- Password: `password123`

**Account 2:**
- Email: `jane.smith@email.com`
- Password: `password123`

## 📋 Project Structure

```
Starbucks-Coffee-Company/
├── index.html                 # Homepage
├── menu.html                  # Product catalog
├── rewards.html               # Loyalty program
├── our-coffee.html           # Coffee education
├── social-impact.html        # Company initiatives
├── store-locator.html        # Store finder
├── signin.html               # User login
├── join.html                 # User registration
├── profile.html              # User dashboard
├── cart.html                 # Shopping cart
├── order-history.html        # Order tracking
├── style.css                 # Main stylesheet
├── js/
│   ├── main.js              # Core functionality
│   ├── cart.js              # Shopping cart logic
│   ├── profile.js           # User profile management
│   └── order-history.js     # Order management
├── font/                    # Custom Starbucks fonts
├── imagens/                 # Images and assets
└── README.md               # This file
```

## 🔧 Technical Implementation

### Frontend Technologies
- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript ES6+** - Interactive functionality and API simulation
- **Bootstrap 5.3.0** - Responsive UI framework
- **Bootstrap Icons** - Icon library

### Key Features Implementation

#### Authentication System
```javascript
// Fake user database with localStorage
const users = [
    {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        password: 'password123',
        stars: 1250,
        memberStatus: 'Gold Member'
    }
];
```

#### Shopping Cart
```javascript
// Real-time cart management
function addToCart(itemName, price, image) {
    const item = {
        id: Date.now() + Math.random(),
        name: itemName,
        price: price,
        quantity: 1
    };
    cart.push(item);
    updateCartCounter();
}
```

#### Order Management
```javascript
// Unique order ID generation
function generateOrderId() {
    const prefix = 'SB';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
}
```

## 🎯 User Journey

### 1. Browse & Discover
- Explore the homepage with featured content
- Navigate through different sections
- View menu items with detailed information

### 2. Account Creation
- Sign up for a new account with email verification simulation
- Or sign in with existing demo accounts
- Access personalized dashboard

### 3. Shopping Experience
- Add items to cart from menu pages
- View cart with item management (quantity, removal)
- Select pickup or delivery options

### 4. Checkout Process
- Enter payment information (simulated)
- Choose from multiple payment methods
- Receive order confirmation with tracking ID

### 5. Order Management
- Track order status in real-time
- View comprehensive order history
- Reorder favorite items with one click

## 💳 Payment System (Simulation)

### Supported Payment Methods
- **Credit/Debit Cards** - Full form validation with card number formatting
- **UPI Payments** - Indian digital payment system simulation
- **Cash on Delivery** - For delivery orders

### Payment Features
- Real-time form validation
- Card number formatting (4-digit groups)
- Expiry date validation (MM/YY format)
- CVV validation
- Payment processing simulation with 2-second delay

## 📊 Order & Analytics

### Order Tracking
- **Unique Order IDs** - Format: SB[timestamp][random]
- **Status Updates** - Preparing → Ready → Completed
- **Estimated Times** - Dynamic based on order type
- **Customer Information** - Phone and email for tracking

### Order History
- **Persistent Storage** - Orders saved in localStorage
- **Guest Lookup** - Search orders by ID and phone
- **Reorder Functionality** - One-click repeat orders
- **Detailed Views** - Complete order breakdown

## 🎨 Design System

### Color Palette
- **Primary Green** - #00754a (Starbucks signature)
- **Secondary Colors** - Various shades for hierarchy
- **Neutral Grays** - For text and backgrounds

### Typography
- **Primary Font** - SoDoSans (Starbucks custom font)
- **Font Weights** - Thin, Light, Regular, Semi-Bold, Bold, Black
- **Responsive Scaling** - Optimized for all screen sizes

### UI Components
- **Buttons** - Rounded pills with hover effects
- **Cards** - Clean shadows and borders
- **Modals** - Overlay dialogs for forms and confirmations
- **Navigation** - Sticky header with responsive collapse

## 📱 Responsive Design

### Breakpoints
- **Mobile** - 320px to 767px
- **Tablet** - 768px to 1023px
- **Desktop** - 1024px and above

### Mobile Optimizations
- Touch-friendly button sizes
- Optimized navigation menu
- Responsive image scaling
- Mobile-specific layouts

## 🔍 SEO & Performance

### Meta Tags
- Proper title and description tags
- Open Graph meta tags for social sharing
- Favicon implementation

### Performance
- Optimized images with proper sizing
- Minified CSS and JavaScript
- Efficient DOM manipulation
- Lazy loading for images

## 🧪 Testing Features

### User Account Testing
1. **Registration** - Create new accounts with validation
2. **Login** - Test with demo accounts
3. **Profile Management** - Update user information
4. **Password Change** - Security features

### Shopping Cart Testing
1. **Add Items** - From menu pages
2. **Quantity Management** - Increase/decrease/remove
3. **Order Types** - Switch between pickup and delivery
4. **Checkout Flow** - Complete payment process

### Payment Testing
- Use any test card numbers (e.g., 4111 1111 1111 1111)
- Try different payment methods
- Test form validation

## 🚧 Future Enhancements

### Planned Features
- **Real-time Notifications** - Push notifications for order updates
- **Advanced Search** - Filter and search menu items
- **Favorites System** - Save preferred items
- **Store Reviews** - Customer feedback system
- **Admin Dashboard** - Order management interface

### Technical Improvements
- **Database Integration** - Replace localStorage with real database
- **API Development** - RESTful API for data operations
- **Authentication** - JWT tokens and secure sessions
- **Payment Gateway** - Real payment processing integration

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Coding Standards
- Use semantic HTML
- Follow CSS naming conventions
- Write clean, commented JavaScript
- Ensure responsive design
- Test across browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Priyanshu Kumar (Pry Uchiha)**
- GitHub: [@Priyanshu84iya](https://github.com/Priyanshu84iya)
- Instagram: [www.instagram.com/priyansh.u26](https://www.instagram.com/priyansh.u26)

## 🙏 Acknowledgments

- **Starbucks Corporation** - For design inspiration and branding
- **Bootstrap Team** - For the excellent UI framework
- **FontAwesome/Bootstrap Icons** - For comprehensive icon library
- **Open Source Community** - For tools and inspiration

## 📈 Project Stats

- **Pages**: 10+ fully functional pages
- **Components**: 50+ reusable UI components
- **JavaScript Functions**: 100+ custom functions
- **Responsive Breakpoints**: 3 major breakpoints
- **Browser Support**: All modern browsers
- **Mobile Optimized**: 100% responsive design

---

### 🎉 Ready to Explore?

Visit the live demo at `http://localhost:8000` and experience the complete Starbucks website clone with all its features!

**Key Testing Scenarios:**
1. 🔐 Sign in with demo account: `john.doe@email.com` / `password123`
2. 🛒 Add items to cart from the menu page
3. 💳 Complete checkout with fake payment details
4. 📋 View order history and track orders
5. 👤 Manage user profile and preferences

**Have questions or suggestions? Feel free to open an issue or contribute to the project!**
