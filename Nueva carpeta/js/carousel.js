/**
 * Carrousel de testimonios
 * - Funciona con cualquier cantidad de <li class="testimonial"> dentro de #carouselTrack
 * - Muestra 1 tarjeta por vez en mobile y 3 en desktop (ver CSS: .testimonial flex-basis)
 * - Autoplay + flechas + dots, con pausa al pasar el mouse / foco por teclado
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
  let visibleCount = getVisibleCount();
  let pageCount = getPageCount();
  let autoplayTimer = null;

  function getVisibleCount() {
    return window.matchMedia('(min-width: 760px)').matches ? 3 : 1;
  }

  function getPageCount() {
    return Math.max(1, slides.length - visibleCount + 1);
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pageCount; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel__dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Ir al testimonio ' + (i + 1));
      dot.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(dot);
    }
    updateDots();
  }

  function updateDots() {
    Array.from(dotsWrap.children).forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
    });
  }

  function update() {
    const slideWidth = slides[0].getBoundingClientRect().width + slideGap();
    track.style.transform = `translateX(-${current * slideWidth}px)`;
    updateDots();
  }

  function slideGap() {
    // margin left+right definido en CSS (.testimonial { margin: 0 10px }) => 20px total
    return 20;
  }

  function goTo(index, userTriggered) {
    current = ((index % pageCount) + pageCount) % pageCount;
    update();
    if (userTriggered) restartAutoplay();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  nextBtn.addEventListener('click', () => goTo(current + 1, true));
  prevBtn.addEventListener('click', () => goTo(current - 1, true));

  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  root.addEventListener('focusin', stopAutoplay);
  root.addEventListener('focusout', startAutoplay);

  // Swipe táctil básico
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) {
      delta < 0 ? goTo(current + 1, true) : goTo(current - 1, true);
    }
  });

  window.addEventListener('resize', () => {
    const newVisible = getVisibleCount();
    if (newVisible !== visibleCount) {
      visibleCount = newVisible;
      pageCount = getPageCount();
      current = Math.min(current, pageCount - 1);
      buildDots();
    }
    update();
  });

  buildDots();
  update();
  startAutoplay();
})();
