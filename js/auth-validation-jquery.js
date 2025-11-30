$(document).ready(function() {
  const $signupForm = $('#signupForm');
  const $loginForm = $('#loginForm');

  if ($signupForm.length) {
    initSignupValidation($signupForm);
  }

  if ($loginForm.length) {
    initLoginValidation($loginForm);
  }

  initPasswordToggles();
});

function initPasswordToggles() {
  $('.toggle-password').on('click', function() {
    const $input = $(this).parent().find('input');
    const $icon = $(this).find('i');

    if ($input.attr('type') === 'password') {
      $input.attr('type', 'text');
      $icon.removeClass('fa-eye').addClass('fa-eye-slash');
    } else {
      $input.attr('type', 'password');
      $icon.removeClass('fa-eye-slash').addClass('fa-eye');
    }
  });
}

function showError($input, errorId, message) {
  $input.addClass('error').removeClass('valid');
  const $errorElement = $('#' + errorId);
  if ($errorElement.length) {
    $errorElement.text(message).addClass('show');
  }
}

function showSuccess($input, errorId) {
  $input.removeClass('error').addClass('valid');
  const $errorElement = $('#' + errorId);
  if ($errorElement.length) {
    $errorElement.text('').removeClass('show');
  }
}

function clearValidation($input, errorId) {
  $input.removeClass('error valid');
  const $errorElement = $('#' + errorId);
  if ($errorElement.length) {
    $errorElement.text('').removeClass('show');
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhoneNumber(phone) {
  const phoneRegex = /^09\d{9}$/;
  return phoneRegex.test(phone);
}

function isValidPassword(password) {
  return password.length >= 8;
}

function initSignupValidation($form) {
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

  Object.keys(fields).forEach(function(fieldName) {
    const $input = $('#' + fieldName);
    if ($input.length) {
      $input.on('blur', function() {
        validateSignupField(fieldName, $(this), fields[fieldName]);
      });

      $input.on('input', function() {
        if ($(this).hasClass('error')) {
          validateSignupField(fieldName, $(this), fields[fieldName]);
        }
      });
    }
  });

  $form.on('submit', function(e) {
    e.preventDefault();
    let isValid = true;

    Object.keys(fields).forEach(function(fieldName) {
      const $input = $('#' + fieldName);
      if ($input.length) {
        if (!validateSignupField(fieldName, $input, fields[fieldName])) {
          isValid = false;
        }
      }
    });

    const $terms = $('#terms');
    const $termsError = $('#termsError');
    if ($terms.length && !$terms.is(':checked')) {
      if ($termsError.length) {
        $termsError.text('You must agree to the Terms of Service and Privacy Policy').addClass('show');
      }
      isValid = false;
    } else if ($termsError.length) {
      $termsError.text('').removeClass('show');
    }

    if (isValid) {
      alert('Account created successfully!');
      $form[0].reset();
      Object.keys(fields).forEach(function(fieldName) {
        const $input = $('#' + fieldName);
        if ($input.length) {
          clearValidation($input, fields[fieldName].errorId);
        }
      });
    } else {
      const $firstError = $form.find('.error').first();
      if ($firstError.length) {
        $('html, body').animate({
          scrollTop: $firstError.offset().top - 100
        }, 600);
        $firstError.focus();
      }
    }
  });
}

function validateSignupField(fieldName, $input, config) {
  const value = $input.val().trim();

  if (config.required && !value) {
    showError($input, config.errorId, config.message);
    return false;
  }

  switch (fieldName) {
    case 'email':
      if (value && !isValidEmail(value)) {
        showError($input, config.errorId, 'Please enter a valid email address (e.g., example@email.com)');
        return false;
      }
      break;

    case 'contactNumber':
      if (value && !isValidPhoneNumber(value)) {
        showError($input, config.errorId, 'Phone number must start with 09 and be exactly 11 digits');
        return false;
      }
      break;

    case 'password':
      if (value && !isValidPassword(value)) {
        showError($input, config.errorId, 'Password must be at least 8 characters long');
        return false;
      }
      const $confirmPassword = $('#confirmPassword');
      if ($confirmPassword.length && $confirmPassword.val()) {
        validateSignupField('confirmPassword', $confirmPassword, {
          required: true,
          errorId: 'confirmPasswordError',
          message: 'Please confirm your password'
        });
      }
      break;

    case 'confirmPassword':
      const $password = $('#password');
      if ($password.length && value !== $password.val()) {
        showError($input, config.errorId, 'Passwords do not match');
        return false;
      }
      break;

    case 'zipCode':
      if (value && !/^\d+$/.test(value)) {
        showError($input, config.errorId, 'Zip code must contain only numbers');
        return false;
      }
      break;
  }

  if (value) {
    showSuccess($input, config.errorId);
  } else {
    clearValidation($input, config.errorId);
  }
  return true;
}

function initLoginValidation($form) {
  const $emailInput = $('#loginEmail');
  const $passwordInput = $('#loginPassword');

  if ($emailInput.length) {
    $emailInput.on('blur', function() {
      validateLoginEmail($(this));
    });

    $emailInput.on('input', function() {
      if ($(this).hasClass('error')) {
        validateLoginEmail($(this));
      }
    });
  }

  if ($passwordInput.length) {
    $passwordInput.on('blur', function() {
      validateLoginPassword($(this));
    });

    $passwordInput.on('input', function() {
      if ($(this).hasClass('error')) {
        validateLoginPassword($(this));
      }
    });
  }

  $form.on('submit', function(e) {
    e.preventDefault();
    let isValid = true;

    if (!validateLoginEmail($emailInput)) {
      isValid = false;
    }

    if (!validateLoginPassword($passwordInput)) {
      isValid = false;
    }

    if (isValid) {
      alert('Login successful!');
      $form[0].reset();
      clearValidation($emailInput, 'loginEmailError');
      clearValidation($passwordInput, 'loginPasswordError');
    } else {
      const $firstError = $form.find('.error').first();
      if ($firstError.length) {
        $firstError.focus();
      }
    }
  });
}

function validateLoginEmail($input) {
  const value = $input.val().trim();

  if (!value) {
    showError($input, 'loginEmailError', 'Email address is required');
    return false;
  }

  if (!isValidEmail(value)) {
    showError($input, 'loginEmailError', 'Please enter a valid email address');
    return false;
  }

  showSuccess($input, 'loginEmailError');
  return true;
}

function validateLoginPassword($input) {
  const value = $input.val().trim();

  if (!value) {
    showError($input, 'loginPasswordError', 'Password is required');
    return false;
  }

  showSuccess($input, 'loginPasswordError');
  return true;
}

