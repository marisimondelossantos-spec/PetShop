// Profile Page JavaScript - REFACTORED VERSION using StorageService

class ProfileManager {
    constructor() {
        this.currentUser = null;
        this.cart = [];
        this.wishlist = [];
        this.orders = [];
        // init() will be called manually by initProfile()
    }

    init() {
        // Check if user is logged in
        this.checkAuth();

        // Setup event listeners
        this.setupEventListeners();

        // Load user data
        this.loadUserData();

        // Load cart, wishlist, and orders
        this.loadCart();
        this.loadWishlist();
        this.loadOrders();
    }

    checkAuth() {
        // CHANGED: Use StorageService instead of direct localStorage
        const isLoggedIn = window.StorageService.isLoggedIn();
        const currentUser = window.StorageService.getCurrentUser();

        if (!isLoggedIn || !currentUser) {
            // Redirect to home page if not logged in
            window.location.href = 'index.html';
            return;
        }

        // getCurrentUser() already returns parsed object
        this.currentUser = currentUser;
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn:not(.logout-btn)').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Logout button
        document.getElementById('profile-logout-btn')?.addEventListener('click', () => {
            this.handleLogout();
        });

        // Edit button
        document.getElementById('edit-info-btn')?.addEventListener('click', () => {
            this.toggleEditMode(true);
        });

        // Cancel edit button
        document.getElementById('cancel-edit-btn')?.addEventListener('click', () => {
            this.toggleEditMode(false);
            this.loadUserData();
        });

        // Save button (form submit)
        document.getElementById('user-info-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveUserInfo();
        });

        // Clear cart button
        document.getElementById('clear-cart-btn')?.addEventListener('click', () => {
            this.clearCart();
        });

        // Clear wishlist button
        document.getElementById('clear-wishlist-btn')?.addEventListener('click', () => {
            this.clearWishlist();
        });

