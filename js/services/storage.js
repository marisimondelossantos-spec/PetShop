/**
 * Centralized localStorage Service
 * 
 * Purpose: Provides a single source of truth for all localStorage operations
 * across the Pet Shop application. Prevents bugs from inconsistent key naming
 * and provides type-safe accessors.
 * 
 * IMPORTANT: All localStorage access should go through this service.
 */

const StorageService = {
    // Centralized key definitions - NEVER access localStorage directly with hardcoded keys
    KEYS: {
        // Authentication
        IS_LOGGED_IN: 'petshop_is_logged_in',
        CURRENT_USER: 'petshop_current_user',
        USERS: 'petshop_users',

        // Shopping
        CART: 'petshop_cart',
        WISHLIST: 'petshop_wishlist',
        ORDERS: 'petshop_orders',

        // UI Preferences
        SHOP_VIEW: 'petshop_shop_view',
        ITEMS_PER_PAGE: 'petshop_items_per_page'
    },

    // === MIGRATION HELPER ===
    // Runs once to migrate old unprefixed keys to new prefixed keys
    migrate() {
        // Migrate cart: 'cart' → 'petshop_cart'
        const oldCart = localStorage.getItem('cart');
        if (oldCart && !localStorage.getItem(this.KEYS.CART)) {
            localStorage.setItem(this.KEYS.CART, oldCart);
            console.log('[Storage Migration] Migrated cart data to petshop_cart');
        }

        // Migrate wishlist: 'wishlist' → 'petshop_wishlist'
        const oldWishlist = localStorage.getItem('wishlist');
        if (oldWishlist && !localStorage.getItem(this.KEYS.WISHLIST)) {
            localStorage.setItem(this.KEYS.WISHLIST, oldWishlist);
            console.log('[Storage Migration] Migrated wishlist data to petshop_wishlist');
        }

        // Migrate shop view: 'shop-view' → 'petshop_shop_view'
        const oldView = localStorage.getItem('shop-view');
        if (oldView && !localStorage.getItem(this.KEYS.SHOP_VIEW)) {
            localStorage.setItem(this.KEYS.SHOP_VIEW, oldView);
            console.log('[Storage Migration] Migrated shop view preference');
        }

        // Migrate items per page: 'items-per-page' → 'petshop_items_per_page'
        const oldItemsPerPage = localStorage.getItem('items-per-page');
        if (oldItemsPerPage && !localStorage.getItem(this.KEYS.ITEMS_PER_PAGE)) {
            localStorage.setItem(this.KEYS.ITEMS_PER_PAGE, oldItemsPerPage);
            console.log('[Storage Migration] Migrated items per page preference');
        }
    },

    // === AUTHENTICATION ===

    isLoggedIn() {
        return localStorage.getItem(this.KEYS.IS_LOGGED_IN) === 'true';
    },

    setLoggedIn(value) {
        localStorage.setItem(this.KEYS.IS_LOGGED_IN, value.toString());
    },

    getCurrentUser() {
        const userData = localStorage.getItem(this.KEYS.CURRENT_USER);
        return userData ? JSON.parse(userData) : null;
    },

    setCurrentUser(user) {
        localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
    },

    removeCurrentUser() {
        localStorage.removeItem(this.KEYS.CURRENT_USER);
    },

    getUsers() {
        const users = localStorage.getItem(this.KEYS.USERS);
        return users ? JSON.parse(users) : [];
    },

    setUsers(users) {
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    },

    logout() {
        this.removeCurrentUser();
        this.setLoggedIn(false);
    },

    // === CART ===

    getCart() {
        const cart = localStorage.getItem(this.KEYS.CART);
        return cart ? JSON.parse(cart) : [];
    },

    setCart(cart) {
        localStorage.setItem(this.KEYS.CART, JSON.stringify(cart));
    },

    clearCart() {
        localStorage.setItem(this.KEYS.CART, JSON.stringify([]));
    },

    addToCart(item) {
        const cart = this.getCart();
        const existingIndex = cart.findIndex(i => i.id === item.id);

        if (existingIndex > -1) {
            // Item exists, increase quantity
            cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
        } else {
            // New item
            cart.push({ ...item, quantity: 1 });
        }

        this.setCart(cart);
        return cart;
    },

    removeFromCart(productId) {
        const cart = this.getCart();
        const filtered = cart.filter(item => item.id !== productId);
        this.setCart(filtered);
        return filtered;
    },

    // === WISHLIST ===

    getWishlist() {
        const wishlist = localStorage.getItem(this.KEYS.WISHLIST);
        return wishlist ? JSON.parse(wishlist) : [];
    },

    setWishlist(wishlist) {
        localStorage.setItem(this.KEYS.WISHLIST, JSON.stringify(wishlist));
    },

    addToWishlist(productId) {
        const wishlist = this.getWishlist();
        if (!wishlist.includes(productId)) {
            wishlist.push(productId);
            this.setWishlist(wishlist);
        }
        return wishlist;
    },

    removeFromWishlist(productId) {
        const wishlist = this.getWishlist();
        const filtered = wishlist.filter(id => id !== productId);
        this.setWishlist(filtered);
        return filtered;
    },

    isInWishlist(productId) {
        return this.getWishlist().includes(productId);
    },

    clearWishlist() {
        localStorage.setItem(this.KEYS.WISHLIST, JSON.stringify([]));
    },

    // === ORDERS ===

    getOrders() {
        const orders = localStorage.getItem(this.KEYS.ORDERS);
        return orders ? JSON.parse(orders) : [];
    },

    setOrders(orders) {
        localStorage.setItem(this.KEYS.ORDERS, JSON.stringify(orders));
    },

    addOrder(order) {
        const orders = this.getOrders();
        orders.push(order);
        this.setOrders(orders);
        return orders;
    },

    // === UI PREFERENCES ===

    getShopView() {
        return localStorage.getItem(this.KEYS.SHOP_VIEW) || 'grid';
    },

    setShopView(view) {
        localStorage.setItem(this.KEYS.SHOP_VIEW, view);
    },

    getItemsPerPage() {
        return localStorage.getItem(this.KEYS.ITEMS_PER_PAGE) || '12';
    },

    setItemsPerPage(count) {
        localStorage.setItem(this.KEYS.ITEMS_PER_PAGE, count.toString());
    }
};

// Run migration automatically when this script loads
// This ensures any existing user data is preserved
if (typeof window !== 'undefined') {
    StorageService.migrate();
}

// Make available globally for all scripts
if (typeof window !== 'undefined') {
    window.StorageService = StorageService;
}
