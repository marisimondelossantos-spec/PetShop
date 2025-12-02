class AuthModalManager {
  constructor() {
    this.authModal = null;
    this.currentForm = 'login'; // 'login' or 'signup'
    this.init();
  }

  init() {
    this.addAuthModalToBody();
    this.setupModalTriggers();
    this.setupFormValidation();
    this.setupPasswordToggles();
  }

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
                          <select class="form-control" id="province" required>
                            <option value="">Select Province</option>
                            <option value="Metro Manila">Metro Manila</option>
                            <option value="Abra">Abra</option>
                            <option value="Agusan del Norte">Agusan del Norte</option>
                            <option value="Agusan del Sur">Agusan del Sur</option>
                            <option value="Aklan">Aklan</option>
                            <option value="Albay">Albay</option>
                            <option value="Antique">Antique</option>
                            <option value="Bataan">Bataan</option>
                            <option value="Batanes">Batanes</option>
                            <option value="Batangas">Batangas</option>
                            <option value="Benguet">Benguet</option>
                            <option value="Bohol">Bohol</option>
                            <option value="Bukidnon">Bukidnon</option>
                            <option value="Bulacan">Bulacan</option>
                            <option value="Cagayan">Cagayan</option>
                            <option value="Camarines Norte">Camarines Norte</option>
                            <option value="Camarines Sur">Camarines Sur</option>
                            <option value="Camiguin">Camiguin</option>
                            <option value="Capiz">Capiz</option>
                            <option value="Cavite">Cavite</option>
                            <option value="Cebu">Cebu</option>
                            <option value="Davao del Norte">Davao del Norte</option>
                            <option value="Davao del Sur">Davao del Sur</option>
                            <option value="Davao Oriental">Davao Oriental</option>
                            <option value="Ilocos Norte">Ilocos Norte</option>
                            <option value="Ilocos Sur">Ilocos Sur</option>
                            <option value="Iloilo">Iloilo</option>
                            <option value="Laguna">Laguna</option>
                            <option value="La Union">La Union</option>
                            <option value="Pampanga">Pampanga</option>
                            <option value="Pangasinan">Pangasinan</option>
                            <option value="Quezon">Quezon</option>
                            <option value="Rizal">Rizal</option>
                          </select>
                        </div>
                        <div class="col-md-4">
                          <label for="zipCode" class="form-label">Zip Code <span class="text-danger">*</span></label>
                          <input type="text" class="form-control" id="zipCode" placeholder="4 digits" pattern="[0-9]{4}" maxlength="4" required>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Password Fields -->
                    <div class="mb-3">
                      <label for="signupPassword" class="form-label">Password <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <input type="password" class="form-control" id="signupPassword" placeholder="Create a password" required>
                        <button class="btn" type="button" id="toggleSignupPassword">
                          <i class="fas fa-eye"></i>
                        </button>
                      </div>
                    </div>
                    <div class="mb-3">
                      <label for="confirmPassword" class="form-label">Confirm Password <span class="text-danger">*</span></label>
                      <input type="password" class="form-control" id="confirmPassword" placeholder="Confirm your password" required>
                    </div>
                    <div class="mb-3 form-check">
                      <input type="checkbox" class="form-check-input" id="agreeTerms" required>
                      <label class="form-check-label" for="agreeTerms">I agree to the Terms and Conditions</label>
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

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Initialize Bootstrap modal instance
    const authModalEl = document.getElementById('authModal');
    this.authModal = new bootstrap.Modal(authModalEl);

    // Setup form switching
    this.setupFormSwitching();

    // Handle modal close events
    authModalEl.addEventListener('hidden.bs.modal', () => {
      this.resetForms();
    });
  }

  setupFormSwitching() {
    // Switch: Login → Signup
    document.getElementById('switchToSignup')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showSignupForm();
    });

    // Switch: Signup → Login
    document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showLoginForm();
    });
  }

  showLoginForm() {
    // Update title with paw icon
    document.getElementById('authModalTitle').innerHTML = '<i class="fas fa-paw"></i> Welcome Back!';

    // Switch containers (using inline styles for reliability)
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('signupFormContainer').style.display = 'none';

    // Update current form
    this.currentForm = 'login';
  }

  showSignupForm() {
    // Update title with paw icon
    document.getElementById('authModalTitle').innerHTML = '<i class="fas fa-paw"></i> Create Account';

    // Switch containers (using inline styles for reliability)
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('signupFormContainer').style.display = 'block';

    // Update current form
    this.currentForm = 'signup';
  }

  openAuthModal(formType = 'login') {
    // Show correct form
    if (formType === 'login') {
      this.showLoginForm();
    } else {
      this.showSignupForm();
    }

    // Open modal
    this.authModal.show();
  }

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
      loginTrigger.setAttribute('data-auth', 'login'); // Add new attribute
    }

    if (signupTrigger) {
      signupTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.openAuthModal('signup');
      });
      signupTrigger.setAttribute('data-auth', 'signup'); // Add new attribute
    }
  }

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

  setupPasswordToggles() {
    // Login password toggle
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    if (toggleLoginPassword) {
      toggleLoginPassword.addEventListener('click', () => {
        this.togglePassword('loginPassword', toggleLoginPassword);
      });
    }

    // Signup password toggle
    const toggleSignupPassword = document.getElementById('toggleSignupPassword');
    if (toggleSignupPassword) {
      toggleSignupPassword.addEventListener('click', () => {
        this.togglePassword('signupPassword', toggleSignupPassword);
      });
    }
  }

  togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');

    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  }

  handleLogin(form) {
    const email = form.querySelector('#loginEmail').value;
    const password = form.querySelector('#loginPassword').value;

    // Basic validation
    if (!email || !password) {
      this.showError('Please fill in all fields');
      return;
    }

    // Simulate login (replace with actual authentication)
    console.log('Login attempt:', { email, password });

    // Show success message
    this.showSuccess('Login successful! Redirecting...');

    // Close modal after success
    setTimeout(() => {
      this.authModal.hide();
      // Update navbar to show logged in state
      this.updateNavbarForLoggedInUser(email);
    }, 1500);
  }

  handleSignup(form) {
    // Collect all form data
    const firstName = form.querySelector('#firstName').value.trim();
    const middleName = form.querySelector('#middleName').value.trim();
    const lastName = form.querySelector('#lastName').value.trim();
    const contactNumber = form.querySelector('#contactNumber').value.trim();
    const email = form.querySelector('#signupEmail').value.trim();
    const street = form.querySelector('#street').value.trim();
    const zone = form.querySelector('#zone').value.trim();
    const city = form.querySelector('#city').value.trim();
    const province = form.querySelector('#province').value;
    const zipCode = form.querySelector('#zipCode').value.trim();
    const password = form.querySelector('#signupPassword').value;
    const confirmPassword = form.querySelector('#confirmPassword').value;
    const agreeTerms = form.querySelector('#agreeTerms').checked;

    // Validation
    if (!firstName || !lastName || !contactNumber || !email || !street || !zone || !city || !province || !zipCode || !password || !confirmPassword) {
      this.showError('Please fill in all required fields');
      return;
    }

    // Validate contact number (11 digits)
    if (!/^[0-9]{11}$/.test(contactNumber)) {
      this.showError('Contact number must be 11 digits');
      return;
    }

    // Validate zip code (4 digits)
    if (!/^[0-9]{4}$/.test(zipCode)) {
      this.showError('Zip code must be 4 digits');
      return;
    }

    if (password !== confirmPassword) {
      this.showError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      this.showError('Please agree to the terms and conditions');
      return;
    }

    // Create user data object
    const userData = {
      firstName,
      middleName,
      lastName,
      contactNumber,
      email,
      address: {
        street,
        zone,
        city,
        province,
        zipCode
      },
      password
    };

    // Simulate signup (replace with actual registration)
    console.log('Signup attempt:', userData);

    // Show success message
    this.showSuccess('Account created successfully!');

    // Switch to login after successful signup
    setTimeout(() => {
      this.showLoginForm();
      this.showSuccess('Account created! Please log in with your credentials.');
    }, 1500);
  }

  updateNavbarForLoggedInUser(email) {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
      authButtons.innerHTML = `
        <div class="user-menu">
          <button class="btn-user dropdown-toggle" id="userDropdown">
            <i class="fas fa-user-circle"></i>
            <span class="user-email">${email}</span>
          </button>
          <div class="dropdown-menu">
            <a href="#" class="dropdown-item">My Profile</a>
            <a href="#" class="dropdown-item">My Orders</a>
            <a href="#" class="dropdown-item">Settings</a>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item" id="logoutBtn">Logout</a>
          </div>
        </div>
      `;

      // Setup dropdown
      const dropdown = document.getElementById('userDropdown');
      if (dropdown) {
        dropdown.addEventListener('click', () => {
          dropdown.parentElement.classList.toggle('show');
        });
      }

      // Setup logout
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleLogout();
        });
      }
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-menu')) {
        document.querySelector('.user-menu')?.classList.remove('show');
      }
    });
  }

  handleLogout() {
    // Show logout message
    this.showSuccess('Logged out successfully');

    // Reset navbar
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
      authButtons.innerHTML = `
        <a href="#" data-auth="login" class="btn-login">Log In</a>
        <a href="#" data-auth="signup" class="btn-signup">Sign Up</a>
      `;
    }
  }

  resetForms() {
    // Clear all form fields
    document.getElementById('loginForm')?.reset();
    document.getElementById('signupForm')?.reset();

    // Reset to login form
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

  showError(message) {
    this.showNotification(message, 'error');
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

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

// Initialize when DOM is ready - robust initialization
function initAuthModal() {
  if (!window.authModalManager) {
    window.authModalManager = new AuthModalManager();
    console.log('AuthModalManager initialized');
  }
}

// Try multiple initialization strategies to handle different loading scenarios
if (document.readyState === 'loading') {
  // Document still loading, wait for DOMContentLoaded
  document.addEventListener('DOMContentLoaded', initAuthModal);
} else {
  // Document already loaded (interactive or complete)
  // Initialize immediately
  initAuthModal();
}

// Fallback: Also listen to DOMContentLoaded in case readyState changes
document.addEventListener('DOMContentLoaded', initAuthModal);

// Extra fallback for file:// protocol issues
if (document.readyState === 'complete') {
  setTimeout(initAuthModal, 100);
}
