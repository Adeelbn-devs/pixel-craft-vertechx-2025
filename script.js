/**
 * VertechX 13.0 - Premium Interactive Enhancements
 * All features implemented with vanilla JavaScript
 */

(function() {
  'use strict';

  // ============================================
  // 1. PREMIUM NAVBAR SCROLL EFFECTS
  // ============================================
  function initNavbarScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    function handleScroll() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }

    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial check
    handleScroll();
  }

  // ============================================
  // 2. MOBILE MENU TOGGLE
  // ============================================
  function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav a');

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      const isActive = nav.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isActive);
      menuToggle.innerHTML = isActive ? '✕' : '☰';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '☰';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '☰';
      }
    });
  }

  // ============================================
  // 3. SCROLL REVEAL ANIMATIONS
  // ============================================
  function initScrollReveal() {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(section => {
      observer.observe(section);
    });
  }

  // ============================================
  // 4. COUNT-UP NUMBER ANIMATION
  // ============================================
  function initCountUp() {
    const statsSection = document.querySelector('.section.stats');
    if (!statsSection) return;

    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const valueElements = entry.target.querySelectorAll('.value[data-target]');
          
          valueElements.forEach(el => {
            const target = parseFloat(el.getAttribute('data-target'));
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            let current = 0;
            const stepTime = duration / steps;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              
              if (suffix.includes('k')) {
                el.textContent = Math.floor(current) + suffix;
              } else {
                el.textContent = Math.floor(current) + suffix;
              }
            }, stepTime);
          });

          countObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    countObserver.observe(statsSection);
  }

  // ============================================
  // 5. ENHANCED NAVIGATION ACTIVE HIGHLIGHT
  // ============================================
  function initNavHighlight() {
    const navLinks = document.querySelectorAll('.nav a');
    const sections = document.querySelectorAll('section[id], footer[id]');

    if (navLinks.length === 0) return;

    // Enhanced smooth scrolling for nav links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });

            // Update active state immediately
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    });

    // Update active nav link on scroll with improved detection
    function updateActiveNav() {
      const scrollPos = window.scrollY + 150;
      let currentSection = '';

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          currentSection = sectionId;
        }
      });

      // Handle top of page (home section)
      if (window.scrollY < 200) {
        currentSection = 'home';
      }

      // Update active states
      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && (href === `#${currentSection}` || (currentSection === 'home' && href === '#home'))) {
          link.classList.add('active');
        }
      });
    }

    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveNav();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial call
    updateActiveNav();
  }

  // ============================================
  // 6. AUTO-TYPING TEXT IN HERO SECTION
  // ============================================
  function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const words = ['Innovate.', 'Create.', 'Compete.', 'Learn.'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 500;
      }

      setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
  }

  // ============================================
  // 7. ENHANCED GALLERY INTERACTIONS
  // ============================================
  function initGalleryScroll() {
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    const galleryTrack = document.querySelector('.gallery-track');
    
    if (!galleryWrapper || !galleryTrack) return;

    galleryWrapper.addEventListener('mouseenter', () => {
      galleryTrack.style.transition = 'transform 0.3s ease-out';
    });

    galleryWrapper.addEventListener('mouseleave', () => {
      galleryTrack.style.transition = '';
    });
  }

  // ============================================
  // 8. PARALLAX HERO BACKGROUND
  // ============================================
  function initParallax() {
    const heroImage = document.querySelector('.hero-image');
    const heroSection = document.querySelector('.section.hero');
    if (!heroImage || !heroSection) return;

    let ticking = false;

    function updateParallax() {
      const scrolled = window.pageYOffset;
      const heroTop = heroSection.offsetTop;
      const heroHeight = heroSection.offsetHeight;
      const windowHeight = window.innerHeight;

      if (scrolled < heroTop + heroHeight && scrolled + windowHeight > heroTop) {
        const parallaxSpeed = 0.15;
        const relativeScroll = scrolled - heroTop;
        const translateY = relativeScroll * parallaxSpeed;
        heroImage.style.transform = `translateY(${translateY}px)`;
      } else {
        heroImage.style.transform = '';
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  // ============================================
  // 9. ENHANCED DARK MODE TOGGLE
  // ============================================
  function initDarkMode() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    const html = document.documentElement;

    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    function updateThemeIcon(theme) {
      if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
      }
    }

    function toggleTheme() {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);

      // Remove old background overrides - let CSS handle it
      document.body.style.background = '';
      document.body.style.color = '';
    }

    themeToggle.addEventListener('click', toggleTheme);

    // Remove initial theme background override
    const initialTheme = html.getAttribute('data-theme');
    // Let CSS handle the background now
  }

  // ============================================
  // 10. PREMIUM BUTTON INTERACTIONS
  // ============================================
  function initButtonInteractions() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      });

      button.addEventListener('click', function(e) {
        // Enhanced ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.4)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '1';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    // Add ripple animation to CSS
    if (!document.querySelector('#ripple-animation')) {
      const style = document.createElement('style');
      style.id = 'ripple-animation';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ============================================
  // 11. CONTACT FORM IMPROVEMENT
  // ============================================
  function initContactForm() {
    const contactLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    contactLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        link.style.transition = 'all 0.3s ease';
        link.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
          link.style.transform = '';
        }, 200);
      });
    });
  }

  // ============================================
  // 12. PERFORMANCE OPTIMIZATIONS
  // ============================================
  function initPerformanceOptimizations() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--transition-fast', '0s');
      document.documentElement.style.setProperty('--transition-smooth', '0s');
      document.documentElement.style.setProperty('--transition-slow', '0s');
      document.querySelectorAll('.scroll-reveal').forEach(el => {
        el.style.transition = 'none';
      });
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Initialize all features
    initNavbarScroll();
    initMobileMenu();
    initScrollReveal();
    initCountUp();
    initNavHighlight();
    initTypingEffect();
    initGalleryScroll();
    initParallax();
    initDarkMode();
    initButtonInteractions();
    initContactForm();
    initPerformanceOptimizations();

    console.log('✨ VertechX 13.0 - Premium features initialized');
  }

  init();

})();

