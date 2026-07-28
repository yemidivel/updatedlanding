(function () {
  'use strict';

  var API_BASE_URL = CONFIG.API_BASE_URL;

  var form = document.getElementById('resetForm');
  var emailInput = document.getElementById('resetEmail');
  var codeInput = document.getElementById('resetCode');
  var passwordInput = document.getElementById('newPassword');
  var togglePassword = document.getElementById('togglePassword');
  var capsWarning = document.getElementById('capsWarning');
  var submitBtn = document.getElementById('submitBtn');
  var formMessage = document.getElementById('formMessage');
  var emailError = document.getElementById('emailError');
  var codeError = document.getElementById('codeError');
  var passwordError = document.getElementById('passwordError');

  var params = new URLSearchParams(window.location.search);
  var prefillEmail = params.get('email');
  if (prefillEmail && emailInput) {
    emailInput.value = prefillEmail;
  }

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function () {
      var isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      togglePassword.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      togglePassword.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
      togglePassword.title = isPassword ? 'Hide password' : 'Show password';
    });
  }

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
    var email = emailInput.value.trim();
    var code = codeInput.value.trim();
    var password = passwordInput.value;

    clearFieldError(emailInput, emailError);
    clearFieldError(codeInput, codeError);
    clearFieldError(passwordInput, passwordError);

    if (!email) {
      showFieldError(emailInput, emailError, 'Please enter your email address.');
      if (valid) emailInput.focus();
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError(emailInput, emailError, 'Please enter a valid email address.');
      if (valid) emailInput.focus();
      valid = false;
    }

    if (!code) {
      showFieldError(codeInput, codeError, 'Please enter the 6-digit code.');
      if (valid) codeInput.focus();
      valid = false;
    } else if (!/^\d{6}$/.test(code)) {
      showFieldError(codeInput, codeError, 'Code must be exactly 6 digits.');
      if (valid) codeInput.focus();
      valid = false;
    }

    if (!password) {
      showFieldError(passwordInput, passwordError, 'Please enter a new password.');
      if (valid) passwordInput.focus();
      valid = false;
    } else if (password.length < 8) {
      showFieldError(passwordInput, passwordError, 'Password must be at least 8 characters.');
      if (valid) passwordInput.focus();
      valid = false;
    }

    return valid;
  }

  if (emailInput) {
    emailInput.addEventListener('input', function () {
      clearFieldError(emailInput, emailError);
      hideFormMessage();
    });
  }

  if (codeInput) {
    codeInput.addEventListener('input', function () {
      clearFieldError(codeInput, codeError);
      hideFormMessage();
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', function () {
      clearFieldError(passwordInput, passwordError);
      hideFormMessage();
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideFormMessage();

      if (!validateForm()) return;

      submitBtn.disabled = true;
      submitBtn.classList.add('loading');

      fetch(API_BASE_URL + '/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.value.trim(),
          code: codeInput.value.trim(),
          password: passwordInput.value
        })
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
            showFormMessage('error', data.message || 'Failed to reset password. The code may have expired.');
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
