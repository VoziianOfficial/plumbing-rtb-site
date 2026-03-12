(function () {
  const stickyCall = document.querySelector("[data-floating-call]");
  if (!stickyCall) return;

  const onScroll = () => {
    const shouldShow = window.innerWidth <= 1080 && window.scrollY > 280;
    stickyCall.classList.toggle("is-visible", shouldShow);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
