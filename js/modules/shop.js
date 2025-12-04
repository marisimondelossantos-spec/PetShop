/**
 * @module shop
 * @description Shop page functionality - product detail modal, filters, sorting
 */

// ========================================
// SHOP MANAGER CLASS
// ========================================

export class ShopManager {
    constructor() {
        this.modal = null;
        this.currentProductData = {};
    }

    /**
     * Initialize the shop system
     */
    init() {
        this.setupModal();
        this.setupEventListeners();
        this.applyBrandColors();
        console.log('✅ Shop module initialized');
    }

    /**
     * Setup modal reference
     */
    setupModal() {
        this.modal = document.getElementById('productModal');
        if (!this.modal) {
            console.warn('Product modal not found - shop module may not function properly');
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Event delegation for product detail buttons
        document.addEventListener('click', (e) => {
            const detailsBtn = e.target.closest('.view-details-btn, .quick-view-btn, .details-btn, [data-action="details"], [data-action="quick-view"]');
            if (detailsBtn) {
                e.preventDefault();
                this.handleProductDetailsClick(detailsBtn);
            }
        });

        if (!this.modal) return;

        // Close button
        this.modal.querySelector('.shop-modal-close')?.addEventListener('click', () => {
            this.closeModal();
        });

        // Overlay click to close
        this.modal.querySelector('.shop-modal-overlay')?.addEventListener('click', () => {
            this.closeModal();
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Quantity controls
        this.setupQuantityControls();

        // Add to cart from modal
        this.setupAddToCartButton();

        // Wishlist toggle in modal
        this.setupWishlistButton();
    }

    /**
     * Handle product details button click
     * @param {HTMLElement} button - The clicked button
     */
    handleProductDetailsClick(button) {
        const productCard = button.closest('.product-card, [data-product-id]');
        if (!productCard) {
            console.warn('Product card not found');
            return;
        }

        this.currentProductData = this.extractProductData(productCard);
        this.populateModal(this.currentProductData);
        this.openModal();
    }

    /**
     * Extract product data from card
     * @param {HTMLElement} card - Product card element
     * @returns {Object} Product data
     */
    extractProductData(card) {
        const productId = card.dataset.productId || card.querySelector('[data-product-id]')?.dataset.productId;
        const productName = card.querySelector('.product-name, .product-title')?.textContent.trim();
        const productPrice = parseFloat(card.querySelector('.product-price, .price')?.textContent.replace(/[^0-9.]/g, ''));
        const productImage = card.querySelector('.product-image img, .product-img img')?.src;
        const productBrand = card.querySelector('.product-brand')?.textContent.trim();
        const productCategory = card.querySelector('.product-category')?.textContent.trim();

        // Rating
        const ratingEl = card.querySelector('.product-rating, .rating-value, [data-rating]');
        const rating = ratingEl ? parseFloat(ratingEl.dataset.rating || ratingEl.textContent) : 4.5;
        const reviewCount = parseInt(card.querySelector('.review-count, [data-review-count]')?.textContent.replace(/[^0-9]/g, '') || '0');

        // Generate stars HTML
        const starsHTML = this.generateStarsHTML(rating);

        // Original price and discount
        const originalPriceEl = card.querySelector('.product-original-price, .original-price');
        const originalPrice = originalPriceEl ? parseFloat(originalPriceEl.textContent.replace(/[^0-9.]/g, '')) : null;
        const discountEl = card.querySelector('.product-discount, .discount-badge');
        const discount = discountEl ? discountEl.textContent.trim() : null;

        // Description
        const description = card.querySelector('.product-description, [data-description]')?.textContent.trim()
            || 'Premium quality pet product designed for your furry friend\'s health and happiness.';

        // Stock status
        const stockStatus = card.querySelector('.stock-status, [data-stock]')?.textContent.trim() || 'In Stock';

        // Wishlist status
        const wishlistBtn = card.querySelector('.wishlist-btn, .btn-wishlist');
        const isWishlisted = wishlistBtn?.classList.contains('active') || false;

        return {
            id: productId,
            name: productName,
            price: productPrice,
            originalPrice: originalPrice,
            discount: discount,
            image: productImage,
            brand: productBrand,
            category: productCategory,
            rating: rating,
            reviewCount: reviewCount,
            starsHTML: starsHTML,
            description: description,
            stockStatus: stockStatus,
            isWishlisted: isWishlisted
        };
    }

    /**
     * Generate stars HTML from rating
     * @param {number} rating - Rating value
     * @returns {string} Stars HTML
     */
    generateStarsHTML(rating) {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                starsHTML += '<i class="fas fa-star"></i>';
            } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                starsHTML += '<i class="fas fa-star-half-alt"></i>';
            } else {
                starsHTML += '<i class="far fa-star"></i>';
            }
        }
        return starsHTML;
    }

