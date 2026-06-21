document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. LENIS SMOOTH SCROLLING INITIALIZATION
     ========================================================================== */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Scroll to top button helper
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      lenis.scrollTo(0, { duration: 1.5 });
    });
  }


  /* ==========================================================================
     2. NAVIGATION & NAVBAR LOGIC
     ========================================================================== */
  const header = document.getElementById('header');
  lenis.on('scroll', ({ scroll }) => {
    if (scroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Hamburger Toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  if (hamburgerBtn && mobileNavOverlay) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileNavOverlay.classList.contains('open');
      if (isOpen) {
        mobileNavOverlay.classList.remove('open');
        hamburgerBtn.classList.remove('open');
        lenis.start();
      } else {
        mobileNavOverlay.classList.add('open');
        hamburgerBtn.classList.add('open');
        lenis.stop();
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavOverlay.classList.remove('open');
        hamburgerBtn.classList.remove('open');
        lenis.start();
      });
    });
  }


  /* ==========================================================================
     3. GSAP HERO INTRO ANIMATION (no ScrollTrigger — just page load)
     ========================================================================== */
  gsap.registerPlugin(ScrollTrigger);

  const heroTL = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });
  heroTL
    .from('.header',                    { y: -50, opacity: 0, delay: 0.2 })
    .from('.hero-title span',           { y: 40,  opacity: 0, stagger: 0.2 }, '-=1.2')
    .from('.hero-content .section-desc',{ y: 30,  opacity: 0 }, '-=1')
    .from('.hero-actions',              { y: 30,  opacity: 0 }, '-=1')
    .from('.hero-visual',               { scale: 0.95, opacity: 0 }, '-=1.2');


  /* ==========================================================================
     4. INTERSECTION OBSERVER — scroll-reveal for all cards & sections
     ========================================================================== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  // Observe service cards with staggered delay
  document.querySelectorAll('.service-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.12}s`;
    el.classList.add('reveal-item');
    revealObserver.observe(el);
  });

  // Observe timeline steps with staggered delay
  document.querySelectorAll('.timeline-step').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
    el.classList.add('reveal-item');
    revealObserver.observe(el);
  });

  // Observe choose visual
  document.querySelectorAll('#choose-visual').forEach(el => {
    el.classList.add('reveal-item');
    revealObserver.observe(el);
  });

  // Observe choose content
  document.querySelectorAll('#choose-content').forEach(el => {
    el.classList.add('reveal-item', 'reveal-from-right');
    revealObserver.observe(el);
  });

  // Observe choose cards
  document.querySelectorAll('.choosecard').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
    el.classList.add('reveal-item');
    revealObserver.observe(el);
  });

  // Observe CTA banner
  document.querySelectorAll('.cta-banner').forEach(el => {
    el.classList.add('reveal-item');
    revealObserver.observe(el);
  });


  /* ==========================================================================
     5. PLANT SVG FLOAT ANIMATION
     ========================================================================== */
  gsap.to('.plant-decor', {
    y: -8, x: 4, rotation: '-=2',
    duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });

});
