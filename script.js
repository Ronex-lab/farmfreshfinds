// Cart and user management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = localStorage.getItem('currentUser') || null;
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// Egg inventory management
let eggInventory = JSON.parse(localStorage.getItem('eggInventory')) || {
    "Dozen Free-Range": 50, // In Stock (50 units)
    "Organic Tray": 30,    // Low Stock (30 units)
    "Dozen Organic Brown Eggs": 20, // Low Stock (20 units)
    "Half-Dozen Free-Range Blue Eggs": 10 // Out of Stock (10 units)
};

// Function to add items to cart with quantity
function addToCart(itemName, price, quantity) {
    if (currentUser) {
        cart.push({ name: itemName, price: price, quantity: quantity, user: currentUser });
    } else {
        cart.push({ name: itemName, price: price, quantity: quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
    reduceStock(itemName, quantity);
}

// Function to update cart count in the button
function updateCartCount() {
    const cartButton = document.querySelector('.cart-button');
    cartButton.textContent = `Cart (${cart.length})`;
}

// Function to update cart modal with items, quantities, and total
function updateCartModal() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartItems.innerHTML = ''; // Clear current list
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        const li = document.createElement('li');
        li.innerHTML = `${item.name} (Qty: ${item.quantity}) <span>$${itemTotal.toFixed(2)}</span> <button class="remove-item" data-index="${index}">Remove</button>`;
        cartItems.appendChild(li);
        total += itemTotal;
    });

    cartTotal.textContent = total.toFixed(2);
}

// Function to remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
}

// Function to update stock status display
function updateStockStatus() {
    const stockElements = document.querySelectorAll('.stock-status');
    stockElements.forEach(element => {
        const eggName = element.getAttribute('data-egg');
        const stock = eggInventory[eggName] || 0;
        let status = 'Out of Stock';
        if (stock > 20) {
            status = 'In Stock';
        } else if (stock > 0) {
            status = 'Low Stock';
        }
        element.textContent = `${status} (${stock} available)`;
        element.className = `stock-status ${status.toLowerCase().replace(' ', '-')}`; // Add class for styling
    });
}

// Function to reduce stock when adding to cart
function reduceStock(itemName, quantity) {
    if (eggInventory[itemName] >= quantity) {
        eggInventory[itemName] -= quantity;
        localStorage.setItem('eggInventory', JSON.stringify(eggInventory));
        updateStockStatus();
    } else {
        alert(`Sorry, only ${eggInventory[itemName]} ${itemName}(s) are available.`);
    }
}

// User authentication functions
function register(username, password) {
    if (users[username]) {
        alert('Username already exists!');
        return false;
    }
    users[username] = btoa(password); // Simple hashing for demo (not secure for production)
    localStorage.setItem('users', JSON.stringify(users));
    alert(`Registered successfully as ${username}!`);
    return true;
}

function login(username, password) {
    if (users[username] && users[username] === btoa(password)) {
        currentUser = username;
        localStorage.setItem('currentUser', currentUser);
        document.getElementById('login-button').textContent = 'Logout';
        alert(`Logged in as ${username}!`);
        updateCartForUser();
        document.getElementById('login-modal').style.display = 'none';
        return true;
    }
    alert('Invalid username or password!');
    return false;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    document.getElementById('login-button').textContent = 'Login';
    updateCartCount();
    updateCartModal();
    alert('Logged out successfully!');
}

// Update cart for current user
function updateCartForUser() {
    if (currentUser) {
        const userCart = cart.filter(item => item.user === currentUser);
        cart = userCart.length ? userCart : [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartModal();
    }
}

// Order tracking function
function trackOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        document.getElementById('order-status').textContent = `Status: ${order.status}`;
    } else {
        document.getElementById('order-status').textContent = 'Status: Not found';
    }
}

// Function to submit order (simulated)
function submitOrder() {
    if (cart.length > 0) {
        const orderId = 'ORD' + Date.now();
        const order = {
            id: orderId,
            items: [...cart],
            status: 'Pending',
            date: new Date().toLocaleDateString()
        };
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartModal();
        alert(`Order ${orderId} submitted successfully! Track it on the Home page.`);
    } else {
        alert('Your cart is empty!');
    }
}

// Search function for eggs
function searchEggs(query) {
    const eggGrid = document.getElementById('egg-grid');
    const eggs = eggGrid.getElementsByClassName('egg-item');
    query = query.toLowerCase();
    for (let egg of eggs) {
        const name = egg.querySelector('h3').textContent.toLowerCase();
        egg.style.display = name.includes(query) ? 'block' : 'none';
    }
}

