
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const progressBar = document.getElementById("scrollProgress");
  const year = document.getElementById("year");

  // Année automatique dans le pied de page
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Menu mobile
  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fermer le menu" : "Ouvrir le menu"
      );
    });

    // Fermer le menu après avoir choisi une section
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Fermer le menu avec la touche Échap
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" &&
          navLinks.classList.contains("open")) {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Fermer le menu quand l'écran redevient large
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  // Barre de progression du défilement
  let ticking = false;

  function updateScrollProgress() {
    if (!progressBar) return;

    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollableHeight > 0
      ? (window.scrollY / scrollableHeight) * 100
      : 0;

    progressBar.style.width = `${Math.min(progress, 100)}%`;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollProgress);
      ticking = true;
    }
  }, { passive: true });

  updateScrollProgress();

  // Apparition progressive des éléments
  const revealElements = document.querySelectorAll(".reveal");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    prefersReducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  // Mettre en évidence la section consultée
  const sections = document.querySelectorAll("main section[id]");
  const navigationLinks = document.querySelectorAll(
    '.nav-links a[href^="#"]'
  );

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navigationLinks.forEach((link) => {
            const isCurrent =
              link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("active", isCurrent);

            if (isCurrent) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }
});
