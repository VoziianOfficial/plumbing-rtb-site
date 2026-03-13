(function () {
  const items = document.querySelectorAll("[data-faq-item]");
  if (!items.length) return;

  const closeItem = (item) => {
    item.classList.remove("is-open");

    const button = item.querySelector("[data-faq-button]");
    if (button) {
      button.setAttribute("aria-expanded", "false");
      const icon = button.querySelector("[data-faq-icon]");
      if (icon) icon.textContent = "+";
    }

    const answer = item.querySelector(".faq-answer");
    if (answer) {
      answer.style.maxHeight = "0px";
    }
  };

  const openItem = (item, button) => {
    item.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");

    const icon = button.querySelector("[data-faq-icon]");
    if (icon) icon.textContent = "-";

    const answer = item.querySelector(".faq-answer");
    if (answer) {
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  };

  items.forEach((item) => {
    const button = item.querySelector("[data-faq-button]");
    if (!button) return;

    closeItem(item);

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      items.forEach((other) => closeItem(other));

      if (!isOpen) {
        openItem(item, button);
      }
    });
  });

  window.addEventListener("resize", () => {
    items.forEach((item) => {
      if (!item.classList.contains("is-open")) return;
      const answer = item.querySelector(".faq-answer");
      if (answer) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
})();
