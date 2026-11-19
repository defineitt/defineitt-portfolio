(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const loader = document.querySelector(".intro-loader");
  let previousFocus = null;

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  // Keep the first visit cinematic without holding up the page if it loads slowly.
  window.setTimeout(() => {
    if (!loader) return;
    loader.classList.add("is-gone");
    window.setTimeout(() => loader.remove(), 700);
  }, 1550);

  const setMenu = (open) => {
    menuButton?.setAttribute("aria-expanded", String(open));
    menuButton?.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    mobileMenu?.setAttribute("aria-hidden", String(!open));
    mobileMenu?.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    if (open) {
      previousFocus = document.activeElement;
      mobileMenu?.querySelector("a")?.focus({ preventScroll: true });
    } else if (previousFocus instanceof HTMLElement) {
      previousFocus.focus({ preventScroll: true });
    }
  };

  menuButton?.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });
  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") setMenu(false);
  });

  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 18);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const revealNodes = document.querySelectorAll(".reveal, .process-track");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -28px 0px" });
    revealNodes.forEach((node) => revealObserver.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  }

  const videos = [...document.querySelectorAll("video.lazy-video")];
  const attachVideo = (video) => {
    if (video.dataset.loaded) return;
    const source = video.dataset.src;
    if (!source) return;
    video.src = source;
    video.dataset.loaded = "true";
    video.load();
  };
  if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const video = entry.target;
        attachVideo(video);
        if (video.closest(".hero-reel") && !reduceMotion) {
          video.play().catch(() => {});
        }
        observer.unobserve(video);
      });
    }, { rootMargin: "320px 0px" });
    videos.forEach((video) => videoObserver.observe(video));
  } else {
    videos.forEach(attachVideo);
  }

  document.querySelectorAll(".work-media").forEach((card) => {
    const video = card.querySelector("video");
    const playButton = card.querySelector(".play-toggle");
    const soundButton = card.querySelector(".sound-toggle");
    if (!video || !playButton || !soundButton) return;
    let manuallyPlaying = false;

    const syncPlay = () => {
      const playing = !video.paused;
      playButton.setAttribute("aria-pressed", String(playing));
      playButton.setAttribute("aria-label", playing ? "Pause clip" : "Play clip");
      playButton.querySelector(".play-glyph").textContent = playing ? "Ⅱ" : "▶";
    };
    const syncSound = () => {
      soundButton.setAttribute("aria-pressed", String(!video.muted));
      soundButton.setAttribute("aria-label", video.muted ? "Unmute clip" : "Mute clip");
      soundButton.textContent = video.muted ? "SOUND OFF" : "SOUND ON";
    };

    playButton.addEventListener("click", () => {
      attachVideo(video);
      if (video.paused) {
        manuallyPlaying = true;
        video.play().catch(() => {});
      } else {
        manuallyPlaying = false;
        video.pause();
      }
    });
    soundButton.addEventListener("click", () => {
      attachVideo(video);
      video.muted = !video.muted;
      if (video.paused) video.play().catch(() => {});
      syncSound();
    });
    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch" || reduceMotion) return;
      attachVideo(video);
      video.play().catch(() => {});
    });
    card.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "touch" || manuallyPlaying) return;
      video.pause();
    });
    video.addEventListener("play", syncPlay);
    video.addEventListener("pause", syncPlay);
    syncPlay();
    syncSound();
  });

  const countNodes = document.querySelectorAll("[data-count]");
  const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value);
  const runCount = (node) => {
    const target = Number(node.dataset.count || 0);
    if (reduceMotion) {
      node.textContent = formatNumber(target);
      return;
    }
    const start = performance.now();
    const duration = 1500;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      node.textContent = formatNumber(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const statsSection = document.querySelector(".stats");
  if (statsSection && countNodes.length && "IntersectionObserver" in window && !reduceMotion) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      countNodes.forEach(runCount);
      observer.disconnect();
    }, { threshold: 0.2 });
    statsObserver.observe(statsSection);
  } else {
    countNodes.forEach(runCount);
  }

  const comparison = document.querySelector(".comparison");
  const slider = document.querySelector(".comparison-range");
  const setSplit = (value) => comparison?.style.setProperty("--split", `${value}%`);
  slider?.addEventListener("input", (event) => setSplit(event.currentTarget.value));
  if (slider) setSplit(slider.value);

  const partnershipForm = document.querySelector("#partnership-form");
  const formStatus = document.querySelector("#form-status");
  partnershipForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!partnershipForm.reportValidity()) return;
    const form = new FormData(partnershipForm);
    const subject = `Creator partnership inquiry — ${form.get("name")}`;
    const message = [
      `Name: ${form.get("name")}`,
      `Email: ${form.get("email")}`,
      `Channel: ${form.get("channel")}`,
      `Platform: ${form.get("platform")}`,
      "",
      `Message: ${form.get("message") || "(not provided)"}`,
    ].join("\n");
    const mailto = `mailto:whodefinedit@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    if (formStatus) {
      formStatus.dataset.state = "success";
      formStatus.textContent = "Opening your email app with the inquiry filled in. Send it there to reach us.";
    }
    window.location.href = mailto;
  });

  if (finePointer && !reduceMotion) {
    const cursor = document.querySelector(".cursor-aura");
    let cursorFrame = 0;
    let cursorX = 0;
    let cursorY = 0;
    document.addEventListener("pointermove", (event) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      if (cursorFrame) return;
      cursorFrame = requestAnimationFrame(() => {
        cursor?.style.setProperty("left", `${cursorX}px`);
        cursor?.style.setProperty("top", `${cursorY}px`);
        document.body.classList.add("cursor-ready");
        cursorFrame = 0;
      });
    }, { passive: true });
    document.querySelectorAll("a, button, input, select, textarea, .comparison-range").forEach((node) => {
      node.addEventListener("pointerenter", () => document.body.classList.add("cursor-hover"));
      node.addEventListener("pointerleave", () => document.body.classList.remove("cursor-hover"));
    });

    document.querySelectorAll(".magnetic").forEach((node) => {
      node.addEventListener("pointermove", (event) => {
        const rect = node.getBoundingClientRect();
        const dx = event.clientX - rect.left - rect.width / 2;
        const dy = event.clientY - rect.top - rect.height / 2;
        node.style.transform = `translate3d(${dx * 0.1}px, ${dy * 0.1}px, 0)`;
      });
      node.addEventListener("pointerleave", () => { node.style.transform = ""; });
    });

    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.setProperty("--tilt-x", `${-y * 3}deg`);
        card.style.setProperty("--tilt-y", `${x * 3}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });

    let scrollFrame = 0;
    const parallaxNodes = document.querySelectorAll(".parallax");
    const updateParallax = () => {
      const scroll = window.scrollY;
      parallaxNodes.forEach((node) => {
        const speed = Number(node.dataset.speed || 0);
        node.style.setProperty("--parallax-y", `${Math.max(-32, Math.min(32, scroll * speed))}px`);
      });
      scrollFrame = 0;
    };
    window.addEventListener("scroll", () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateParallax);
    }, { passive: true });
  }
})();
