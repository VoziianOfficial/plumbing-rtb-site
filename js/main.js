(function () {
  const yearTargets = document.querySelectorAll("[data-current-year]");
  const currentYear = new Date().getFullYear();

  yearTargets.forEach((el) => {
    el.textContent = String(currentYear);
  });

  // Basic active-state handling for top navigation links.
  const currentPath = window.location.pathname.replace(/\/$/, "");
  const navLinks = document.querySelectorAll("[data-nav-link]");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const normalizedHref = href.replace(/\.\./g, "").replace(/\/$/, "");
    const normalizedPath = currentPath === "" ? "/index.html" : currentPath;

    if (
      normalizedPath.endsWith(normalizedHref) ||
      (normalizedHref === "/index.html" &&
        (normalizedPath === "/" || normalizedPath.endsWith("/index.html")))
    ) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  const heroCarousels = document.querySelectorAll("[data-hero-carousel]");
  heroCarousels.forEach((carousel) => {
    const slides = carousel.querySelectorAll("[data-carousel-slide]");
    const dots = carousel.querySelectorAll("[data-carousel-dot]");
    const prevButton = carousel.querySelector("[data-carousel-prev]");
    const nextButton = carousel.querySelector("[data-carousel-next]");

    if (!slides.length) return;

    let currentIndex = 0;
    let autoTimer = null;

    const normalizeIndex = (index) => {
      if (index < 0) return slides.length - 1;
      if (index >= slides.length) return 0;
      return index;
    };

    const renderSlide = (index) => {
      currentIndex = normalizeIndex(index);

      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === currentIndex;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === currentIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-selected", String(isActive));
      });
    };

    const startAuto = () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        renderSlide(currentIndex + 1);
      }, 4200);
    };

    const stopAuto = () => {
      clearInterval(autoTimer);
    };

    prevButton?.addEventListener("click", () => {
      renderSlide(currentIndex - 1);
      startAuto();
    });

    nextButton?.addEventListener("click", () => {
      renderSlide(currentIndex + 1);
      startAuto();
    });

    dots.forEach((dot, dotIndex) => {
      dot.addEventListener("click", () => {
        renderSlide(dotIndex);
        startAuto();
      });
    });

    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", startAuto);
    carousel.addEventListener("focusin", stopAuto);
    carousel.addEventListener("focusout", startAuto);

    renderSlide(0);
    startAuto();
  });
})();
