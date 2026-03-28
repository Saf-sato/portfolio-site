/* ==================================
header  --Hamburger + Drawer
================================== */
(() => {
  const btn = document.getElementById("menuButton");
  const drawer = document.getElementById("siteDrawer");
  const overlay = document.getElementById("overlay");

  let lastFocus = null;

  const q = (r) =>
    [
      ...r.querySelectorAll(
        "a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex='-1'])"
      ),
    ].filter((el) => el.offsetParent);

  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  // CSS変数 --dur を読む（"240ms" / "0.24s" どっちも対応）
  const dur = () => {
    const s = getComputedStyle(document.documentElement)
      .getPropertyValue("--dur")
      .trim();
    const n = parseFloat(s) || 0;
    return s.endsWith("ms") ? n : s.endsWith("s") ? n * 1000 : 240;
  };

  const isOpen = () => btn.getAttribute("aria-expanded") === "true";

  const sync = (open) => {
    btn.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
    drawer.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("is-locked", open);
  };

  const open = () => {
    if (isOpen()) return;
    lastFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    drawer.hidden = overlay.hidden = false;
    sync(true);

    requestAnimationFrame(() => {
      drawer.classList.add("is-open");
      overlay.classList.add("is-open");
      (q(drawer)[0] || drawer).focus?.();
    });
  };

  const close = (immediate = reduced()) => {
    if (!isOpen()) return;

    sync(false);
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");

    const done = () => {
      drawer.hidden = overlay.hidden = true;
      lastFocus?.focus?.();
    };
    immediate ? done() : setTimeout(done, dur());
  };

  btn.addEventListener("click", () => (isOpen() ? close() : open()));
  overlay.addEventListener("click", () => close());
  drawer.addEventListener("click", (e) => {
    if (e.target instanceof HTMLElement && e.target.closest("a")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!isOpen()) return;

    if (e.key === "Escape") return e.preventDefault(), close();

    if (e.key !== "Tab") return;
    const f = q(drawer);
    if (!f.length) return;

    const first = f[0],
      last = f[f.length - 1];
    const active = document.activeElement;

    if (!e.shiftKey && active === last) e.preventDefault(), first.focus();
    else if (e.shiftKey && active === first) e.preventDefault(), last.focus();
  });

  window.addEventListener("resize", () => !isOpen() && close(true));
})();

/* ==================================
common  --simpleParallax CSS
================================== */

(() => {
  const parallaxItems = document.querySelectorAll(".parallax");

  if (!parallaxItems.length) return;

  const updateParallax = () => {
    const scrollY = window.scrollY;

    parallaxItems.forEach((el) => {
      const speed = Number(el.dataset.speed) || 0.3;
      const y = scrollY * speed;
      el.style.transform = `translateY(${y}px)`;
    });
  };

  window.addEventListener("scroll", updateParallax, { passive: true });
  updateParallax();
})();

/* ==================================
common data-animate="fade"
================================== */

window.addEventListener("load", () => {
  const fadeIns = document.querySelectorAll('[data-animate="fade"]');

  setTimeout(() => {
    fadeIns.forEach((el) => {
      el.classList.add("is__show");
    });
  }, 100);
});

/* ==================================
common --scroll-image CSS
================================== */

const scrollImages = document.querySelectorAll(".scroll-image");

window.addEventListener("scroll", () => {
  scrollImages.forEach((wrap) => {
    const img = wrap.querySelector("img");
    const rect = wrap.getBoundingClientRect();
    const windowH = window.innerHeight;

    // 要素が画面内にある時だけ動かす
    if (rect.bottom > 0 && rect.top < windowH) {
      const progress = (windowH - rect.top) / (windowH + rect.height);
      const moveY = (progress - 0.5) * 200; // 動く量
      img.style.transform = `translateY(${moveY}px)`;
    }
  });
});
