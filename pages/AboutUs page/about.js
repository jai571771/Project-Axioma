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

  // Smooth scroll links
  const viewStoryBtn = document.getElementById('view-story-btn');
  if (viewStoryBtn) {
    viewStoryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#story');
      if (target) {
        lenis.scrollTo(target, { duration: 1.5, offset: -80 });
      }
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
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Hero Stagger Fade-In
  const heroTL = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });
  
  heroTL.from('.header', { y: -50, opacity: 0, delay: 0.2 })
        .from('.section-label', { y: 20, opacity: 0 }, '-=1')
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
      scrub: true
    }
  });

  // Parallax Effect on MVV Image
  gsap.to('#mvv-img', {
    yPercent: 8,
    ease: 'none',
    scrollTrigger: {
      trigger: '#story',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });

  // Stagger entry reveal for MVV cards
  gsap.fromTo('.mvv-card', 
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: 0.15,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#story',
        start: 'top 75%'
      }
    }
  );

  // Stagger entry reveal for Philosophy pillars
  gsap.from('.pillar-card', {
    y: 55,
    opacity: 0,
    stagger: 0.15,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#pillars-grid',
      start: 'top 85%'
    }
  });


  /* ==========================================================================
     4. STATISTICS COUNTER ANIMATION (SECTION 3)
     ========================================================================== */
  const statsCard = document.getElementById('stats-card');
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statsCard && statNumbers.length > 0) {
    gsap.from(statsCard, {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#stats',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    statNumbers.forEach(num => {
      const target = parseInt(num.getAttribute('data-target'));
      let counterObj = { val: 0 };
      
      gsap.to(counterObj, {
        val: target,
        duration: 2.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#stats',
          start: 'top 85%',
          once: true
        },
        onUpdate: () => {
          num.textContent = Math.ceil(counterObj.val) + '+';
        }
      });
    });
  }


  /* ==========================================================================
     5. TEAM EXPAND CARDS LOGIC (SECTION 5)
     ========================================================================== */
  const teamCards = document.querySelectorAll('.team-card');
  
  teamCards.forEach(card => {
    const expandBtn = card.querySelector('.team-expand-btn');
    if (expandBtn) {
      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent closing card from bubbling
        
        const isExpanded = card.classList.contains('expanded');
        
        // Collapse all other expanded cards first
        teamCards.forEach(c => {
          if (c !== card) c.classList.remove('expanded');
        });

        // Toggle state
        if (isExpanded) {
          card.classList.remove('expanded');
        } else {
          card.classList.add('expanded');
        }
        
        // Recalculate heights for scroll-trigger offsets
        ScrollTrigger.refresh();
      });
    }
  });

  // Stagger reveal team cards
  gsap.from('.team-card', {
    y: 50,
    opacity: 0,
    stagger: 0.12,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.team-grid',
      start: 'top 85%'
    }
  });


  /* ==========================================================================
     6. FINAL CTA FLOATING EFFECT (SECTION 6)
     ========================================================================== */
  gsap.from('.cta-banner', {
    scale: 0.95,
    opacity: 0,
    duration: 1.5,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#cta',
      start: 'top 90%'
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

  // Refresh ScrollTrigger on window load to recalculate element offsets
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

});