    /**
     * Populate modal with product data
     * @param {Object} data - Product data
     */
    populateModal(data) {
        if (!this.modal) return;

        // Store product ID
        this.modal.dataset.productId = data.id;

        // Image
        const modalImage = this.modal.querySelector('.shop-modal-image img, .modal-product-image img');
        if (modalImage) {
            modalImage.src = data.image || 'assets/images/placeholder.png';
            modalImage.alt = data.name;
        }

        // Name
        const nameEl = this.modal.querySelector('.shop-modal-title, .modal-product-name');
        if (nameEl) nameEl.textContent = data.name;

        // Brand
        const brandEl = this.modal.querySelector('.shop-modal-brand, .modal-product-brand');
        if (brandEl) brandEl.textContent = data.brand;

        // Category
        const categoryEl = this.modal.querySelector('.shop-modal-category, .modal-product-category');
        if (categoryEl) categoryEl.textContent = data.category;

        // Stock status
        const stockEl = this.modal.querySelector('.shop-modal-stock, .modal-stock-status');
        if (stockEl) {
            stockEl.textContent = data.stockStatus;
            stockEl.className = 'shop-modal-stock ' + (data.stockStatus === 'In Stock' ? 'in-stock' : 'out-of-stock');
        }

        // Price
        const priceEl = this.modal.querySelector('.shop-modal-price, .modal-product-price');
        if (priceEl) priceEl.textContent = `₱${data.price.toFixed(2)}`;

        // Original price and discount
        const originalPriceEl = this.modal.querySelector('.shop-modal-original-price, .modal-original-price');
        const discountEl = this.modal.querySelector('.shop-modal-discount, .modal-discount-badge');

        if (data.originalPrice && originalPriceEl && discountEl) {
            originalPriceEl.textContent = `₱${data.originalPrice.toFixed(2)}`;
            originalPriceEl.style.display = 'inline-block';
            discountEl.textContent = data.discount || '-XX%';
            discountEl.style.display = 'inline-block';
        } else {
            if (originalPriceEl) originalPriceEl.style.display = 'none';
            if (discountEl) discountEl.style.display = 'none';
        }

        // Rating
        const ratingStarsEl = this.modal.querySelector('.shop-modal-rating .shop-modal-rating-stars, .modal-rating-stars');
        const ratingValueEl = this.modal.querySelector('.shop-modal-rating .shop-modal-rating-value, .modal-rating-value');
        const ratingCountEl = this.modal.querySelector('.shop-modal-rating .shop-modal-rating-count, .modal-rating-count');

        if (ratingStarsEl) ratingStarsEl.innerHTML = data.starsHTML;
        if (ratingValueEl) ratingValueEl.textContent = data.rating.toFixed(1);
        if (ratingCountEl) ratingCountEl.textContent = `(${data.reviewCount})`;

        // Description
        const descEl = this.modal.querySelector('.description-content, .modal-product-description');
        if (descEl) descEl.textContent = data.description;

        // Wishlist button state
        const wishlistBtn = this.modal.querySelector('.shop-modal-wishlist-btn, .modal-wishlist-btn');
        if (wishlistBtn) {
            const icon = wishlistBtn.querySelector('i');
            if (data.isWishlisted) {
                wishlistBtn.classList.add('active');
                if (icon) icon.className = 'fas fa-heart';
            } else {
                wishlistBtn.classList.remove('active');
                if (icon) icon.className = 'far fa-heart';
            }
        }

        // Reset quantity
        const quantityInput = this.modal.querySelector('#shop-modal-quantity, .modal-quantity-input');
        if (quantityInput) quantityInput.value = 1;
    }

