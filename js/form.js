/**
 * Formulario de contacto
 *
 * Por ahora el envío está simulado en el frontend (enviarConsulta) para poder
 * probar la UI sin backend. Cuando tengas el endpoint listo (Spring Boot u
 * otro), reemplazá SOLO el contenido de la función enviarConsulta por un
 * fetch real. Ejemplo dejado comentado más abajo.
 */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmit');

  const fields = {
    nombre: form.querySelector('#nombre'),
    email: form.querySelector('#email'),
    telefono: form.querySelector('#telefono'),
    mensaje: form.querySelector('#mensaje'),
  };

  function setError(field, hasError) {
    field.closest('.form__field').classList.toggle('has-error', hasError);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validate() {
    let valid = true;

    const nombreOk = fields.nombre.value.trim().length > 1;
    setError(fields.nombre, !nombreOk);
    valid = valid && nombreOk;

    const emailOk = isValidEmail(fields.email.value.trim());
    setError(fields.email, !emailOk);
    valid = valid && emailOk;

    const mensajeOk = fields.mensaje.value.trim().length > 4;
    setError(fields.mensaje, !mensajeOk);
    valid = valid && mensajeOk;

    return valid;
  }

  /**
   * Simula el envío de la consulta. Devuelve una Promise, igual que haría
   * un fetch real, para que el resto del código no cambie cuando conectes
   * el backend.
   */
  function enviarConsulta(data) {
    console.log('Consulta a enviar:', data);
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ok: true }), 700);
    });

    /* ---- Ejemplo para conectar a un backend Spring Boot ----
    return fetch('/api/consultas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((res) => {
      if (!res.ok) throw new Error('Error de red');
      return res.json();
    });
    ------------------------------------------------------------ */
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validate()) {
      statusEl.textContent = 'Revisá los campos marcados antes de enviar.';
      statusEl.classList.add('is-error');
      return;
    }

    const data = {
      nombre: fields.nombre.value.trim(),
      email: fields.email.value.trim(),
      telefono: fields.telefono.value.trim(),
      mensaje: fields.mensaje.value.trim(),
    };

    submitBtn.disabled = true;
    statusEl.classList.remove('is-error');
    statusEl.textContent = 'Enviando...';

    enviarConsulta(data)
      .then(() => {
        statusEl.textContent = '¡Gracias! Recibí tu consulta y te voy a contactar a la brevedad.';
        form.reset();
      })
      .catch(() => {
        statusEl.textContent = 'Hubo un problema al enviar tu consulta. Probá de nuevo o escribime por WhatsApp.';
        statusEl.classList.add('is-error');
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });

  // Limpia el estado de error apenas el usuario empieza a corregir
  Object.values(fields).forEach((field) => {
    field.addEventListener('input', () => setError(field, false));
  });
})();
