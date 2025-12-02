/* ============================================
   PRODUCTCARD.JS - Happy Animal Pet Shop
   ============================================ */

/* ============================================
   1. HELPER FUNCTIONS
   ============================================ */

/**
 * Calculate stock status based on inventory and reorder level
 * @param {number} inventory - Current stock count
 * @param {number} reorderLevel - Minimum stock threshold
 * @returns {string} - Stock status: "in-stock", "low-stock", or "out-of-stock"
 */
const calculateStockStatus = (inventory, reorderLevel) => {
    if (inventory === 0) return 'out-of-stock';
    if (inventory <= reorderLevel) return 'low-stock';
    return 'in-stock';
};

/**
 * Generate star rating HTML
 * @param {number} rating - Rating value (0-5)
 * @returns {string} - HTML string for star icons
 */
const generateStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let html = '';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fas fa-star" aria-hidden="true"></i>';
    }

    // Half star
    if (hasHalfStar) {
        html += '<i class="fas fa-star-half-alt" aria-hidden="true"></i>';
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="far fa-star" aria-hidden="true"></i>';
    }

    return html;
};

/**
 * Calculate discount percentage
 * @param {number} price - Current price
 * @param {number} originalPrice - Original price
 * @returns {number} - Discount percentage
 */
const calculateDiscount = (price, originalPrice) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
};

/**
 * Format price as PHP currency
 * @param {number} price - Price value
 * @returns {string} - Formatted price string
 */
const formatPrice = (price) => {
    return `₱${price.toLocaleString('en-PH')}`;
};

/**
 * Get brand color
 * @param {string} brand - Brand name
 * @returns {string} - Hex color code
 */
const getBrandColor = (brand) => {
    const brandColors = {
        'natural-food': '#e67e22',
        'pet-care': '#2ecc71',
        'dogs-friend': '#1abc9c'
    };

    const brandSlug = brand.toLowerCase().replace(/\s+/g, '-');
    return brandColors[brandSlug] || '#999999';
};

/**
 * Get stock status display info
 * @param {string} status - Stock status
 * @returns {object} - Display text and class
 */
const getStockStatusInfo = (status) => {
    const statusMap = {
        'in-stock': { text: 'In Stock', class: 'in-stock' },
        'low-stock': { text: 'Low Stock', class: 'low-stock' },
        'out-of-stock': { text: 'Out of Stock', class: 'out-of-stock' }
    };
    return statusMap[status] || statusMap['in-stock'];
};

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

/**
 * Get wishlist from localStorage
 * @returns {array} - Array of product IDs
 */
const getWishlist = () => {
    try {
        return JSON.parse(localStorage.getItem('wishlist') || '[]');
    } catch (error) {
        console.error('Error reading wishlist:', error);
        return [];
    }
};

/**
 * Save wishlist to localStorage
 * @param {array} wishlist - Array of product IDs
 */
const saveWishlist = (wishlist) => {
    try {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
        console.error('Error saving wishlist:', error);
    }
};

/**
 * Check if product is in wishlist
 * @param {number} productId - Product ID
 * @returns {boolean}
 */
const isInWishlist = (productId) => {
    const wishlist = getWishlist();
    return wishlist.includes(productId);
};

/* ============================================
   2. RENDERING FUNCTIONS
   ============================================ */

/**
 * Render a single product card
 * @param {object} product - Product data object
 * @returns {string} - HTML string for product card
 */
