/**
 * @module wishlist
 * @description Wishlist module - handles add/remove items, heart toggle, badge updates, and persistence
 * @requires StorageService from storage.js (window.StorageService)
 */

// ========================================
// WISHLIST MANAGER CLASS
// ========================================

export class WishlistManager {
    constructor() {
        this.wishlist = [];
        this.wishlistBadge = null;
    }

    /**
     * Initialize the wishlist system
     */
    init() {
        this.loadWishlist();
        this.setupWishlistBadge();
        this.setupEventListeners();
        this.updateWishlistBadge();
        this.updateHeartStates();
        console.log('✅ Wishlist module initialized');
    }

    /**
     * Load wishlist from storage
     */
    loadWishlist() {
        this.wishlist = window.StorageService.getWishlist() || [];
    }

    /**
     * Save wishlist to storage
     */
    saveWishlist() {
        window.StorageService.setWishlist(this.wishlist);
    }

    /**
     * Setup wishlist badge element reference
     */
    setupWishlistBadge() {
        this.wishlistBadge = document.querySelector('.wishlist-badge') ||
            document.querySelector('.wishlist-count') ||
            document.getElementById('wishlistCount');
    }

    /**
     * Setup event listeners for wishlist buttons
     */
    setupEventListeners() {
        // Listen for wishlist toggle button clicks (heart icon)
        document.addEventListener('click', (e) => {
            const wishlistBtn = e.target.closest('.wishlist-btn, .btn-wishlist, [data-action="toggle-wishlist"]');
            if (wishlistBtn) {
                e.preventDefault();
                e.stopPropagation();
                this.handleWishlistToggle(wishlistBtn);
            }
        });

        // Listen for remove from wishlist buttons
        document.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('[data-action="remove-from-wishlist"]');
            if (removeBtn) {
                e.preventDefault();
                const productId = removeBtn.dataset.productId;
                if (productId) {
                    this.removeFromWishlist(productId);
                }
            }
        });
    }

    /**
     * Handle wishlist button toggle
     * @param {HTMLElement} button - The wishlist button element
     */
    handleWishlistToggle(button) {
        // Extract product data from button attributes
        const productData = {
            id: button.dataset.productId || button.getAttribute('data-product-id'),
            name: button.dataset.productName || button.getAttribute('data-product-name'),
            price: parseFloat(button.dataset.price || button.getAttribute('data-price')),
            image: button.dataset.image || button.getAttribute('data-image')
        };

        // Validate product data
        if (!productData.id) {
            console.error('Invalid product data - missing ID:', productData);
            return;
        }

        // Toggle wishlist state
        if (this.isInWishlist(productData.id)) {
            this.removeFromWishlist(productData.id);
            this.updateHeartIcon(button, false);
        } else {
            this.addToWishlist(productData);
            this.updateHeartIcon(button, true);
        }
    }

    /**
     * Add item to wishlist
     * @param {Object} product - Product object {id, name, price, image}
     */
    addToWishlist(product) {
        // Check if already in wishlist
        if (this.isInWishlist(product.id)) {
            this.showNotification(`${product.name || 'Item'} is already in your wishlist`, 'info');
            return;
        }

        // Add to wishlist
        this.wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            addedAt: new Date().toISOString()
        });

        // Save and update UI
        this.saveWishlist();
        this.updateWishlistBadge();
        this.updateWishlistUI();
        this.showNotification(`${product.name || 'Item'} added to wishlist! ❤️`, 'success');

        // Dispatch custom event
        this.dispatchWishlistEvent('wishlist-updated');
    }

    /**
     * Remove item from wishlist
     * @param {string} productId - Product ID to remove
     */
    removeFromWishlist(productId) {
        const itemIndex = this.wishlist.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            const removedItem = this.wishlist[itemIndex];
            this.wishlist.splice(itemIndex, 1);

            this.showNotification(`${removedItem.name || 'Item'} removed from wishlist`, 'info');

            // Save and update UI
            this.saveWishlist();
            this.updateWishlistBadge();
            this.updateWishlistUI();
            this.updateHeartStates();

            // Dispatch custom event
            this.dispatchWishlistEvent('wishlist-updated');
        }
    }

    /**
     * Clear entire wishlist
     */
    clearWishlist() {
        this.wishlist = [];
        this.saveWishlist();
        this.updateWishlistBadge();
        this.updateWishlistUI();
        this.updateHeartStates();
        this.showNotification('Wishlist cleared', 'info');
        this.dispatchWishlistEvent('wishlist-cleared');
    }

    /**
     * Get wishlist items
     * @returns {Array} Array of wishlist items
     */
    getWishlist() {
        return this.wishlist;
    }

    /**
     * Get total number of items in wishlist
     * @returns {number} Total item count
     */
    getItemCount() {
        return this.wishlist.length;
    }

    /**
     * Check if item is in wishlist
     * @param {string} productId - Product ID
     * @returns {boolean} True if item is in wishlist
     */
    isInWishlist(productId) {
        return this.wishlist.some(item => item.id === productId);
    }

    /**
     * Update wishlist badge with current item count
     */
    updateWishlistBadge() {
        const count = this.getItemCount();

        if (this.wishlistBadge) {
            this.wishlistBadge.textContent = count;

            // Show/hide badge based on count
            if (count > 0) {
                this.wishlistBadge.style.display = 'flex';
                this.wishlistBadge.classList.add('has-items');
            } else {
                this.wishlistBadge.style.display = 'none';
                this.wishlistBadge.classList.remove('has-items');
            }
        }

        // Update any other wishlist count displays
        document.querySelectorAll('[data-wishlist-count]').forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    /**
     * Update all heart icons to reflect wishlist state
     */
    updateHeartStates() {
        document.querySelectorAll('.wishlist-btn, .btn-wishlist, [data-action="toggle-wishlist"]').forEach(btn => {
            const productId = btn.dataset.productId || btn.getAttribute('data-product-id');
            if (productId) {
                const isInWishlist = this.isInWishlist(productId);
                this.updateHeartIcon(btn, isInWishlist);
            }
        });
    }

    /**
     * Update heart icon state
     * @param {HTMLElement} button - Wishlist button element
     * @param {boolean} isActive - Whether item is in wishlist
     */
    updateHeartIcon(button, isActive) {
        const icon = button.querySelector('i') || button;

        if (isActive) {
            // Filled heart - in wishlist
            icon.classList.remove('fa-heart-o', 'far');
            icon.classList.add('fa-heart', 'fas', 'active');
            button.classList.add('active', 'in-wishlist');
            button.setAttribute('aria-label', 'Remove from wishlist');
        } else {
            // Outline heart - not in wishlist
            icon.classList.remove('fa-heart', 'fas', 'active');
            icon.classList.add('fa-heart-o', 'far');
            button.classList.remove('active', 'in-wishlist');
            button.setAttribute('aria-label', 'Add to wishlist');
        }

        // Animate the heart
        button.classList.add('heart-animate');
        setTimeout(() => button.classList.remove('heart-animate'), 300);
    }

    /**
     * Update wishlist UI (for wishlist page)
     */
    updateWishlistUI() {
        const wishlistContainer = document.getElementById('wishlist-items-container') ||
            document.querySelector('.wishlist-items') ||
            document.querySelector('[data-wishlist-container]');

        if (wishlistContainer) {
            this.renderWishlistItems(wishlistContainer);
        }
    }

    /**
     * Render wishlist items in container
     * @param {HTMLElement} container - Container element
     */
    renderWishlistItems(container) {
        if (!container) return;

        if (this.wishlist.length === 0) {
            container.innerHTML = `
        <div class="empty-wishlist">
          <i class="fas fa-heart"></i>
          <p>Your wishlist is empty</p>
          <p class="subtitle">Save items you love for later!</p>
          <a href="Shop.html" class="btn btn-primary">Browse Products</a>
        </div>
      `;
            return;
        }

        const wishlistHTML = this.wishlist.map(item => `
      <div class="wishlist-item" data-product-id="${item.id}">
        <button class="wishlist-item-remove" data-product-id="${item.id}" data-action="remove-from-wishlist">
          <i class="fas fa-times"></i>
        </button>
        <div class="wishlist-item-image">
          <img src="${item.image || 'assets/images/placeholder.png'}" alt="${item.name}">
        </div>
        <div class="wishlist-item-details">
          <h4 class="wishlist-item-name">${item.name}</h4>
          <p class="wishlist-item-price">₱${item.price.toFixed(2)}</p>
          <button class="btn btn-primary btn-sm add-to-cart-btn" 
                  data-product-id="${item.id}"
                  data-product-name="${item.name}"
                  data-price="${item.price}"
                  data-image="${item.image}">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    `).join('');

        container.innerHTML = wishlistHTML;
    }

    /**
     * Move item from wishlist to cart
     * @param {string} productId - Product ID
     */
    moveToCart(productId) {
        const item = this.wishlist.find(i => i.id === productId);

        if (item && window.cartManager) {
            // Add to cart
            window.cartManager.addToCart(item);

            // Remove from wishlist
            this.removeFromWishlist(productId);

            this.showNotification(`${item.name} moved to cart`, 'success');
        }
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
     * Dispatch custom wishlist event
     * @param {string} eventName - Event name
     * @param {Object} detail - Event detail data
     */
    dispatchWishlistEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail: {
                wishlist: this.wishlist,
                itemCount: this.getItemCount(),
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
 * Initialize the wishlist system
 * Call this function when DOM is ready
 */
export function initWishlist() {
    if (!window.wishlistManager) {
        window.wishlistManager = new WishlistManager();
        window.wishlistManager.init();
    }
    return window.wishlistManager;
}

/**
 * Get wishlist manager instance
 * @returns {WishlistManager} Wishlist manager instance
 */
export function getWishlistManager() {
    return window.wishlistManager;
}