// Slider functionality
function startSlider() {
    let slideIndex = 0;
    const slides = document.getElementsByClassName('slide');
    function showSlide() {
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = 'none';
        }
        slideIndex++;
        if (slideIndex > slides.length) slideIndex = 1;
        slides[slideIndex - 1].style.display = 'block';
        setTimeout(showSlide, 3000); // Change slide every 3 seconds
    }
    showSlide();
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    updateStockStatus();
    updateCartForUser();
    startSlider();

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const itemName = button.previousElementSibling.previousElementSibling.previousElementSibling.textContent; // Get egg name
            const price = parseFloat(button.previousElementSibling.previousElementSibling.textContent.replace('$', '')); // Get price
            const quantityInput = button.previousElementSibling.querySelector('.quantity-input');
            const quantity = parseInt(quantityInput.value) || 1; // Default to 1 if invalid
            reduceStock(itemName, quantity);
            addToCart(itemName, price, quantity);
            alert(`${quantity} ${itemName}(s) added to cart!`);
        });
    });

    // Handle quantity increase/decrease
    const quantityDecreases = document.querySelectorAll('.quantity-decrease');
    const quantityIncreases = document.querySelectorAll('.quantity-increase');
    const quantityInputs = document.querySelectorAll('.quantity-input');

    quantityDecreases.forEach((button, index) => {
        button.addEventListener('click', () => {
            let value = parseInt(quantityInputs[index].value);
            if (value > 1) {
                quantityInputs[index].value = value - 1;
            }
        });
    });

    quantityIncreases.forEach((button, index) => {
        button.addEventListener('click', () => {
            let value = parseInt(quantityInputs[index].value);
            quantityInputs[index].value = value + 1;
        });
    });

    const cartButton = document.querySelector('.cart-button');
    cartButton.addEventListener('click', () => {
        document.getElementById('cart-modal').style.display = 'block';
    });

    const closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', () => {
        document.getElementById('cart-modal').style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('cart-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Add event listeners for remove buttons
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item')) {
            const index = event.target.getAttribute('data-index');
            removeFromCart(index);
        }
    });

    // Contact form submission handler
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-message');

    submitButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default form submission

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validate form fields
        if (!name) {
            alert('Please enter your name.');
            return;
        }
        if (!email) {
            alert('Please enter your email.');
            return;
        }
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        if (!message) {
            alert('Please enter your message.');
            return;
        }

        // If all validations pass, show success alert
        alert(`Thank you, ${name}! Your message has been received. We’ll get back to you at ${email} soon.`);
        
        // Optionally, clear the form
        contactForm.reset();
    });

    // Newsletter signup submission handler
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterSubmit = document.getElementById('newsletter-submit');

    newsletterSubmit.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default form submission

        // Get email value
        const email = document.getElementById('newsletter-email').value.trim();

        // Validate email
        if (!email) {
            alert('Please enter your email address.');
            return;
        }
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // If validation passes, show success alert
        alert(`Thank you! You’ve subscribed to our newsletter with ${email}. Expect updates soon.`);
        
        // Optionally, clear the form
        newsletterForm.reset();
    });

    // Login/Logout handler
    const loginButton = document.getElementById('login-button');
    loginButton.addEventListener('click', () => {
        if (loginButton.textContent === 'Login') {
            document.getElementById('login-modal').style.display = 'block';
        } else {
            logout();
        }
    });

    // Login form submission
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        login(username, password);
    });

    // Register button
    const registerButton = document.getElementById('register-button');
    registerButton.addEventListener('click', () => {
        const username = prompt('Choose a username:');
        const password = prompt('Choose a password:');
        if (username && password) {
            register(username, password);
        }
    });

    // Close login modal
    const loginModalClose = document.querySelector('#login-modal .close');
    loginModalClose.addEventListener('click', () => {
        document.getElementById('login-modal').style.display = 'none';
    });

    // Checkout button to submit order
    document.getElementById('checkout-button').addEventListener('click', submitOrder);

    // Order tracking
    document.getElementById('track-order').addEventListener('click', () => {
        const orderId = document.getElementById('order-id').value.trim();
        trackOrder(orderId);
    });

    // Search bar for eggs
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', (e) => {
        searchEggs(e.target.value);
    });

    // Function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});