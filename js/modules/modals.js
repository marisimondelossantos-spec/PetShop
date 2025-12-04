/**
 * @module modals
 * @description Universal modal manager - handles all modals (confirmation, product, payment, generic), with focus trap, body lock, and stacking
 */

// ========================================
// MODAL MANAGER CLASS
// ========================================

export class ModalManager {
    constructor() {
        this.modals = new Map(); // Store modal instances
        this.activeModals = []; // Stack of active modals
        this.scrollPosition = 0;
        this.focusedElementBeforeModal = null;
    }

    /**
     * Initialize the modal system
     */
    init() {
        this.setupEventListeners();
        this.discoverModals();
        console.log('✅ Modal module initialized');
    }

    /**
     * Discover and register existing modals in the DOM
     */
    discoverModals() {
        // Find all elements with data-modal attribute
        document.querySelectorAll('[data-modal]').forEach(modalEl => {
            const modalId = modalEl.dataset.modal || modalEl.id;
            if (modalId) {
                this.registerModal(modalId, modalEl);
            }
        });

        // Also register Bootstrap modals
        document.querySelectorAll('.modal').forEach(modalEl => {
            if (modalEl.id) {
                this.registerModal(modalEl.id, modalEl);
            }
        });
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Listen for modal trigger clicks
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-modal-open]');
            if (trigger) {
                e.preventDefault();
                const modalId = trigger.dataset.modalOpen;
                this.open(modalId);
            }

