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
  const viewProjectsBtn = document.getElementById('view-projects-btn');
  if (viewProjectsBtn) {
    viewProjectsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#projects-section');
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
        .from('.hero-visual', { scale: 0.95, opacity: 0, ease: 'power3.out' }, '-=1.2')
        .from('.hero-visual-badge', { y: 20, opacity: 0, ease: 'power3.out' }, '-=0.8');

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


  /* ==========================================================================
     4. CATEGORY FILTER MATCHING & INDICATOR
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const filterIndicator = document.getElementById('filter-indicator');

  // Align sliding background indicator to the active button
  const positionIndicator = (activeBtn) => {
    if (!filterIndicator || !activeBtn) return;
    const parentRect = activeBtn.parentElement.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    
    gsap.to(filterIndicator, {
      left: btnRect.left - parentRect.left,
      width: btnRect.width,
      duration: 0.5,
      ease: 'power3.out'
    });
  };

  // Set initial indicator position
  const activeBtn = document.querySelector('.filter-btn.active');
  if (activeBtn) {
    // Wait a brief tick for render layout calculation
    setTimeout(() => positionIndicator(activeBtn), 100);
  }

  // Handle resizing to keep indicator aligned
  window.addEventListener('resize', () => {
    const currentActive = document.querySelector('.filter-btn.active');
    if (currentActive) positionIndicator(currentActive);
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states on button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update sliding indicator position
      positionIndicator(btn);

      // Perform Grid filtering
      const filterValue = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          // Card matches filter
          card.classList.remove('filtered-out');
          
          gsap.fromTo(card.querySelector('.card-inner'), 
            { opacity: 0, scale: 0.95, y: 15 },
            { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: 'all' }
          );
        } else {
          // Card is filtered out
          gsap.to(card.querySelector('.card-inner'), {
            opacity: 0,
            scale: 0.95,
            y: 15,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
              card.classList.add('filtered-out');
            }
          });
        }
      });

      // Refresh ScrollTrigger to adjust trigger offsets for layout change
      setTimeout(() => ScrollTrigger.refresh(), 600);
    });
  });


  /* ==========================================================================
     5. PROJECT GRID INTERACTIVE MODAL (GRID CARDS)
     ========================================================================== */
  const projectModal = document.getElementById('project-modal');
  const projectModalClose = document.getElementById('project-modal-close');
  
  // Modal Fields
  const modalImg = document.getElementById('modal-project-img');
  const modalBadge = document.getElementById('modal-project-badge');
  const modalTitle = document.getElementById('modal-project-title');
  const modalLocation = document.getElementById('modal-project-location');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalYear = document.getElementById('modal-project-year');
  const modalScale = document.getElementById('modal-project-scale');
  const modalArchitect = document.getElementById('modal-project-architect');

  // 6 Projects Data
  const projectsData = [
    {
      title: "Villa Vista",
      category: "Residential",
      location: "Alibaug, India",
      year: "2023",
      scale: "6,200 SF",
      architect: "Daniel Roberts",
      img: "../Experience page/assets/gallery_exterior.png",
      desc: "Perched on a serene coastal plot in Alibaug, Villa Vista is a masterpiece of geometric contrast. The home features double-cantilevered structural slabs that float effortlessly over the coastline, blending raw local stone facades with sweeping panoramic floor-to-ceiling glass paneling."
    },
    {
      title: "Minimalist Sanctuary",
      category: "Interior",
      location: "Mumbai, India",
      year: "2024",
      scale: "3,800 SF",
      architect: "Sophia Martinez",
      img: "../Experience page/assets/gallery_interior.png",
      desc: "Located in the heart of Mumbai, this luxury penthouse acts as an oasis from metropolitan chaos. Fusing raw, textured plaster walls with warm gold/champagne metallic hardware details, the space emphasizes deep, concealed warm lighting systems and organic wood finishes."
    },
    {
      title: "The Flow Museum",
      category: "Cultural",
      location: "Kyoto, Japan",
      year: "2022",
      scale: "28,000 SF",
      architect: "Daniel Roberts",
      img: "../Experience page/assets/gallery_concept.png",
      desc: "Inspired by the fluid kinetics of running water in nature, the Flow Museum represents a complex double-curved composite construction. The layout utilizes circular biophilic skylights and dynamic concrete walls to guide museum visitors through changing natural light environments."
    },
    {
      title: "Metropolis Tower",
      category: "Commercial",
      location: "Dubai, UAE",
      year: "2023",
      scale: "340,000 SF",
      architect: "James Wilson",
      img: "../Experience page/assets/gallery_modern.png",
      desc: "A commercial landmark in Dubai's business district. Metropolis Tower utilizes a double-skin glass facade with automated sun-tracking louvers, lowering cooling loads by 42%. The structure is designed with floating sky-gardens every ten floors to encourage workspace connection."
    },
    {
      title: "Aetherium Pavilion",
      category: "Hospitality",
      location: "Santorini, Greece",
      year: "2024",
      scale: "15,500 SF",
      architect: "Sophia Martinez",
      img: "../Experience page/assets/facade_architecture.png",
      desc: "Carved directly into volcanic cliff faces, the Aetherium Pavilion merges organic cave architecture with high-luxury hospitality. Multi-tiered infinity pools cascade down the cliffs, while deep wind-catchers utilize passive airflow to maintain cool indoor microclimates."
    },
    {
      title: "Lumina Library",
      category: "Cultural",
      location: "Copenhagen, Denmark",
      year: "2021",
      scale: "18,200 SF",
      architect: "Daniel Roberts",
      img: "../Experience page/assets/hero_architecture.png",
      desc: "Designed around the primary principle of daylight maximization, Lumina Library utilizes a structural Scandinavian timber skeleton. The open interior layout houses green reading nooks, structural bookshelves that double as support pillars, and glass roofs."
    }
  ];

  const openProjectModal = (data) => {
    modalImg.src = data.img;
    modalBadge.textContent = data.category;
    modalTitle.textContent = data.title;
    modalLocation.textContent = data.location;
    modalDesc.textContent = data.desc;
    modalYear.textContent = data.year;
    modalScale.textContent = data.scale;
    modalArchitect.textContent = data.architect;

    projectModal.classList.add('open');
    lenis.stop(); // Stop scroll behind modal
  };

  const closeProjectModal = () => {
    projectModal.classList.remove('open');
    lenis.start(); // Resume scroll
  };

  // Click on cards
  projectCards.forEach(card => {
    const cardInner = card.querySelector('.card-inner');
    const viewBtn = card.querySelector('.card-overlay');
    const actionLink = card.querySelector('.project-action-link');
    const index = parseInt(card.getAttribute('data-index'));

    [cardInner, viewBtn, actionLink].forEach(elem => {
      if (elem) {
        elem.addEventListener('click', (e) => {
          // If clicked the view-project action link or image overlay
          e.stopPropagation();
          e.preventDefault();
          openProjectModal(projectsData[index]);
        });
      }
    });
  });

  if (projectModalClose) {
    projectModalClose.addEventListener('click', closeProjectModal);
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }


  /* ==========================================================================
     6. FEATURED SIGNATURE CASE STUDY
     ========================================================================== */
  const exploreCaseStudyBtn = document.getElementById('explore-case-study-btn');
  const signatureData = {
    title: "The Helix Pavilion",
    category: "Signature Masterpiece",
    location: "Monaco",
    year: "2024",
    scale: "12,500 SF",
    architect: "Daniel Roberts",
    img: "../Experience page/assets/facade_architecture.png",
    desc: "Our Monaco signature masterpiece represents the absolute synthesis of dynamic curves and sustainable luxury materials. Suspended gracefully over the Mediterranean, it integrates active solar glass, locally quarried sandstone, and carbon-neutral composite frameworks to create a structural flow that feels entirely organic."
  };

  if (exploreCaseStudyBtn) {
    exploreCaseStudyBtn.addEventListener('click', () => {
      openProjectModal(signatureData);
    });
  }

  // Parallax Effect on Signature Image
  gsap.to('#signature-visual img', {
    yPercent: 10,
    ease: 'none',
    scrollTrigger: {
      trigger: '#signature',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });


  /* ==========================================================================
     8. STATISTICS COUNTER ANIMATION (SECTION 6)
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
     9. DESIGN PHILOSOPHY TEXT REVEAL (SECTION 7)
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
      delay: 0.3,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#philosophy',
        start: 'top 80%'
      }
    });
  }


  /* ==========================================================================
     10. FINAL CTA BANNER ANIMATIONS (SECTION 8)
     ========================================================================== */
  gsap.from('.cta-banner', {
    scale: 0.96,
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

});
