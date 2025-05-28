const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

const projectDetails = {
  donation: `
    <h2>Donation Website</h2>
    <p>Plataforma para que creadores en Latinoamérica puedan recibir donaciones vía Mercado Pago y PayPal, resolviendo barreras comunes.</p>
    <ul>
      <li>Soporte exclusivo para fans</li>
      <li>Interfaz sencilla</li>
      <li>Implementación segura y confiable</li>
    </ul>

  `,
  mpfans: `
    <h2>Mp Fans</h2>
    <p>Proyecto para fans que permite interactuar con contenido exclusivo y novedades sobre sus creadores favoritos.</p>
    <ul>
      <li>Integración con redes sociales</li>
      <li>Actualizaciones en tiempo real</li>
      <li>Diseño responsivo</li>
    </ul>
  `,
  // Agrega otros proyectos aquí, p.ej. 'project3': 'contenido'
};

// Abrir modal al click en botón Read More
document.querySelectorAll('.read-more-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const projectKey = btn.getAttribute('data-project');
    modalBody.innerHTML = projectDetails[projectKey] || '<p>Información no disponible.</p>';
    modal.classList.remove('hidden');
  });
});

// Cerrar modal
modalClose.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Cerrar modal al hacer click fuera del contenido
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.add('hidden');
  }
});