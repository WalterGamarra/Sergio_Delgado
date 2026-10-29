/**
 * Carrusel de testimonios
 * - Muestra siempre 1 testimonio por vez
 * - Funciona con cualquier cantidad de testimonios
 * - Autoplay
 * - Flechas
 * - Dots
 * - Swipe táctil
 * - Pausa al pasar el mouse o usar teclado
 */
(function () {
  const root = document.getElementById('carousel');

  if (!root) return;

  const track = document.getElementById('carouselTrack');
  const slides = Array.from(track.children);

  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsWrap = document.getElementById('carouselDots');

  const AUTOPLAY_MS = 6000;

  let current = 0;
  let autoplayTimer = null;

  /* -------------------------
     Crear dots
  ------------------------- */

  function buildDots() {
    dotsWrap.innerHTML = '';

    slides.forEach((_, index) => {
      const dot = document.createElement('button');

      dot.className = 'carousel__dot';
      dot.type = 'button';

      dot.setAttribute(
        'aria-label',
        'Ir al testimonio ' + (index + 1)
      );

      dot.addEventListener('click', () => {
        goTo(index, true);
      });

      dotsWrap.appendChild(dot);
    });

    updateDots();
  }

  /* -------------------------
     Actualizar dots
  ------------------------- */

  function updateDots() {
    Array.from(dotsWrap.children).forEach((dot, index) => {
      dot.classList.toggle(
        'is-active',
        index === current
      );
    });
  }

  /* -------------------------
     Obtener ancho del slide
  ------------------------- */

  function getSlideWidth() {
    const slide = slides[0];

    if (!slide) return 0;

    const styles = window.getComputedStyle(slide);

    const marginLeft =
      parseFloat(styles.marginLeft) || 0;

    const marginRight =
      parseFloat(styles.marginRight) || 0;

    return (
      slide.getBoundingClientRect().width +
      marginLeft +
      marginRight
    );
  }

  /* -------------------------
     Actualizar posición
  ------------------------- */

  function update() {
    const slideWidth = getSlideWidth();

    track.style.transform =
      `translateX(-${current * slideWidth}px)`;

    updateDots();
  }

  /* -------------------------
     Ir a un testimonio
  ------------------------- */

  function goTo(index, userTriggered = false) {
    const total = slides.length;

    current = ((index % total) + total) % total;

    update();

    if (userTriggered) {
      restartAutoplay();
    }
  }

  /* -------------------------
     Siguiente / anterior
  ------------------------- */

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  /* -------------------------
     Autoplay
  ------------------------- */

  function startAutoplay() {
    stopAutoplay();

    autoplayTimer = setInterval(
      next,
      AUTOPLAY_MS
    );
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  /* -------------------------
     Flechas
  ------------------------- */

  nextBtn.addEventListener('click', () => {
    goTo(current + 1, true);
  });

  prevBtn.addEventListener('click', () => {
    goTo(current - 1, true);
  });

  /* -------------------------
     Pausar con mouse
  ------------------------- */

  root.addEventListener(
    'mouseenter',
    stopAutoplay
  );

  root.addEventListener(
    'mouseleave',
    startAutoplay
  );

  /* -------------------------
     Pausar con teclado
  ------------------------- */

  root.addEventListener(
    'focusin',
    stopAutoplay
  );

  root.addEventListener(
    'focusout',
    startAutoplay
  );

  /* -------------------------
     Swipe táctil
  ------------------------- */

  let touchStartX = 0;

  track.addEventListener(
    'touchstart',
    (event) => {
      touchStartX =
        event.touches[0].clientX;
    },
    { passive: true }
  );

  track.addEventListener(
    'touchend',
    (event) => {
      const touchEndX =
        event.changedTouches[0].clientX;

      const delta =
        touchEndX - touchStartX;

      if (Math.abs(delta) > 40) {
        if (delta < 0) {
          goTo(current + 1, true);
        } else {
          goTo(current - 1, true);
        }
      }
    },
    { passive: true }
  );

  /* -------------------------
     Resize
  ------------------------- */

  window.addEventListener(
    'resize',
    update
  );

  /* -------------------------
     Inicializar
  ------------------------- */

  buildDots();
  update();
  startAutoplay();
})();