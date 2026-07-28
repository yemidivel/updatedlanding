(function () {
  'use strict';

  var API_BASE_URL = CONFIG.API_BASE_URL;

  var form = document.getElementById('forgotForm');
  var emailInput = document.getElementById('forgotEmail');
  var submitBtn = document.getElementById('submitBtn');
  var formMessage = document.getElementById('formMessage');
  var emailError = document.getElementById('emailError');

  function showFieldError(input, message) {
    input.classList.add('error');
    if (emailError) emailError.textContent = message;
  }

  function clearFieldError(input) {
    input.classList.remove('error');
    if (emailError) emailError.textContent = '';
  }

  function showFormMessage(type, text) {
    formMessage.textContent = text;
    formMessage.className = 'form-message visible ' + type;
  }

  function hideFormMessage() {
    formMessage.className = 'form-message';
    formMessage.textContent = '';
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateForm() {
    var valid = true;
    var email = emailInput.value.trim();

    clearFieldError(emailInput);

    if (!email) {
      showFieldError(emailInput, 'Please enter your email address.');
      if (valid) emailInput.focus();
      valid = false;
    } else if (!validateEmail(email)) {
      showFieldError(emailInput, 'Please enter a valid email address.');
      if (valid) emailInput.focus();
      valid = false;
    }

    return valid;
  }

  if (emailInput) {
    emailInput.addEventListener('input', function () {
      clearFieldError(emailInput);
      hideFormMessage();
    });
    emailInput.addEventListener('focus', function () {
      clearFieldError(emailInput);
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideFormMessage();

      if (!validateForm()) return;

      var email = emailInput.value.trim();

      submitBtn.disabled = true;
      submitBtn.classList.add('loading');

      fetch(API_BASE_URL + '/api/auth/forgotPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');

          showFormMessage('success', 'A reset code has been sent to your email. Redirecting...');

          setTimeout(function () {
            window.location.href = '/reset-password?email=' + encodeURIComponent(email);
          }, 1500);
        })
        .catch(function (err) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
          console.error('Forgot password error:', err);
          showFormMessage('error', 'Could not connect to server. Please try again.');
        });
    });
  }
})();
