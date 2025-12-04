/**
 * @module search
 * @description Product search module - real-time search, live results, keyboard navigation, and search history
 */

// ========================================
// SEARCH MANAGER CLASS
// ========================================

export class SearchManager {
    constructor() {
        this.searchInput = null;
        this.searchResults = null;
        this.searchResultsContainer = null;
        this.products = [];
        this.currentResults = [];
        this.selectedIndex = -1;
        this.searchHistory = [];
        this.debounceTimer = null;
        this.minSearchLength = 2;
        this.maxResults = 8;
        this.isOpen = false;
    }

    /**
     * Initialize the search system
     */
    init() {
        this.setupSearchElements();
        this.loadSearchHistory();
        this.setupEventListeners();
        console.log('✅ Search module initialized');
    }

    /**
     * Setup search input and results container
     */
    setupSearchElements() {
        // Find search input
        this.searchInput = document.querySelector('.search-input') ||
            document.querySelector('#search-input') ||
            document.querySelector('[data-search-input]');

        if (!this.searchInput) {
            console.warn('Search input not found');
            return;
        }

        // Create or find results container
        this.setupResultsContainer();
    }

    /**
     * Create search results container
     */
    setupResultsContainer() {
        // Check if results container already exists
        this.searchResultsContainer = document.querySelector('.search-results') ||
            document.querySelector('#search-results') ||
            document.querySelector('[data-search-results]');

        if (!this.searchResultsContainer && this.searchInput) {
            // Create results container
            this.searchResultsContainer = document.createElement('div');
            this.searchResultsContainer.className = 'search-results';
            this.searchResultsContainer.setAttribute('role', 'listbox');
            this.searchResultsContainer.setAttribute('aria-label', 'Search results');

            // Insert after search input or its parent container
            const searchContainer = this.searchInput.closest('.search-container') ||
                this.searchInput.parentElement;
            searchContainer.style.position = 'relative';
            searchContainer.appendChild(this.searchResultsContainer);
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (!this.searchInput) return;

        // Input event - real-time search
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });

