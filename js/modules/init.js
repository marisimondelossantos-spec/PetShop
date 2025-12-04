/**
 * @module init
 * @description Main initialization module - bootstraps and coordinates all other modules
 * @version 1.0.0
 */

// ========================================
// MODULE IMPORTS
// ========================================

import { AuthModalManager, initAuth, immediateAuthCheck } from './auth.js';
import { CartManager, initCart, getCartManager } from './cart.js';
import { WishlistManager, initWishlist, getWishlistManager } from './wishlist.js';
import { SearchManager, initSearch, getSearchManager } from './search.js';
import { MobileMenuManager, initMobileMenu, getMobileMenuManager } from './mobileMenu.js';
import { ModalManager, initModals, getModalManager, openModal, closeModal, confirmModal, alertModal } from './modals.js';
import { UIManager, initUI, getUIManager, toast, showLoading, hideLoading, scrollToTop } from './ui.js';
import { ShopManager, initShop, getShopManager } from './shop.js';
import { ServiceManager, initService, getServiceManager } from './service.js';
import { ProfileManager, initProfile, getProfileManager } from './profile.js';
import './navigation.js';

// ========================================
// IMMEDIATE EXECUTION (BEFORE DOM READY)
// ========================================

/**
 * Run immediately to prevent FOUC (Flash of Unstyled Content)
 * This ensures the correct auth state is applied before page renders
 */
immediateAuthCheck();

// ========================================
// INITIALIZATION MANAGER
// ========================================

class InitManager {
    constructor() {
        this.initialized = false;
        this.modules = {};
    }

    /**
     * Initialize all modules in the correct order
     */
    async init() {
        if (this.initialized) {
            console.warn('Modules already initialized');
            return;
        }

        try {
            console.log('🚀 Initializing Pet Shop modules...');

            // Initialize in dependency order
            await this.initializeModules();

            // Mark as initialized
            this.initialized = true;

            // Dispatch ready event
            this.dispatchReadyEvent();

            console.log('✅ All modules initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing modules:', error);
        }
    }

    /**
     * Initialize all modules
     */
    async initializeModules() {
        // 1. UI utilities (no dependencies)
        this.modules.ui = initUI();

        // 2. Modals (no dependencies)
        this.modules.modals = initModals();

        // 3. Mobile menu (no dependencies)
        this.modules.mobileMenu = initMobileMenu();

        // 4. Auth (depends on UI for notifications)
        this.modules.auth = initAuth();

        // 5. Cart (depends on UI for notifications)
        this.modules.cart = initCart();

        // 6. Wishlist (depends on UI for notifications, cart for move-to-cart)
        this.modules.wishlist = initWishlist();

        // 7. Search (depends on UI for notifications)
        this.modules.search = initSearch();

        // 8. Shop (depends on cart, wishlist, UI - only on shop page)
        if (window.location.pathname.toLowerCase().includes('shop')) {
            this.modules.shop = initShop();
        }

        // 9. Service (depends on UI, modals - only on service page)
        if (window.location.pathname.toLowerCase().includes('service')) {
            this.modules.service = initService();
        }

        // 10. Profile (depends on auth, cart, wishlist, UI - only on profile page)
        if (window.location.pathname.toLowerCase().includes('profile')) {
            this.modules.profile = initProfile();
            this.modules.profile.init(); // Call init after creation
        }

        // Expose to window for global access
        this.exposeToWindow();
    }

    /**
     * Expose modules to window for backward compatibility and debugging
     */
    exposeToWindow() {
        // Managers
        window.authModalManager = this.modules.auth;
        window.cartManager = this.modules.cart;
        window.wishlistManager = this.modules.wishlist;
        window.searchManager = this.modules.search;
        window.mobileMenuManager = this.modules.mobileMenu;
        window.modalManager = this.modules.modals;
        window.uiManager = this.modules.ui;
        if (this.modules.shop) {
            window.shopManager = this.modules.shop;
        }
        if (this.modules.service) {
            window.serviceManager = this.modules.service;
        }
        if (this.modules.profile) {
            window.profileManager = this.modules.profile;
        }

        // Quick access functions
        window.PetShop = {
            // Auth
            auth: this.modules.auth,

            // Cart
            cart: this.modules.cart,
            addToCart: (product) => this.modules.cart.addToCart(product),

            // Wishlist
            wishlist: this.modules.wishlist,
            addToWishlist: (product) => this.modules.wishlist.addToWishlist(product),

            // Search
            search: this.modules.search,

            // Modals
            modals: this.modules.modals,
            openModal: (id, options) => this.modules.modals.open(id, options),
            closeModal: (id) => this.modules.modals.close(id),
            confirm: (config) => this.modules.modals.confirm(config),
            alert: (config) => this.modules.modals.alert(config),

            // UI
            ui: this.modules.ui,
            toast: (message, type, duration) => this.modules.ui.toast(message, type, duration),
            success: (message) => this.modules.ui.success(message),
            error: (message) => this.modules.ui.error(message),
            warning: (message) => this.modules.ui.warning(message),
            info: (message) => this.modules.ui.info(message),
            showLoading: (message) => this.modules.ui.showLoading(message),
            hideLoading: () => this.modules.ui.hideLoading(),
            scrollToTop: () => this.modules.ui.scrollToTop(),

            // Mobile menu
            mobileMenu: this.modules.mobileMenu,

            // Utility
            version: '1.0.0',
            initialized: () => this.initialized
        };
    }

    /**
     * Dispatch ready event
     */
    dispatchReadyEvent() {
        const event = new CustomEvent('petshop-ready', {
            detail: {
                modules: Object.keys(this.modules),
                version: '1.0.0'
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Get all initialized modules
     * @returns {Object} Object containing all module instances
     */
    getModules() {
        return this.modules;
    }

    /**
     * Check if modules are initialized
     * @returns {boolean} True if initialized
     */
    isInitialized() {
        return this.initialized;
    }
}

// ========================================
// MAIN INITIALIZATION
// ========================================

const initManager = new InitManager();

/**
 * Initialize when DOM is ready
 */
function initializeApp() {
    if (document.readyState === 'loading') {
        // DOM is still loading
        document.addEventListener('DOMContentLoaded', () => {
            initManager.init();
        });
    } else {
        // DOM is already ready
        initManager.init();
    }
}

// Start initialization
initializeApp();

// ========================================
// EXPORTS
// ========================================

export default initManager;

export {
    // Managers
    AuthModalManager,
    CartManager,
    WishlistManager,
    SearchManager,
    MobileMenuManager,
    ModalManager,
    UIManager,
    ShopManager,
    ServiceManager,
    ProfileManager,

    // Init functions
    initAuth,
    initCart,
    initWishlist,
    initSearch,
    initMobileMenu,
    initModals,
    initUI,
    initShop,
    initService,
    initProfile,

    // Getter functions
    getCartManager,
    getWishlistManager,
    getSearchManager,
    getMobileMenuManager,
    getModalManager,
    getUIManager,
    getShopManager,
    getServiceManager,
    getProfileManager,

    // Quick access functions
    openModal,
    closeModal,
    confirmModal,
    alertModal,
    toast,
    showLoading,
    hideLoading,
    scrollToTop,

    // Immediate functions
    immediateAuthCheck
};
