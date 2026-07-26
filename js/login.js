(function () {
  'use strict';

  const API_BASE_URL = CONFIG.API_BASE_URL;

  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const capsWarning = document.getElementById('capsWarning');
  const submitBtn = document.getElementById('submitBtn');
  const formMessage = document.getElementById('formMessage');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

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
  function showFieldError(input, message) {
    input.classList.add('error');
    var el = input.id === 'email' ? emailError : passwordError;
    if (el) el.textContent = message;
  }

  function clearFieldError(input) {
    input.classList.remove('error');
    var el = input.id === 'email' ? emailError : passwordError;
    if (el) el.textContent = '';
  }

  function showFormMessage(type, text) {
    formMessage.textContent = text;
    formMessage.className = 'form-message visible ' + type;
  }

  function hideFormMessage() {
    formMessage.className = 'form-message';
    formMessage.textContent = '';
  }

  function setLoading(on) {
    submitBtn.disabled = on;
    submitBtn.classList.toggle('loading', !!on);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ----- Check for reset password success ----- */
  (function () {
    try {
      var params = new URLSearchParams(window.location.search || '');
      if (params.get('reset') === '1') {
        showFormMessage('success', 'Password updated. You can now sign in.');
      }
    } catch (e) {}
  })();

  function validateForm() {
    var valid = true;
    var email = emailInput.value.trim();
    var password = passwordInput.value;

    clearFieldError(emailInput);
    clearFieldError(passwordInput);

    if (!email) {
      showFieldError(emailInput, 'Please enter your email.');
      if (valid) emailInput.focus();
      valid = false;
    } else if (!validateEmail(email)) {
      showFieldError(emailInput, 'Please enter a valid email address.');
      if (valid) emailInput.focus();
      valid = false;
    }

    if (!password) {
      showFieldError(passwordInput, 'Please enter your password.');
      if (valid) passwordInput.focus();
      valid = false;
    }

    return valid;
  }

  /* ----- Clear errors on input ----- */
  [emailInput, passwordInput].forEach(function (input) {
    if (!input) return;
    input.addEventListener('input', function () {
      clearFieldError(input);
      hideFormMessage();
    });
    input.addEventListener('focus', function () {
      clearFieldError(input);
    });
  });

  /* ----- Form submit ----- */
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideFormMessage();

      if (!validateForm()) return;

      var email = emailInput.value.trim();
      var password = passwordInput.value;

      setLoading(true);

      fetch(API_BASE_URL + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
      })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
        .then(function (result) {
          setLoading(false);

          if (!result.ok || !result.data.success) {
            var msg = (result.data && result.data.message) ? result.data.message : 'Invalid email or password.';
            showFormMessage('error', msg);
            return;
          }

          /* Store token and user data */
          if (result.data.token) {
            localStorage.setItem('sellsync_token', result.data.token);
          }
          if (result.data.data) {
            localStorage.setItem('sellsync_user', JSON.stringify(result.data.data));
          }

          showFormMessage('success', 'Signed in. Redirecting...');
          setTimeout(function () {
            window.location.href = '/coming-soon';
          }, 800);
        })
        .catch(function (err) {
          setLoading(false);
          console.error('Login error:', err);
          showFormMessage('error', 'Could not connect to server. Please try again.');
        });
    });
  }
})();
