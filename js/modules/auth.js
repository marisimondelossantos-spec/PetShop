/**
 * @module auth
 * @description Authentication module - handles login, signup, logout, user menu, and token management
 * @requires StorageService from storage.js (window.StorageService)
 */

// ========================================
// AUTH MODAL MANAGER CLASS
// ========================================

export class AuthModalManager {
  constructor() {
    this.authModal = null;
    this.currentForm = 'login'; // 'login' or 'signup'
  }

  /**
   * Initialize the authentication system
   */
  init() {
    this.addAuthModalToBody();
    this.setupModalTriggers();
    this.setupFormValidation();
    this.setupPasswordToggles();
  }

  /**
   * Inject auth modal HTML into the DOM
   */
  addAuthModalToBody() {
    const modalHTML = `
      <!-- Auth Modal Isolation Wrapper -->
      <div class="auth-modal-isolated">
        <!-- Single Auth Modal -->
        <div class="modal fade" id="authModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content auth-modal-content">
              <div class="modal-header auth-modal-header">
                <h5 class="modal-title" id="authModalTitle">
                  <i class="fas fa-paw"></i>
                  Welcome Back!
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body auth-modal-body">
                <!-- Login Form Container (VISIBLE BY DEFAULT) -->
                <div id="loginFormContainer" class="auth-form-container">
                  <form id="loginForm" class="auth-form">
                    <div class="mb-3">
                      <label for="loginEmail" class="form-label">Email address</label>
                      <input type="email" class="form-control" id="loginEmail" placeholder="Enter your email" required>
                    </div>
                    <div class="mb-3">
                      <label for="loginPassword" class="form-label">Password</label>
                      <div class="input-group">
                        <input type="password" class="form-control" id="loginPassword" placeholder="Enter your password" required>
                        <button class="btn" type="button" id="toggleLoginPassword">
                          <i class="fas fa-eye"></i>
                        </button>
                      </div>
                    </div>
                    <div class="mb-3 form-check">
                      <input type="checkbox" class="form-check-input" id="rememberMe">
                      <label class="form-check-label" for="rememberMe">Remember me</label>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Log In</button>
                  </form>
                  <div class="text-center mt-3">
                    <p>Don't have an account? <a href="#" id="switchToSignup" class="auth-link">Sign Up</a></p>
                  </div>
                </div>

                <!-- Signup Form Container (HIDDEN BY DEFAULT) -->
                <div id="signupFormContainer" class="auth-form-container" style="display: none;">
                  <form id="signupForm" class="auth-form">
                    <!-- Name Fields -->
                    <div class="row mb-3">
                      <div class="col-md-6">
                        <label for="firstName" class="form-label">First Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="firstName" placeholder="First name" required>
                      </div>
                      <div class="col-md-6">
                        <label for="lastName" class="form-label">Last Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="lastName" placeholder="Last name" required>
                      </div>
                    </div>
                    <div class="mb-3">
                      <label for="middleName" class="form-label">Middle Name</label>
                      <input type="text" class="form-control" id="middleName" placeholder="Middle name (optional)">
                    </div>
                    
                    <!-- Contact & Email -->
                    <div class="mb-3">
                      <label for="contactNumber" class="form-label">Contact Number <span class="text-danger">*</span></label>
                      <input type="tel" class="form-control" id="contactNumber" placeholder="09XX-XXX-XXXX" pattern="[0-9]{11}" required>
                      <small class="form-text">Format: 11 digits (e.g., 09171234567)</small>
                    </div>
                    <div class="mb-3">
                      <label for="signupEmail" class="form-label">Email Address <span class="text-danger">*</span></label>
                      <input type="email" class="form-control" id="signupEmail" placeholder="your.email@example.com" required>
                    </div>
                    
                    <!-- Address Section -->
                    <div class="address-section">
                      <h6 class="address-title">Address Information</h6>
                      <div class="mb-3">
                        <label for="street" class="form-label">Street <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="street" placeholder="House/Unit No., Street Name" required>
                      </div>
                      <div class="mb-3">
                        <label for="zone" class="form-label">Zone/Barangay <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="zone" placeholder="Zone or Barangay" required>
                      </div>
                      <div class="row mb-3">
                        <div class="col-md-4">
                          <label for="city" class="form-label">City <span class="text-danger">*</span></label>
                          <input type="text" class="form-control" id="city" placeholder="City" required>
                        </div>
                        <div class="col-md-4">
                          <label for="province" class="form-label">Province <span class="text-danger">*</span></label>
                          <input type="text" class="form-control" id="province" placeholder="Province" required>
                        </div>
                        <div class="col-md-4">
                          <label for="zipCode" class="form-label">Zip Code <span class="text-danger">*</span></label>
                          <input type="text" class="form-control" id="zipCode" placeholder="0000" pattern="[0-9]{4}" maxlength="4" required>
                        </div>
                      </div>
                    </div>

                    <!-- Password -->
                    <div class="mb-3">
                      <label for="signupPassword" class="form-label">Password <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <input type="password" class="form-control" id="signupPassword" placeholder="Create a password" required>
                        <button class="btn" type="button" id="toggleSignupPassword">
                          <i class="fas fa-eye"></i>
                        </button>
                      </div>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Sign Up</button>
                  </form>
                  <div class="text-center mt-3">
                    <p>Already have an account? <a href="#" id="switchToLogin" class="auth-link">Log In</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Inject modal into body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Initialize Bootstrap modal
    const modalEl = document.getElementById('authModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      this.authModal = new bootstrap.Modal(modalEl);

      // Setup form switchers after modal is in DOM
      document.getElementById('switchToSignup')?.addEventListener('click', (e) => {
        e.preventDefault();
        this.showSignupForm();
      });

      document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        this.showLoginForm();
      });
    }
  }

  /**
   * Show login form
   */
  showLoginForm() {
    document.getElementById('authModalTitle').innerHTML = '<i class="fas fa-paw"></i> Welcome Back!';
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('signupFormContainer').style.display = 'none';
    this.currentForm = 'login';
  }

  /**
   * Show signup form
   */
  showSignupForm() {
    document.getElementById('authModalTitle').innerHTML = '<i class="fas fa-paw"></i> Create Account';
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('signupFormContainer').style.display = 'block';
    this.currentForm = 'signup';
  }

  /**
   * Open auth modal with specific form
   * @param {string} formType - 'login' or 'signup'
   */
  openAuthModal(formType = 'login') {
    if (formType === 'login') {
      this.showLoginForm();
    } else {
      this.showSignupForm();
    }
    this.authModal?.show();
  }

  /**
   * Setup click handlers for auth modal triggers
   */
  setupModalTriggers() {
    // Handle all elements with data-auth attributes
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-auth]');
      if (trigger) {
        e.preventDefault();
        const authType = trigger.getAttribute('data-auth');
        this.openAuthModal(authType);
      }
    });

    // Legacy support for existing IDs
    const loginTrigger = document.getElementById('openLoginModal');
    const signupTrigger = document.getElementById('openSignupModal');

    if (loginTrigger) {
      loginTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.openAuthModal('login');
      });
      loginTrigger.setAttribute('data-auth', 'login');
    }

    if (signupTrigger) {
      signupTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.openAuthModal('signup');
      });
      signupTrigger.setAttribute('data-auth', 'signup');
    }
  }

  /**
   * Setup form submission handlers
   */
  setupFormValidation() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin(e.target);
      });
    }

    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSignup(e.target);
      });
    }
  }

  /**
   * Setup password visibility toggles
   */
  setupPasswordToggles() {
    // Login password toggle
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    if (toggleLoginPassword) {
      toggleLoginPassword.addEventListener('click', () => {
        const passwordInput = document.getElementById('loginPassword');
        const icon = toggleLoginPassword.querySelector('i');

        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          passwordInput.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      });
    }

    // Signup password toggle
    const toggleSignupPassword = document.getElementById('toggleSignupPassword');
    if (toggleSignupPassword) {
      toggleSignupPassword.addEventListener('click', () => {
        const passwordInput = document.getElementById('signupPassword');
        const icon = toggleSignupPassword.querySelector('i');

        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          passwordInput.type = 'password';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      });
    }
  }

  /**
   * Handle login form submission
   * @param {HTMLFormElement} form - The login form element
   */
  handleLogin(form) {
    const email = form.querySelector('#loginEmail').value;
    const password = form.querySelector('#loginPassword').value;
    const rememberMe = form.querySelector('#rememberMe').checked;

    // TODO: Replace with PHP backend API call
    // Example:
    // fetch('backend/login.php', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password, rememberMe })
    // })
    // .then(res => res.json())
    // .then(data => {
    //   if (data.success) {
    //     const userData = data.user;
    //     // ... proceed with login
    //   } else {
    //     this.showError(data.message);
    //   }
    // });

    // TEMPORARY: Mock login logic (remove when backend is ready)
    const username = email.split('@')[0];
    const userData = {
      email: email,
      firstName: username.charAt(0).toUpperCase() + username.slice(1),
      lastName: 'User',
      isLoggedIn: true,
      loginTime: new Date().toISOString()
    };

    // Save to storage
    window.StorageService.setCurrentUser(userData);
    window.StorageService.setLoginState(true);

    // Update UI
    document.documentElement.classList.add('user-logged-in');
    this.updateNavbarForLoggedInUser(userData);

    // Close modal
    this.authModal?.hide();
    this.resetForms();

    // Show success message
    this.showSuccess('Login successful! Welcome back!');
  }

  /**
   * Handle signup form submission
   * @param {HTMLFormElement} form - The signup form element
   */
  handleSignup(form) {
    // TODO: Replace with PHP backend API call
    // Example:
    // fetch('backend/signup.php', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(userData)
    // })
    // .then(res => res.json())
    // .then(data => {
    //   if (data.success) {
    //     const userData = data.user;
    //     // ... proceed with signup
    //   } else {
    //     this.showError(data.message);
    //   }
    // });

    // TEMPORARY: Mock signup logic (remove when backend is ready)
    const password = form.querySelector('#signupPassword').value; // Get password for backend
    const userData = {
      firstName: form.querySelector('#firstName').value,
      lastName: form.querySelector('#lastName').value,
      middleName: form.querySelector('#middleName').value,
      contactNumber: form.querySelector('#contactNumber').value,
      email: form.querySelector('#signupEmail').value,
      address: {
        street: form.querySelector('#street').value,
        zone: form.querySelector('#zone').value,
        city: form.querySelector('#city').value,
        province: form.querySelector('#province').value,
        zipCode: form.querySelector('#zipCode').value
      },
      isLoggedIn: true,
      signupTime: new Date().toISOString()
      // Note: password should be hashed on backend, not stored in user object
    };

    // Save to storage
    window.StorageService.setCurrentUser(userData);
    window.StorageService.setLoginState(true);

    // Update UI
    document.documentElement.classList.add('user-logged-in');
    this.updateNavbarForLoggedInUser(userData);

    // Close modal
    this.authModal?.hide();
    this.resetForms();

    // Show success message
    this.showSuccess('Account created successfully! Welcome!');
  }

  /**
   * Handle user logout
   */
  handleLogout() {
    // TODO: Replace with PHP backend API call
    // Example:
    // fetch('backend/logout.php', { method: 'POST' })
    // .then(() => {
    //   // ... proceed with logout
    // });

    // Clear storage
    window.StorageService.clearAll();

    // Update UI
    document.documentElement.classList.remove('user-logged-in');
    this.resetNavbarForLoggedOutUser();

    // Show message
    this.showSuccess('Logged out successfully!');

    // Redirect to home if on restricted page
    if (window.location.pathname.includes('profile')) {
      setTimeout(() => window.location.href = 'index.html', 1000);
    }
  }

  /**
   * Update navbar to show user menu for logged-in user
   * @param {Object} userData - User data object
   */
  updateNavbarForLoggedInUser(userData) {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;

    const userName = userData.firstName || 'User';
    const userMenuHTML = `
      <div class="user-menu">
        <button class="user-menu-toggle" id="userMenuToggle">
          <i class="fas fa-user-circle"></i>
          <span class="user-name">${userName}</span>
          <i class="fas fa-chevron-down"></i>
        </button>
        <div class="user-menu-dropdown" id="userMenuDropdown">
          <a href="profile.html" class="user-menu-item">
            <i class="fas fa-user"></i>
            <span>My Profile</span>
          </a>
          <a href="#" class="user-menu-item" id="logoutBtn">
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </a>
        </div>
      </div>
    `;

    authButtons.innerHTML = userMenuHTML;

    // Setup user menu toggle
    this.setupUserMenu();
  }

  /**
   * Reset navbar to show login/signup buttons for logged-out user
   */
  resetNavbarForLoggedOutUser() {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;

    authButtons.innerHTML = `
      <button class="btn-login" data-auth="login">Login</button>
      <button class="btn-signup" data-auth="signup">Sign Up</button>
    `;
  }

  /**
   * Setup user menu dropdown toggle
   */
  setupUserMenu() {
    const userMenuToggle = document.getElementById('userMenuToggle');
    const userMenuDropdown = document.getElementById('userMenuDropdown');
    const logoutBtn = document.getElementById('logoutBtn');

    if (userMenuToggle && userMenuDropdown) {
      // Toggle dropdown
      userMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenuDropdown.classList.toggle('show');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        userMenuDropdown.classList.remove('show');
      });

      // Prevent dropdown close when clicking inside
      userMenuDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Logout button
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleLogout();
      });
    }
  }

  /**
   * Check current auth state and update UI accordingly
   */
  checkAuthState() {
    const isLoggedIn = window.StorageService.isLoggedIn();
    const userData = window.StorageService.getCurrentUser();

    if (isLoggedIn && userData) {
      document.documentElement.classList.add('user-logged-in');
      this.updateNavbarForLoggedInUser(userData);
    }
  }

  /**
   * Reset all forms to initial state
   */
  resetForms() {
    document.getElementById('loginForm')?.reset();
    document.getElementById('signupForm')?.reset();
    this.showLoginForm();

    // Reset password visibility
    const loginPassword = document.getElementById('loginPassword');
    const signupPassword = document.getElementById('signupPassword');
    if (loginPassword) loginPassword.type = 'password';
    if (signupPassword) signupPassword.type = 'password';

    // Reset icons
    document.querySelectorAll('#toggleLoginPassword i, #toggleSignupPassword i').forEach(icon => {
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    });
  }

  /**
   * Show error notification
   * @param {string} message - Error message to display
   */
  showError(message) {
    this.showNotification(message, 'error');
  }

  /**
   * Show success notification
   * @param {string} message - Success message to display
   */
  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  /**
   * Show notification toast
   * @param {string} message - Message to display
   * @param {string} type - 'success', 'error', or 'info'
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// ========================================
// INITIALIZATION FUNCTION
// ========================================

/**
 * Initialize the authentication system
 * Call this function when DOM is ready
 */
export function initAuth() {
  if (!window.authModalManager) {
    window.authModalManager = new AuthModalManager();
    window.authModalManager.init();
    window.authModalManager.checkAuthState();
    console.log('✅ Auth module initialized');
  }
}

/**
 * Immediately check and apply auth state (for FOUC prevention)
 * This runs BEFORE DOM ready to prevent flash of unauthenticated content
 */
export function immediateAuthCheck() {
  const isLoggedIn = (window.StorageService ?
    window.StorageService.isLoggedIn() :
    localStorage.getItem('petshop_is_logged_in') === 'true'
  );

  if (isLoggedIn) {
    document.documentElement.classList.add('user-logged-in');
  }
}
