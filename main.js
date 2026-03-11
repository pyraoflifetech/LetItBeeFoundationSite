// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Lenis Smooth Scrolling Setup
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

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time)=>{
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    /* ==========================================================================
       2. Custom Cursor Logic
       ========================================================================== */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    // Listen to mouse move
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Dot follows instantly
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    // Smooth animation for ring
    const renderCursor = () => {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Hover states for links and buttons
    const interactiveElements = document.querySelectorAll('a, button, .magnetic');
    interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    /* ==========================================================================
       3. Magnetic Effect Logic
       ========================================================================== */
    const magnetics = document.querySelectorAll('.magnetic');
    
    magnetics.forEach((elem) => {
        elem.addEventListener('mousemove', (e) => {
            const bound = elem.getBoundingClientRect();
            const strength = elem.dataset.strength ? parseFloat(elem.dataset.strength) : 20;
            
            const transX = ((e.clientX - bound.left) / elem.offsetWidth - 0.5) * strength;
            const transY = ((e.clientY - bound.top) / elem.offsetHeight - 0.5) * strength;
            
            gsap.to(elem, {
                x: transX,
                y: transY,
                duration: 1.2,
                ease: 'power3.out'
            });
        });

        elem.addEventListener('mouseleave', () => {
            gsap.to(elem, {
                x: 0,
                y: 0,
                duration: 1.2,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });

    /* ==========================================================================
       4. Navbar Scroll Effect
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    lenis.on('scroll', (e) => {
        if (e.scroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       5. GSAP Animations & ScrollTriggers
       ========================================================================== */
    gsap.registerPlugin(ScrollTrigger);

    // Basic Fade Ups
    const fadeUps = document.querySelectorAll('.fade-up');
    fadeUps.forEach((elem) => {
        gsap.to(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
            },
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out"
        });
    });

    // Primitive Text Splitting for Titles
    const splitTexts = document.querySelectorAll('.split-text');
    splitTexts.forEach(title => {
        // Simple word split logic
        const words = title.innerText.split(' ');
        title.innerHTML = '';
        words.forEach(word => {
            const wordSpan = document.createElement('span');
            wordSpan.classList.add('word-wrapper');
            const innerSpan = document.createElement('span');
            // Check if word contains a break tag logic in html (not perfect for raw text but ok for simple usage)
            innerSpan.innerHTML = word + '&nbsp;';
            innerSpan.style.display = 'inline-block';
            innerSpan.style.transform = 'translateY(110%)';
            wordSpan.appendChild(innerSpan);
            title.appendChild(wordSpan);
        });

        gsap.to(title.querySelectorAll('.word-wrapper > span'), {
            scrollTrigger: {
                trigger: title,
                start: "top 85%"
            },
            y: "0%",
            duration: 1.2,
            stagger: 0.05,
            ease: "expo.out"
        });
    });

    // Parallax Images
    const parallaxElements = document.querySelectorAll('.parallax');
    parallaxElements.forEach(elem => {
        const speed = elem.dataset.speed || 1;
        
        let yValue = -50 * speed;
        if(speed === 'calc') yValue = -100;
        if(speed === 'calc-reverse') yValue = 100;

        gsap.fromTo(elem, {
            y: 0
        }, {
            y: yValue,
            ease: "none",
            scrollTrigger: {
                trigger: elem,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Image Reveals
    const imgReveals = document.querySelectorAll('.img-reveal');
    imgReveals.forEach(img => {
        gsap.fromTo(img, 
            { scale: 1.3, filter: 'brightness(0)' },
            {
                scale: 1, 
                filter: 'brightness(1)',
                duration: 1.5,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: img,
                    start: "top 90%"
                }
            }
        );
    });

    // Hero Initial Animation (Entry Payload)
    const tl = gsap.timeline();
    tl.to('body', { opacity: 1, duration: 0.1 })
      .fromTo('.stagger-text', 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'expo.out', delay: 0.2 })
      .fromTo('.hero-img', 
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 0.4, duration: 2, ease: 'power2.out' }, '-=1.5')
      .fromTo('.navbar', 
        { y: -100 }, 
        { y: 0, duration: 1, ease: 'expo.out' }, '-=1');

    /* ==========================================================================
       6. Glow Card Mouse Tracking
       ========================================================================== */
    const cards = document.querySelectorAll(".glow-card");
    cards.forEach(card => {
        card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    /* ==========================================================================
       7. Anchor link smooth scrolling
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                lenis.scrollTo(targetElement);
            }
        });
    });

    /* ==========================================================================
       8. Theme Toggle logic
       ========================================================================== */
    const themeToggleBtn = document.querySelector('.theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    // Default to light theme
    let currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
            updateThemeIcon(currentTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }
});
