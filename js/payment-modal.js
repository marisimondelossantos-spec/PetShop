// Payment Modal Manager

class PaymentModalManager {
  constructor() {
    this.paymentModal = null;
    this.cart = [];
    this.totalAmount = 0;
    this.init();
  }

  init() {
    this.addPaymentModalToBody();
    this.loadCartData();
  }

  addPaymentModalToBody() {
    const modalHTML = `
      <!-- Payment Modal Isolation Wrapper -->
      <div class="payment-modal-isolated">
        <!-- Payment Modal -->
        <div class="modal fade" id="paymentModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content payment-modal-content">
              <div class="modal-header payment-modal-header">
                <h5 class="modal-title" id="paymentModalTitle">
                  <i class="fas fa-credit-card"></i>
                  Secure Checkout
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body payment-modal-body">
                
                <!-- Order Summary Section -->
                <div class="order-summary-section">
                  <h6 class="section-title">
                    <i class="fas fa-shopping-cart"></i>
                    Order Summary
                  </h6>
                  <div id="order-items-list" class="order-items-list">
                    <!-- Items will be dynamically loaded -->
                  </div>
                  <div class="order-total">
                    <span>Total Amount:</span>
                    <span id="modal-total-amount" class="total-amount">₱0.00</span>
                  </div>
                </div>

                <!-- Payment Method Section -->
                <div class="payment-method-section">
                  <h6 class="section-title">
                    <i class="fas fa-wallet"></i>
                    Payment Method
                  </h6>
                  <div class="payment-options">
                    <label class="payment-option">
                      <input type="radio" name="paymentMethod" value="cash" checked>
                      <div class="option-content">
                        <i class="fas fa-money-bill-wave"></i>
                        <div class="option-text">
                          <strong>Cash on Delivery</strong>
                          <small>Pay when you receive your order</small>
                        </div>
                      </div>
                    </label>
                    <label class="payment-option">
                      <input type="radio" name="paymentMethod" value="gcash">
                      <div class="option-content">
                        <i class="fab fa-google-wallet"></i>
                        <div class="option-text">
                          <strong>GCash</strong>
                          <small>Pay via GCash mobile wallet</small>
                        </div>
                      </div>
                    </label>
                    <label class="payment-option">
                      <input type="radio" name="paymentMethod" value="card">
                      <div class="option-content">
                        <i class="fas fa-credit-card"></i>
                        <div class="option-text">
                          <strong>Credit/Debit Card</strong>
                          <small>Visa, Mastercard, American Express</small>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <!-- Card Payment Details (Hidden by default) -->
                <div id="cardPaymentDetails" class="card-payment-details" style="display: none;">
                  <h6 class="section-title">
                    <i class="fas fa-lock"></i>
                    Card Information
                  </h6>
                  <form id="cardPaymentForm">
                    <div class="mb-3">
                      <label for="cardNumber" class="form-label">Card Number</label>
                      <input type="text" class="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" pattern="[0-9 ]{19}">
                    </div>
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label for="cardExpiry" class="form-label">Expiry Date</label>
                        <input type="text" class="form-control" id="cardExpiry" placeholder="MM/YY" maxlength="5">
                      </div>
                      <div class="col-md-6">
                        <label for="cardCvv" class="form-label">CVV</label>
                        <input type="text" class="form-control" id="cardCvv" placeholder="123" maxlength="3" pattern="[0-9]{3}">
                      </div>
                    </div>
                    <div class="mb-3">
                      <label for="cardName" class="form-label">Cardholder Name</label>
                      <input type="text" class="form-control" id="cardName" placeholder="John Doe">
                    </div>
                  </form>
                </div>

                <!-- GCash Payment Details (Hidden by default) -->
                <div id="gcashPaymentDetails" class="gcash-payment-details" style="display: none;">
                  <h6 class="section-title">
                    <i class="fas fa-mobile-alt"></i>
                    GCash Number
                  </h6>
                  <form id="gcashPaymentForm">
                    <div class="mb-3">
                      <label for="gcashNumber" class="form-label">Mobile Number</label>
                      <input type="tel" class="form-control" id="gcashNumber" placeholder="09XX XXX XXXX" pattern="[0-9]{11}" maxlength="11">
                      <small class="form-text">Enter your GCash-registered mobile number</small>
                    </div>
                  </form>
                </div>

                <!-- Delivery Address Section -->
                <div class="delivery-address-section">
                  <h6 class="section-title">
                    <i class="fas fa-map-marker-alt"></i>
                    Delivery Address
                  </h6>
                  <div id="delivery-address-display" class="address-display">
                    <!-- Address will be loaded from user data -->
                  </div>
                </div>

                <!-- Security Notice -->
                <div class="security-notice">
                  <i class="fas fa-shield-alt"></i>
                  <span>Your payment information is secure and encrypted</span>
                </div>

              </div>
              <div class="modal-footer payment-modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="confirmPaymentBtn">
                  <i class="fas fa-check-circle"></i>
                  <span>Place Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Initialize Bootstrap modal instance
    const paymentModalEl = document.getElementById('paymentModal');
    this.paymentModal = new bootstrap.Modal(paymentModalEl);

    // Setup event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Payment method change
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
      radio.addEventListener('change', (e) => this.handlePaymentMethodChange(e.target.value));
    });

    // Confirm payment button
    document.getElementById('confirmPaymentBtn')?.addEventListener('click', () => {
      this.handleConfirmPayment();
    });

    // Card number formatting
    document.getElementById('cardNumber')?.addEventListener('input', (e) => {
      this.formatCardNumber(e.target);
    });

    // Expiry date formatting
    document.getElementById('cardExpiry')?.addEventListener('input', (e) => {
      this.formatExpiryDate(e.target);
    });
  }

  handlePaymentMethodChange(method) {
    // Hide all payment detail sections
    document.getElementById('cardPaymentDetails').style.display = 'none';
    document.getElementById('gcashPaymentDetails').style.display = 'none';

    // Show relevant section
    if (method === 'card') {
      document.getElementById('cardPaymentDetails').style.display = 'block';
    } else if (method === 'gcash') {
      document.getElementById('gcashPaymentDetails').style.display = 'block';
    }
  }

  formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    input.value = formattedValue;
  }

  formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    input.value = value;
  }

  loadCartData() {
    // Load cart from localStorage
    const storedCart = window.StorageService.getCart();
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }
  }

  openPaymentModal(cartData) {
    // Update cart data if provided
    if (cartData) {
      this.cart = cartData;
    } else {
      this.loadCartData();
    }

    // Calculate total
    this.totalAmount = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Render order items
    this.renderOrderItems();

    // Load delivery address
    this.loadDeliveryAddress();

    // Show modal
    this.paymentModal.show();
  }

  renderOrderItems() {
    const container = document.getElementById('order-items-list');
    if (!container) return;

    if (this.cart.length === 0) {
      container.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
      document.getElementById('modal-total-amount').textContent = '₱0.00';
      return;
    }

    container.innerHTML = this.cart.map(item => `
      <div class="order-item">
        <div class="item-info">
          <span class="item-name">${item.name}</span>
          <span class="item-qty">x${item.quantity}</span>
        </div>
        <span class="item-price">₱${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');

    document.getElementById('modal-total-amount').textContent = `₱${this.totalAmount.toFixed(2)}`;
  }

  loadDeliveryAddress() {
    const currentUser = window.StorageService.getCurrentUser() || {};
    const addressDisplay = document.getElementById('delivery-address-display');

    if (currentUser && currentUser.address) {
      const addr = currentUser.address;
      addressDisplay.innerHTML = `
        <p><strong>${currentUser.firstName} ${currentUser.lastName}</strong></p>
        <p>${addr.street}, ${addr.zone}</p>
        <p>${addr.city}, ${addr.province} ${addr.zipCode}</p>
        <p>Contact: ${currentUser.contactNumber}</p>
      `;
    } else {
      addressDisplay.innerHTML = '<p class="text-muted">No delivery address found. Please update your profile.</p>';
    }
  }

  handleConfirmPayment() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    // Validate based on payment method
    if (selectedMethod === 'card') {
      const cardNumber = document.getElementById('cardNumber').value;
      const cardExpiry = document.getElementById('cardExpiry').value;
      const cardCvv = document.getElementById('cardCvv').value;
      const cardName = document.getElementById('cardName').value;

      if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        this.showNotification('Please fill in all card details', 'error');
        return;
      }
    } else if (selectedMethod === 'gcash') {
      const gcashNumber = document.getElementById('gcashNumber').value;
      if (!gcashNumber || gcashNumber.length !== 11) {
        this.showNotification('Please enter a valid GCash number', 'error');
        return;
      }
    }

