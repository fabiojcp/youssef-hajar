document.addEventListener('DOMContentLoaded', () => {

  const ROTATE_DURATION = 850;
  const pages = document.querySelectorAll('.page');
  const dots = document.querySelectorAll('.nav-dot');
  const totalPages = pages.length;
  let currentPage = 0;
  let isTransitioning = false;

  /* ==========================================
     Initialize transforms
     ========================================== */
  function initPages() {
    pages.forEach((page, i) => {
      page.style.transform = i === 0 ? 'rotateY(0deg)' : 'rotateY(90deg)';
    });
  }
  initPages();

  /* ==========================================
     Navigate to page
     ========================================== */
  function goToPage(target) {
    if (target === currentPage || isTransitioning || target < 0 || target >= totalPages) return;

    isTransitioning = true;

    pages.forEach((page, i) => {
      if (i < target) {
        page.style.transform = 'rotateY(90deg)';
      } else if (i > target) {
        page.style.transform = 'rotateY(-90deg)';
      } else {
        page.style.transform = 'rotateY(0deg)';
      }
    });

    updateDots(target);

    setTimeout(() => {
      currentPage = target;
      isTransitioning = false;
      triggerCountersIfNeeded(target);
    }, ROTATE_DURATION);
  }

  /* ==========================================
     Navigation Dots
     ========================================== */
  function updateDots(index) {
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.dataset.page);
      goToPage(target);
    });
  });

  /* ==========================================
     Mouse Wheel
     ========================================== */
  let wheelTimeout;
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (isTransitioning) return;

    if (wheelTimeout) return;
    wheelTimeout = setTimeout(() => { wheelTimeout = null; }, ROTATE_DURATION + 200);

    if (e.deltaY > 30) {
      goToPage(currentPage + 1);
    } else if (e.deltaY < -30) {
      goToPage(currentPage - 1);
    }
  }, { passive: false });

  /* ==========================================
     Keyboard
     ========================================== */
  window.addEventListener('keydown', (e) => {
    if (isTransitioning) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      goToPage(currentPage + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPage(currentPage - 1);
    }
  });

  /* ==========================================
     Touch Swipe
     ========================================== */
  let touchStartY = 0;
  let touchStartX = 0;

  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (isTransitioning) return;
    const dy = touchStartY - e.changedTouches[0].clientY;
    const dx = touchStartX - e.changedTouches[0].clientX;
    const absDy = Math.abs(dy);
    const absDx = Math.abs(dx);

    if (Math.max(absDy, absDx) < 50) return;

    if (absDy > absDx) {
      if (dy > 0) goToPage(currentPage + 1);
      else goToPage(currentPage - 1);
    } else {
      if (dx > 0) goToPage(currentPage + 1);
      else goToPage(currentPage - 1);
    }
  });

  /* ==========================================
     Hero Typing Effect
     ========================================== */
  const typeWord = document.getElementById('typeWord');
  const words = [
    'perspectiva',
    'ansiedade',
    'relação com o mundo',
    'produtividade',
    'equilíbrio',
    'vida',
    'autoestima',
    'bem-estar',
    'saúde mental',
    'futuro'
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 70;
  const deleteSpeed = 35;
  const pauseAfterType = 1800;
  const pauseAfterDelete = 300;

  function typeLoop() {
    const current = words[wordIndex];

    if (!isDeleting) {
      typeWord.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeLoop, pauseAfterType);
        return;
      }

      setTimeout(typeLoop, typeSpeed);
    } else {
      typeWord.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeLoop, pauseAfterDelete);
        return;
      }

      setTimeout(typeLoop, deleteSpeed);
    }
  }

  if (typeWord && words.length > 0) {
    setTimeout(typeLoop, 800);
  }

  /* ==========================================
     Testimonial Carousel
     ========================================== */
  const testCards = document.querySelectorAll('.test-card');
  const testDots = document.querySelectorAll('.test__dot');
  let testIndex = 0;
  let testInterval;

  function showTest(index) {
    testCards.forEach(t => t.classList.remove('active'));
    testDots.forEach(d => d.classList.remove('active'));
    testCards[index].classList.add('active');
    testDots[index].classList.add('active');
    testIndex = index;
  }

  testDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(dot.dataset.test);
      showTest(idx);
      resetTestAutoplay();
    });
  });

  function resetTestAutoplay() {
    clearInterval(testInterval);
    if (testCards.length > 1) {
      testInterval = setInterval(() => {
        showTest((testIndex + 1) % testCards.length);
      }, 4500);
    }
  }

  if (testCards.length > 1) {
    testInterval = setInterval(() => {
      showTest((testIndex + 1) % testCards.length);
    }, 4500);
  }

  /* ==========================================
     Counter Animation
     ========================================== */
  const statNumbers = document.querySelectorAll('.sobre__stat-number[data-count]');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated || statNumbers.length === 0) return;
    countersAnimated = true;

    statNumbers.forEach(el => {
      const target = parseInt(el.dataset.count);
      const suffix = target >= 300 ? '+' : '';
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  function triggerCountersIfNeeded(pageIndex) {
    if (pageIndex === 1) {
      setTimeout(animateCounters, ROTATE_DURATION + 100);
    }
  }

  /* ==========================================
     Prevent clicks during transition
     ========================================== */
  document.addEventListener('click', (e) => {
    if (isTransitioning) {
      const link = e.target.closest('a');
      if (link) e.preventDefault();
    }
  }, true);

});