        // Checkout button
        document.getElementById('checkout-btn')?.addEventListener('click', () => {
            if (this.cart.length === 0) {
                this.showNotification('Your cart is empty', 'error');
                return;
            }
            // Open payment modal with current cart
            if (window.paymentModalManager) {
                window.paymentModalManager.openPaymentModal(this.cart);
            }
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-panel`)?.classList.add('active');
    }

    loadUserData() {
        if (!this.currentUser) return;

        // Update header
        const fullName = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        document.getElementById('profile-user-name').textContent = fullName;
        document.getElementById('profile-user-email').textContent = this.currentUser.email;

        // Fill form fields
        document.getElementById('info-firstName').value = this.currentUser.firstName || '';
        document.getElementById('info-middleName').value = this.currentUser.middleName || '';
        document.getElementById('info-lastName').value = this.currentUser.lastName || '';
        document.getElementById('info-email').value = this.currentUser.email || '';
        document.getElementById('info-contactNumber').value = this.currentUser.contactNumber || '';
        document.getElementById('info-street').value = this.currentUser.address?.street || '';
        document.getElementById('info-zone').value = this.currentUser.address?.zone || '';
        document.getElementById('info-city').value = this.currentUser.address?.city || '';
        document.getElementById('info-province').value = this.currentUser.address?.province || '';
        document.getElementById('info-zipCode').value = this.currentUser.address?.zipCode || '';
    }

    toggleEditMode(enable) {
        const form = document.getElementById('user-info-form');
        const inputs = form.querySelectorAll('input');
        const formActions = form.querySelector('.form-actions');
        const editBtn = document.getElementById('edit-info-btn');

        inputs.forEach(input => {
            if (input.id !== 'info-email') { // Email should not be editable
                input.disabled = !enable;
            }
        });

        if (enable) {
            formActions.style.display = 'flex';
            editBtn.style.display = 'none';
        } else {
            formActions.style.display = 'none';
            editBtn.style.display = 'flex';
        }
    }

    saveUserInfo() {
        // Get form values
        const updatedData = {
            ...this.currentUser,
            firstName: document.getElementById('info-firstName').value.trim(),
            middleName: document.getElementById('info-middleName').value.trim(),
            lastName: document.getElementById('info-lastName').value.trim(),
            contactNumber: document.getElementById('info-contactNumber').value.trim(),
            address: {
                street: document.getElementById('info-street').value.trim(),
                zone: document.getElementById('info-zone').value.trim(),
                city: document.getElementById('info-city').value.trim(),
                province: document.getElementById('info-province').value.trim(),
                zipCode: document.getElementById('info-zipCode').value.trim()
            }
        };

        // Validate
        if (!updatedData.firstName || !updatedData.lastName) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // CHANGED: Use StorageService to update user data
        window.StorageService.setCurrentUser(updatedData);

        // Update users array
        const users = window.StorageService.getUsers();
        const userIndex = users.findIndex(u => u.email === updatedData.email);
        if (userIndex !== -1) {
            users[userIndex] = updatedData;
            window.StorageService.setUsers(users);
        }

        this.currentUser = updatedData;
        this.toggleEditMode(false);
        this.loadUserData();
        this.showNotification('Profile updated successfully!', 'success');
    }

    loadCart() {
        // CHANGED: Use StorageService to get cart (returns array directly)
        const storedCart = window.StorageService.getCart();
        if (storedCart && storedCart.length > 0) {
            this.cart = storedCart;
        } else {
            // Sample cart data
            this.cart = [
                {
                    id: 1,
                    name: 'Premium Dog Food - Chicken & Rice',
                    price: 799,
                    quantity: 2,
                    image: 'assets/images/products/dog-food-premium.jpg',
                    category: 'Food',
                    brand: 'Natural Food'
                },
                {
                    id: 2,
                    name: 'Interactive Rope Toy for Dogs',
                    price: 299,
                    quantity: 1,
                    image: 'assets/images/products/rope-toy-interactive.jpg',
                    category: 'Toys',
                    brand: 'Pet Care'
                }
            ];
        }

        this.renderCart();
        this.updateCartBadge();
    }

    renderCart() {
        const container = document.getElementById('cart-items-container');
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-shopping-cart"></i>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started!</p>
        </div>
      `;
            this.updateCartTotal();
            return;
        }

        container.innerHTML = this.cart.map(item => `
      <div class="item-card" data-item-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.src='assets/images/home/HeroImageMain.png'">
        <div class="item-details">
          <h3 class="item-name">${item.name}</h3>
          <p class="item-meta">${item.category} • ${item.brand}</p>
          <div class="item-price">₱${item.price.toFixed(2)}</div>
        </div>
        <div class="item-actions">
          <div class="quantity-controls">
            <button class="qty-btn" onclick="profileManager.updateQuantity(${item.id}, -1)">
              <i class="fas fa-minus"></i>
            </button>
            <input type="number" class="qty-input" value="${item.quantity}" min="1" readonly>
            <button class="qty-btn" onclick="profileManager.updateQuantity(${item.id}, 1)">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <button class="btn-remove" onclick="profileManager.removeFromCart(${item.id})">
            <i class="fas fa-trash"></i>
            Remove
          </button>
        </div>
      </div>
    `).join('');

        this.updateCartTotal();
    }

    updateQuantity(itemId, change) {
        const item = this.cart.find(i => i.id === itemId);
        if (item) {
            item.quantity = Math.max(1, item.quantity + change);
            this.saveCart();
            this.renderCart();
        }
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(i => i.id !== itemId);
        this.saveCart();
        this.renderCart();
        this.updateCartBadge();
        this.showNotification('Item removed from cart', 'success');
    }

