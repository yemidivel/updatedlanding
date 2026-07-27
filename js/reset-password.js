(function () {
  'use strict';

  const API_BASE_URL = CONFIG.API_BASE_URL;

  const form = document.getElementById('newPasswordForm');
  const passwordInput = document.getElementById('newPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const togglePassword = document.getElementById('togglePassword');
  const capsWarning = document.getElementById('capsWarning');
  const submitBtn = document.getElementById('submitBtn');
  const formMessage = document.getElementById('formMessage');
  const passwordError = document.getElementById('passwordError');
  const confirmPasswordError = document.getElementById('confirmPasswordError');

  /* ----- Get token from URL ----- */
  const token = new URLSearchParams(window.location.search).get('token');

  if (!token) {
    showFormMessage('error', 'Invalid or missing reset link. Please request a new one.');
    if (form) form.style.display = 'none';
    return;
  }

  /* ----- Show / hide password ----- */
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function () {
      var isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      togglePassword.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      togglePassword.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
      togglePassword.title = isPassword ? 'Hide password' : 'Show password';
    });
  }

  /* ----- Caps Lock warning ----- */
  function checkCapsLock(e) {
    if (!e.getModifierState) return;
    var on = e.getModifierState('CapsLock');
    capsWarning.classList.toggle('visible', on);
  }

  if (passwordInput && capsWarning) {
    passwordInput.addEventListener('keydown', checkCapsLock);
    passwordInput.addEventListener('keyup', checkCapsLock);
    passwordInput.addEventListener('focus', checkCapsLock);
    passwordInput.addEventListener('blur', function () {
      capsWarning.classList.remove('visible');
    });
  }

  /* ----- Validation helpers ----- */
  function showFieldError(input, errorElement, message) {
    input.classList.add('error');
    if (errorElement) errorElement.textContent = message;
  }

  function clearFieldError(input, errorElement) {
    input.classList.remove('error');
    if (errorElement) errorElement.textContent = '';
  }

  function showFormMessage(type, text) {
    formMessage.textContent = text;
    formMessage.className = 'form-message visible ' + type;
  }

  function hideFormMessage() {
    formMessage.className = 'form-message';
    formMessage.textContent = '';
  }

  function validateForm() {
    var valid = true;
    var password = passwordInput.value;
    var confirmPassword = confirmPasswordInput.value;

    clearFieldError(passwordInput, passwordError);
    clearFieldError(confirmPasswordInput, confirmPasswordError);

    if (!password) {
      showFieldError(passwordInput, passwordError, 'Please enter a new password.');
      if (valid) passwordInput.focus();
      valid = false;
    } else if (password.length < 8) {
      showFieldError(passwordInput, passwordError, 'Password must be at least 8 characters.');
      if (valid) passwordInput.focus();
      valid = false;
    }

    if (!confirmPassword) {
      showFieldError(confirmPasswordInput, confirmPasswordError, 'Please confirm your password.');
      if (valid) confirmPasswordInput.focus();
      valid = false;
    } else if (password !== confirmPassword) {
      showFieldError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match.');
      if (valid) confirmPasswordInput.focus();
      valid = false;
    }

    return valid;
  }

  /* ----- Clear errors on input ----- */
  if (passwordInput) {
    passwordInput.addEventListener('input', function () {
      clearFieldError(passwordInput, passwordError);
      hideFormMessage();
    });
    passwordInput.addEventListener('focus', function () {
      clearFieldError(passwordInput, passwordError);
    });
  }

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', function () {
      clearFieldError(confirmPasswordInput, confirmPasswordError);
      hideFormMessage();
    });
    confirmPasswordInput.addEventListener('focus', function () {
      clearFieldError(confirmPasswordInput, confirmPasswordError);
    });
  }

  /* ----- Form submit — call backend API ----- */
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideFormMessage();

      if (!validateForm()) return;

      submitBtn.disabled = true;
      submitBtn.classList.add('loading');

      fetch(API_BASE_URL + '/api/auth/reset-password?token=' + encodeURIComponent(token), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput.value })
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');

          if (data.success) {
            showFormMessage('success', 'Password updated successfully! Redirecting to sign in...');
            setTimeout(function () {
              window.location.href = '/login?reset=1';
            }, 2000);
          } else {
            showFormMessage('error', data.message || 'Failed to reset password. The link may have expired.');
          }
        })
        .catch(function (err) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
          console.error('Reset password error:', err);
          showFormMessage('error', 'Could not connect to server. Please try again.');
        });
    });
  }
})();
