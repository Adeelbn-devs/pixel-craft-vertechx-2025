/**
 * VertechX 13.0 - Interactive Enhancements
 * All features implemented with vanilla JavaScript
 */

(function() {
  'use strict';

  // ============================================
  // 1. SCROLL REVEAL ANIMATIONS
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

    // Observe all sections with scroll-reveal class
    document.querySelectorAll('.scroll-reveal').forEach(section => {
      observer.observe(section);
    });
  }

  // ============================================
  // 2. COUNT-UP NUMBER ANIMATION
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
            const duration = 2000; // 2 seconds
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
              
              // Format number based on suffix
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
  // 3. NAVIGATION ACTIVE HIGHLIGHT ON SCROLL
  // ============================================
  function initNavHighlight() {
    const navLinks = document.querySelectorAll('.nav a');
    const sections = document.querySelectorAll('section[id], footer[id]');

    // Smooth scrolling for nav links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // Update active nav link on scroll
    function updateActiveNav() {
      const scrollPos = window.scrollY + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });

      // Handle top of page
      if (window.scrollY < 100) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#home') {
            link.classList.add('active');
          }
        });
      }
    }

    // Throttle scroll events for performance
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
  // 4. AUTO-TYPING TEXT IN HERO SECTION
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
        typingSpeed = 50; // Faster when deleting
      } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100; // Normal speed when typing
      }

      if (!isDeleting && charIndex === currentWord.length) {
        // Pause at end of word
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Move to next word
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 500; // Pause before next word
      }

      setTimeout(type, typingSpeed);
    }

    // Start typing after a short delay
    setTimeout(type, 1000);
  }

  // ============================================
  // 5. AUTO-SCROLLING IMAGE GALLERY
  // ============================================
  function initGalleryScroll() {
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    const galleryTrack = document.querySelector('.gallery-track');
    
    if (!galleryWrapper || !galleryTrack) return;

    // Gallery already has CSS animation, but we'll enhance it with pause on hover
    // The CSS already handles :hover pause, but we can add smooth transitions
    galleryWrapper.addEventListener('mouseenter', () => {
      galleryTrack.style.transition = 'transform 0.3s ease-out';
    });

    galleryWrapper.addEventListener('mouseleave', () => {
      galleryTrack.style.transition = '';
    });
  }

  // ============================================
  // 6. PARALLAX HERO BACKGROUND
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

      // Only apply parallax when hero is in view
      if (scrolled < heroTop + heroHeight && scrolled + windowHeight > heroTop) {
        const parallaxSpeed = 0.15; // Subtle movement
        const relativeScroll = scrolled - heroTop;
        const translateY = relativeScroll * parallaxSpeed;
        // Apply parallax while preserving the float animation
        heroImage.style.transform = `translateY(${translateY}px)`;
      } else {
        // Reset when out of view
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
  // 7. DARK MODE TOGGLE
  // ============================================
  function initDarkMode() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    const html = document.documentElement;

    // Get saved theme or default to dark
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

      // Update body background for light mode
      if (newTheme === 'light') {
        document.body.style.background = 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f0f4f8 100%)';
        document.body.style.color = '#0f172a';
      } else {
        document.body.style.background = 'linear-gradient(135deg, #0a0f1a 0%, #0f172a 25%, #1a2332 50%, #0f172a 75%, #0a0f1a 100%)';
        document.body.style.color = '#ffffff';
      }
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }

    // Apply initial theme
    const initialTheme = html.getAttribute('data-theme');
    if (initialTheme === 'light') {
      document.body.style.background = 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f0f4f8 100%)';
      document.body.style.color = '#0f172a';
    }
  }

  // ============================================
  // 8. BUTTON INTERACTIONS
  // ============================================
  function initButtonInteractions() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      // Add subtle scale and glow on hover (CSS handles most of this)
      // But we can add additional interactive feedback
      button.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      });

      button.addEventListener('click', function(e) {
        // Ripple effect
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
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    // Add ripple animation to CSS dynamically
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
  // 9. CONTACT FORM IMPROVEMENT
  // ============================================
  function initContactForm() {
    // Check if there's a contact form (currently just email link)
    // This is a placeholder for future form implementation
    const contactLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    contactLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Add visual feedback
        link.style.transition = 'all 0.3s ease';
        link.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
          link.style.transform = '';
        }, 200);
      });
    });
  }

  // ============================================
  // 10. PERFORMANCE & CLEANUP
  // ============================================
  function initPerformanceOptimizations() {
    // Lazy load images (if needed in future)
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

    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
      document.querySelectorAll('.scroll-reveal').forEach(el => {
        el.style.transition = 'none';
      });
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Initialize all features
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

    console.log('VertechX 13.0 - All interactive features initialized');
  }

  // Start initialization
  init();

})();

