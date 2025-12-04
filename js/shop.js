const brandColors = {
    'natural-food': '#e67e22',   // Orange
    'pet-care': '#2ecc71',       // Green
    'dogs-friend': '#1abc9c',    // Teal
    // Add more brands as needed
};

// Apply brand colors dynamically to product cards

document.querySelectorAll('.product-brand').forEach(badge => {
    const brand = badge.getAttribute('data-brand');
    const colors = {
        'natural-food': '#e67e22',
        'pet-care': '#2ecc71',
        'dogs-friend': '#1abc9c'
    };
    badge.style.setProperty('--brand-color', colors[brand] || '#999');
});

// ============================================
// PRODUCT DETAILS MODAL - COMPLETE & FIXED
// ============================================
(function () {
    'use strict';

    const modal = document.getElementById('productModal');
    if (!modal) return;

    let currentProductData = {};

    // ============================================
    // EVENT DELEGATION: Open modal on Details button click
    // ============================================
    document.addEventListener('click', function (e) {
        const detailsBtn = e.target.closest('.view-details-btn, .quick-view-btn, .details-btn, [data-action="details"], [data-action="quick-view"]');
        if (!detailsBtn) return;
        e.preventDefault();

        const productCard = detailsBtn.closest('.product-card, [data-product-id]');
        if (!productCard) return;

        currentProductData = extractProductData(productCard);
        populateModal(currentProductData);
        openModal();
    });

    // ============================================
    // EXTRACT DATA FROM PRODUCT CARD
    // ============================================
    function extractProductData(card) {
        const data = {
            id: card.dataset.productId || '',
            name: card.querySelector('h3, .product-title')?.textContent.trim() || 'Product',
            price: card.querySelector('.current-price, .price')?.textContent.trim() || '',
            priceValue: parseFloat(card.dataset.price || card.querySelector('.current-price, .price')?.textContent.replace(/[^\d.]/g, '') || 0),
            originalPrice: card.querySelector('.original-price, .old-price')?.textContent.trim() || '',
            discount: card.querySelector('.discount, .sale-badge')?.textContent.trim() || '',
            rating: parseFloat(card.dataset.rating || 5),
            reviewCount: card.querySelector('.review-count')?.textContent.replace(/[()]/g, '')?.trim() || '0',
            image: card.querySelector('.product-image img')?.src || '',
            imageAlt: card.querySelector('.product-image img')?.alt || card.querySelector('h3')?.textContent || 'Product',
            description: card.querySelector('.product-description-hidden, .description')?.textContent.trim() || 'No description available.',
            isWishlisted: card.querySelector('.wishlist-btn')?.classList.contains('active') || false,
            stockStatus: card.querySelector('.stock-status')?.textContent.trim() || 'In Stock',
        };

        // Rating stars HTML
        const stars = card.querySelector('.rating-stars, .stars');
        data.starsHTML = stars ? stars.innerHTML : generateStars(data.rating);

        return data;
    }

    function generateStars(rating) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) html += '<i class="fas fa-star"></i>';
            else if (i === Math.ceil(rating) && rating % 1 >= 0.5) html += '<i class="fas fa-star-half-alt"></i>';
            else html += '<i class="far fa-star"></i>';
        }
        return html;
    }

    // ============================================
    // POPULATE MODAL
    // ============================================
    function populateModal(data) {
        modal.querySelector('#shop-modal-main-image').src = data.image;
        modal.querySelector('#shop-modal-main-image').alt = data.imageAlt;

        modal.querySelector('#shop-modal-product-title').textContent = data.name;
        modal.querySelector('.shop-modal-price .shop-modal-current-price').textContent = data.price;

        const originalPriceEl = modal.querySelector('.shop-modal-price .shop-modal-original-price');
        const discountEl = modal.querySelector('.shop-modal-price .shop-modal-discount-percentage');

        if (data.originalPrice && data.originalPrice !== data.price) {
            originalPriceEl.textContent = data.originalPrice;
            originalPriceEl.style.display = 'inline';
            discountEl.textContent = data.discount || '-XX%';
            discountEl.style.display = 'inline-block';
        } else {
            originalPriceEl.style.display = 'none';
            discountEl.style.display = 'none';
        }

        modal.querySelector('.shop-modal-rating .shop-modal-rating-stars').innerHTML = data.starsHTML;
        modal.querySelector('.shop-modal-rating .shop-modal-rating-value').textContent = data.rating.toFixed(1);
        modal.querySelector('.shop-modal-rating .shop-modal-rating-count').textContent = `(${data.reviewCount})`;

        modal.querySelector('.description-content').textContent = data.description;

        // Wishlist button state
        const wishlistBtn = modal.querySelector('.shop-modal-wishlist-btn');
        if (data.isWishlisted) {
            wishlistBtn.classList.add('active');
            wishlistBtn.querySelector('i').className = 'fas fa-heart';
        } else {
            wishlistBtn.classList.remove('active');
            wishlistBtn.querySelector('i').className = 'far fa-heart';
        }

        // Reset quantity
        modal.querySelector('#shop-modal-quantity').value = 1;
    }

    // ============================================
    // OPEN / CLOSE MODAL
    // ============================================
    function openModal() {
        modal.classList.add('active');
        modal.parentElement.classList.add('active'); // Also add active to parent .product-modal
        document.body.classList.add('modal-open'); // Add class for CSS scroll lock
        document.body.style.overflow = 'hidden'; // Fallback inline style
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.parentElement.classList.remove('active'); // Also remove from parent .product-modal
        document.body.classList.remove('modal-open'); // Remove the class that locks scroll
        document.body.style.overflow = ''; // Reset inline styles
    }

    modal.querySelector('.shop-modal-close')?.addEventListener('click', closeModal);
    modal.querySelector('.-shop-modal-overlay')?.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    // ============================================
    // QUANTITY SELECTOR  (FIXED VERSION)
    // ============================================
    modal.querySelector('.shop-modal-qty-btn.minus')?.addEventListener('click', () => {
        const input = modal.querySelector('#shop-modal-quantity');
        if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
    });

    modal.querySelector('.shop-modal-qty-btn.plus')?.addEventListener('click', () => {
        const input = modal.querySelector('#shop-modal-quantity');
        input.value = parseInt(input.value) + 1;
    });

    // ============================================
    // ADD TO CART FROM MODAL - REFACTORED VERSION
    // ============================================
    modal.querySelector('.shop-modal-add-to-cart')?.addEventListener('click', function () {
        const btn = this;
        const qty = parseInt(modal.querySelector('#shop-modal-quantity').value) || 1;

        btn.textContent = 'Adding...';
        btn.disabled = true;

        setTimeout(() => {
            // CHANGED: Use StorageService instead of direct localStorage
            let cart = window.StorageService.getCart();
            const existing = cart.find(item => item.id === currentProductData.id);

            if (existing) {
                existing.quantity += qty;
            } else {
                cart.push({
                    id: currentProductData.id || Date.now(),
                    name: currentProductData.name,
                    price: currentProductData.priceValue,
                    image: currentProductData.image,
                    quantity: qty
                });
            }

            // CHANGED: Use StorageService to save cart
            window.StorageService.setCart(cart);
            btn.textContent = 'Added!';
            btn.classList.add('added');

            setTimeout(() => {
                btn.textContent = 'Add to Cart';
                btn.disabled = false;
                btn.classList.remove('added');
            }, 1500);
        }, 600);
    });

    // ============================================
    // WISHLIST TOGGLE IN MODAL
    // ============================================
    modal.querySelector('.modal-wishlist-btn')?.addEventListener('click', function () {
        this.classList.toggle('active');
        const icon = this.querySelector('i');
        if (this.classList.contains('active')) {
            icon.className = 'fas fa-heart';
        } else {
            icon.className = 'far fa-heart';
        }
    });

})();
