/**
 * @module service
 * @description Service page functionality - category filtering, service display, appointment booking
 */

// ========================================
// SERVICE DATA
// ========================================

const SERVICES = [
    {
        id: 1,
        category: 'Grooming',
        icon: '✂️',
        title: 'Professional Grooming',
        description: 'Complete grooming services including bath, haircut, nail trimming, and ear cleaning',
        duration: '1-2 hours',
        price: 800,
        badge: 'Popular',
        branches: ['Main Branch', 'Quezon City', 'Makati']
    },
    {
        id: 2,
        category: 'Grooming',
        icon: '🛁',
        title: 'Bath & Brush',
        description: 'Basic bath and brushing service to keep your pet clean and fresh',
        duration: '45 minutes',
        price: 400,
        branches: ['Main Branch', 'Quezon City']
    },
    {
        id: 3,
        category: 'Boarding',
        icon: '🏠',
        title: 'Premium Boarding',
        description: 'Comfortable stay with spacious kennels, regular exercise, and 24/7 care',
        duration: 'Per day',
        price: 600,
        badge: 'Recommended',
        branches: ['Main Branch']
    },
    {
        id: 4,
        category: 'Boarding',
        icon: '🌙',
        title: 'Overnight Care',
        description: 'Safe overnight boarding with experienced staff and comfortable accommodations',
        duration: 'Per night',
        price: 500,
        branches: ['Main Branch', 'Quezon City']
    },
    {
        id: 5,
        category: 'Health',
        icon: '💉',
        title: 'Vaccination',
        description: 'Complete vaccination program to protect your pet from diseases',
        duration: '30 minutes',
        price: 1200,
        badge: 'Essential',
        branches: ['Main Branch', 'Quezon City', 'Makati']
    },
    {
        id: 6,
        category: 'Health',
        icon: '🩺',
        title: 'General Checkup',
        description: 'Comprehensive health examination by licensed veterinarians',
        duration: '45 minutes',
        price: 800,
        branches: ['Main Branch', 'Makati']
    },
    {
        id: 7,
        category: 'Training',
        icon: '🎓',
        title: 'Basic Obedience',
        description: 'Fundamental commands and behavior training for puppies and adult dogs',
        duration: '4 weeks',
        price: 5000,
        badge: 'Popular',
        branches: ['Main Branch']
    },
    {
        id: 8,
        category: 'Training',
        icon: '⭐',
        title: 'Advanced Training',
        description: 'Advanced obedience, tricks, and specialized training programs',
        duration: '8 weeks',
        price: 8000,
        branches: ['Main Branch']
    }
];

// ========================================
// SERVICE MANAGER CLASS
// ========================================

export class ServiceManager {
    constructor() {
        this.services = SERVICES;
        this.currentCategory = 'all';
        this.currentService = null;
    }

