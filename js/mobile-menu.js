(function () {
  const toggleButton = document.querySelector("[data-mobile-toggle]");
  const drawer = document.querySelector("[data-mobile-drawer]");
  const overlay = document.querySelector("[data-drawer-overlay]");

  if (!toggleButton || !drawer || !overlay) return;

  const nav = drawer.querySelector("nav");
  const mainList = nav?.querySelector("ul");
  if (!nav || !mainList) return;

  const createIcon = (name, className = "") => {
    const icon = document.createElement("span");
    icon.className = `material-symbols-outlined ${className}`.trim();
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = name;
    return icon;
  };

  const createCloseIcon = () => {
    const namespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(namespace, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("mobile-drawer-close-icon");

    const path = document.createElementNS(namespace, "path");
    path.setAttribute(
      "d",
      "M6.4 6.4a1 1 0 0 1 1.4 0L12 10.6l4.2-4.2a1 1 0 1 1 1.4 1.4L13.4 12l4.2 4.2a1 1 0 0 1-1.4 1.4L12 13.4l-4.2 4.2a1 1 0 0 1-1.4-1.4l4.2-4.2-4.2-4.2a1 1 0 0 1 0-1.4Z"
    );
    path.setAttribute("fill", "currentColor");
    svg.append(path);

    return svg;
  };

  const createMenuIcon = () => {
    const namespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(namespace, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("mobile-toggle-icon");

    const path = document.createElementNS(namespace, "path");
    path.setAttribute("d", "M5 7.5h14M8 12h11M5 16.5h14");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-width", "2.2");
    svg.append(path);

    return svg;
  };

  const inServicesFolder = window.location.pathname.includes("/services/");
  const basePath = inServicesFolder ? "../" : "";

  if (!toggleButton.querySelector(".mobile-toggle-icon")) {
    toggleButton.replaceChildren(createMenuIcon());
  }

  const serviceLinks = [
    { href: "services/emergency-plumbing.html", label: "Emergency Plumbing" },
    {
      href: "services/plumbing-repairs-maintenance.html",
      label: "Repairs & Maintenance",
    },
    { href: "services/drain-cleaning.html", label: "Drain Cleaning" },
    {
      href: "services/plumbing-replacement.html",
      label: "Plumbing Replacement",
    },
    {
      href: "services/plumbing-installation.html",
      label: "Plumbing Installation",
    },
    {
      href: "services/water-heater-services.html",
      label: "Water Heater Services",
    },
    { href: "services/leak-detection.html", label: "Leak Detection" },
    {
      href: "services/toilet-repair-installation.html",
      label: "Toilet Repair & Installation",
    },
    {
      href: "services/faucet-fixture-services.html",
      label: "Faucet & Fixture Services",
    },
  ];

  const ctaBlock = drawer.querySelector(".drawer-cta");
  if (ctaBlock) ctaBlock.remove();

  let servicesToggle;
  let servicesList;
  const topLevelItems = Array.from(mainList.children).filter(
    (node) => node.tagName === "LI"
  );
  const servicesItem = topLevelItems.find((item) => {
    const link = item.querySelector("a");
    if (!link) return false;
    const label = link.textContent.trim().toLowerCase();
    const href = link.getAttribute("href") || "";
    return label === "services" || href.includes("#services");
  });

  if (servicesItem) {
    servicesToggle = document.createElement("button");
    servicesToggle.type = "button";
    servicesToggle.className = "mobile-services-toggle";
    servicesToggle.setAttribute("aria-expanded", "false");
    servicesToggle.setAttribute("aria-controls", "mobileServicesList");
    servicesToggle.setAttribute("aria-label", "Toggle service links");
    const servicesToggleLabel = document.createElement("span");
    servicesToggleLabel.className = "mobile-services-label";
    servicesToggleLabel.append(createIcon("construction", "menu-link-icon"));
    servicesToggleLabel.append("Services");
    servicesToggle.append(servicesToggleLabel);
    const servicesChevron = document.createElement("span");
    servicesChevron.className = "mobile-services-chevron";
    servicesChevron.setAttribute("aria-hidden", "true");
    servicesToggle.append(servicesChevron);

    servicesList = document.createElement("ul");
    servicesList.className = "mobile-services-list";
    servicesList.id = "mobileServicesList";
    servicesList.hidden = true;

    serviceLinks.forEach((service) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `${basePath}${service.href}`;
      link.append(createIcon("chevron_right", "menu-link-icon"));
      link.append(service.label);
      link.setAttribute("data-mobile-close", "");
      item.append(link);
      servicesList.append(item);
    });

    servicesItem.replaceChildren(servicesToggle, servicesList);
  }

  const existingCookieSettings = drawer.querySelector(".mobile-cookie-settings");
  if (!existingCookieSettings) {
    const cookieSettingsLink = document.createElement("a");
    cookieSettingsLink.className = "mobile-cookie-settings";
    cookieSettingsLink.href = `${basePath}cookie-policy.html`;
    cookieSettingsLink.append(createIcon("cookie", "menu-link-icon"));
    cookieSettingsLink.append("Cookie Settings");
    cookieSettingsLink.dataset.iconized = "true";
    cookieSettingsLink.setAttribute("data-mobile-close", "");
    nav.append(cookieSettingsLink);
  }

  let closeButton = drawer.querySelector("[data-mobile-drawer-close]");
  if (!closeButton) {
    closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "mobile-drawer-close";
    closeButton.setAttribute("aria-label", "Close menu");
    closeButton.setAttribute("data-mobile-drawer-close", "");
    closeButton.append(createCloseIcon());
    drawer.prepend(closeButton);
  }

  const closeServicesMenu = () => {
    if (!servicesToggle || !servicesList) return;
    servicesToggle.setAttribute("aria-expanded", "false");
    servicesList.hidden = true;
    servicesList.classList.remove("is-open");
  };

  const toggleServicesMenu = () => {
    if (!servicesToggle || !servicesList) return;
    const expanded = servicesToggle.getAttribute("aria-expanded") === "true";
    servicesToggle.setAttribute("aria-expanded", expanded ? "false" : "true");
    servicesList.hidden = expanded;
    servicesList.classList.toggle("is-open", !expanded);
  };

  const openMenu = () => {
    drawer.classList.add("is-open");
    overlay.classList.add("is-open");
    document.body.classList.add("menu-open");
    toggleButton.setAttribute("aria-expanded", "true");
    drawer.setAttribute("aria-hidden", "false");
    closeButton.focus({ preventScroll: true });
  };

  const closeMenu = () => {
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    toggleButton.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
    closeServicesMenu();
    toggleButton.focus({ preventScroll: true });
  };

  toggleButton.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("is-open");
    if (isOpen) {
      closeMenu();
      return;
    }
    openMenu();
  });

  overlay.addEventListener("click", closeMenu);
  closeButton.addEventListener("click", closeMenu);
  if (servicesToggle) {
    servicesToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleServicesMenu();
    });
  }

  drawer.addEventListener("click", (event) => {
    const target = event.target.closest("[data-mobile-close]");
    if (!target) return;
    closeMenu();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
})();
