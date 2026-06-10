/**
 * NEXORA Concept
 * Main Javascript
 */

document.addEventListener('DOMContentLoaded', () => {
    
  // --- 1. Navbar Scroll Effect ---
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // --- 2. Scroll Reveal Animations (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal, .spec-card');
  
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('is-visible');
        
        // If it's a spec card, trigger counter animation
        if (entry.target.classList.contains('spec-card')) {
          const counterSpan = entry.target.querySelector('span[data-count]');
          if (counterSpan && !counterSpan.classList.contains('counted')) {
            animateCounter(counterSpan);
            counterSpan.classList.add('counted');
          }
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });

  // --- 3. Counter Animation ---
  function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-count'));
    const decimals = parseInt(element.getAttribute('data-decimals')) || 0;
    const duration = 2000; // ms
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let currentFrame = 0;

    const easeOutExpo = (t) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const counterInterval = setInterval(() => {
      currentFrame++;
      const progress = easeOutExpo(currentFrame / totalFrames);
      const currentVal = target * progress;

      element.textContent = currentVal.toFixed(decimals);

      if (currentFrame >= totalFrames) {
        clearInterval(counterInterval);
        element.textContent = target.toFixed(decimals);
      }
    }, frameRate);
  }

  // --- 4. Models Slider (Grab & Scroll) ---
  const slider = document.querySelector('.models__slider');
  let isDown = false;
  let startX;
  let scrollLeft;

  if (slider) {
    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('active');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    
    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('active');
    });
    
    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('active');
    });
    
    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // Scroll-fast
      slider.scrollLeft = scrollLeft - walk;
    });
  }

  // --- 5. Simple Parallax Effect ---
  const parallaxElements = document.querySelectorAll('[data-parallax] img');
  
  window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      const scrolled = window.scrollY;
      parallaxElements.forEach(el => {
        // Move background images slightly slower than scroll
        const speed = 0.15;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  });

  // --- 6. Lenis Smooth Scroll ---
  if (typeof Lenis !== 'undefined') {
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

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }

  // --- 7. Custom Cursor ---
  const cursor = document.querySelector('.custom-cursor');
  if (cursor) {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    const speed = 0.2; 

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      const distX = mouseX - cursorX;
      const distY = mouseY - cursorY;

      cursorX += distX * speed;
      cursorY += distY * speed;

      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverElements = document.querySelectorAll('a, .btn, .highlight-card, .model-card');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
  }

  // --- 8. Magnetic Buttons ---
  const magneticBtns = document.querySelectorAll('.btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });

  // --- 9. 3D Tilt Effect for Cards ---
  const tiltCards = document.querySelectorAll('.highlight-card');
  tiltCards.forEach(card => {
    const img = card.querySelector('img');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; 
      const y = e.clientY - rect.top;  
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; 
      const rotateY = ((x - centerX) / centerX) * 10;
      
      if(img) {
        img.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if(img) {
        img.style.transform = `scale(1) rotateX(0) rotateY(0)`;
      }
    });
  });

  // --- 10. Aerodynamics Sticky Scroll Observer ---
  const aeroBlocks = document.querySelectorAll('.aero-block');
  if (aeroBlocks.length > 0) {
    const aeroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-active');
        } else {
          entry.target.classList.remove('is-active');
        }
      });
    }, {
      rootMargin: "-40% 0px -40% 0px", 
      threshold: 0
    });

    aeroBlocks.forEach(block => aeroObserver.observe(block));
  }

});