const renderProductCard = (product) => {
    const {
        ProductID,
        Product_name,
        Description,
        Product_Type,
        Price,
        Brand,
        Image_Url,
        Reorder_Level,
        inventory = 0,
        rating = 0,
        reviewCount = 0,
        originalPrice,
        isNew = false
    } = product;

    // Calculate derived values
    const stockStatus = calculateStockStatus(inventory, Reorder_Level);
    const stockInfo = getStockStatusInfo(stockStatus);
    const discount = calculateDiscount(Price, originalPrice);
    const hasDiscount = discount > 0;
    const brandColor = getBrandColor(Brand);
    const inWishlist = isInWishlist(ProductID);
    const isOutOfStock = stockStatus === 'out-of-stock';

    // Generate badges HTML
    let badgesHtml = '';
    if (hasDiscount) {
        badgesHtml += '<span class="product-badge badge-sale" aria-label="On sale">Sale</span>';
    }
    if (isNew && !hasDiscount) {
        badgesHtml += '<span class="product-badge badge-new" aria-label="New product">New</span>';
    }
    if (isOutOfStock) {
        badgesHtml += '<span class="product-badge badge-out-of-stock" aria-label="Out of stock">Out of Stock</span>';
    }

    // Generate category slug
    const categorySlug = Product_Type.toLowerCase();
    const brandSlug = Brand.toLowerCase().replace(/\s+/g, '-');

    // Build product card HTML
    return `
    <article class="product-card ${isOutOfStock ? 'out-of-stock-card' : ''}" 
             data-product-id="${ProductID}" 
             data-product-type="${categorySlug}" 
             data-brand="${brandSlug}"
             data-price="${Price}"
             data-stock-status="${stockStatus}"
             ${hasDiscount ? `data-original-price="${originalPrice}"` : ''}
             ${hasDiscount ? `data-discount="${discount}"` : ''}
             itemscope 
             itemtype="https://schema.org/Product">

      <!-- Badges -->
      <div class="product-badges">
        ${badgesHtml}
      </div>

      <!-- Wishlist Button -->
      <button class="wishlist-btn ${inWishlist ? 'active' : ''}" 
              type="button"
              data-product-id="${ProductID}"
              aria-label="${inWishlist ? 'Remove from' : 'Add to'} wishlist"
              aria-pressed="${inWishlist}">
        <i class="${inWishlist ? 'fas' : 'far'} fa-heart" aria-hidden="true"></i>
      </button>

      <!-- Product Image -->
      <div class="product-image">
        <a href="product-details.html?id=${ProductID}" 
           aria-label="View details for ${escapeHtml(Product_name)}">
          <img src="${escapeHtml(Image_Url)}" 
               alt="${escapeHtml(Product_name)}"
               itemprop="image"
               loading="lazy"
               onerror="this.src='assets/images/placeholder.jpg'">
        </a>
        
        <button class="quick-view-btn" 
                type="button"
                data-product-id="${ProductID}"
                aria-label="Quick view ${escapeHtml(Product_name)}">
          <i class="fas fa-eye" aria-hidden="true"></i>
          Quick View
        </button>
        
        <div class="product-overlay" aria-hidden="true"></div>
      </div>

      <!-- Product Info -->
      <div class="product-info">
        
        <!-- Meta -->
        <div class="product-meta">
          <span class="product-category" 
                data-category="${categorySlug}"
                itemprop="category">${Product_Type.toUpperCase()}</span>
          
          <span class="product-brand" 
                data-brand="${brandSlug}"
                style="--brand-color: ${brandColor};">${escapeHtml(Brand)}</span>
        </div>

        <!-- Title -->
        <h3 class="product-title" itemprop="name">
          <a href="product-details.html?id=${ProductID}" 
             aria-label="View ${escapeHtml(Product_name)} details">
            ${escapeHtml(Product_name)}
          </a>
        </h3>

        <!-- Rating -->
        <div class="product-rating" 
             itemprop="aggregateRating" 
             itemscope 
             itemtype="https://schema.org/AggregateRating">
          
          <div class="rating-stars" 
               role="img" 
               aria-label="Rated ${rating} out of 5 stars">
            ${generateStarRating(rating)}
          </div>
          
          <span class="rating-value" itemprop="ratingValue">${rating.toFixed(1)}</span>
          <span class="rating-count">
            (<span itemprop="reviewCount">${reviewCount}</span>)
          </span>
          
          <meta itemprop="bestRating" content="5">
          <meta itemprop="worstRating" content="1">
        </div>

        <!-- Price -->
        <div class="product-price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
          <span class="current-price" itemprop="price" content="${Price}">${formatPrice(Price)}</span>
          
          ${hasDiscount ? `
            <span class="original-price">${formatPrice(originalPrice)}</span>
            <span class="discount-percentage">-${discount}%</span>
          ` : ''}
          
          <meta itemprop="priceCurrency" content="PHP">
          <link itemprop="availability" href="https://schema.org/${isOutOfStock ? 'OutOfStock' : 'InStock'}">
        </div>

        <!-- Stock Status -->
        <div class="stock-status ${stockInfo.class}" data-stock="${stockStatus}">
          <i class="fas fa-circle" aria-hidden="true"></i>
          <span>${stockInfo.text}</span>
        </div>

        <!-- Actions -->
        <div class="product-actions">
          
          <button class="add-to-cart-btn" 
                  type="button"
                  data-product-id="${ProductID}"
                  data-product-name="${escapeHtml(Product_name)}"
                  data-price="${Price}"
                  data-image="${escapeHtml(Image_Url)}"
                  ${isOutOfStock ? 'disabled' : ''}
                  aria-label="${isOutOfStock ? 'Product out of stock' : `Add ${escapeHtml(Product_name)} to cart`}">
            <i class="${isOutOfStock ? 'fas fa-ban' : 'fas fa-shopping-cart'}" aria-hidden="true"></i>
            <span class="btn-text">${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>

          <div class="secondary-actions">
            <a href="product-details.html?id=${ProductID}" 
               class="view-details-btn"
               aria-label="View full details for ${escapeHtml(Product_name)}">
              <i class="fas fa-eye" aria-hidden="true"></i>
              <span class="btn-text">Details</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Hidden Description -->
      <div class="product-description-hidden" style="display: none;" itemprop="description">
        ${escapeHtml(Description)}
      </div>

      <input type="hidden" class="product-id-hidden" value="${ProductID}">
    </article>
  `;
};

