/**
 * @module cart
 * @description Shopping cart module - handles add/remove/update items, cart count badge, and persistence
 * @requires StorageService from storage.js (window.StorageService)
 */

// ========================================
// CART MANAGER CLASS
// ========================================

export class CartManager {
    constructor() {
        this.cart = [];
        this.cartBadge = null;
    }

    /**
     * Initialize the cart system
     */
    init() {
        this.loadCart();
        this.setupCartBadge();
        this.setupEventListeners();
        this.updateCartBadge();
        console.log('✅ Cart module initialized');
    }

    /**
     * Load cart from storage
     */
    loadCart() {
        this.cart = window.StorageService.getCart() || [];
    }

    /**
     * Save cart to storage
     */
    saveCart() {
        window.StorageService.setCart(this.cart);
    }

    /**
     * Setup cart badge element reference
     */
    setupCartBadge() {
        // Look for cart badge in navbar or other locations
        this.cartBadge = document.querySelector('.cart-badge') ||
            document.querySelector('.cart-count') ||
            document.getElementById('cartCount');
    }

    /**
     * Setup event listeners for add to cart buttons
     */
    setupEventListeners() {
        // Listen for add to cart button clicks
        document.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('.add-to-cart-btn, [data-action="add-to-cart"]');
            if (addToCartBtn && !addToCartBtn.disabled) {
                e.preventDefault();
                this.handleAddToCart(addToCartBtn);
            }
        });

        // Listen for remove from cart buttons
        document.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.remove-from-cart, [data-action="remove-from-cart"]');
            if (removeBtn) {
                e.preventDefault();
                const productId = removeBtn.dataset.productId;
                if (productId) {
                    this.removeFromCart(productId);
                }
            }
        });

        // Listen for quantity changes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('cart-item-quantity') ||
                e.target.dataset.action === 'update-quantity') {
                const productId = e.target.dataset.productId;
                const newQuantity = parseInt(e.target.value);
                if (productId && newQuantity > 0) {
                    this.updateQuantity(productId, newQuantity);
                }
            }
        });
    }

    /**
     * Handle add to cart button click
     * @param {HTMLElement} button - The add to cart button element
     */
    handleAddToCart(button) {
        // Extract product data from button attributes
        const productData = {
            id: button.dataset.productId || button.getAttribute('data-product-id'),
            name: button.dataset.productName || button.getAttribute('data-product-name'),
            price: parseFloat(button.dataset.price || button.getAttribute('data-price')),
            image: button.dataset.image || button.getAttribute('data-image'),
            quantity: 1
        };

        // Validate product data
        if (!productData.id || !productData.name || !productData.price) {
            console.error('Invalid product data:', productData);
            this.showNotification('Error: Invalid product data', 'error');
            return;
        }

        // Add to cart
        this.addToCart(productData);

        // Visual feedback
        this.animateAddToCart(button);
    }

    /**
     * Add item to cart
     * @param {Object} product - Product object {id, name, price, image, quantity}
     */
    addToCart(product) {
        // Check if product already exists in cart
        const existingItem = this.cart.find(item => item.id === product.id);

        if (existingItem) {
            // Increase quantity
            existingItem.quantity += product.quantity || 1;
            this.showNotification(`Updated ${product.name} quantity in cart`, 'success');
        } else {
            // Add new item
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: product.quantity || 1,
                addedAt: new Date().toISOString()
            });
            this.showNotification(`${product.name} added to cart!`, 'success');
        }

        // Save and update UI
        this.saveCart();
        this.updateCartBadge();
        this.updateCartUI();

        // Dispatch custom event
        this.dispatchCartEvent('cart-updated');
    }

    /**
     * Remove item from cart
     * @param {string} productId - Product ID to remove
     */
    removeFromCart(productId) {
        const itemIndex = this.cart.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            const removedItem = this.cart[itemIndex];
            this.cart.splice(itemIndex, 1);

            this.showNotification(`${removedItem.name} removed from cart`, 'info');

            // Save and update UI
            this.saveCart();
            this.updateCartBadge();
            this.updateCartUI();

            // Dispatch custom event
            this.dispatchCartEvent('cart-updated');
        }
    }

    /**
     * Update item quantity in cart
     * @param {string} productId - Product ID
     * @param {number} newQuantity - New quantity
     */
    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);

        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = newQuantity;

                // Save and update UI
                this.saveCart();
                this.updateCartBadge();
                this.updateCartUI();

                // Dispatch custom event
                this.dispatchCartEvent('cart-updated');
            }
        }
    }

    /**
     * Increase item quantity
     * @param {string} productId - Product ID
     */
    increaseQuantity(productId) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += 1;
            this.saveCart();
            this.updateCartBadge();
            this.updateCartUI();
            this.dispatchCartEvent('cart-updated');
        }
    }

    /**
     * Decrease item quantity
     * @param {string} productId - Product ID
     */
    decreaseQuantity(productId) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
                this.saveCart();
                this.updateCartBadge();
                this.updateCartUI();
                this.dispatchCartEvent('cart-updated');
            } else {
                this.removeFromCart(productId);
            }
        }
    }

    /**
     * Clear entire cart
     */
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartBadge();
        this.updateCartUI();
        this.showNotification('Cart cleared', 'info');
        this.dispatchCartEvent('cart-cleared');
    }

    /**
     * Get cart items
     * @returns {Array} Array of cart items
     */
    getCart() {
        return this.cart;
    }

    /**
     * Get total number of items in cart
     * @returns {number} Total item count
     */
    getItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Get cart subtotal
     * @returns {number} Cart subtotal
     */
    getSubtotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    /**
     * Get cart total (with tax, shipping, etc.)
     * @param {number} tax - Tax rate (e.g., 0.12 for 12%)
     * @param {number} shipping - Shipping cost
     * @returns {number} Cart total
     */
    getTotal(tax = 0, shipping = 0) {
        const subtotal = this.getSubtotal();
        const taxAmount = subtotal * tax;
        return subtotal + taxAmount + shipping;
    }

    /**
     * Check if item is in cart
     * @param {string} productId - Product ID
     * @returns {boolean} True if item is in cart
     */
    isInCart(productId) {
        return this.cart.some(item => item.id === productId);
    }

    /**
     * Get item quantity in cart
     * @param {string} productId - Product ID
     * @returns {number} Quantity (0 if not in cart)
     */
    getItemQuantity(productId) {
        const item = this.cart.find(item => item.id === productId);
        return item ? item.quantity : 0;
    }

    /**
     * Update cart badge with current item count
     */
    updateCartBadge() {
        const count = this.getItemCount();

        if (this.cartBadge) {
            this.cartBadge.textContent = count;

            // Show/hide badge based on count
            if (count > 0) {
                this.cartBadge.style.display = 'flex';
                this.cartBadge.classList.add('has-items');
            } else {
                this.cartBadge.style.display = 'none';
                this.cartBadge.classList.remove('has-items');
            }
        }

        // Update any other cart count displays
        document.querySelectorAll('[data-cart-count]').forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    /**
     * Update cart UI (for cart page/modal)
     */
    updateCartUI() {
        // Update cart display if on cart page or if cart container exists
        const cartContainer = document.getElementById('cart-items-container') ||
            document.querySelector('.cart-items') ||
            document.querySelector('[data-cart-container]');

        if (cartContainer) {
            this.renderCartItems(cartContainer);
        }

        // Update subtotal displays
        this.updateCartTotals();
    }

    /**
     * Render cart items in container
     * @param {HTMLElement} container - Container element
     */
    renderCartItems(container) {
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>Your cart is empty</p>
          <a href="Shop.html" class="btn btn-primary">Start Shopping</a>
        </div>
      `;
            return;
        }

        const cartHTML = this.cart.map(item => `
      <div class="cart-item" data-product-id="${item.id}">
        <div class="cart-item-image">
          <img src="${item.image || 'assets/images/placeholder.png'}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.name}</h4>
          <p class="cart-item-price">₱${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-quantity">
          <button class="qty-btn decrease" data-product-id="${item.id}" data-action="decrease-quantity">
            <i class="fas fa-minus"></i>
          </button>
          <input type="number" class="cart-item-quantity-input" value="${item.quantity}" 
                 min="1" data-product-id="${item.id}" data-action="update-quantity">
          <button class="qty-btn increase" data-product-id="${item.id}" data-action="increase-quantity">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="cart-item-total">
          ₱${(item.price * item.quantity).toFixed(2)}
        </div>
        <button class="cart-item-remove" data-product-id="${item.id}" data-action="remove-from-cart">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `).join('');

        container.innerHTML = cartHTML;

        // Setup quantity buttons
        this.setupQuantityButtons(container);
    }

    /**
     * Setup quantity increase/decrease buttons
     * @param {HTMLElement} container - Container element
     */
    setupQuantityButtons(container) {
        // Increase quantity buttons
        container.querySelectorAll('[data-action="increase-quantity"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.productId;
                this.increaseQuantity(productId);
            });
        });

        // Decrease quantity buttons
        container.querySelectorAll('[data-action="decrease-quantity"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.dataset.productId;
                this.decreaseQuantity(productId);
            });
        });
    }

    /**
     * Update cart total displays
     */
    updateCartTotals() {
        const subtotal = this.getSubtotal();
        const total = this.getTotal();

        // Update subtotal displays
        document.querySelectorAll('[data-cart-subtotal], #cart-subtotal').forEach(el => {
            el.textContent = `₱${subtotal.toFixed(2)}`;
        });

        // Update total displays
        document.querySelectorAll('[data-cart-total], #cart-total').forEach(el => {
            el.textContent = `₱${total.toFixed(2)}`;
        });
    }

    /**
     * Animate add to cart button
     * @param {HTMLElement} button - Button element
     */
    animateAddToCart(button) {
        // Add animation class
        button.classList.add('added-to-cart');

        // Change button text temporarily
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.disabled = true;

        // Reset after animation
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            button.classList.remove('added-to-cart');
        }, 2000);
    }

    /**
     * Show notification toast
     * @param {string} message - Message to display
     * @param {string} type - 'success', 'error', or 'info'
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
      </div>
    `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Dispatch custom cart event
     * @param {string} eventName - Event name
     * @param {Object} detail - Event detail data
     */
    dispatchCartEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail: {
                cart: this.cart,
                itemCount: this.getItemCount(),
                subtotal: this.getSubtotal(),
                ...detail
            }
        });
        document.dispatchEvent(event);
    }
}

// ========================================
// INITIALIZATION FUNCTION
// ========================================

/**
 * Initialize the cart system
 * Call this function when DOM is ready
 */
export function initCart() {
    if (!window.cartManager) {
        window.cartManager = new CartManager();
        window.cartManager.init();
    }
    return window.cartManager;
}

/**
 * Get cart manager instance
 * @returns {CartManager} Cart manager instance
 */
export function getCartManager() {
    return window.cartManager;
}