    /**
     * Open modal
     */
    openModal() {
        if (!this.modal) return;

        this.modal.classList.add('active');

        // Also add active to parent .product-modal if it exists
        const parentModal = this.modal.parentElement;
        if (parentModal?.classList.contains('product-modal')) {
            parentModal.classList.add('active');
        }

        // Lock body scroll
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close modal
     */
    closeModal() {
        if (!this.modal) return;

        this.modal.classList.remove('active');

        // Remove from parent .product-modal
        const parentModal = this.modal.parentElement;
        if (parentModal?.classList.contains('product-modal')) {
            parentModal.classList.remove('active');
        }

        // Unlock body scroll
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
    }

    /**
     * Setup quantity controls
     */
    setupQuantityControls() {
        if (!this.modal) return;

        const quantityInput = this.modal.querySelector('#shop-modal-quantity, .modal-quantity-input');
        const decreaseBtn = this.modal.querySelector('.shop-modal-quantity-decrease, .quantity-decrease');
        const increaseBtn = this.modal.querySelector('.shop-modal-quantity-increase, .quantity-increase');

        if (decreaseBtn && quantityInput) {
            decreaseBtn.addEventListener('click', () => {
                const currentValue = parseInt(quantityInput.value) || 1;
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            });
        }

        if (increaseBtn && quantityInput) {
            increaseBtn.addEventListener('click', () => {
                const currentValue = parseInt(quantityInput.value) || 1;
                const maxValue = parseInt(quantityInput.max) || 99;
                if (currentValue < maxValue) {
                    quantityInput.value = currentValue + 1;
                }
            });
        }
    }

    /**
     * Setup add to cart button in modal
     */
    setupAddToCartButton() {
        if (!this.modal) return;

        const addToCartBtn = this.modal.querySelector('.shop-modal-add-to-cart, .modal-add-to-cart');
        if (!addToCartBtn) return;

        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(this.modal.querySelector('#shop-modal-quantity, .modal-quantity-input')?.value) || 1;

            // Add to cart using cart manager
            if (window.cartManager) {
                const product = {
                    id: this.currentProductData.id,
                    name: this.currentProductData.name,
                    price: this.currentProductData.price,
                    image: this.currentProductData.image,
                    quantity: quantity
                };

                window.cartManager.addToCart(product);

                // Close modal after adding
                this.closeModal();
            } else {
                console.warn('Cart manager not available');
            }
        });
    }

    /**
     * Setup wishlist button in modal
     */
    setupWishlistButton() {
        if (!this.modal) return;

        const wishlistBtn = this.modal.querySelector('.shop-modal-wishlist-btn, .modal-wishlist-btn');
        if (!wishlistBtn) return;

        wishlistBtn.addEventListener('click', () => {
            const productId = this.currentProductData.id;

            if (window.wishlistManager) {
                const isInWishlist = window.wishlistManager.isInWishlist(productId);

                if (isInWishlist) {
                    window.wishlistManager.removeFromWishlist(productId);
                } else {
                    const product = {
                        id: this.currentProductData.id,
                        name: this.currentProductData.name,
                        price: this.currentProductData.price,
                        image: this.currentProductData.image
                    };
                    window.wishlistManager.addToWishlist(product);
                }

                // Update button state
                const icon = wishlistBtn.querySelector('i');
                if (isInWishlist) {
                    wishlistBtn.classList.remove('active');
                    if (icon) icon.className = 'far fa-heart';
                } else {
                    wishlistBtn.classList.add('active');
                    if (icon) icon.className = 'fas fa-heart';
                }
            }
        });
    }

    /**
     * Apply brand colors to product badges
     */
    applyBrandColors() {
        const brandColors = {
            'natural-food': '#e67e22',
            'pet-care': '#2ecc71',
            'dogs-friend': '#1abc9c'
        };

        document.querySelectorAll('.product-brand').forEach(badge => {
            const brand = badge.getAttribute('data-brand');
            if (brand && brandColors[brand]) {
                badge.style.setProperty('--brand-color', brandColors[brand]);
            }
        });
    }
}

// ========================================
// INITIALIZATION FUNCTION
// ========================================

/**
 * Initialize the shop system
 * Call this function when DOM is ready
 */
export function initShop() {
    if (!window.shopManager) {
        window.shopManager = new ShopManager();
        window.shopManager.init();
    }
    return window.shopManager;
}

/**
 * Get shop manager instance
 * @returns {ShopManager} Shop manager instance
 */
export function getShopManager() {
    return window.shopManager;
}
