// Auth Form Validation
document.addEventListener('DOMContentLoaded', function() {
  
  // Signup Form Validation
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    initSignupValidation(signupForm);
  }
  
  // Login Form Validation
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    initLoginValidation(loginForm);
  }

  // Password toggle functionality
  initPasswordToggles();
});

// Initialize password visibility toggles
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.toggle-password');
  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const input = this.parentElement.querySelector('input');
      const icon = this.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });
}

// Validation helper functions
function showError(input, errorId, message) {
  input.classList.add('error');
  input.classList.remove('valid');
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
}

function showSuccess(input, errorId) {
  input.classList.remove('error');
  input.classList.add('valid');
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }
}

function clearValidation(input, errorId) {
  input.classList.remove('error', 'valid');
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }
}

// Validation rules
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhoneNumber(phone) {
  // Must start with 09 and be exactly 11 digits
  const phoneRegex = /^09\d{9}$/;
  return phoneRegex.test(phone);
}

function isValidPassword(password) {
  return password.length >= 8;
}

// Signup Form Validation
function initSignupValidation(form) {
  const fields = {
    firstName: { required: true, errorId: 'firstNameError', message: 'First name is required' },
    lastName: { required: true, errorId: 'lastNameError', message: 'Last name is required' },
    contactNumber: { required: true, errorId: 'contactNumberError', message: 'Contact number is required' },
    province: { required: true, errorId: 'provinceError', message: 'Province is required' },
    city: { required: true, errorId: 'cityError', message: 'City is required' },
    zipCode: { required: true, errorId: 'zipCodeError', message: 'Zip code is required' },
    zoneStreet: { required: true, errorId: 'zoneStreetError', message: 'Zone & Street is required' },
    email: { required: true, errorId: 'emailError', message: 'Email is required' },
    password: { required: true, errorId: 'passwordError', message: 'Password is required' },
    confirmPassword: { required: true, errorId: 'confirmPasswordError', message: 'Please confirm your password' }
  };

  // Real-time validation on blur
  Object.keys(fields).forEach(fieldName => {
    const input = document.getElementById(fieldName);
    if (input) {
      input.addEventListener('blur', function() {
        validateSignupField(fieldName, this, fields[fieldName]);
      });

      input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          validateSignupField(fieldName, this, fields[fieldName]);
        }
      });
    }
  });

  // Form submit validation
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;

    // Validate all fields
    Object.keys(fields).forEach(fieldName => {
      const input = document.getElementById(fieldName);
      if (input) {
        if (!validateSignupField(fieldName, input, fields[fieldName])) {
          isValid = false;
        }
      }
    });

    // Validate terms checkbox
    const terms = document.getElementById('terms');
    const termsError = document.getElementById('termsError');
    if (terms && !terms.checked) {
      if (termsError) {
        termsError.textContent = 'You must agree to the Terms of Service and Privacy Policy';
        termsError.classList.add('show');
      }
      isValid = false;
    } else if (termsError) {
      termsError.textContent = '';
      termsError.classList.remove('show');
    }

    if (isValid) {
      // Form is valid, you can submit
      alert('Account created successfully!');
      form.reset();
      // Clear all validation states
      Object.keys(fields).forEach(fieldName => {
        const input = document.getElementById(fieldName);
        if (input) {
          clearValidation(input, fields[fieldName].errorId);
        }
      });
    } else {
      // Scroll to first error
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }
  });
}

function validateSignupField(fieldName, input, config) {
  const value = input.value.trim();

  // Check required
  if (config.required && !value) {
    showError(input, config.errorId, config.message);
    return false;
  }

  // Field-specific validation
  switch (fieldName) {
    case 'email':
      if (value && !isValidEmail(value)) {
        showError(input, config.errorId, 'Please enter a valid email address (e.g., example@email.com)');
        return false;
      }
      break;

    case 'contactNumber':
      if (value && !isValidPhoneNumber(value)) {
        showError(input, config.errorId, 'Phone number must start with 09 and be exactly 11 digits');
        return false;
      }
      break;

    case 'password':
      if (value && !isValidPassword(value)) {
        showError(input, config.errorId, 'Password must be at least 8 characters long');
        return false;
      }
      // Re-validate confirm password if password changes
      const confirmPassword = document.getElementById('confirmPassword');
      if (confirmPassword && confirmPassword.value) {
        validateSignupField('confirmPassword', confirmPassword, {
          required: true,
          errorId: 'confirmPasswordError',
          message: 'Please confirm your password'
        });
      }
      break;

    case 'confirmPassword':
      const password = document.getElementById('password');
      if (password && value !== password.value) {
        showError(input, config.errorId, 'Passwords do not match');
        return false;
      }
      break;

    case 'zipCode':
      if (value && !/^\d+$/.test(value)) {
        showError(input, config.errorId, 'Zip code must contain only numbers');
        return false;
      }
      break;
  }

  // If we get here, the field is valid
  if (value) {
    showSuccess(input, config.errorId);
  } else {
    clearValidation(input, config.errorId);
  }
  return true;
}

// Login Form Validation
function initLoginValidation(form) {
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');

  // Real-time validation on blur
  if (emailInput) {
    emailInput.addEventListener('blur', function() {
      validateLoginEmail(this);
    });

    emailInput.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        validateLoginEmail(this);
      }
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('blur', function() {
      validateLoginPassword(this);
    });

    passwordInput.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        validateLoginPassword(this);
      }
    });
  }

  // Form submit validation
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;

    if (!validateLoginEmail(emailInput)) {
      isValid = false;
    }

    if (!validateLoginPassword(passwordInput)) {
      isValid = false;
    }

    if (isValid) {
      // Form is valid, you can submit
      alert('Login successful!');
      form.reset();
      clearValidation(emailInput, 'loginEmailError');
      clearValidation(passwordInput, 'loginPasswordError');
    } else {
      // Focus on first error
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.focus();
      }
    }
  });
}

function validateLoginEmail(input) {
  const value = input.value.trim();

  if (!value) {
    showError(input, 'loginEmailError', 'Email address is required');
    return false;
  }

  if (!isValidEmail(value)) {
    showError(input, 'loginEmailError', 'Please enter a valid email address');
    return false;
  }

  showSuccess(input, 'loginEmailError');
  return true;
}

function validateLoginPassword(input) {
  const value = input.value.trim();

  if (!value) {
    showError(input, 'loginPasswordError', 'Password is required');
    return false;
  }

  showSuccess(input, 'loginPasswordError');
  return true;
}
