const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

const projectDetails = {
  donation: `
    <h2> 🔧The Problem to solve:</h2>
    <p> Many creators in Latin America face difficulties receiving donations from their supporters.
      Mercado Pago works well locally but becomes impractical when dealing with different countries, currencies, and regional restrictions.
      PayPal can work as an international alternative, but it's not always the ideal first choice in the region, and platforms like Cafecito, Ko-fi, or Buy Me a Coffee don't adapt well to the Latin American reality.</p>
    <h2>💡 The Solution:</h2>
     <p>
      I built a platform specifically for this context. The interface is simple and straightforward:
    </p>
    <ul>
      <li>If the donor is in the same country as the creator, they can donate easily via Mercado Pago.</li>
      <li>If the donor is abroad or Mercado Pago isn't an option, PayPal is offered as an immediate alternative.</li>
    </ul>
    <h3>Additional Features:</h3>
    <p>
      Beyond handling donations, the platform allows creators to visually highlight:
    </p>
    <ul>
      <li>Content they are offering in exchange for support</li>
      <li>Links to their social media, projects, or any relevant external pages</li>
    </ul>
    <p>
      All in one place—designed to make supporting creators in South America easier.
    </p>

  `,
  mpfans: `
    <h2>🔧 The Problem to Solve:</h2>
  <p>
    Mercado Pago is the most popular payment solution in South America, but its API can be frustrating to use.
    The official documentation is often unclear, and community support is limited compared to more global payment tools like Stripe or PayPal.
    This creates a steep learning curve for developers—especially those just starting out—who want to integrate it into their websites or apps.
  </p>
  <h2>💡 The Solution:</h2>
  <p>
    MP Fans is an alternative and growing documentation site focused on making the Mercado Pago API more approachable and developer-friendly.
    It provides practical resources to help developers of all levels work with the API efficiently.
  </p>
  <ul>
    <li>Step-by-step video tutorials</li>
    <li>Clear and concise technical articles</li>
    <li>Support and comunnity behind</li>
  </ul>
  <p>
    The goal is to make the power of Mercado Pago accessible to more developers across South America, by offering the kind of guidance and examples the official docs often lack.
  </p>
  `,
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