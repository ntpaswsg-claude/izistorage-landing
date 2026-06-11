(function () {
  'use strict';

  // ── CONFIGURACIÓN — editar aquí antes de publicar ─────────────────────────
  var WHATSAPP_PHONE = '56912345678'; // Sin + ni espacios (ej: 56912345678)
  var WHATSAPP_MSG   = 'Hola, me interesa conocer más sobre IZI Storage para mi operación. ¿Pueden darme más información?';
  // ─────────────────────────────────────────────────────────────────────────

  function showToast(message, type) {
    type = type || 'success';
    var container = document.getElementById('toast-container');
    if (!container) return;

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    var iconSvg = type === 'success'
      ? '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 5v4m0 2.5h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

    toast.innerHTML =
      '<div class="toast-icon">' + iconSvg + '</div>' +
      '<div class="toast-message">' + message + '</div>';

    container.appendChild(toast);

    setTimeout(function () {
      toast.classList.add('toast-exit');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 320);
    }, 4500);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function clearErrors(form) {
    form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(function (field) {
      field.classList.remove('error');
    });
    form.querySelectorAll('.form-error').forEach(function (el) {
      el.classList.remove('visible');
    });
  }

  function setError(field, errorEl) {
    field.classList.add('error');
    if (errorEl) errorEl.classList.add('visible');
  }

  function validateForm(form) {
    var valid = true;
    clearErrors(form);

    var required = form.querySelectorAll('[required]');
    required.forEach(function (field) {
      var val = field.value.trim();
      if (!val) {
        var errorEl = form.querySelector('[data-error="' + field.name + '"]');
        setError(field, errorEl);
        valid = false;
      }
    });

    var emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(function (field) {
      if (field.value.trim() && !validateEmail(field.value)) {
        var errorEl = form.querySelector('[data-error="' + field.name + '"]');
        setError(field, errorEl);
        valid = false;
      }
    });

    return valid;
  }

  function resetForm(form) {
    form.reset();
    clearErrors(form);
  }

  function initDemoForm(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(form)) return;

      var submitBtn = form.querySelector('[type="submit"]');
      var originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      setTimeout(function () {
        resetForm(form);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        showToast(
          'Solicitud recibida. El equipo de IZI Storage podrá contactarte para revisar tu operación.',
          'success'
        );
      }, 800);
    });
  }

  function initWhatsAppButtons() {
    document.querySelectorAll('[data-action="whatsapp"]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var url = 'https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(WHATSAPP_MSG);
        window.open(url, '_blank', 'noopener,noreferrer');
        showToast(
          'Te redirigimos a WhatsApp. El equipo estará disponible para orientarte.',
          'success'
        );
      });

      if (btn.getAttribute('role') === 'link') {
        btn.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
          }
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form[data-form]').forEach(function (form) {
      var type = form.getAttribute('data-form');
      if (type === 'demo' || type === 'contact') {
        initDemoForm(form);
      }
    });

    initWhatsAppButtons();
  });
})();
