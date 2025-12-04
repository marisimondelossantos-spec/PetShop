/**
 * @module ui
 * @description UI utilities module - toast notifications, loading spinners, scroll-to-top, smooth scroll, and other UI helpers
 */

// ========================================
// UI MANAGER CLASS
// ========================================

export class UIManager {
    constructor() {
        this.toastContainer = null;
        this.loadingOverlay = null;
        this.scrollToTopButton = null;
        this.navbar = null;
    }

    /**
     * Initialize the UI system
     */
    init() {
        this.setupToastContainer();
        this.setupLoadingOverlay();
        this.setupScrollToTop();
        this.setupSmoothScroll();
        this.setupNavbarScroll();
        console.log('✅ UI module initialized');
    }

    // ========================================
    // TOAST NOTIFICATIONS
    // ========================================

    /**
     * Setup toast container
     */
    setupToastContainer() {
        this.toastContainer = document.querySelector('.toast-container');

        if (!this.toastContainer) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.className = 'toast-container';
            this.toastContainer.setAttribute('aria-live', 'polite');
            this.toastContainer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(this.toastContainer);
        }
    }

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duration in milliseconds (default: 3000)
     * @returns {HTMLElement} Toast element
     */
    toast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        const icon = this.getToastIcon(type);

        toast.innerHTML = `
      <div class="toast-content">
        <i class="fas ${icon}"></i>
        <span class="toast-message">${this.escapeHtml(message)}</span>
        <button class="toast-close" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

        // Close button handler
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.dismissToast(toast);
        });

        // Add to container
        this.toastContainer.appendChild(toast);

        // Show toast with animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => {
                this.dismissToast(toast);
            }, duration);
        }

        return toast;
    }

    /**
     * Get icon for toast type
     * @param {string} type - Toast type
     * @returns {string} FontAwesome icon class
     */
    getToastIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    /**
     * Dismiss toast
     * @param {HTMLElement} toast - Toast element
     */
    dismissToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }

    /**
     * Success toast shorthand
     * @param {string} message - Message
     * @param {number} duration - Duration
     */
    success(message, duration = 3000) {
        return this.toast(message, 'success', duration);
    }

    /**
     * Error toast shorthand
     * @param {string} message - Message
     * @param {number} duration - Duration
     */
    error(message, duration = 3000) {
        return this.toast(message, 'error', duration);
    }

    /**
     * Warning toast shorthand
     * @param {string} message - Message
     * @param {number} duration - Duration
     */
    warning(message, duration = 3000) {
        return this.toast(message, 'warning', duration);
    }

    /**
     * Info toast shorthand
     * @param {string} message - Message
     * @param {number} duration - Duration
     */
    info(message, duration = 3000) {
        return this.toast(message, 'info', duration);
    }

    // ========================================
    // LOADING OVERLAY
    // ========================================

    /**
     * Setup loading overlay
     */
    setupLoadingOverlay() {
        const existingOverlay = document.querySelector('.loading-overlay');
        if (existingOverlay) return;  // Avoid duplicates

        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.style.display = 'none';  // Start hidden
        overlay.innerHTML = `
    <div class="loading-spinner"></div>
    <p class="loading-text">Loading...</p>
  `;

        document.body.appendChild(overlay);
        this.loadingOverlay = overlay;
    }

    /**
     * Show loading overlay
     * @param {string} message - Optional loading message
     */
    showLoading(message = 'Loading...') {
        if (!this.loadingOverlay) this.setupLoadingOverlay();
        this.loadingOverlay.querySelector('.loading-text').textContent = message;
        this.loadingOverlay.style.display = 'flex';  // Show only when called
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        if (this.loadingOverlay) this.loadingOverlay.style.display = 'none';
    }

    /**
     * Show loading for a promise
     * @param {Promise} promise - Promise to track
     * @param {string} message - Loading message
     * @returns {Promise} The original promise
     */
    async loadingPromise(promise, message = 'Loading...') {
        this.showLoading(message);
        try {
            const result = await promise;
            this.hideLoading();
            return result;
        } catch (error) {
            this.hideLoading();
            throw error;
        }
    }

    // ========================================
    // SCROLL TO TOP
    // ========================================

    /**
     * Setup scroll to top button
     */
    setupScrollToTop() {
        const existingBtn = document.querySelector('.scroll-to-top');
        if (existingBtn) return;

        const button = document.createElement('button');
        button.className = 'scroll-to-top';
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.style.display = 'none';  // Start hidden
        button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        document.body.appendChild(button);
        this.scrollToTopButton = button;

        window.addEventListener('scroll', () => {
            button.style.display = window.pageYOffset > 300 ? 'block' : 'none';
        });
    }

    /**
     * Scroll to top smoothly
     * @param {number} duration - Animation duration in ms
     */
    scrollToTop(duration = 500) {
        const start = window.scrollY;
        const startTime = performance.now();

        const scroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easing = 1 - Math.pow(1 - progress, 3);

            window.scrollTo(0, start * (1 - easing));

            if (progress < 1) {
                requestAnimationFrame(scroll);
            }
        };

        requestAnimationFrame(scroll);
    }

    // ========================================
    // SMOOTH SCROLL
    // ========================================

    /**
     * Setup smooth scroll for anchor links
     */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');

                // Skip if it's just "#" or empty
                if (!href || href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    this.scrollToElement(target);
                }
            });
        });
    }

    /**
     * Scroll to element smoothly
     * @param {HTMLElement|string} element - Element or selector
     * @param {Object} options - Scroll options
     */
    scrollToElement(element, options = {}) {
        const {
            offset = 0,
            behavior = 'smooth',
            block = 'start'
        } = options;

        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (!target) return;

        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: behavior
        });
    }

    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================

    /**
     * Setup navbar scroll effect
     */
    setupNavbarScroll() {
        this.navbar = document.querySelector('.navbar') || document.querySelector('nav');

        if (!this.navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    }

    // ========================================
    // UTILITY HELPERS
    // ========================================

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in ms
     * @returns {Function} Throttled function
     */
    throttle(func, limit = 300) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Format currency
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency symbol (default: ₱)
     * @returns {string} Formatted currency
     */
    formatCurrency(amount, currency = '₱') {
        return `${currency}${amount.toFixed(2)}`;
    }

    /**
     * Format date
     * @param {Date|string} date - Date to format
     * @param {Object} options - Intl.DateTimeFormat options
     * @returns {string} Formatted date
     */
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(dateObj);
    }

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Success status
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.success('Copied to clipboard!');
            return true;
        } catch (err) {
            this.error('Failed to copy to clipboard');
            return false;
        }
    }

    /**
     * Animate element
     * @param {HTMLElement} element - Element to animate
     * @param {string} animationClass - Animation class name
     * @param {Function} callback - Callback after animation
     */
    animate(element, animationClass, callback = null) {
        element.classList.add(animationClass);

        const handleAnimationEnd = () => {
            element.classList.remove(animationClass);
            element.removeEventListener('animationend', handleAnimationEnd);
            if (callback) callback();
        };

        element.addEventListener('animationend', handleAnimationEnd);
    }

    /**
     * Toggle element visibility with fade
     * @param {HTMLElement} element - Element to toggle
     * @param {boolean} show - Show or hide
     */
    toggleFade(element, show) {
        if (show) {
            element.style.display = 'block';
            setTimeout(() => element.classList.add('show'), 10);
        } else {
            element.classList.remove('show');
            setTimeout(() => element.style.display = 'none', 300);
        }
    }

    /**
     * Get scroll position
     * @returns {Object} {x, y}
     */
    getScrollPosition() {
        return {
            x: window.scrollX,
            y: window.scrollY
        };
    }

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} True if in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// ========================================
// INITIALIZATION FUNCTION
// ========================================

/**
 * Initialize the UI system
 * Call this function when DOM is ready
 */
export function initUI() {
    if (!window.uiManager) {
        window.uiManager = new UIManager();
        window.uiManager.init();
    }
    return window.uiManager;
}

/**
 * Get UI manager instance
 * @returns {UIManager} UI manager instance
 */
export function getUIManager() {
    return window.uiManager;
}

/**
 * Quick access functions for common UI operations
 */
export function toast(message, type, duration) {
    return window.uiManager?.toast(message, type, duration);
}

export function showLoading(message) {
    return window.uiManager?.showLoading(message);
}

export function hideLoading() {
    return window.uiManager?.hideLoading();
}

export function scrollToTop() {
    return window.uiManager?.scrollToTop();
}

