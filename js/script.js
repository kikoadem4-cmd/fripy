/* =============================================
   FRIPY — SCRIPT.JS
   ============================================= */

(function () {
  "use strict";

  /* ── CUSTOM CURSOR ── */
  const cursor = document.querySelector(".cursor");
  const follower = document.querySelector(".cursor-follower");

  if (cursor && follower && window.matchMedia("(pointer: fine)").matches) {
    let mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + "px";
      cursor.style.top  = my + "px";
    });

    function animateFollower() {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      follower.style.left = fx + "px";
      follower.style.top  = fy + "px";
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Scale cursor on hover
    document.querySelectorAll("a, button, .service-card, .feature-card").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.width  = "30px";
        cursor.style.height = "30px";
        follower.style.width  = "48px";
        follower.style.height = "48px";
        follower.style.borderColor = "rgba(123, 34, 224, 0.8)";
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.width  = "35px";
        cursor.style.height = "35px";
        follower.style.width  = "32px";
        follower.style.height = "32px";
        follower.style.borderColor = "rgba(123, 34, 224, 0.5)";
      });
    });
  }

  /* ── STICKY HEADER ── */
  const header = document.getElementById("header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── MOBILE NAV ── */
  const menuToggle = document.getElementById("menuToggle");
  const navbar     = document.getElementById("navbar");

  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navbar.classList.toggle("open");
      menuToggle.classList.toggle("open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close nav on link click
    navbar.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navbar.classList.remove("open");
        menuToggle.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ── THEME TOGGLE ── */
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY   = "fripy_theme";

  function applyTheme(theme) {
    document.body.classList.toggle("light-mode", theme === "light");
    if (themeToggle) {
      themeToggle.querySelector(".toggle-icon").textContent =
        theme === "light" ? "◐" : "◑";
    }
  }

  // Restore saved theme
  applyTheme(localStorage.getItem(THEME_KEY) || "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = document.body.classList.contains("light-mode") ? "dark" : "light";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  /* ── SCROLL REVEAL ── */
  const revealEls = document.querySelectorAll(".scroll-reveal");

  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // Stagger by data-index or natural order
            const delay = (entry.target.dataset.index || 0) * 80;
            setTimeout(() => {
              entry.target.classList.add("in-view");
            }, delay);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: show all immediately
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ── HERO STATS COUNTER ANIMATION ── */
  function animateCounter(el, target, suffix) {
    const duration = 1400;
    const start    = performance.now();
    const isFloat  = target % 1 !== 0;

    function tick(now) {
      const t   = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const val  = isFloat
        ? (ease * target).toFixed(1)
        : Math.floor(ease * target);
      el.textContent = val + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statNums = document.querySelectorAll(".stat-num");
  if (statNums.length) {
    const statsData = [
      { value: 12000, suffix: "+" },
      { value: 4.8,   suffix: "★" },
      { value: 98,    suffix: "%" },
    ];

    const statsIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            statNums.forEach((el, i) => {
              if (statsData[i]) animateCounter(el, statsData[i].value, statsData[i].suffix);
            });
            statsIO.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsEl = document.querySelector(".hero-stats");
    if (statsEl) statsIO.observe(statsEl);
  }

  /* ── CONTACT FORM ── */
  const form        = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const btn  = form.querySelector(".form-submit");
      const span = btn.querySelector("span");
      span.textContent = "Sending…";
      btn.disabled = true;

      // Simulate async send
      setTimeout(() => {
        form.reset();
        btn.style.display = "none";
        if (formSuccess) formSuccess.classList.add("show");
      }, 1200);
    });
  }

  /* ── PAGE LOAD FADE ── */
  document.documentElement.style.opacity = "0";
  document.documentElement.style.transition = "opacity 0.4s ease";
  window.addEventListener("load", () => {
    document.documentElement.style.opacity = "1";
  });

})();
