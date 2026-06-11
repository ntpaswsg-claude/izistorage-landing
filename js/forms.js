/* forms.js — IZI Storage v2
   Formulario de demo, validación, toast, WhatsApp
   EDITAR: WHATSAPP_PHONE y WHATSAPP_MSG
*/
(function () {
  'use strict';

  /* ===== CONFIGURACIÓN ===== */
  var WHATSAPP_PHONE = '56912345678'; // <— Cambia por el número real
  var WHATSAPP_MSG   = 'Hola%2C+quiero+saber+m%C3%A1s+sobre+IZI+Storage';

  /* ===== UTILIDADES ===== */
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

  function showToast(msg, isError) {
    var toast = $('#form-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.toggle('toast--error', !!isError);
    toast.classList.add('toast--visible');
    setTimeout(function () {
      toast.classList.remove('toast--visible');
    }, 4000);
  }

  function isValidEmail(val) {
    return /^[^s@]+@[^s@]+.[^s@]+$/.test(val);
  }

  function markError(input, msg) {
    input.classList.add('input--error');
    var existing = input.parentNode.querySelector('.form-error-msg');
    if (!existing) {
      var el = document.createElement('span');
      el.className = 'form-error-msg';
      el.setAttribute('role', 'alert');
      el.textContent = msg;
      input.parentNode.appendChild(el);
    }
  }

  function clearError(input) {
    input.classList.remove('input--error');
    var err = input.parentNode.querySelector('.form-error-msg');
    if (err) err.remove();
  }

  /* ===== FORMULARIO DEMO ===== */
  var form = $('#demo-form');
  if (form) {
    // Clear on input
    form.querySelectorAll('.form-input').forEach(function (inp) {
      inp.addEventListener('input', function () { clearError(inp); });
      inp.addEventListener('change', function () { clearError(inp); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;

      var nombre   = $('#f-nombre');
      var empresa  = $('#f-empresa');
      var email    = $('#f-email');
      var whatsapp = $('#f-whatsapp');
      var op       = $('#f-operacion');
      var prob     = $('#f-problema');

      [nombre, empresa, email, whatsapp, op, prob].forEach(clearError);

      if (!nombre.value.trim()) {
        markError(nombre, 'Ingresa tu nombre'); ok = false;
      }
      if (!empresa.value.trim()) {
        markError(empresa, 'Ingresa el nombre de tu empresa'); ok = false;
      }
      if (!email.value.trim() || !isValidEmail(email.value)) {
        markError(email, 'Ingresa un correo válido'); ok = false;
      }
      if (!whatsapp.value.trim()) {
        markError(whatsapp, 'Ingresa tu WhatsApp'); ok = false;
      }
      if (!op.value) {
        markError(op, 'Selecciona tu tipo de operación'); ok = false;
      }
      if (!prob.value) {
        markError(prob, 'Selecciona tu problema principal'); ok = false;
      }

      if (!ok) {
        showToast('Completa los campos obligatorios.', true);
        return;
      }

      // Build WhatsApp message
      var web     = $('#f-web')     ? ($('#f-web').value     || '—') : '—';
      var pedidos = $('#f-pedidos') ? ($('#f-pedidos').value || '—') : '—';
      var skus    = $('#f-skus')    ? ($('#f-skus').value    || '—') : '—';
      var plat    = $('#f-plataforma') ? ($('#f-plataforma').value || '—') : '—';

      var msg = encodeURIComponent(
        'Hola, quiero solicitar una demo de IZI Storage.

' +
        '▪ Nombre: '    + nombre.value.trim()   + '
' +
        '▪ Empresa: '   + empresa.value.trim()  + '
' +
        '▪ Email: '     + email.value.trim()    + '
' +
        '▪ WhatsApp: '  + whatsapp.value.trim() + '
' +
        '▪ Operación: ' + op.value              + '
' +
        '▪ Problema: '  + prob.value            + '
' +
        '▪ Web/IG: '    + web                   + '
' +
        '▪ Pedidos/mes: ' + pedidos             + '
' +
        '▪ SKUs: '      + skus                  + '
' +
        '▪ Plataforma: '+ plat
      );

      showToast('✓ Enviado. Te contactaremos pronto.');

      // Disable button briefly
      var btn = form.querySelector('.form-submit');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Enviado ✓';
        setTimeout(function () {
          btn.disabled = false;
          btn.textContent = 'Solicitar demo';
        }, 3000);
      }

      // Open WhatsApp
      setTimeout(function () {
        window.open('https://wa.me/' + WHATSAPP_PHONE + '?text=' + msg, '_blank', 'noopener,noreferrer');
      }, 500);

      form.reset();
      var optFields = $('#optional-fields');
      var optBtn    = $('#toggle-optional');
      if (optFields) {
        optFields.setAttribute('aria-hidden', 'true');
        optFields.style.maxHeight = '';
      }
      if (optBtn) {
        optBtn.setAttribute('aria-expanded', 'false');
        optBtn.textContent = '+ Datos adicionales (opcionales)';
      }
    });
  }

  /* ===== WHATSAPP LINKS ===== */
  var waUrl = 'https://wa.me/' + WHATSAPP_PHONE + '?' + WHATSAPP_MSG;
  $$('#hero-whatsapp, #whatsapp-float, a[href*="WHATSAPP_PHONE"]').forEach(function (el) {
    el.href = waUrl;
  });

  // Also update footer WA link
  $$('a[href*="wa.me/WHATSAPP_PHONE"]').forEach(function (el) {
    el.href = 'https://wa.me/' + WHATSAPP_PHONE;
  });

}());
