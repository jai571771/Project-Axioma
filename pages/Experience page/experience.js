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
  const enterExperienceBtn = document.getElementById('enter-experience-btn');
  if (enterExperienceBtn) {
    enterExperienceBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#timeline');
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
    yPercent: 15,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });


  /* ==========================================================================
     4. STATISTICS COUNTER ANIMATION (SECTION 2)
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
     5. INTERACTIVE TIMELINE CONTROLS (SECTION 3)
     ========================================================================== */
  const timelineNodes = document.querySelectorAll('.timeline-node');
  const timelineCards = document.querySelectorAll('.timeline-detail-card');
  const progressLine = document.getElementById('timeline-progress-line');

  // Helper to calculate milestone progress percent
  const getProgressPercentage = (index, total) => {
    if (total <= 1) return 0;
    return (index / (total - 1)) * 100;
  };

  const updateTimelineState = (activeIndex) => {
    // Update active class on nodes
    timelineNodes.forEach((node, idx) => {
      if (idx <= activeIndex) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    // Update active class on text cards with transition
    timelineCards.forEach((card, idx) => {
      if (idx === activeIndex) {
        card.classList.add('active');
        // Smoothly fade in content details
        gsap.fromTo(card.children, 
          { y: 15, opacity: 0 }, 
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out' }
        );
      } else {
        card.classList.remove('active');
      }
    });

    // Update SVG progress line width
    const percentage = getProgressPercentage(activeIndex, timelineNodes.length);
    gsap.to(progressLine, {
      attr: { x2: `${percentage}%` },
      duration: 0.6,
      ease: 'power3.out'
    });
  };

  // Click handler on nodes
  timelineNodes.forEach((node, index) => {
    node.addEventListener('click', () => {
      updateTimelineState(index);
    });
  });

  // Stagger entry animation for timeline nodes
  gsap.from('.timeline-node', {
    y: 30,
    opacity: 0,
    stagger: 0.15,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.timeline-track',
      start: 'top 80%'
    }
  });


  /* ==========================================================================
     6. INTERACTIVE SHOWCASE IMAGES SWITCHER (SECTION 4)
     ========================================================================== */
  const showcaseCards = document.querySelectorAll('.showcase-card');
  const showcaseImg = document.getElementById('showcase-img');

  showcaseCards.forEach(card => {
    card.addEventListener('click', () => {
      // Deactivate all cards
      showcaseCards.forEach(c => c.classList.remove('active'));
      // Activate clicked card
      card.classList.add('active');

      // Crossfade right image
      const newImgPath = card.getAttribute('data-img');
      
      gsap.to(showcaseImg, {
        opacity: 0.2,
        scale: 0.98,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          showcaseImg.src = newImgPath;
          gsap.to(showcaseImg, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out'
          });
        }
      });
    });
  });

  // Scroll parallax on showcase visual container
  gsap.to('#showcase-visual img', {
    yPercent: 8,
    ease: 'none',
    scrollTrigger: {
      trigger: '#showcase',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });


  /* ==========================================================================
     7. ARCHITECTURAL GALLERY LIGHTBOX (SECTION 5)
     ========================================================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxType = document.getElementById('lightbox-type');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let activeGalleryIndex = 0;
  const galleryData = Array.from(galleryItems).map(item => ({
    img: item.getAttribute('data-img'),
    title: item.getAttribute('data-title'),
    type: item.getAttribute('data-type')
  }));

  const openLightbox = (index) => {
    activeGalleryIndex = index;
    const data = galleryData[activeGalleryIndex];
    
    lightboxImg.src = data.img;
    lightboxCaption.textContent = data.title;
    lightboxType.textContent = data.type;
    
    lightbox.classList.add('open');
    lenis.stop(); // Stop scrolling
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lenis.start(); // Resume scrolling
  };

  const navigateLightbox = (direction) => {
    activeGalleryIndex = (activeGalleryIndex + direction + galleryData.length) % galleryData.length;
    const data = galleryData[activeGalleryIndex];
    
    // Smooth transition between image swaps inside Lightbox
    gsap.fromTo(lightboxImg, { opacity: 0.3, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
    lightboxImg.src = data.img;
    lightboxCaption.textContent = data.title;
    lightboxType.textContent = data.type;
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  if (lightboxPrev && lightboxNext) {
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));
  }

  // Keyboard navigation inside lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // Stagger fade-up reveal for gallery grid items
  gsap.from('.gallery-item', {
    y: 50,
    opacity: 0,
    stagger: 0.15,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.gallery-grid',
      start: 'top 85%'
    }
  });


  /* ==========================================================================
     8. CINEMATIC VIDEO JOURNEY MODAL (SECTION 1)
     ========================================================================== */
  const playJourneyBtn = document.getElementById('btn-play-journey');
  const videoModal = document.getElementById('video-modal');
  const modalClose = document.getElementById('modal-close');

  if (playJourneyBtn && videoModal && modalClose) {
    playJourneyBtn.addEventListener('click', () => {
      videoModal.classList.add('open');
      lenis.stop();
    });

    modalClose.addEventListener('click', () => {
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
     9. PHILOSOPHY QUOTE ANIMATION (SECTION 6)
     ========================================================================== */
  const philosophyQuote = document.getElementById('philosophy-quote');
  if (philosophyQuote) {
    gsap.from(philosophyQuote, {
      opacity: 0,
      y: 40,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#philosophy',
        start: 'top 80%'
      }
    });
    gsap.from('.philosophy-desc', {
      opacity: 0,
      y: 20,
      duration: 1.2,
      delay: 0.4,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#philosophy',
        start: 'top 80%'
      }
    });
  }


  /* ==========================================================================
     10. TEAM EXPAND CARDS LOGIC (SECTION 7)
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
     11. FINAL CTA FLOATING EFFECT (SECTION 8)
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

});