/**
 * Render multiple product cards to container
 * @param {array} products - Array of product objects
 * @param {string} containerId - Target container ID
 */
const renderProductCards = (products, containerId = 'products-grid') => {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
    }

    if (!products || products.length === 0) {
        container.innerHTML = '<p class="no-products">No products available.</p>';
        return;
    }

    const html = products.map(product => renderProductCard(product)).join('');
    container.innerHTML = html;

    // Re-initialize event listeners after rendering
    initializeProductCards();
};

/* ============================================
   3. EVENT HANDLERS
   ============================================ */

/**
 * Handle add to cart button click
 * @param {Event} event - Click event
 */
const handleAddToCart = async (event) => {
    const button = event.currentTarget;

    // Prevent double clicks
    if (button.disabled) return;

    const productId = parseInt(button.dataset.productId);
    const productName = button.dataset.productName;
    const price = parseFloat(button.dataset.price);
    const image = button.dataset.image;

    // Disable button
    button.disabled = true;

    // Save original content
    const originalHtml = button.innerHTML;

    // Show loading state
    button.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i><span class="btn-text">Adding...</span>';

    try {
        // Simulate API call (replace with actual cart API)
        await new Promise(resolve => setTimeout(resolve, 800));

        // Add to cart (localStorage for demo)
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ productId, productName, price, image, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        // Show success state
        button.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i><span class="btn-text">Added!</span>';
        button.style.background = '#2ecc71';

        // Revert after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalHtml;
            button.style.background = '';
            button.disabled = false;
        }, 2000);

        // Dispatch custom event for cart update
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { productId, quantity: 1 } }));

    } catch (error) {
        console.error('Error adding to cart:', error);

        // Show error state
        button.innerHTML = '<i class="fas fa-exclamation-triangle" aria-hidden="true"></i><span class="btn-text">Error</span>';
        button.style.background = '#e74c3c';

        setTimeout(() => {
            button.innerHTML = originalHtml;
            button.style.background = '';
            button.disabled = false;
        }, 2000);
    }
};

