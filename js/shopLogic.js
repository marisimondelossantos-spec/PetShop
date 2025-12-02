// ============================================
// SHOP FILTERING & SEARCH FUNCTIONALITY
// ============================================
// ============================================
// UPDATE CART COUNT FUNCTION
// ============================================
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = document.getElementById('cart-count');
    
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
        
        // Show/hide badge based on count
        if (totalItems > 0) {
            cartCount.style.display = 'block';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

// ============================================
// CART COUNT UPDATE EVENT LISTENER
// ============================================
window.addEventListener('cart-updated', updateCartCount);

// Initial cart count update
updateCartCount();

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.product-card');
    const grid = document.getElementById('products-grid');

    // === SEARCH ===
    document.getElementById('product-search')?.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        cards.forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = name.includes(term) ? '' : 'none';
        });
    });

    // === PRICE RANGE ===
    const updatePriceDisplay = () => {
        const minDisplay = document.getElementById('price-min-display') || document.querySelector('.price-min-value');
        const maxDisplay = document.getElementById('price-max-display') || document.querySelector('.price-max-value');

        if (minDisplay) minDisplay.textContent = '₱' + (document.getElementById('price-min')?.value || '0');
        if (maxDisplay) maxDisplay.textContent = '₱' + (document.getElementById('price-max')?.value || '5000');
    };

    const getCurrentMinPrice = () => parseFloat(document.getElementById('price-min')?.value || 0);
    const getCurrentMaxPrice = () => parseFloat(document.getElementById('price-max')?.value || 99999);

    // === RATING ===
    const getMinRating = () => {
        const checked = document.querySelector('input[name="rating"]:checked');
        return checked ? parseInt(checked.value) : 0;
    };

    // === FILTERS ===
    const applyFilters = () => {
        const categories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(c => c.value);
        const brands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(c => c.value);

        cards.forEach(card => {
            // Category is stored in data-product-type on the article element
            const cat = card.dataset.productType;
            // Brand is stored in data-brand on the article element
            const brand = card.dataset.brand;
            // Price is stored in data-price on the article element
            const price = parseFloat(card.dataset.price);
            // Get rating from data-rating if present, otherwise extract from HTML
            let rating = parseFloat(card.dataset.rating) || 0;
            if (!rating) {
                const ratingValueEl = card.querySelector('.rating-value');
                if (ratingValueEl) {
                    rating = parseFloat(ratingValueEl.textContent) || 0;
                    // Store it for next time
                    card.dataset.rating = rating;
                }
            }

            const catMatch = categories.length === 0 || categories.includes(cat);
            const brandMatch = brands.length === 0 || brands.includes(brand);
            const priceMatch = price >= getCurrentMinPrice() && price <= getCurrentMaxPrice();
            const ratingMatch = rating >= getMinRating();

            // OR logic within each group, AND logic between groups
            const show = catMatch && brandMatch && priceMatch && ratingMatch;
            if (show) {
                card.dataset.filtered = 'false';   // visible by filters
                card.style.display = '';           // will be handled by pagination
            } else {
                card.dataset.filtered = 'true';
                card.style.display = 'none';
            }
        });
    };

    // Event listeners for category and brand filters
    document.querySelectorAll('input[name="category"], input[name="brand"]').forEach(input => {
        input.addEventListener('change', applyFilters);
    });

    // Add price and rating filter event listeners
    document.querySelectorAll('#price-min, #price-max, input[name="rating"], .apply-price-btn').forEach(el => {
        el.addEventListener('input', () => { applyFilters(); updatePriceDisplay(); });
        el.addEventListener('change', () => { applyFilters(); updatePriceDisplay(); });
        el.addEventListener('click', () => { applyFilters(); updatePriceDisplay(); }); // for apply button
    });

    // === CLEAR ALL FILTERS ===
    const clearAllFiltersBtn = document.querySelector('.clear-filters');
    if (clearAllFiltersBtn) {
        clearAllFiltersBtn.addEventListener('click', () => {
            // Uncheck all category and brand checkboxes
            document.querySelectorAll('input[name="category"], input[name="brand"], input[name="rating"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            // Clear search
            const searchInput = document.getElementById('product-search');
            if (searchInput) searchInput.value = '';
            // Clear price range
            const priceMin = document.getElementById('price-min');
            const priceMax = document.getElementById('price-max');
            if (priceMin) priceMin.value = '';
            if (priceMax) priceMax.value = '';
            // Reset sort
            const sortSelect = document.getElementById('sort-select');
            if (sortSelect) sortSelect.value = 'default';
            // Apply filters to show all products
            applyFilters();
            // Re-apply search (which will show all since search is empty)
            if (searchInput) {
                searchInput.dispatchEvent(new Event('input'));
            }
            // Update price display
            updatePriceDisplay();
            // Reset sort order to original
            const sortedCards = Array.from(cards).sort((a, b) => {
                return parseInt(a.dataset.productId) - parseInt(b.dataset.productId);
            });
            sortedCards.forEach(card => grid.appendChild(card));
        });
    }

    // === SORT ===
    document.getElementById('sort-select')?.addEventListener('change', (e) => {
        const value = e.target.value;
        const sorted = Array.from(cards);

        sorted.sort((a, b) => {
            switch(value) {
                case 'price-low':  return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                case 'price-high': return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                case 'name-az':    return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
                case 'name-za':    return b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent);
                case 'rating':     return parseInt(b.dataset.rating) - parseInt(a.dataset.rating);
                default:           return 0;
            }
        });

        sorted.forEach(card => grid.appendChild(card));
    });

    // === CART COUNT UPDATE ===
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const badge = document.querySelector('.cart-count');
        if (badge) badge.textContent = cart.length;
    };
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(updateCartCount, 500); // after "Added!" state
        });
    });
    updateCartCount(); // initial
    
    // === ITEMS PER PAGE ===
    const itemsPerPageSelect = document.getElementById('items-per-page');
    if (itemsPerPageSelect) {
        const applyItemsPerPage = () => {
            const value = itemsPerPageSelect.value;
            const limit = value === 'all' ? 9999 : parseInt(value);

            document.querySelectorAll('.product-card').forEach((card, index) => {
                // First respect existing filters (only act on visible cards)
                if (card.style.display === 'none' && card.dataset.filtered !== 'true') {
                    return; // already hidden by filters
                }
                card.style.display = index < limit ? '' : 'none';
            });
        };

        itemsPerPageSelect.addEventListener('change', () => {
            // Reset any previous "hidden by pagination" before applying filters again
            document.querySelectorAll('.product-card').forEach(card => {
                if (card.dataset.filtered !== 'true') {
                    card.style.display = '';
                }
            });
            applyFilters();       // re-apply category/price/rating etc.
            applyItemsPerPage();  // then apply the new pagination limit
        });

        // Run once on page load
        applyItemsPerPage();
    }

    // Run once on load
    updatePriceDisplay();
});

