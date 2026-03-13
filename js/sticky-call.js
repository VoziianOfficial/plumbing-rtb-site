(function () {
  const stickyCall = document.querySelector("[data-floating-call]");
  if (!stickyCall) return;
  const isContactPage = /(?:^|\/)contact\.html$/.test(window.location.pathname);

  const onScroll = () => {
    const shouldShow =
      window.scrollY > 280 && (isContactPage || window.innerWidth <= 1080);
    stickyCall.classList.toggle("is-visible", shouldShow);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
