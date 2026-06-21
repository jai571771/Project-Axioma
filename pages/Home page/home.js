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
     3. VIDEO MODAL SHOWREEL LOGIC
     ========================================================================== */
  const videoModal = document.getElementById('video-modal');
  const playShowreelBtn = document.getElementById('btn-play-showreel');
  const modalCloseBtn = document.getElementById('modal-close');

  if (videoModal && playShowreelBtn && modalCloseBtn) {
    playShowreelBtn.addEventListener('click', () => {
      videoModal.classList.add('open');
      lenis.stop();
    });

    modalCloseBtn.addEventListener('click', () => {
      videoModal.classList.remove('open');
      lenis.start();
    });

    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        videoModal.classList.remove('open');
        lenis.start();
      }
    });
  }


  /* ==========================================================================
     4. GSAP HERO INTRO ANIMATION (no ScrollTrigger — just page load)
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
     5. INTERSECTION OBSERVER — scroll-reveal for all cards & sections
        Uses CSS classes: .reveal-item (initial hidden), .is-revealed (visible)
     ========================================================================== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target); // fire once only
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  // Observe all project cards with staggered delay
  document.querySelectorAll('.project-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.12}s`;
    el.classList.add('reveal-item');
    revealObserver.observe(el);
  });

  // Observe all service cards with staggered delay
  document.querySelectorAll('.service-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.12}s`;
    el.classList.add('reveal-item');
    revealObserver.observe(el);
  });

  // Observe about-content
  document.querySelectorAll('#about-content').forEach(el => {
    el.classList.add('reveal-item', 'reveal-from-right');
    revealObserver.observe(el);
  });

  // Observe stats card
  document.querySelectorAll('#stats-card').forEach(el => {
    el.classList.add('reveal-item');
    revealObserver.observe(el);
  });

  // Observe CTA banner
  document.querySelectorAll('.cta-banner').forEach(el => {
    el.classList.add('reveal-item');
    revealObserver.observe(el);
  });


  /* ==========================================================================
     6. STATISTICS COUNTER ANIMATION
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'));
            let counterObj = { val: 0 };
            gsap.to(counterObj, {
              val: target,
              duration: 2.5,
              ease: 'power2.out',
              onUpdate: () => {
                num.textContent = Math.ceil(counterObj.val) + '+';
              }
            });
          });
          counterObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.getElementById('stats');
    if (statsSection) counterObserver.observe(statsSection);
  }


  /* ==========================================================================
     7. PLANT SVG FLOAT ANIMATION
     ========================================================================== */
  gsap.to('.plant-decor', {
    y: -8, x: 4, rotation: '-=2',
    duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });

});