    // Create order
    this.createOrder(selectedMethod);
  }

  createOrder(paymentMethod) {
    const currentUser = window.StorageService.getCurrentUser() || {};

    // Create order object
    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'processing',
      paymentMethod: paymentMethod,
      items: this.cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image || 'assets/images/home/HeroImageMain.png'
      })),
      total: this.totalAmount,
      customer: {
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        email: currentUser.email,
        phone: currentUser.contactNumber,
        address: currentUser.address
      }
    };

    // Save order to localStorage
    const orders = window.StorageService.getOrders();
    orders.unshift(order);
    window.StorageService.setOrders(orders);

    // Clear cart
    window.StorageService.clearCart();

    // Close modal
    this.paymentModal.hide();

    // Show success message
    this.showNotification('Order placed successfully! Order ID: ' + order.id, 'success');

    // Redirect to profile page after delay
    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 2000);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize when DOM is ready
let paymentModalManager;

function initPaymentModal() {
  if (!window.paymentModalManager) {
    window.paymentModalManager = new PaymentModalManager();
    console.log('PaymentModalManager initialized');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPaymentModal);
} else {
  initPaymentModal();
}

// Export for use in other scripts
window.openPaymentModal = (cartData) => {
  if (window.paymentModalManager) {
    window.paymentModalManager.openPaymentModal(cartData);
  }
};