/**
 * Handle wishlist toggle
 * @param {Event} event - Click event
 */
const toggleWishlist = (event) => {
    const button = event.currentTarget;
    const productId = parseInt(button.dataset.productId);

    let wishlist = getWishlist();
    const icon = button.querySelector('i');
    const isCurrentlyInWishlist = wishlist.includes(productId);

    if (isCurrentlyInWishlist) {
        // Remove from wishlist
        wishlist = wishlist.filter(id => id !== productId);
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('aria-label', button.getAttribute('aria-label').replace('Remove from', 'Add to'));
    } else {
        // Add to wishlist
        wishlist.push(productId);
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
        button.setAttribute('aria-label', button.getAttribute('aria-label').replace('Add to', 'Remove from'));
    }

    saveWishlist(wishlist);

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('wishlist-updated', {
        detail: { productId, added: !isCurrentlyInWishlist }
    }));
};

/**
 * Handle quick view modal
 * @param {Event} event - Click event
 */
const showQuickView = async (event) => {
    const button = event.currentTarget;
    const productId = parseInt(button.dataset.productId);

    try {
        // Get product card element
        const card = button.closest('.product-card');

        // Extract product data from card
        const productData = {
            id: productId,
            name: card.querySelector('.product-title a').textContent.trim(),
            image: card.querySelector('.product-image img').src,
            price: card.querySelector('.current-price').textContent,
            description: card.querySelector('.product-description-hidden').textContent.trim(),
            rating: card.querySelector('.rating-value').textContent,
            reviewCount: card.querySelector('.rating-count span').textContent,
            stockStatus: card.dataset.stockStatus
        };

        // Create modal HTML
        const modalHtml = `
      <div class="quick-view-modal" id="quick-view-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <button class="modal-close" aria-label="Close quick view">&times;</button>
          
          <div class="modal-body">
            <div class="modal-image">
              <img src="${productData.image}" alt="${productData.name}">
            </div>
            
            <div class="modal-info">
              <h2 id="modal-title">${productData.name}</h2>
              <p class="modal-price">${productData.price}</p>
              <div class="modal-rating">
                <span>${productData.rating}</span> ⭐ (${productData.reviewCount} reviews)
              </div>
              <p class="modal-description">${productData.description}</p>
              <button class="modal-add-to-cart" data-product-id="${productId}">
                <i class="fas fa-shopping-cart"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

        // Remove existing modal
        const existingModal = document.getElementById('quick-view-modal');
        if (existingModal) existingModal.remove();

        // Insert modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Add event listeners
        const modal = document.getElementById('quick-view-modal');
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        const addToCartBtn = modal.querySelector('.modal-add-to-cart');

        const closeModal = () => {
            modal.remove();
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        addToCartBtn.addEventListener('click', handleAddToCart);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Focus management
        closeBtn.focus();

    } catch (error) {
        console.error('Error showing quick view:', error);
    }
};

/* ============================================
   4. INITIALIZATION
   ============================================ */

/**
 * Apply brand colors to all brand badges
 */
const applyBrandColors = () => {
    document.querySelectorAll('.product-brand').forEach(badge => {
        const brand = badge.dataset.brand;
        const color = getBrandColor(brand);
        badge.style.setProperty('--brand-color', color);
    });
};

/**
 * Initialize all product card event listeners
 */
const initializeProductCards = () => {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    // Wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', toggleWishlist);
    });

    // Quick view buttons
    document.querySelectorAll('.quick-view-btn').forEach(button => {
        button.addEventListener('click', showQuickView);
    });

    // Apply brand colors
    applyBrandColors();
};

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeProductCards();
});

/* ============================================
   5. EXPORT FOR USE IN OTHER MODULES
   ============================================ */
window.ProductCard = {
    render: renderProductCard,
    renderMultiple: renderProductCards,
    calculateStockStatus,
    generateStarRating,
    formatPrice,
    calculateDiscount,
    initialize: initializeProductCards
};

// Sample products removed - product rendering handled by main application