            const closeTrigger = e.target.closest('[data-modal-close]');
            if (closeTrigger) {
                e.preventDefault();
                const modalId = closeTrigger.dataset.modalClose || this.getActiveModalId();
                this.close(modalId);
            }
        });

        // Global escape key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModals.length > 0) {
                const topModal = this.activeModals[this.activeModals.length - 1];
                this.close(topModal);
            }
        });
    }

    /**
     * Register a modal
     * @param {string} modalId - Modal ID
     * @param {HTMLElement} modalElement - Modal DOM element
     */
    registerModal(modalId, modalElement) {
        if (!modalElement) {
            console.warn(`Modal element not found for ID: ${modalId}`);
            return;
        }

        this.modals.set(modalId, {
            element: modalElement,
            isBootstrap: modalElement.classList.contains('modal'),
            config: {
                closeOnBackdrop: modalElement.dataset.closeOnBackdrop !== 'false',
                closeOnEscape: modalElement.dataset.closeOnEscape !== 'false',
                lockBody: modalElement.dataset.lockBody !== 'false',
                focusTrap: modalElement.dataset.focusTrap !== 'false'
            }
        });

        // Setup close buttons within modal
        this.setupModalCloseButtons(modalId);

        // Setup backdrop click
        if (this.modals.get(modalId).config.closeOnBackdrop) {
            this.setupBackdropClick(modalId);
        }
    }

    /**
     * Setup close buttons within modal
     * @param {string} modalId - Modal ID
     */
    setupModalCloseButtons(modalId) {
        const modal = this.modals.get(modalId);
        if (!modal) return;

        const closeButtons = modal.element.querySelectorAll('.modal-close, .btn-close, [data-dismiss="modal"]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.close(modalId);
            });
        });
    }

    /**
     * Setup backdrop click to close
     * @param {string} modalId - Modal ID
     */
    setupBackdropClick(modalId) {
        const modal = this.modals.get(modalId);
        if (!modal) return;

        modal.element.addEventListener('click', (e) => {
            // Only close if clicking the backdrop itself, not content
            if (e.target === modal.element || e.target.classList.contains('modal')) {
                this.close(modalId);
            }
        });
    }

    /**
     * Open a modal
     * @param {string} modalId - Modal ID
     * @param {Object} options - Optional configuration
     */
    open(modalId, options = {}) {
        const modal = this.modals.get(modalId);

        if (!modal) {
            console.warn(`Modal not found: ${modalId}`);
            return;
        }

        // Store currently focused element
        this.focusedElementBeforeModal = document.activeElement;

        // Handle Bootstrap modals differently
        if (modal.isBootstrap && typeof bootstrap !== 'undefined') {
            const bsModal = new bootstrap.Modal(modal.element);
            bsModal.show();
            return;
        }

        // Lock body scroll if first modal
        if (this.activeModals.length === 0 && modal.config.lockBody) {
            this.lockBodyScroll();
        }

        // Add to active stack
        if (!this.activeModals.includes(modalId)) {
            this.activeModals.push(modalId);
        }

        // Show modal
        modal.element.classList.add('show', 'active');
        modal.element.style.display = 'block';
        modal.element.setAttribute('aria-hidden', 'false');

        // Update z-index for stacking
        const zIndex = 1050 + (this.activeModals.length * 10);
        modal.element.style.zIndex = zIndex;

        // Show/create backdrop
        this.showBackdrop(modalId, zIndex - 5);

        // Focus management
        if (modal.config.focusTrap) {
            setTimeout(() => {
                this.trapFocus(modalId);
            }, 100);
        }

        // Dispatch event
        this.dispatchModalEvent('modal-opened', modalId);
    }

    /**
     * Close a modal
     * @param {string} modalId - Modal ID (or null to close top modal)
     */
    close(modalId = null) {
        // If no ID provided, close the top modal
        if (!modalId && this.activeModals.length > 0) {
            modalId = this.activeModals[this.activeModals.length - 1];
        }

        const modal = this.modals.get(modalId);
        if (!modal) return;

        // Handle Bootstrap modals
        if (modal.isBootstrap && typeof bootstrap !== 'undefined') {
            const bsModal = bootstrap.Modal.getInstance(modal.element);
            if (bsModal) {
                bsModal.hide();
            }
            return;
        }

        // Hide modal
        modal.element.classList.remove('show', 'active');

        // Use timeout to allow fade animation
        setTimeout(() => {
            modal.element.style.display = 'none';
            modal.element.setAttribute('aria-hidden', 'true');
        }, 300);

        // Remove from active stack
        const index = this.activeModals.indexOf(modalId);
        if (index > -1) {
            this.activeModals.splice(index, 1);
        }

        // Hide backdrop
        this.hideBackdrop(modalId);

        // Unlock body scroll if no more modals
        if (this.activeModals.length === 0) {
            this.unlockBodyScroll();
        }

        // Restore focus
        if (this.focusedElementBeforeModal) {
            this.focusedElementBeforeModal.focus();
            this.focusedElementBeforeModal = null;
        }

        // Dispatch event
        this.dispatchModalEvent('modal-closed', modalId);
    }

    /**
     * Close all modals
     */
    closeAll() {
        // Close in reverse order (top to bottom)
        [...this.activeModals].reverse().forEach(modalId => {
            this.close(modalId);
        });
    }

    /**
     * Show backdrop
     * @param {string} modalId - Modal ID
     * @param {number} zIndex - Z-index for backdrop
     */
    showBackdrop(modalId, zIndex) {
        let backdrop = document.querySelector(`.modal-backdrop[data-modal="${modalId}"]`);

        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop';
            backdrop.dataset.modal = modalId;
            backdrop.style.zIndex = zIndex;
            document.body.appendChild(backdrop);

            // Click to close
            const modal = this.modals.get(modalId);
            if (modal?.config.closeOnBackdrop) {
                backdrop.addEventListener('click', () => {
                    this.close(modalId);
                });
            }
        }

        // Show backdrop
        setTimeout(() => {
            backdrop.classList.add('show');
        }, 10);
    }

    /**
     * Hide backdrop
     * @param {string} modalId - Modal ID
     */
    hideBackdrop(modalId) {
        const backdrop = document.querySelector(`.modal-backdrop[data-modal="${modalId}"]`);
        if (backdrop) {
            backdrop.classList.remove('show');
            setTimeout(() => {
                backdrop.remove();
            }, 300);
        }
    }

    /**
     * Lock body scroll
     */
    lockBodyScroll() {
        this.scrollPosition = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';
        document.body.classList.add('modal-open');
    }

    /**
     * Unlock body scroll
     */
    unlockBodyScroll() {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.classList.remove('modal-open');
        window.scrollTo(0, this.scrollPosition);
    }

    /**
     * Trap focus within modal
     * @param {string} modalId - Modal ID
     */
    trapFocus(modalId) {
        const modal = this.modals.get(modalId);
        if (!modal) return;

        const focusableElements = modal.element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Focus first element
        firstElement.focus();

        // Setup tab trap
        const handleTabKey = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        // Remove any existing listeners
        modal.element.removeEventListener('keydown', handleTabKey);

        // Add new listener
        modal.element.addEventListener('keydown', handleTabKey);
    }

    /**
     * Check if modal is open
     * @param {string} modalId - Modal ID
     * @returns {boolean} True if modal is open
     */
    isOpen(modalId) {
        return this.activeModals.includes(modalId);
    }

    /**
     * Get currently active modal ID
     * @returns {string|null} Active modal ID or null
     */
    getActiveModalId() {
        return this.activeModals.length > 0
            ? this.activeModals[this.activeModals.length - 1]
            : null;
    }

    /**
     * Create and show a confirmation modal
     * @param {Object} config - Configuration {title, message, confirmText, cancelText, onConfirm, onCancel}
     * @returns {Promise} Resolves on confirm, rejects on cancel
     */
    confirm(config = {}) {
        return new Promise((resolve, reject) => {
            const {
                title = 'Confirm',
                message = 'Are you sure?',
                confirmText = 'Confirm',
                cancelText = 'Cancel',
                confirmClass = 'btn-primary',
                cancelClass = 'btn-secondary',
                onConfirm = null,
                onCancel = null
            } = config;

            // Create modal HTML
            const modalId = 'confirmModal-' + Date.now();
            const modalHTML = `
        <div class="modal fade" id="${modalId}" data-modal="${modalId}" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">${title}</h5>
                <button type="button" class="btn-close" data-modal-close></button>
              </div>
              <div class="modal-body">
                <p>${message}</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn ${cancelClass}" data-action="cancel">${cancelText}</button>
                <button type="button" class="btn ${confirmClass}" data-action="confirm">${confirmText}</button>
              </div>
            </div>
          </div>
        </div>
      `;

            // Add to DOM
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const modalElement = document.getElementById(modalId);

            // Register modal
            this.registerModal(modalId, modalElement);

            // Setup buttons
            const confirmBtn = modalElement.querySelector('[data-action="confirm"]');
            const cancelBtn = modalElement.querySelector('[data-action="cancel"]');

            confirmBtn.addEventListener('click', () => {
                if (onConfirm) onConfirm();
                this.close(modalId);
                setTimeout(() => modalElement.remove(), 500);
                resolve(true);
            });

            cancelBtn.addEventListener('click', () => {
                if (onCancel) onCancel();
                this.close(modalId);
                setTimeout(() => modalElement.remove(), 500);
                reject(false);
            });

            // Open modal
            this.open(modalId);
        });
    }

    /**
     * Create and show an alert modal
     * @param {Object} config - Configuration {title, message, buttonText}
     * @returns {Promise} Resolves when closed
     */
    alert(config = {}) {
        return new Promise((resolve) => {
            const {
                title = 'Alert',
                message = '',
                buttonText = 'OK',
                buttonClass = 'btn-primary'
            } = config;

            const modalId = 'alertModal-' + Date.now();
            const modalHTML = `
        <div class="modal fade" id="${modalId}" data-modal="${modalId}" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">${title}</h5>
                <button type="button" class="btn-close" data-modal-close></button>
              </div>
              <div class="modal-body">
                <p>${message}</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn ${buttonClass}" data-action="ok">${buttonText}</button>
              </div>
            </div>
          </div>
        </div>
      `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);
            const modalElement = document.getElementById(modalId);

            this.registerModal(modalId, modalElement);

            const okBtn = modalElement.querySelector('[data-action="ok"]');
            okBtn.addEventListener('click', () => {
                this.close(modalId);
                setTimeout(() => modalElement.remove(), 500);
                resolve(true);
            });

            this.open(modalId);
        });
    }

    /**
     * Dispatch custom modal event
     * @param {string} eventName - Event name
     * @param {string} modalId - Modal ID
     * @param {Object} detail - Additional event detail
     */
    dispatchModalEvent(eventName, modalId, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail: {
                modalId,
                activeModals: this.activeModals,
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
 * Initialize the modal system
 * Call this function when DOM is ready
 */
export function initModals() {
    if (!window.modalManager) {
        window.modalManager = new ModalManager();
        window.modalManager.init();
    }
    return window.modalManager;
}

/**
 * Get modal manager instance
 * @returns {ModalManager} Modal manager instance
 */
export function getModalManager() {
    return window.modalManager;
}

/**
 * Quick access functions
 */
export function openModal(modalId, options) {
    return window.modalManager?.open(modalId, options);
}

export function closeModal(modalId) {
    return window.modalManager?.close(modalId);
}

export function confirmModal(config) {
    return window.modalManager?.confirm(config);
}

export function alertModal(config) {
    return window.modalManager?.alert(config);
}