    clearCart() {
        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveCart();
            this.renderCart();
            this.updateCartBadge();
            this.showNotification('Cart cleared', 'success');
        }
    }

    saveCart() {
        // CHANGED: Use StorageService to save cart
        window.StorageService.setCart(this.cart);
    }

    updateCartTotal() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cart-subtotal').textContent = `₱${subtotal.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `₱${subtotal.toFixed(2)}`;
    }

    updateCartBadge() {
        const badge = document.getElementById('cart-count');
        if (badge) {
            badge.textContent = this.cart.length;
        }
    }

    loadWishlist() {
        // CHANGED: Use StorageService to get wishlist (returns array directly)
        const storedWishlist = window.StorageService.getWishlist();
        if (storedWishlist && storedWishlist.length > 0) {
            this.wishlist = storedWishlist;
        } else {
            // Sample wishlist data
            this.wishlist = [
                {
                    id: 3,
                    name: 'Waterproof Dog Jacket - Red',
                    price: 599,
                    image: 'assets/images/products/dog-jacket-waterproof.jpg',
                    category: 'Clothing',
                    brand: 'Dogs Friend',
                    status: 'Out of Stock'
                }
            ];
        }

        this.renderWishlist();
        this.updateWishlistBadge();
    }

    renderWishlist() {
        const container = document.getElementById('wishlist-items-container');
        if (!container) return;

        if (this.wishlist.length === 0) {
            container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-heart"></i>
          <h3>Your wishlist is empty</h3>
          <p>Save your favorite items here!</p>
        </div>
      `;
            return;
        }

        container.innerHTML = this.wishlist.map(item => `
      <div class="item-card" data-item-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.src='assets/images/home/HeroImageMain.png'">
        <div class="item-details">
          <h3 class="item-name">${item.name}</h3>
          <p class="item-meta">${item.category} • ${item.brand}</p>
          <div class="item-price">₱${item.price.toFixed(2)}</div>
          ${item.status ? `<p class="item-meta" style="color: #e74c3c;">${item.status}</p>` : ''}
        </div>
        <div class="item-actions">
          <button class="btn-add-to-cart" onclick="profileManager.addToCartFromWishlist(${item.id})">
            <i class="fas fa-shopping-cart"></i>
            Add to Cart
          </button>
          <button class="btn-remove" onclick="profileManager.removeFromWishlist(${item.id})">
            <i class="fas fa-trash"></i>
            Remove
          </button>
        </div>
      </div>
    `).join('');
    }

    addToCartFromWishlist(itemId) {
        const item = this.wishlist.find(i => i.id === itemId);
        if (item) {
            // Check if already in cart
            const existingItem = this.cart.find(i => i.id === itemId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.push({ ...item, quantity: 1 });
            }
            this.saveCart();
            this.renderCart();
            this.updateCartBadge();
            this.updateCartTotal();
            this.showNotification('Item added to cart!', 'success');
        }
    }

    removeFromWishlist(itemId) {
        this.wishlist = this.wishlist.filter(i => i.id !== itemId);
        this.saveWishlist();
        this.renderWishlist();
        this.updateWishlistBadge();
        this.showNotification('Item removed from wishlist', 'success');
    }

    clearWishlist() {
        if (confirm('Are you sure you want to clear your wishlist?')) {
            this.wishlist = [];
            this.saveWishlist();
            this.renderWishlist();
            this.updateWishlistBadge();
            this.showNotification('Wishlist cleared', 'success');
        }
    }

    saveWishlist() {
        // CHANGED: Use StorageService to save wishlist
        window.StorageService.setWishlist(this.wishlist);
    }

    updateWishlistBadge() {
        const badge = document.getElementById('wishlist-count');
        if (badge) {
            badge.textContent = this.wishlist.length;
        }
    }

    loadOrders() {
        // CHANGED: Use StorageService to get orders (returns array directly)
        const storedOrders = window.StorageService.getOrders();
        if (storedOrders && storedOrders.length > 0) {
            this.orders = storedOrders;
        } else {
            // Sample order data
            this.orders = [];
        }

        this.renderOrders();
    }

    renderOrders() {
        const container = document.getElementById('orders-container');
        if (!container) return;

        if (this.orders.length === 0) {
            container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-box"></i>
          <h3>No orders yet</h3>
          <p>Your order history will appear here</p>
        </div>
      `;
            return;
        }

        container.innerHTML = this.orders.map(order => `
      <div class="order-card">
        <div class="order-header">
          <div class="order-id">Order #${order.id}</div>
          <div class="order-date">${new Date(order.date).toLocaleDateString()}</div>
        </div>
        <div class="order-items">
          ${order.items.map(item => `
            <div class="order-item">
              <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/home/HeroImageMain.png'">
              <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">Qty: ${item.quantity}</div>
              </div>
              <div class="item-price">₱${item.price.toFixed(2)}</div>
            </div>
          `).join('')}
        </div>
        <div class="order-footer">
          <div class="order-status status-${order.status.toLowerCase().replace(' ', '-')}">${order.status}</div>
          <div class="order-total">Total: ₱${order.total.toFixed(2)}</div>
        </div>
      </div>
    `).join('');
    }

    handleLogout() {
        if (confirm('Are you sure you want to log out?')) {
            // CHANGED: Use StorageService logout method
            window.StorageService.logout();
            document.documentElement.classList.remove('user-logged-in');
            window.location.href = 'index.html';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
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
}

// ========================================
// EXPORTS
// ========================================

/**
 * Initialize the profile system
 * Call this function when DOM is ready
 */
export function initProfile() {
    if (!window.profileManager) {
        window.profileManager = new ProfileManager();
    }
    return window.profileManager;
}

/**
 * Get profile manager instance
 * @returns {ProfileManager} Profile manager instance
 */
export function getProfileManager() {
    return window.profileManager;
}

export { ProfileManager };
