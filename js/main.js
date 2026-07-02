document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     Custom Cursor
     ========================================== */
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');

  if (cursor && follower && window.innerWidth > 1024) {
    let mx = 0, my = 0;
    let cx = 0, cy = 0;
    let fx = 0, fy = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    const updateCursor = () => {
      cx += (mx - cx) * 0.3;
      cy += (my - cy) * 0.3;
      fx += (mx - fx) * 0.08;
      fy += (my - fy) * 0.08;

      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';

      requestAnimationFrame(updateCursor);
    };

    updateCursor();

    const hoverables = document.querySelectorAll('a, button, .expertise-card, .approach__card, .pillar, .testimonials__dot');

    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.background = '#C9A96E';
        follower.style.width = '60px';
        follower.style.height = '60px';
        follower.style.borderColor = 'rgba(201, 169, 110, 0.6)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '8px';
        cursor.style.height = '8px';
        cursor.style.background = '#C9A96E';
        follower.style.width = '40px';
        follower.style.height = '40px';
        follower.style.borderColor = 'rgba(201, 169, 110, 0.4)';
      });
    });
  }

  /* ==========================================
     Header Scroll
     ========================================== */
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScroll = y;
  }, { passive: true });

  /* ==========================================
     Mobile Menu
     ========================================== */
  const burger = document.getElementById('burger');
  const nav = document.querySelector('.header__nav');
  const menuLinks = document.querySelectorAll('.header__link, .header__cta');

  if (burger) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ==========================================
     Hero Word Rotation
     ========================================== */
  const swapWords = document.querySelectorAll('.hero__swap-word');
  let currentWord = 0;

  if (swapWords.length > 0) {
    setInterval(() => {
      swapWords[currentWord].classList.remove('active');
      currentWord = (currentWord + 1) % swapWords.length;
      swapWords[currentWord].classList.add('active');
    }, 2800);
  }

  /* ==========================================
     Testimonial Carousel
     ========================================== */
  const testimonials = document.querySelectorAll('.testimonial');
  const dots = document.querySelectorAll('.testimonials__dot');
  let currentTestimonial = 0;
  let testimonialInterval;

  function showTestimonial(index) {
    testimonials.forEach(t => t.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentTestimonial = index;
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index);
      showTestimonial(index);
      resetTestimonialAutoplay();
    });
  });

  function resetTestimonialAutoplay() {
    clearInterval(testimonialInterval);
    testimonialInterval = setInterval(() => {
      showTestimonial((currentTestimonial + 1) % testimonials.length);
    }, 5000);
  }

  if (testimonials.length > 1) {
    testimonialInterval = setInterval(() => {
      showTestimonial((currentTestimonial + 1) % testimonials.length);
    }, 5000);
  }

  /* ==========================================
     Counter Animation
     ========================================== */
  const stats = document.querySelectorAll('.about__stat-number[data-count]');
  let countersAnimated = false;

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 1800;
    const start = performance.now();
    const suffix = target >= 300 ? '+' : '';

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        stats.forEach(animateCounter);
      }
    });
  }, { threshold: 0.5 });

  if (stats.length > 0) {
    counterObserver.observe(stats[0].closest('.about__stats'));
  }

  /* ==========================================
     Scroll Reveal
     ========================================== */
  const reveals = document.querySelectorAll(
    '.about__grid, .expertise__header, .expertise-card, .approach__grid, .testimonial-card, .cta__inner, .tag, .section__title'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });

  /* ==========================================
     Smooth scroll for anchor links
     ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ==========================================
     Active nav link on scroll
     ========================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

});
