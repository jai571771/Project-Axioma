document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. LENIS SMOOTH SCROLLING INITIALIZATION
     ========================================================================== */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Register GSAP plugins first
  gsap.registerPlugin(ScrollTrigger);

  // Properly integrate Lenis with GSAP ScrollTrigger via scrollerProxy
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: document.body.style.transform ? 'transform' : 'fixed'
  });

  // Bind Lenis scroll event to GSAP's ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

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
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
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
     3. GSAP INTRO & SCROLL TRIGGER ANIMATIONS
     ========================================================================== */

  // Hero Stagger Fade-In (Page Load)
  const heroTL = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });
  
  heroTL.from('.header', { y: -50, opacity: 0, delay: 0.2 })
        .from('.hero-title span', { y: 40, opacity: 0, stagger: 0.2 }, '-=1.2')
        .from('.hero-content .section-desc', { y: 30, opacity: 0 }, '-=1')
        .from('.hero-actions', { y: 30, opacity: 0 }, '-=1')
        .from('.hero-visual', { scale: 0.95, opacity: 0, ease: 'power3.out' }, '-=1.2');

  // Parallax Effect on Hero Image
  gsap.to('#hero-img', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      scroller: document.body
    }
  });

  // Parallax Effect on Why Choose Us Image
  gsap.to('#choose-img', {
    yPercent: 8,
    ease: 'none',
    scrollTrigger: {
      trigger: '#why-choose-us',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      scroller: document.body
    }
  });

  // Stagger entry reveal for Services grid
  gsap.from('.service-card', {
    y: 50,
    opacity: 0,
    stagger: 0.15,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#services-grid',
      start: 'top 85%',
      once: true,
      scroller: document.body,
      toggleActions: 'play none none none'
    }
  });

  // Stagger entry reveal for Process steps
  gsap.from('.timeline-step', {
    y: 40,
    opacity: 0,
    stagger: 0.15,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#timeline-container',
      start: 'top 80%',
      once: true,
      scroller: document.body,
      toggleActions: 'play none none none'
    }
  });

  // Scroll Reveal for Choose Us Content
  gsap.from('#choose-content', {
    x: 40,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#why-choose-us',
      start: 'top 75%',
      once: true,
      scroller: document.body,
      toggleActions: 'play none none none'
    }
  });

  // Stagger reveal Choose points
  gsap.from('.choosecard', {
    y: 30,
    opacity: 0,
    stagger: 0.12,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.choose-points-grid',
      start: 'top 85%',
      once: true,
      scroller: document.body,
      toggleActions: 'play none none none'
    }
  });

  // Stagger reveal CTA banner
  gsap.from('.cta-banner', {
    scale: 0.95,
    opacity: 0,
    duration: 1.5,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#cta',
      start: 'top 90%',
      once: true,
      scroller: document.body,
      toggleActions: 'play none none none'
    }
  });

  // Micro floating animation on plant SVG
  gsap.to('.plant-decor', {
    y: -8,
    x: 4,
    rotation: '-=2',
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  // Refresh ScrollTrigger after Lenis is fully ready
  ScrollTrigger.addEventListener('refresh', () => lenis.resize());
  ScrollTrigger.refresh();

});
