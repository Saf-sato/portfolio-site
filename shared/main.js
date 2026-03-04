(function () {
  const btn = document.getElementById("menuButton");
  const drawer = document.getElementById("siteDrawer");
  const overlay = document.getElementById("overlay");

  /** @type {HTMLElement | null} */
  let lastFocused = null;

  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  function getFocusable(container) {
    return Array.from(container.querySelectorAll(focusableSelector)).filter(
      (el) => el.offsetParent !== null
    );
  }

  function setOpen(open) {
    btn.classList.toggle("is-open", open);

    btn.setAttribute("aria-expanded", String(open));
    drawer.setAttribute("aria-hidden", String(!open));

    document.body.classList.toggle("is-locked", open);

    if (open) {
      lastFocused =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

      drawer.hidden = false;
      overlay.hidden = false;

      requestAnimationFrame(() => {
        drawer.classList.add("is-open");
        overlay.classList.add("is-open");

        const focusables = getFocusable(drawer);
        (focusables[0] || drawer).focus?.();
      });
    } else {
      drawer.classList.remove("is-open");
      overlay.classList.remove("is-open");

      window.setTimeout(() => {
        drawer.hidden = true;
        overlay.hidden = true;
        lastFocused?.focus?.();
      }, 240);
    }
  }

  function isOpen() {
    return btn.getAttribute("aria-expanded") === "true";
  }

  function toggle() {
    setOpen(!isOpen());
  }

  function onKeyDown(e) {
    if (!isOpen()) return;

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }

    if (e.key !== "Tab") return;

    const focusables = getFocusable(drawer);
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    const active = document.activeElement;
    const goingBackward = e.shiftKey;

    if (!goingBackward && active === last) {
      e.preventDefault();
      first.focus();
    } else if (goingBackward && active === first) {
      e.preventDefault();
      last.focus();
    }
  }

  btn.addEventListener("click", toggle);
  overlay.addEventListener("click", () => setOpen(false));

  // Close when clicking a link inside the drawer (typical portfolio UX)
  drawer.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLElement && target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", onKeyDown);

  // If viewport changes (e.g., rotate), keep hidden state consistent
  window.addEventListener("resize", () => {
    if (!isOpen()) {
      drawer.hidden = true;
      overlay.hidden = true;
      drawer.classList.remove("is-open");
      overlay.classList.remove("is-open");
    }
  });
})();