        // Focus event - show recent searches or results
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.trim().length >= this.minSearchLength) {
                this.showResults();
            } else if (this.searchHistory.length > 0) {
                this.showSearchHistory();
            }
        });

        // Keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container') &&
                !e.target.closest('.search-results')) {
                this.hideResults();
            }
        });

        // Clear search button
        const clearBtn = document.querySelector('.search-clear') ||
            document.querySelector('[data-search-clear]');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearSearch();
            });
        }
    }

    /**
     * Handle search input with debouncing
     * @param {string} query - Search query
     */
    handleSearchInput(query) {
        // Clear previous timer
        clearTimeout(this.debounceTimer);

        // Show/hide clear button
        this.toggleClearButton(query);

        // If query is too short, hide results
        if (query.trim().length < this.minSearchLength) {
            this.hideResults();
            return;
        }

        // Debounce search
        this.debounceTimer = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }

    /**
     * Perform search operation
     * @param {string} query - Search query
     */
    performSearch(query) {
        const normalizedQuery = query.toLowerCase().trim();

        // Filter products based on query
        this.currentResults = this.products.filter(product => {
            return product.name.toLowerCase().includes(normalizedQuery) ||
                product.category?.toLowerCase().includes(normalizedQuery) ||
                product.description?.toLowerCase().includes(normalizedQuery) ||
                product.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery));
        });

        // Limit results
        this.currentResults = this.currentResults.slice(0, this.maxResults);

        // Render results
        this.renderResults(query);

        // Show results
        this.showResults();

        // Dispatch search event
        this.dispatchSearchEvent('search-performed', { query, results: this.currentResults });
    }

    /**
     * Render search results
     * @param {string} query - Search query for highlighting
     */
    renderResults(query) {
        if (!this.searchResultsContainer) return;

        if (this.currentResults.length === 0) {
            this.searchResultsContainer.innerHTML = `
        <div class="search-no-results">
          <i class="fas fa-search"></i>
          <p>No results found for "${this.escapeHtml(query)}"</p>
        </div>
      `;
            return;
        }

        const resultsHTML = this.currentResults.map((product, index) => `
      <div class="search-result-item" 
           data-index="${index}"
           data-product-id="${product.id}"
           role="option"
           tabindex="-1">
        <div class="search-result-image">
          <img src="${product.image || 'assets/images/placeholder.png'}" alt="${product.name}">
        </div>
        <div class="search-result-info">
          <h4 class="search-result-name">${this.highlightText(product.name, query)}</h4>
          <p class="search-result-category">${product.category || ''}</p>
          <p class="search-result-price">₱${product.price.toFixed(2)}</p>
        </div>
      </div>
    `).join('');

        this.searchResultsContainer.innerHTML = resultsHTML;

        // Setup click handlers for results
        this.setupResultsClickHandlers();
    }

    /**
     * Render search history
     */
    showSearchHistory() {
        if (!this.searchResultsContainer || this.searchHistory.length === 0) return;

        const historyHTML = `
      <div class="search-history">
        <div class="search-history-header">
          <span>Recent Searches</span>
          <button class="search-history-clear" data-action="clear-history">Clear</button>
        </div>
        ${this.searchHistory.slice(0, 5).map(item => `
          <div class="search-history-item" data-query="${this.escapeHtml(item)}">
            <i class="fas fa-history"></i>
            <span>${this.escapeHtml(item)}</span>
          </div>
        `).join('')}
      </div>
    `;

        this.searchResultsContainer.innerHTML = historyHTML;
        this.showResults();

        // Setup click handlers for history items
        this.setupHistoryClickHandlers();
    }

    /**
     * Setup click handlers for search results
     */
    setupResultsClickHandlers() {
        if (!this.searchResultsContainer) return;

        this.searchResultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const productId = item.dataset.productId;
                this.handleResultClick(productId);
            });

            // Hover effect
            item.addEventListener('mouseenter', () => {
                this.selectedIndex = parseInt(item.dataset.index);
                this.updateSelectedItem();
            });
        });
    }

    /**
     * Setup click handlers for search history
     */
    setupHistoryClickHandlers() {
        if (!this.searchResultsContainer) return;

        // History item click
        this.searchResultsContainer.querySelectorAll('.search-history-item').forEach(item => {
            item.addEventListener('click', () => {
                const query = item.dataset.query;
                this.searchInput.value = query;
                this.performSearch(query);
            });
        });

        // Clear history button
        const clearBtn = this.searchResultsContainer.querySelector('[data-action="clear-history"]');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearSearchHistory();
            });
        }
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyboardNavigation(e) {
        if (!this.isOpen || this.currentResults.length === 0) {
            if (e.key === 'Escape') {
                this.hideResults();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.currentResults.length - 1);
                this.updateSelectedItem();
                break;

            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelectedItem();
                break;

            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && this.currentResults[this.selectedIndex]) {
                    const productId = this.currentResults[this.selectedIndex].id;
                    this.handleResultClick(productId);
                }
                break;

            case 'Escape':
                e.preventDefault();
                this.hideResults();
                this.searchInput.blur();
                break;
        }
    }

    /**
     * Update selected item in results
     */
    updateSelectedItem() {
        if (!this.searchResultsContainer) return;

        const items = this.searchResultsContainer.querySelectorAll('.search-result-item');
        items.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    /**
     * Handle result click
     * @param {string} productId - Product ID
     */
    handleResultClick(productId) {
        const query = this.searchInput.value.trim();

        // Add to search history
        this.addToSearchHistory(query);

        // Hide results
        this.hideResults();

        // Dispatch event
        this.dispatchSearchEvent('search-result-clicked', { productId, query });

        // Navigate to product or perform action
        // For shop page, could trigger modal
        // For other pages, could navigate to shop with filter
        console.log('Search result clicked:', productId);
    }

    /**
     * Show search results dropdown
     */
    showResults() {
        if (!this.searchResultsContainer) return;

        this.searchResultsContainer.classList.add('show');
        this.isOpen = true;
        this.selectedIndex = -1;
    }

    /**
     * Hide search results dropdown
     */
    hideResults() {
        if (!this.searchResultsContainer) return;

        this.searchResultsContainer.classList.remove('show');
        this.isOpen = false;
        this.selectedIndex = -1;
    }

    /**
     * Clear search input
     */
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
            this.searchInput.focus();
        }
        this.hideResults();
        this.toggleClearButton('');
        this.dispatchSearchEvent('search-cleared');
    }

    /**
     * Toggle clear button visibility
     * @param {string} value - Current input value
     */
    toggleClearButton(value) {
        const clearBtn = document.querySelector('.search-clear') ||
            document.querySelector('[data-search-clear]');
        if (clearBtn) {
            clearBtn.style.display = value.length > 0 ? 'block' : 'none';
        }
    }

    /**
     * Set products for search
     * @param {Array} products - Array of product objects
     */
    setProducts(products) {
        this.products = products;
    }

    /**
     * Add product to searchable items
     * @param {Object} product - Product object
     */
    addProduct(product) {
        this.products.push(product);
    }

    /**
     * Highlight search term in text
     * @param {string} text - Text to highlight
     * @param {string} query - Search query
     * @returns {string} HTML with highlighted text
     */
    highlightText(text, query) {
        if (!query) return this.escapeHtml(text);

        const escapedQuery = this.escapeHtml(query);
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return this.escapeHtml(text).replace(regex, '<mark>$1</mark>');
    }

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
     * Add query to search history
     * @param {string} query - Search query
     */
    addToSearchHistory(query) {
        if (!query || query.length < this.minSearchLength) return;

        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(item => item !== query);

        // Add to beginning
        this.searchHistory.unshift(query);

        // Limit to 10 items
        this.searchHistory = this.searchHistory.slice(0, 10);

        // Save to storage
        this.saveSearchHistory();
    }

    /**
     * Load search history from storage
     */
    loadSearchHistory() {
        const stored = localStorage.getItem('petshop_search_history');
        if (stored) {
            try {
                this.searchHistory = JSON.parse(stored);
            } catch (e) {
                this.searchHistory = [];
            }
        }
    }

    /**
     * Save search history to storage
     */
    saveSearchHistory() {
        localStorage.setItem('petshop_search_history', JSON.stringify(this.searchHistory));
    }

    /**
     * Clear search history
     */
    clearSearchHistory() {
        this.searchHistory = [];
        localStorage.removeItem('petshop_search_history');
        this.hideResults();
    }

    /**
     * Dispatch custom search event
     * @param {string} eventName - Event name
     * @param {Object} detail - Event detail data
     */
    dispatchSearchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail: {
                query: this.searchInput?.value || '',
                results: this.currentResults,
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
 * Initialize the search system
 * Call this function when DOM is ready
 * @param {Array} products - Optional array of products to search
 */
export function initSearch(products = []) {
    if (!window.searchManager) {
        window.searchManager = new SearchManager();
        window.searchManager.init();

        if (products.length > 0) {
            window.searchManager.setProducts(products);
        }
    }
    return window.searchManager;
}

/**
 * Get search manager instance
 * @returns {SearchManager} Search manager instance
 */
export function getSearchManager() {
    return window.searchManager;
}