    /**
     * Initialize the service system
     */
    init() {
        this.setupEventListeners();
        this.renderServices();
        console.log('✅ Service module initialized');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Category filter buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterByCategory(btn.dataset.category);
            });
        });

        // Close modal
        document.getElementById('closeModal')?.addEventListener('click', () => {
            this.closeModal();
        });

        // Modal overlay click
        document.getElementById('appointmentModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'appointmentModal') {
                this.closeModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Form submit
        document.getElementById('appointmentForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAppointmentSubmit(e);
        });
    }

    /**
     * Filter services by category
     * @param {string} category - Category to filter by
     */
    filterByCategory(category) {
        this.currentCategory = category;

        // Update button states
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`)?.classList.add('active');

        // Render filtered services
        this.renderServices();
    }

    /**
     * Render services to the grid
     */
    renderServices() {
        const grid = document.getElementById('servicesGrid');
        if (!grid) return;

        // Filter services
        const filteredServices = this.currentCategory === 'all'
            ? this.services
            : this.services.filter(s => s.category === this.currentCategory);

        // Render service cards
        grid.innerHTML = filteredServices.map(service => this.createServiceCard(service)).join('');

        // Setup book buttons
        grid.querySelectorAll('.btn-book').forEach(btn => {
            btn.addEventListener('click', () => {
                const serviceId = parseInt(btn.dataset.serviceId);
                this.openAppointmentModal(serviceId);
            });
        });
    }

    /**
     * Create service card HTML
     * @param {Object} service - Service data
     * @returns {string} Service card HTML
     */
    createServiceCard(service) {
        return `
      <div class="service-card">
        <div class="service-card__header">
          <span class="service-card__icon">${service.icon}</span>
          ${service.badge ? `<span class="service-card__badge">${service.badge}</span>` : ''}
          <div class="service-card__category">${service.category}</div>
          <h3 class="service-card__title">${service.title}</h3>
          <p class="service-card__description">${service.description}</p>
        </div>
        
        <div class="service-card__body">
          <div class="service-card__details">
            <div class="service-detail">
              <div class="service-detail__icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="service-detail__label">Duration:</div>
              <div class="service-detail__value">${service.duration}</div>
            </div>
          </div>
          
          <div class="service-card__price">₱${service.price.toFixed(2)}</div>
          
          <div class="service-card__branches">
            <span class="service-card__branches-label">Available at:</span>
            ${service.branches.map(branch => `<span class="branch-tag">${branch}</span>`).join('')}
          </div>
        </div>
        
        <div class="service-card__footer">
          <button class="btn-book" data-service-id="${service.id}">
            <i class="fas fa-calendar-check"></i>
            Book Appointment
          </button>
        </div>
      </div>
    `;
    }

    /**
     * Open appointment modal
     * @param {number} serviceId - Service ID
     */
    openAppointmentModal(serviceId) {
        this.currentService = this.services.find(s => s.id === serviceId);
        if (!this.currentService) return;

        const modal = document.getElementById('appointmentModal');
        if (!modal) return;

        // Update modal title, price, and duration using correct IDs
        const titleEl = document.getElementById('modalServiceName');
        const priceEl = document.getElementById('modalPrice');
        const durationEl = document.getElementById('modalDuration');

        if (titleEl) titleEl.textContent = this.currentService.title;
        if (priceEl) priceEl.textContent = `₱${this.currentService.price.toFixed(2)}`;
        if (durationEl) durationEl.textContent = this.currentService.duration;

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close appointment modal
     */
    closeModal() {
        const modal = document.getElementById('appointmentModal');
        if (!modal) return;

        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Handle appointment form submission
     * @param {Event} e - Form submit event
     */
    handleAppointmentSubmit(e) {
        const formData = new FormData(e.target);
        const appointment = {
            service: this.currentService,
            petName: formData.get('petName'),
            petType: formData.get('petType'),
            ownerName: formData.get('ownerName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            branch: formData.get('branch'),
            date: formData.get('date'),
            time: formData.get('time'),
            notes: formData.get('notes')
        };

        // Save appointment (mock - would normally send to server)
        console.log('Appointment submitted:', appointment);

        // Show success message
        if (window.uiManager) {
            window.uiManager.success('Appointment booked successfully! We\'ll send you a confirmation email.');
        } else {
            this.showSuccessMessage();
        }

        // Close modal
        this.closeModal();

        // Reset form
        e.target.reset();
    }

    /**
     * Show success message (fallback if UI manager not available)
     */
    showSuccessMessage() {
        const successMsg = document.querySelector('.success-message');
        if (successMsg) {
            successMsg.classList.add('active');
            setTimeout(() => {
                successMsg.classList.remove('active');
            }, 3000);
        }
    }
}

// ========================================
// INITIALIZATION FUNCTION
// ========================================

/**
 * Initialize the service system
 * Call this function when DOM is ready
 */
export function initService() {
    if (!window.serviceManager) {
        window.serviceManager = new ServiceManager();
        window.serviceManager.init();
    }
    return window.serviceManager;
}

/**
 * Get service manager instance
 * @returns {ServiceManager} Service manager instance
 */
export function getServiceManager() {
    return window.serviceManager;
}
