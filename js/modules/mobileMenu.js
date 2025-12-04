/**
 * @module mobileMenu
 * @description Mobile menu module - handles navbar toggle, overlay, body scroll lock, and accessibility
 */

// ========================================
// MOBILE MENU MANAGER CLASS
// ========================================

export class MobileMenuManager {
    constructor() {
        this.mobileToggle = null;
        this.navLinks = null;
        this.navbar = null;
        this.overlay = null;
        this.isOpen = false;
        this.breakpoint = 768;
    }

    /**
     * Initialize the mobile menu system
     */
    init() {
        this.setupElements();
        this.createOverlay();
        this.setupEventListeners();
        this.setupResizeHandler();
        console.log('✅ Mobile menu module initialized');
    }

    /**
     * Setup DOM element references
     */
    setupElements() {
        this.mobileToggle = document.querySelector('.mobile-toggle') ||
            document.querySelector('.navbar-toggle') ||
            document.querySelector('[data-mobile-toggle]');

        this.navLinks = document.querySelector('.nav-links') ||
            document.querySelector('.navbar-menu') ||
            document.querySelector('[data-nav-links]');

        this.navbar = document.querySelector('.navbar') ||
            document.querySelector('nav');

        if (!this.mobileToggle || !this.navLinks) {
            console.warn('Mobile menu elements not found');
            return;
        }

        // Set ARIA attributes
        this.mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
        this.mobileToggle.setAttribute('aria-expanded', 'false');
        this.navLinks.setAttribute('aria-hidden', 'true');
    }

    /**
     * Create overlay element
     */
    createOverlay() {
        // Check if overlay already exists
        this.overlay = document.querySelector('.mobile-menu-overlay');

        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'mobile-menu-overlay';
            this.overlay.setAttribute('aria-hidden', 'true');
            document.body.appendChild(this.overlay);
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (!this.mobileToggle || !this.navLinks) return;

        // Toggle button click
        this.mobileToggle.addEventListener('click', () => {
            this.toggle();
        });

        // Close when clicking nav links
        const navItems = this.navLinks.querySelectorAll('a');
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= this.breakpoint) {
                    this.close();
                }
            });
        });

        // Close when clicking overlay
        if (this.overlay) {
            this.overlay.addEventListener('click', () => {
                this.close();
            });
        }

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen &&
                !this.navbar?.contains(e.target) &&
                !e.target.closest('.mobile-toggle')) {
                this.close();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    /**
     * Setup window resize handler
     */
    setupResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Auto-close menu if window is resized above breakpoint
                if (window.innerWidth > this.breakpoint && this.isOpen) {
                    this.close();
                }
            }, 250);
        });
    }

    /**
     * Toggle mobile menu
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Open mobile menu
     */
    open() {
        if (!this.navLinks || !this.mobileToggle) return;

        // Add active class
        this.navLinks.classList.add('active');
        this.mobileToggle.classList.add('active');

        // Show overlay
        if (this.overlay) {
            this.overlay.classList.add('active');
        }

        // Update icon
        this.updateIcon(true);

        // Lock body scroll
        this.lockBodyScroll();

        // Update ARIA attributes
        this.mobileToggle.setAttribute('aria-expanded', 'true');
        this.navLinks.setAttribute('aria-hidden', 'false');

        // Set state
        this.isOpen = true;

        // Dispatch event
        this.dispatchMenuEvent('mobile-menu-opened');

        // Focus trap - focus first link
        setTimeout(() => {
            const firstLink = this.navLinks.querySelector('a');
            if (firstLink) {
                firstLink.focus();
            }
        }, 100);
    }

    /**
     * Close mobile menu
     */
    close() {
        if (!this.navLinks || !this.mobileToggle) return;

        // Remove active class
        this.navLinks.classList.remove('active');
        this.mobileToggle.classList.remove('active');

        // Hide overlay
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }

        // Update icon
        this.updateIcon(false);

        // Unlock body scroll
        this.unlockBodyScroll();

        // Update ARIA attributes
        this.mobileToggle.setAttribute('aria-expanded', 'false');
        this.navLinks.setAttribute('aria-hidden', 'true');

        // Set state
        this.isOpen = false;

        // Dispatch event
        this.dispatchMenuEvent('mobile-menu-closed');

        // Return focus to toggle button
        this.mobileToggle.focus();
    }

    /**
     * Update hamburger icon
     * @param {boolean} isOpen - Whether menu is open
     */
    updateIcon(isOpen) {
        const icon = this.mobileToggle.querySelector('i');
        if (!icon) return;

        if (isOpen) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }

    /**
     * Lock body scroll (prevent scrolling when menu is open)
     */
    lockBodyScroll() {
        // Save current scroll position
        const scrollY = window.scrollY;

        // Lock scroll
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.classList.add('mobile-menu-open');

        // Store scroll position
        this.scrollPosition = scrollY;
    }

    /**
     * Unlock body scroll
     */
    unlockBodyScroll() {
        // Unlock scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.classList.remove('mobile-menu-open');

        // Restore scroll position
        if (this.scrollPosition !== undefined) {
            window.scrollTo(0, this.scrollPosition);
            this.scrollPosition = undefined;
        }
    }

    /**
     * Check if menu is open
     * @returns {boolean} True if menu is open
     */
    isMenuOpen() {
        return this.isOpen;
    }

    /**
     * Set breakpoint for mobile menu
     * @param {number} breakpoint - Breakpoint in pixels
     */
    setBreakpoint(breakpoint) {
        this.breakpoint = breakpoint;
    }

    /**
     * Dispatch custom menu event
     * @param {string} eventName - Event name
     * @param {Object} detail - Event detail data
     */
    dispatchMenuEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail: {
                isOpen: this.isOpen,
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
 * Initialize the mobile menu system
 * Call this function when DOM is ready
 * @param {number} breakpoint - Optional breakpoint in pixels (default: 768)
 */
export function initMobileMenu(breakpoint = 768) {
    if (!window.mobileMenuManager) {
        window.mobileMenuManager = new MobileMenuManager();
        window.mobileMenuManager.setBreakpoint(breakpoint);
        window.mobileMenuManager.init();
    }
    return window.mobileMenuManager;
}

/**
 * Get mobile menu manager instance
 * @returns {MobileMenuManager} Mobile menu manager instance
 */
export function getMobileMenuManager() {
    return window.mobileMenuManager;
}