// ============================================
// PRODUCT DETAILS MODAL - COMPLETE & FIXED VERSION
// ============================================
(function() {
    'use strict';

    // Check if modal exists
    const modal = document.getElementById('productModal');
    if (!modal) {
        console.error('Product modal not found!');
        return;
    }

    let currentProductData = {};

    // ============================================
    // EVENT LISTENERS SETUP
    // ============================================

    // Handle clicks on Details buttons (view-details-btn) and Quick View buttons (quick-view-btn)
    document.addEventListener('click', function(e) {
        // Check if clicked on Details button or Quick View button
        const detailsBtn = e.target.closest('.view-details-btn, .quick-view-btn');
        if (!detailsBtn) return;
        
        e.preventDefault(); // Prevent link navigation
        
        const productCard = detailsBtn.closest('.product-card');
        if (!productCard) {
            console.error('Product card not found');
            return;
        }

        currentProductData = extractProductData(productCard);
        if (!currentProductData.id) {
            console.error('Failed to extract product data');
            return;
        }

        populateModal(currentProductData);
        openModal();
    });

    // ============================================
    // EXTRACT PRODUCT DATA FROM CARD
    // ============================================
    function extractProductData(card) {
        // Helper function to safely get text content
        const safeText = (selector) => {
            const el = card.querySelector(selector);
            return el ? el.textContent.trim() : '';
        };

        // Helper function to safely get attribute value
        const safeAttr = (selector, attr) => {
            const el = card.querySelector(selector);
            return el ? el.getAttribute(attr) || '' : '';
        };

        const data = {
            // Basic product info
            id: card.dataset.productId || '',
            name: safeText('.product-title a, .product-title') || 'Product',
            
            // Price information
            price: safeText('.current-price') || '',
            priceValue: parseFloat(card.dataset.price || safeText('.current-price').replace(/[^\d.]/g, '') || '0'),
            originalPrice: safeText('.original-price') || '',
            discount: safeText('.discount-percentage') || '',
            
            // Rating information
            rating: parseFloat(card.dataset.rating || safeText('.rating-value') || '5'),
            reviewCount: safeText('.rating-count span') || safeText('.review-count').replace(/[()]/g, '') || '0',
            
            // Image information
            image: card.querySelector('.product-image img')?.src || '',
            imageAlt: card.querySelector('.product-image img')?.alt || safeText('.product-title') || 'Product',
            
            // Description
            description: safeText('.product-description-hidden') || 'No description available.',
            
            // Category and brand
            category: safeText('.product-category'),
            brand: safeText('.product-brand'),
            
            // Stock status
            stockStatus: safeText('.stock-status span') || safeText('.stock-status') || 'In Stock',
            stockClass: card.querySelector('.stock-status')?.className || 'stock-status in-stock',
            
            // Wishlist status
            isWishlisted: card.querySelector('.wishlist-btn')?.classList.contains('active') || false,
            
            // Additional info
            productId: safeText('.product-id-hidden[value]') ? card.querySelector('.product-id-hidden').value : '',
        };

        // Generate rating stars HTML
        const starsContainer = card.querySelector('.rating-stars');
        data.starsHTML = starsContainer ? starsContainer.innerHTML : generateStars(data.rating);

        console.log('Extracted product data:', data);
        return data;
    }

    // ============================================
    // GENERATE STAR RATING HTML
    // ============================================
    function generateStars(rating) {
        let html = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                html += '<i class="fas fa-star" aria-hidden="true"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                html += '<i class="fas fa-star-half-alt" aria-hidden="true"></i>';
            } else {
                html += '<i class="far fa-star" aria-hidden="true"></i>';
            }
        }
        return html;
    }

    // ============================================
    // BULLETPROOF POPULATE MODAL WITH PRODUCT DATA
    // ============================================
    function populateModal(data) {
        try {
            // Helper functions for null-safe DOM manipulation
            const setText = (selector, text) => {
                const el = modal.querySelector(selector);
                if (el) el.textContent = text;
                else console.warn(`Modal element not found: ${selector}`);
            };
            
            const setHTML = (selector, html) => {
                const el = modal.querySelector(selector);
                if (el) el.innerHTML = html;
                else console.warn(`Modal element not found: ${selector}`);
            };
            
            const setSrc = (selector, src) => {
                const el = modal.querySelector(selector);
                if (el) el.src = src;
                else console.warn(`Modal image not found: ${selector}`);
            };
            
            const setAlt = (selector, alt) => {
                const el = modal.querySelector(selector);
                if (el) el.alt = alt;
                else console.warn(`Modal image not found: ${selector}`);
            };
            
            const setDisplay = (selector, display) => {
                const el = modal.querySelector(selector);
                if (el) el.style.display = display;
                else console.warn(`Modal element not found: ${selector}`);
            };

            // === UPDATE MODAL CONTENT SAFELY ===
            
            // Main image
            setSrc('#modalMainImage', data.image);
            setAlt('#modalMainImage', data.imageAlt);

            // Basic product info
            setText('#modalProductTitle', data.name);
            setText('.modal-category', data.category || '');
            setText('.modal-brand', data.brand || '');

            // Price information
            setText('.modal-price .current-price', data.price);
            
            const originalPrice = modal.querySelector('.modal-price .original-price');
            const discountPercentage = modal.querySelector('.modal-price .discount-percentage');
            
            if (originalPrice && discountPercentage) {
                if (data.originalPrice && data.originalPrice !== data.price) {
                    setText('.modal-price .original-price', data.originalPrice);
                    setDisplay('.modal-price .original-price', 'inline');
                    setText('.modal-price .discount-percentage', data.discount || '-XX%');
                    setDisplay('.modal-price .discount-percentage', 'inline-block');
                } else {
                    setDisplay('.modal-price .original-price', 'none');
                    setDisplay('.modal-price .discount-percentage', 'none');
                }
            }

            // Rating
            setHTML('.modal-rating .rating-stars', data.starsHTML);
            setText('.modal-rating .rating-value', data.rating.toFixed(1));
            setText('.modal-rating .rating-count', `(${data.reviewCount})`);

            // Stock status
            const modalStockStatus = modal.querySelector('.modal-price-section .stock-status');
            if (modalStockStatus) {
                modalStockStatus.className = data.stockClass || 'stock-status in-stock';
                modalStockStatus.innerHTML = '<i class="fas fa-circle" aria-hidden="true"></i><span>' + (data.stockStatus || 'In Stock') + '</span>';
            }

            // Description
            setText('.description-content', data.description);

            // Additional info tab
            setText('.info-id', data.id);
            setText('.info-category', data.category);
            setText('.info-brand', data.brand);
            setText('.info-stock', data.stockStatus);

            // Wishlist button state
            const wishlistBtn = modal.querySelector('.modal-wishlist-btn');
            if (wishlistBtn) {
                wishlistBtn.classList.toggle('active', data.isWishlisted);
                const icon = wishlistBtn.querySelector('i');
                if (icon) {
                    icon.className = data.isWishlisted ? 'fas fa-heart' : 'far fa-heart';
                }
            }

            // Reset quantity
            setText('#modalQuantity', '1');

            console.log('Modal populated successfully');
        } catch (error) {
            console.error('Error populating modal:', error);
        }
    }

    // ============================================
    // BULLETPROOF MODAL OPEN/CLOSE FUNCTIONS
    // ============================================
    function openModal() {
        try {
            document.body.classList.add('modal-open');
            document.body.style.paddingRight = getScrollbarWidth() + 'px';
            modal.classList.add('active');
            
            setTimeout(() => {
                const closeBtn = modal.querySelector('.modal-close');
                if (closeBtn) closeBtn.focus();
            }, 100);
        } catch (error) {
            console.error('Error opening modal:', error);
        }
    }

    function getScrollbarWidth() {
        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        document.body.appendChild(outer);
        const inner = document.createElement('div');
        outer.appendChild(inner);
        const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
        outer.parentNode.removeChild(outer);
        return scrollbarWidth;
    }

    function closeModal() {
        try {
            modal.classList.remove('active');  // triggers fade-out

            // Keep body locked until fade-out is completely done
            const onTransitionEnd = () => {
                document.body.classList.remove('modal-open');
                document.body.style.paddingRight = '';
            };

            modal.addEventListener('transitionend', onTransitionEnd, { once: true });

            // Fallback: remove after 500ms max (in case transitionend doesn't fire)
            setTimeout(() => {
                document.body.classList.remove('modal-open');
                document.body.style.paddingRight = '';
            }, 500);
        } catch (error) {
            console.error('Error closing modal:', error);
        }
    }

    // ============================================
    // MODAL EVENT LISTENERS
    // ============================================
    
    // Close button
    modal.querySelector('.modal-close')?.addEventListener('click', closeModal);
    
    // Overlay click to close
    modal.querySelector('.modal-overlay')?.addEventListener('click', closeModal);
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Also close when clicking overlay (outside modal content)
    modal.querySelector('.modal-overlay')?.addEventListener('click', function() {
        closeModal();
    });

    // Prevent closing when clicking inside modal content
    modal.querySelector('.modal-container')?.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // ============================================
    // QUANTITY CONTROLS
    // ============================================
    const minusBtn = modal.querySelector('.qty-btn.minus');
    const plusBtn = modal.querySelector('.qty-btn.plus');
    const quantityInput = modal.querySelector('#modalQuantity');

    minusBtn?.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    plusBtn?.addEventListener('click', function() {
        const currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue < 99) {
            quantityInput.value = currentValue + 1;
        }
    });

    // ============================================
    // ADD TO CART FROM MODAL
    // ============================================
    modal.querySelector('.modal-add-to-cart')?.addEventListener('click', function() {
        const btn = this;
        const quantity = parseInt(quantityInput?.value) || 1;

        // Disable button during processing
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span class="btn-text">Adding...</span>';

        // Simulate API call
        setTimeout(() => {
            try {
                let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                const existingItem = cart.find(item => item.id === currentProductData.id);

                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({
                        id: currentProductData.id || Date.now(),
                        name: currentProductData.name,
                        price: currentProductData.priceValue,
                        image: currentProductData.image,
                        quantity: quantity
                    });
                }

                localStorage.setItem('cart', JSON.stringify(cart));

                // Trigger cart update event
                window.dispatchEvent(new CustomEvent('cart-updated', { detail: { product: currentProductData, quantity: quantity } }));

                // Show success state
                btn.innerHTML = '<i class="fas fa-check"></i><span class="btn-text">Added!</span>';
                btn.classList.add('added');

                // Trigger cart update event
                window.dispatchEvent(new CustomEvent('cart-updated', { 
                    detail: { productId: currentProductData.id, quantity } 
                }));

                // Reset after delay
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-shopping-cart"></i><span class="btn-text">Add to Cart</span>';
                    btn.disabled = false;
                    btn.classList.remove('added');
                }, 2000);

            } catch (error) {
                console.error('Error adding to cart:', error);
                btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span class="btn-text">Error</span>';
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-shopping-cart"></i><span class="btn-text">Add to Cart</span>';
                    btn.disabled = false;
                }, 2000);
            }
        }, 800);
    });

    // ============================================
    // WISHLIST TOGGLE IN MODAL
    // ============================================
    modal.querySelector('.modal-wishlist-btn')?.addEventListener('click', function() {
        const btn = this;
        const icon = btn.querySelector('i');
        let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const productId = parseInt(currentProductData.id);
        
        if (!productId) return;

        const isInWishlist = wishlist.includes(productId);
        
        if (isInWishlist) {
            // Remove from wishlist
            wishlist = wishlist.filter(id => id !== productId);
            icon.className = 'far fa-heart';
            btn.classList.remove('active');
            
            // Update corresponding product card
            document.querySelector(`.wishlist-btn[data-product-id="${productId}"]`)?.classList.remove('active');
        } else {
            // Add to wishlist
            wishlist.push(productId);
            icon.className = 'fas fa-heart';
            btn.classList.add('active');
            
            // Update corresponding product card
            document.querySelector(`.wishlist-btn[data-product-id="${productId}"]`)?.classList.add('active');
        }

        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Trigger wishlist update event
        window.dispatchEvent(new CustomEvent('wishlist-updated', {
            detail: { productId: productId, added: !isInWishlist }
        }));
    });

    // ============================================
    // TAB FUNCTIONALITY
    // ============================================
    const tabButtons = modal.querySelectorAll('.tab-btn');
    const tabPanels = modal.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            this.classList.add('active');
            modal.querySelector(`.tab-panel[data-panel="${targetTab}"]`)?.classList.add('active');
        });
    });

    // ============================================
    // GRID/LIST VIEW TOGGLE (PAGE-LEVEL)
    // ============================================
    const viewButtons = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('products-grid');
    
    if (viewButtons.length > 0 && productsGrid) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const view = this.dataset.view;
                
                // Update button states
                viewButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update grid layout
                if (view === 'list') {
                    productsGrid.classList.add('list-view');
                    productsGrid.classList.remove('grid-view');
                } else {
                    productsGrid.classList.add('grid-view');
                    productsGrid.classList.remove('list-view');
                }
                
                // Store preference
                localStorage.setItem('shop-view', view);
            });
        });
        
        // Load saved view preference
        const savedView = localStorage.getItem('shop-view') || 'grid';
        const savedButton = document.querySelector(`.view-btn[data-view="${savedView}"]`);
        if (savedButton) {
            savedButton.click();
        }
    }

    // ============================================
    // ITEMS PER PAGE HANDLER
    // ============================================
    const itemsPerPageSelect = document.getElementById('items-per-page');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', function() {
            const itemsPerPage = this.value;
            console.log(`Items per page changed to: ${itemsPerPage}`);
            // Store preference
            localStorage.setItem('items-per-page', itemsPerPage);
            // Trigger product grid refresh if needed
            window.dispatchEvent(new CustomEvent('items-per-page-changed', { detail: itemsPerPage }));
        });
    }

    // ============================================
    // MOBILE FILTER TOGGLE
    // ============================================
    const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
    const filtersSidebar = document.querySelector('.filters-sidebar');
    const clearFiltersBtn = document.querySelector('.clear-filters');
    
    if (mobileFilterToggle && filtersSidebar) {
        mobileFilterToggle.addEventListener('click', function() {
            const isActive = filtersSidebar.classList.contains('active');
            
            // Toggle sidebar
            filtersSidebar.classList.toggle('active');
            
            // Update button state
            if (isActive) {
                mobileFilterToggle.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                mobileFilterToggle.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scroll
            }
            
            // Update aria-expanded
            mobileFilterToggle.setAttribute('aria-expanded', !isActive);
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && filtersSidebar.classList.contains('active')) {
                mobileFilterToggle.click();
            }
        });
        
        // Close on backdrop click
        filtersSidebar.addEventListener('click', function(e) {
            if (e.target === filtersSidebar) {
                mobileFilterToggle.click();
            }
        });
        
        // Clear filters functionality
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', function() {
                // Clear all checkboxes
                const checkboxes = filtersSidebar.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = false;
                });
                
                // Reset price inputs
                const priceInputs = filtersSidebar.querySelectorAll('input[type="number"]');
                priceInputs.forEach(input => {
                    input.value = '';
                });
                
                // Update active filters count
                updateActiveFiltersCount();
                
                // Trigger filters cleared event
                window.dispatchEvent(new CustomEvent('filters-cleared'));
            });
        }
        
        // Update active filters count
        function updateActiveFiltersCount() {
            const activeFiltersCount = filtersSidebar.querySelectorAll('input[type="checkbox"]:checked').length;
            const countElement = mobileFilterToggle.querySelector('.active-filters-count');
            
            if (countElement) {
                if (activeFiltersCount > 0) {
                    countElement.textContent = activeFiltersCount;
                    countElement.style.display = 'inline-flex';
                } else {
                    countElement.style.display = 'none';
                }
            }
        }
        
        // Initial count update
        updateActiveFiltersCount();
        
        // Listen for checkbox changes
        const checkboxes = filtersSidebar.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateActiveFiltersCount);
        });
    }

    console.log('Product modal system initialized successfully');
})();
