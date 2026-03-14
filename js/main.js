(function () {
  const yearTargets = document.querySelectorAll("[data-current-year]");
  const currentYear = new Date().getFullYear();
  const loadedAssets = new Map();
  const serviceSearchPages = [
    {
      title: "Plumbing Match Hub Home",
      path: "index.html",
      category: "Page",
      keywords: "home homepage request quotes call local plumbing connections",
    },
    {
      title: "Emergency Plumbing",
      path: "services/emergency-plumbing.html",
      category: "Service",
      keywords: "burst pipes urgent leaks overflow emergency water damage",
    },
    {
      title: "Plumbing Repairs & Maintenance",
      path: "services/plumbing-repairs-maintenance.html",
      category: "Service",
      keywords: "repairs maintenance low pressure drip running toilet upkeep",
    },
    {
      title: "Drain Cleaning",
      path: "services/drain-cleaning.html",
      category: "Service",
      keywords: "drain clogged sink shower tub backup gurgling odor",
    },
    {
      title: "Plumbing Replacement",
      path: "services/plumbing-replacement.html",
      category: "Service",
      keywords: "replacement worn fixtures piping aging water heater toilet faucet",
    },
    {
      title: "Plumbing Installation",
      path: "services/plumbing-installation.html",
      category: "Service",
      keywords: "installation install sink toilet faucet appliance remodel",
    },
    {
      title: "Water Heater Services",
      path: "services/water-heater-services.html",
      category: "Service",
      keywords: "water heater no hot water leaking tank tankless replacement",
    },
    {
      title: "Leak Detection",
      path: "services/leak-detection.html",
      category: "Service",
      keywords: "hidden leak moisture stains water bill ceiling wall",
    },
    {
      title: "Toilet Repair & Installation",
      path: "services/toilet-repair-installation.html",
      category: "Service",
      keywords: "toilet clog running leak base replacement install flush",
    },
    {
      title: "Faucet & Fixture Services",
      path: "services/faucet-fixture-services.html",
      category: "Service",
      keywords: "faucet fixture shower bath kitchen drip handle spout",
    },
    {
      title: "About Plumbing Match Hub",
      path: "about.html",
      category: "Page",
      keywords: "about company platform homeowners referral aggregator",
    },
    {
      title: "Contact Plumbing Match Hub",
      path: "contact.html",
      category: "Page",
      keywords: "contact request quotes phone email support",
    },
    {
      title: "Privacy Policy",
      path: "privacy-policy.html",
      category: "Legal",
      keywords: "privacy data policy",
    },
    {
      title: "Terms of Service",
      path: "terms-of-service.html",
      category: "Legal",
      keywords: "terms conditions service legal",
    },
    {
      title: "Cookie Policy",
      path: "cookie-policy.html",
      category: "Legal",
      keywords: "cookie settings policy tracking",
    },
  ];

  yearTargets.forEach((el) => {
    el.textContent = String(currentYear);
  });

  const navLinks = document.querySelectorAll("[data-nav-link]");
  const getBasePath = () =>
    window.location.pathname.includes("/services/") ? "../" : "";
  const resolveSitePath = (path) => `${getBasePath()}${path}`;
  const normalizePath = (value) => {
    const sanitizedValue = value.replace(/\/$/, "");
    if (!sanitizedValue || sanitizedValue === "/") {
      return "/index.html";
    }
    return sanitizedValue.replace(/\.\./g, "");
  };

  const updateActiveNavLinks = () => {
    const normalizedPath = normalizePath(window.location.pathname);
    const currentHash = window.location.hash;

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      const [pathPart, hashPart] = href.split("#");
      const targetPath = normalizePath(pathPart || "/index.html");
      const pathMatches = normalizedPath.endsWith(targetPath);

      const isServicesLink = hashPart === "services";
      const isActive = isServicesLink
        ? pathMatches && currentHash === "#services"
        : pathMatches && !currentHash;

      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      window.requestAnimationFrame(updateActiveNavLinks);
      window.setTimeout(updateActiveNavLinks, 60);
    });
  });

  window.addEventListener("hashchange", updateActiveNavLinks);
  updateActiveNavLinks();

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

  const loadStylesheet = (href) => {
    if (document.querySelector(`link[href="${href}"]`)) {
      return Promise.resolve();
    }

    if (loadedAssets.has(href)) {
      return loadedAssets.get(href);
    }

    const promise = new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = () => resolve();
      link.onerror = () =>
        reject(new Error(`Unable to load stylesheet: ${href}`));
      document.head.append(link);
    });

    loadedAssets.set(href, promise);
    return promise;
  };

  const loadScript = (src) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      return Promise.resolve();
    }

    if (loadedAssets.has(src)) {
      return loadedAssets.get(src);
    }

    const promise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Unable to load script: ${src}`));
      document.head.append(script);
    });

    loadedAssets.set(src, promise);
    return promise;
  };

  const createIcon = (name, className = "") => {
    const icon = document.createElement("span");
    icon.className = `material-symbols-outlined ${className}`.trim();
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = name;
    return icon;
  };

  const iconNameForText = (text, fallback = "chevron_right") => {
    const normalized = text.trim().toLowerCase();
    const rules = [
      { pattern: /emergency|urgent|burst|overflow/, icon: "bolt" },
      { pattern: /drain|clog/, icon: "water_drop" },
      { pattern: /water heater|hot water|heater/, icon: "shower" },
      { pattern: /leak|moisture|water/, icon: "water_drop" },
      { pattern: /toilet|flush/, icon: "wc" },
      { pattern: /faucet|fixture|kitchen|bathroom/, icon: "plumbing" },
      { pattern: /repair|maintenance|replacement|installation/, icon: "build" },
      { pattern: /service|category|contractor|provider/, icon: "construction" },
      { pattern: /home/, icon: "home" },
      { pattern: /about|info|who we are/, icon: "info" },
      { pattern: /contact|support/, icon: "support_agent" },
      { pattern: /call|phone/, icon: "call" },
      { pattern: /email|mail/, icon: "mail" },
      { pattern: /whatsapp|chat/, icon: "chat" },
      { pattern: /hour|schedule|availability|time/, icon: "schedule" },
      { pattern: /company|details|office/, icon: "apartment" },
      { pattern: /location|map|address/, icon: "location_on" },
      { pattern: /faq|question|help/, icon: "help" },
      { pattern: /privacy|terms|policy/, icon: "policy" },
      { pattern: /cookie/, icon: "cookie" },
      { pattern: /trust|transparent|verified/, icon: "verified" },
      { pattern: /quote|estimate|request/, icon: "description" },
      { pattern: /match|connect|network/, icon: "search" },
      { pattern: /related/, icon: "forum" },
      { pattern: /fast|same-day/, icon: "bolt" },
      { pattern: /local/, icon: "location_on" },
      { pattern: /residential|homeowner/, icon: "home" },
      { pattern: /reliable|safe|coverage/, icon: "shield" },
    ];

    const matchedRule = rules.find(({ pattern }) => pattern.test(normalized));
    return matchedRule ? matchedRule.icon : fallback;
  };

  const prependIcon = (element, iconName, className = "") => {
    if (!element || element.dataset.iconized === "true") return;
    element.dataset.iconized = "true";
    element.prepend(createIcon(iconName, className));
  };

  const appendIcon = (element, iconName, className = "") => {
    if (!element || element.dataset.iconized === "true") return;
    element.dataset.iconized = "true";
    element.append(createIcon(iconName, className));
  };

  const enhanceInterfaceWithIcons = () => {
    const materialSymbolsHref =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&icon_names=apartment,arrow_forward,bolt,build,call,chat,check_circle,chevron_right,construction,cookie,description,forum,help,home,info,location_on,mail,phone_in_talk,plumbing,policy,schedule,search,shield,shower,support_agent,verified,water_drop,wc&display=block";

    const applyIcons = () => {
      document.querySelectorAll(".badge").forEach((badge) => {
        prependIcon(badge, iconNameForText(badge.textContent, "check_circle"), "badge-icon");
      });

      document
        .querySelectorAll(
          ".service-card h3, .related-card h3, .info-card h3, .problem-card h3, .project-card h3, .contact-info-card h3, .callout h3, .footer-links h3, .footer-contact h3"
        )
        .forEach((heading) => {
          prependIcon(
            heading,
            iconNameForText(heading.textContent, "plumbing"),
            "heading-icon"
          );
        });

      document.querySelectorAll(".trust-list li").forEach((item) => {
        prependIcon(item, iconNameForText(item.textContent, "verified"), "trust-icon");
      });

      document.querySelectorAll(".btn").forEach((button) => {
        if (
          button.classList.contains("btn-primary") ||
          button.hasAttribute("data-no-button-icon")
        ) {
          button.querySelectorAll(".btn-icon").forEach((icon) => icon.remove());
          button.dataset.iconized = "true";
          return;
        }

        const href = button.getAttribute("href") || "";
        const text = button.textContent || "";
        const iconName = href.startsWith("tel:") || /call/i.test(text)
          ? "phone_in_talk"
          : /cookie/i.test(text)
            ? "cookie"
            : "arrow_forward";
        appendIcon(button, iconName, "btn-icon");
      });

      document.querySelectorAll(".phone-link").forEach((link) => {
        prependIcon(link, "call", "inline-link-icon");
      });

      document
        .querySelectorAll(".mobile-drawer nav > ul > li > a, .mobile-cookie-settings")
        .forEach((link) => {
          prependIcon(
            link,
            iconNameForText(link.textContent, "chevron_right"),
            "menu-link-icon"
          );
        });
    };

    return loadStylesheet(materialSymbolsHref).then(applyIcons).catch(() => {});
  };

  const applyScrollRevealMap = () => {
    const revealGroups = [
      { selector: ".hero-copy", animation: "fade-right", delayStep: 0 },
      { selector: ".hero-form-wrap, .form-card", animation: "fade-left", delayStep: 0 },
      { selector: ".hero-feature-layout", animation: "zoom-in", delayStep: 0 },
      { selector: ".section-header", animation: "fade-up", delayStep: 70 },
      { selector: ".content-grid > article", animation: "fade-right", delayStep: 0 },
      { selector: ".content-grid > aside", animation: "fade-left", delayStep: 80 },
      { selector: ".split-layout > article", animation: "fade-right", delayStep: 0 },
      { selector: ".split-layout > aside", animation: "fade-left", delayStep: 80 },
      { selector: ".trust-bar", animation: "fade-up", delayStep: 0 },
      { selector: ".service-card", animation: "fade-up", delayStep: 75 },
      { selector: ".step-card", animation: "fade-up", delayStep: 85 },
      { selector: ".project-card", animation: "fade-up", delayStep: 100 },
      { selector: ".faq-item", animation: "fade-up", delayStep: 70 },
      { selector: ".problem-card", animation: "fade-up", delayStep: 75 },
      { selector: ".info-card", animation: "fade-up", delayStep: 75 },
      { selector: ".related-card", animation: "fade-up", delayStep: 75 },
      { selector: ".contact-info-card", animation: "fade-up", delayStep: 85 },
      { selector: ".callout", animation: "fade-left", delayStep: 90 },
      { selector: ".map-placeholder", animation: "zoom-in-up", delayStep: 0 },
      { selector: ".about-story article", animation: "fade-right", delayStep: 0 },
      { selector: ".about-story figure", animation: "fade-left", delayStep: 120 },
      { selector: ".cta-band", animation: "zoom-in-up", delayStep: 0 },
      { selector: ".page-hero .container", animation: "fade-up", delayStep: 0 },
      { selector: ".service-hero .container", animation: "fade-up", delayStep: 0 },
      { selector: ".footer-top > section", animation: "fade-up", delayStep: 80 },
    ];

    revealGroups.forEach(({ selector, animation, delayStep }) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        if (element.dataset.aos) return;

        element.dataset.aos = animation;
        element.dataset.aosDuration = "760";
        element.dataset.aosEasing = "ease-out-cubic";

        if (delayStep) {
          element.dataset.aosDelay = String(index * delayStep);
        }
      });
    });
  };

  const addFloatingAccents = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    document
      .querySelectorAll(
        ".project-card, .contact-info-card, .info-card, .problem-card, .related-card"
      )
      .forEach((card, index) => {
        card.style.setProperty("--float-delay", `${(index % 4) * 0.75}s`);
        card.classList.add("motion-float-card");
      });
  };

  const initializeAos = () => {
    applyScrollRevealMap();

    return Promise.all([
      loadStylesheet("https://unpkg.com/aos@2.3.1/dist/aos.css"),
      loadScript("https://unpkg.com/aos@2.3.1/dist/aos.js"),
    ])
      .then(() => {
        if (typeof window.AOS === "undefined") return;

        window.AOS.init({
          once: true,
          offset: 48,
          duration: 760,
          easing: "ease-out-cubic",
          mirror: false,
        });
      })
      .catch(() => {
        document.documentElement.classList.add("animations-fallback");
      });
  };

  const initializeServiceHeroMotion = () => {
    const heroes = document.querySelectorAll(".service-hero");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!heroes.length || reduceMotion.matches) return;

    heroes.forEach((hero) => {
      let rect = null;
      let frameId = 0;
      let currentX = 0;
      let currentY = 0;
      let targetX = 0;
      let targetY = 0;

      const measure = () => {
        rect = hero.getBoundingClientRect();
      };

      const applyMotion = () => {
        currentX += (targetX - currentX) * 0.18;
        currentY += (targetY - currentY) * 0.18;

        hero.style.setProperty("--service-hero-pan-x", `${currentX.toFixed(2)}px`);
        hero.style.setProperty("--service-hero-pan-y", `${currentY.toFixed(2)}px`);

        const stillMoving =
          Math.abs(targetX - currentX) > 0.08 || Math.abs(targetY - currentY) > 0.08;

        if (stillMoving) {
          frameId = window.requestAnimationFrame(applyMotion);
        } else {
          frameId = 0;
        }
      };

      const queueMotion = () => {
        if (frameId) return;
        frameId = window.requestAnimationFrame(applyMotion);
      };

      const updateTarget = (clientX, clientY) => {
        if (!rect) measure();
        if (!rect || !rect.width || !rect.height) return;

        const normalizedX = (clientX - rect.left) / rect.width - 0.5;
        const normalizedY = (clientY - rect.top) / rect.height - 0.5;

        targetX = normalizedX * 46;
        targetY = normalizedY * 32;
        queueMotion();
      };

      hero.addEventListener("pointerenter", (event) => {
        measure();
        updateTarget(event.clientX, event.clientY);
      });

      hero.addEventListener("pointermove", (event) => {
        updateTarget(event.clientX, event.clientY);
      });

      hero.addEventListener("pointerleave", () => {
        targetX = 0;
        targetY = 0;
        queueMotion();
      });

      window.addEventListener("resize", measure, { passive: true });
      measure();
    });
  };

  const initializePrivacyConsent = () => {
    const consentKey = "pmh_privacy_notice_accepted_v1";
    const basePath = getBasePath();

    const getConsentValue = () => {
      try {
        return window.localStorage.getItem(consentKey);
      } catch (error) {
        return null;
      }
    };

    const setConsentValue = (value) => {
      try {
        window.localStorage.setItem(consentKey, value);
      } catch (error) {
        // Ignore storage failures and allow the site to keep working.
      }
    };

    if (["accepted", "essential"].includes(getConsentValue())) return;

    const consentDialog = document.createElement("div");
    consentDialog.className = "site-consent";
    consentDialog.setAttribute("data-site-consent", "");
    consentDialog.setAttribute("role", "region");
    consentDialog.setAttribute("aria-labelledby", "siteConsentTitle");
    consentDialog.setAttribute("aria-describedby", "siteConsentDescription");

    consentDialog.innerHTML = `
      <div class="site-consent__backdrop" aria-hidden="true"></div>
      <div class="site-consent__panel">
        <p class="site-consent__eyebrow">Privacy Notice</p>
        <h2 id="siteConsentTitle">Before You Continue</h2>
        <p class="site-consent__description" id="siteConsentDescription">
          Plumbing Match Hub routes homeowner requests to independent local plumbing contractors.
          Review the policies below first if needed. You can then allow full consent
          or continue with essential-only site storage.
        </p>
        <div class="site-consent__links" aria-label="Policy links">
          <a
            class="site-consent__link"
            href="${basePath}privacy-policy.html"
          >Privacy Policy</a>
          <a
            class="site-consent__link"
            href="${basePath}terms-of-service.html"
          >Terms of Service</a>
          <a
            class="site-consent__link"
            href="${basePath}cookie-policy.html"
          >Cookie Policy</a>
        </div>
        <p class="site-consent__note">
          You can open any policy page first. This notice stays visible on every
          page until you choose Accept All or Essential Only.
        </p>
        <div class="site-consent__actions">
          <button
            class="btn btn-secondary"
            type="button"
            data-consent-essential
            data-no-button-icon
          >
            Essential Only
          </button>
          <button class="btn btn-primary" type="button" data-consent-accept>Accept All</button>
        </div>
      </div>
    `;

    const acceptButton = consentDialog.querySelector("[data-consent-accept]");
    const essentialButton = consentDialog.querySelector("[data-consent-essential]");
    essentialButton
      ?.querySelectorAll(".btn-icon, .material-symbols-outlined")
      .forEach((icon) => icon.remove());

    const closeConsent = (value) => {
      setConsentValue(value);
      document.body.classList.remove("consent-open");
      consentDialog.remove();
    };
    acceptButton?.addEventListener("click", () => closeConsent("accepted"));
    essentialButton?.addEventListener("click", () => closeConsent("essential"));

    document.body.append(consentDialog);
    document.body.classList.add("consent-open");
  };

  const initializeHeaderSearch = () => {
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

    if (document.querySelector("[data-site-search]")) return;

    const searchDialog = document.createElement("div");
    searchDialog.className = "site-search";
    searchDialog.setAttribute("data-site-search", "");
    searchDialog.setAttribute("hidden", "");
    searchDialog.innerHTML = `
      <div class="site-search__backdrop" data-site-search-close aria-hidden="true"></div>
      <div
        class="site-search__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="siteSearchTitle"
      >
        <div class="site-search__header">
          <div>
            <p class="site-search__eyebrow">Quick Search</p>
            <h2 id="siteSearchTitle">Search Services and Pages</h2>
            <p class="site-search__helper">
              Search by plumbing issue, service type, or support page.
            </p>
          </div>
          <button
            class="site-search__close"
            type="button"
            data-site-search-close
            aria-label="Close search"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 6 18 18"></path>
              <path d="M18 6 6 18"></path>
            </svg>
          </button>
        </div>
        <label class="site-search__label" for="siteSearchInput">Search the site</label>
        <input
          id="siteSearchInput"
          class="site-search__input"
          type="search"
          placeholder="Try emergency, drain, water heater, leak..."
          autocomplete="off"
        />
        <div class="site-search__results" data-site-search-results></div>
      </div>
    `;

    document.body.append(searchDialog);

    const searchInput = searchDialog.querySelector("#siteSearchInput");
    const resultsContainer = searchDialog.querySelector("[data-site-search-results]");
    const closeButtons = searchDialog.querySelectorAll("[data-site-search-close]");
    let triggerElement = null;
    const getFocusableElements = () =>
      Array.from(searchDialog.querySelectorAll(focusableSelector)).filter(
        (element) =>
          !element.hasAttribute("disabled") &&
          !element.hasAttribute("hidden") &&
          element.getAttribute("aria-hidden") !== "true"
      );
    let firstResultLink = null;

    const buildResultMarkup = (items) =>
      items
        .map((item) => {
          const href = resolveSitePath(item.path);
          const categoryLabel =
            item.category === "Service"
              ? "Service Page"
              : item.category === "Legal"
                ? "Policy Page"
                : "Site Page";
          return `
            <a class="site-search__result" href="${href}">
              <span class="site-search__result-copy">
                <span class="site-search__result-title">${item.title}</span>
                <span class="site-search__result-subtitle">${categoryLabel}</span>
              </span>
              <span class="site-search__result-meta">${item.category}</span>
            </a>
          `;
        })
        .join("");

    const filterResults = (query) => {
      const normalized = query.trim().toLowerCase();
      const items = normalized
        ? serviceSearchPages
            .map((item) => {
              const haystack = `${item.title} ${item.category} ${item.keywords}`.toLowerCase();
              const titleIndex = item.title.toLowerCase().indexOf(normalized);
              const keywordIndex = haystack.indexOf(normalized);
              const matchIndex =
                titleIndex >= 0 ? titleIndex : keywordIndex >= 0 ? keywordIndex : -1;

              return {
                item,
                matchIndex,
              };
            })
            .filter(({ matchIndex }) => matchIndex >= 0)
            .sort((a, b) => a.matchIndex - b.matchIndex)
            .map(({ item }) => item)
        : serviceSearchPages.slice(0, 8);

      resultsContainer.innerHTML = items.length
        ? buildResultMarkup(items.slice(0, 8))
        : `<p class="site-search__empty">No matching pages found. Try “drain”, “toilet”, or “water heater”.</p>`;

      firstResultLink = resultsContainer.querySelector(".site-search__result");
    };

    const openSearch = (sourceTrigger = null) => {
      triggerElement = sourceTrigger;
      searchDialog.hidden = false;
      document.body.classList.add("search-open");
      triggerElement?.setAttribute("aria-expanded", "true");
      filterResults(searchInput?.value || "");
      window.requestAnimationFrame(() => {
        searchInput?.focus();
        searchInput?.select();
      });
    };

    const closeSearch = () => {
      searchDialog.hidden = true;
      document.body.classList.remove("search-open");
      triggerElement?.setAttribute("aria-expanded", "false");
      triggerElement?.focus();
      triggerElement = null;
    };

    closeButtons.forEach((button) => button.addEventListener("click", closeSearch));
    searchInput?.addEventListener("input", (event) => {
      filterResults(event.currentTarget.value);
    });

    searchInput?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && firstResultLink) {
        event.preventDefault();
        firstResultLink.click();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        closeSearch();
      }
    });

    searchDialog.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        const focusableElements = getFocusableElements();
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!firstElement || !lastElement) return;

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeSearch();
      }
    });

    window.PMHOpenSiteSearch = openSearch;

    filterResults("");
  };

  const initializeHeroSearchTrigger = () => {
    const heroSearchTrigger = document.querySelector("[data-hero-search-trigger]");

    if (!heroSearchTrigger) return;

    heroSearchTrigger.setAttribute("aria-haspopup", "dialog");
    heroSearchTrigger.setAttribute("aria-expanded", "false");

    heroSearchTrigger.addEventListener("click", () => {
      window.PMHOpenSiteSearch?.(heroSearchTrigger);
    });
  };

  const initializeFloatingSearchTrigger = () => {
    if (typeof window.PMHOpenSiteSearch !== "function") return;
    if (document.querySelector("[data-floating-search]")) return;

    const floatingSearch = document.createElement("button");
    floatingSearch.type = "button";
    floatingSearch.className = "floating-search";
    floatingSearch.setAttribute("data-floating-search", "");
    floatingSearch.setAttribute("aria-label", "Open site search");
    floatingSearch.setAttribute("aria-haspopup", "dialog");
    floatingSearch.setAttribute("aria-expanded", "false");
    floatingSearch.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="6.5"></circle>
        <path d="M16.2 16.2 21 21"></path>
      </svg>
    `;

    const updateFloatingSearch = () => {
      const shouldShow = window.scrollY > 280;
      floatingSearch.classList.toggle("is-visible", shouldShow);
    };

    floatingSearch.addEventListener("click", () => {
      window.PMHOpenSiteSearch?.(floatingSearch);
    });

    document.body.append(floatingSearch);
    window.addEventListener("scroll", updateFloatingSearch, { passive: true });
    window.addEventListener("resize", updateFloatingSearch);
    updateFloatingSearch();
  };

  const initializeMobileHeroForm = () => {
    const formWrap = document.querySelector("[data-mobile-hero-form]");
    if (!formWrap) return;

    const toggle = formWrap.querySelector("[data-hero-form-toggle]");
    const toggleIcon = formWrap.querySelector("[data-hero-form-toggle-icon]");
    const panel = formWrap.querySelector("[data-hero-form-panel]");
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    if (!toggle || !panel) return;

    let userInteracted = false;
    let isExpanded = false;

    const renderMobileState = (expanded) => {
      isExpanded = expanded;
      toggle.setAttribute("aria-expanded", String(expanded));
      formWrap.dataset.mobileExpanded = String(expanded);
      panel.hidden = !expanded;

      if (toggleIcon) {
        toggleIcon.textContent = expanded ? "-" : "+";
      }
    };

    const syncFormState = () => {
      if (mobileQuery.matches) {
        renderMobileState(userInteracted ? isExpanded : false);
        return;
      }

      panel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      formWrap.dataset.mobileExpanded = "true";

      if (toggleIcon) {
        toggleIcon.textContent = "-";
      }
    };

    toggle.addEventListener("click", () => {
      if (!mobileQuery.matches) return;

      userInteracted = true;
      renderMobileState(!isExpanded);
    });

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", syncFormState);
    } else if (typeof mobileQuery.addListener === "function") {
      mobileQuery.addListener(syncFormState);
    }

    syncFormState();
  };

  enhanceInterfaceWithIcons();
  initializeHeaderSearch();
  initializeHeroSearchTrigger();
  initializeFloatingSearchTrigger();
  initializeMobileHeroForm();
  initializePrivacyConsent();
  initializeServiceHeroMotion();
  addFloatingAccents();
  initializeAos();
})();
