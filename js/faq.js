(function () {
  const items = document.querySelectorAll("[data-faq-item]");
  if (!items.length) return;

  items.forEach((item) => {
    const button = item.querySelector("[data-faq-button]");
    if (!button) return;

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      items.forEach((other) => {
        other.classList.remove("is-open");
        const otherButton = other.querySelector("[data-faq-button]");
        if (otherButton) {
          otherButton.setAttribute("aria-expanded", "false");
          const icon = otherButton.querySelector("[data-faq-icon]");
          if (icon) icon.textContent = "+";
        }
      });

      if (!isOpen) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
        const icon = button.querySelector("[data-faq-icon]");
        if (icon) icon.textContent = "-";
      }
    });
  });
})();
