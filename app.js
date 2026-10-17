document.addEventListener("DOMContentLoaded", () => {
    /* ---------- Starfield background ---------- */
    const canvas = document.getElementById("stars");
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars = [];
  
    const makeStars = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  
      const count = Math.floor((window.innerWidth * window.innerHeight) / 2500);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() < 0.9 ? Math.random() * 0.9 + 0.2 : Math.random() * 1.4 + 0.8,
        base: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.002 + 0.0005,
        phase: Math.random() * Math.PI * 2,
      }));
    };
  
    const drawStars = (t = 0) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const s of stars) {
        const alpha = reduceMotion
          ? s.base
          : s.base + Math.sin(t * s.speed + s.phase) * 0.25;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.05, alpha)})`;
        ctx.fill();
      }
      if (!reduceMotion) requestAnimationFrame(drawStars);
    };
  
    makeStars();
    drawStars();
    window.addEventListener("resize", () => {
      makeStars();
      if (reduceMotion) drawStars();
    });
  
    /* ---------- Sticky nav background on scroll ---------- */
    const nav = document.getElementById("nav");
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  
    /* ---------- Mobile menu ---------- */
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");
  
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  
    /* ---------- Typing effect in hero ---------- */
    const typedEl = document.getElementById("typed");
    const words = ["deep focus", "night owls", "your team", "calm work"];
    let wordIndex = 0;
    let charIndex = words[0].length;
    let deleting = true;
  
    const type = () => {
      const word = words[wordIndex];
      typedEl.textContent = word.slice(0, charIndex);
  
      if (!deleting && charIndex === word.length) {
        deleting = true;
        return setTimeout(type, 1800);
      }
      if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        return setTimeout(type, 300);
      }
      charIndex += deleting ? -1 : 1;
      setTimeout(type, deleting ? 45 : 90);
    };
    setTimeout(type, 2000);
  
    /* ---------- Count-up numbers ---------- */
    const countUp = (el) => {
      const target = Number(el.dataset.count);
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
  
    /* ---------- Reveal on scroll ---------- */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add("visible");
          if (el.classList.contains("preview")) {
            el.querySelectorAll("[data-count]").forEach(countUp);
          }
          observer.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );
  
    document.querySelectorAll(".reveal").forEach((el, i) => {
      el.style.transitionDelay = `${(i % 3) * 80}ms`;
      observer.observe(el);
    });
  
    /* ---------- Signup form ---------- */
    const form = document.getElementById("signupForm");
    const email = document.getElementById("email");
    const msg = document.getElementById("formMsg");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        msg.style.color = "#f87171";
        msg.textContent = "Please enter a valid email address.";
        return;
      }
      msg.style.color = "";
      msg.textContent = `Thanks! We'll send your invite to ${value}.`;
      form.reset();
    });
  
    /* ---------- Footer year ---------- */
    document.getElementById("year").textContent = new Date().getFullYear();
  });