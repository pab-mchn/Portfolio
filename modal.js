const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    const projectsNavLinks = document.querySelectorAll('a[href="#projects"]');

    // Abrir modal con Projects
    projectsNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.remove('hidden');
      });
    });


    // Cerrar modal
    modalClose.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });