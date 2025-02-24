// Cart array to store selected items with quantities
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add items to cart with quantity
function addToCart(itemName, price, quantity) {
    cart.push({ name: itemName, price: price, quantity: quantity });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
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

// Add event listeners to "Add to Cart" buttons and quantity controls
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const itemName = button.previousElementSibling.previousElementSibling.previousElementSibling.textContent; // Get egg name (e.g., "Dozen Free-Range")
            const price = parseFloat(button.previousElementSibling.previousElementSibling.textContent.replace('$', '')); // Get price (e.g., 4.99)
            const quantityInput = button.previousElementSibling.querySelector('.quantity-input');
            const quantity = parseInt(quantityInput.value) || 1; // Default to 1 if invalid
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

    updateCartCount(); // Initialize cart count
    updateCartModal(); // Initialize cart modal

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

    // Function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});