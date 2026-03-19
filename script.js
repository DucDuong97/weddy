const SERVER_URL = "https://weddy-production-19a6.up.railway.app"; // replace with your deployed server URL

// ── Page loading screen (hides once all static assets are ready) ──────────────
const pageLoadingScreen = document.getElementById("loading-screen");

if (pageLoadingScreen) {
  const dismissLoadingScreen = () => {
    pageLoadingScreen.classList.add("is-hidden");
    pageLoadingScreen.addEventListener(
      "transitionend",
      () => pageLoadingScreen.remove(),
      { once: true }
    );
  };

  // CSS background-image URLs are not tracked by window.load, so we preload them manually.
  const bgImagePromises = Array.from(document.querySelectorAll(".slide[style]")).map(
    (el) =>
      new Promise((resolve) => {
        const match = el.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (!match) return resolve();
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = match[1];
      })
  );

  const windowLoaded = new Promise((resolve) => window.addEventListener("load", resolve));

  Promise.all([windowLoaded, ...bgImagePromises]).then(dismissLoadingScreen);
}
// ─────────────────────────────────────────────────────────────────────────────

const loadingScreen = document.getElementById("letter-seal-screen");
const openInvitationButton = document.getElementById("open-invitation");
const loadingGuestName = document.getElementById("loading-guest-name");
const greeting = document.getElementById("attendance-greeting");
const DEFAULT_GUEST_NAME = "";
const TEXT_FADE_DURATION = 600;
const UNSEAL_DURATION = 1000;
let isOpeningInvitation = false;

const params = new URLSearchParams(window.location.search);
const _decodeBase64UrlName = (str) => {
  try {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
  } catch {
    return "";
  }
};
const _nParam = params.get("n");
const _rawGuestName = _nParam ? _decodeBase64UrlName(_nParam) : params.get("name")?.trim();
const guestName = _rawGuestName || DEFAULT_GUEST_NAME;
const hasGuestNameFromQuery = Boolean(_rawGuestName);

const openInvitation = () => {
  if (!loadingScreen || isOpeningInvitation) {
    return;
  }

  isOpeningInvitation = true;
  loadingScreen.classList.add("is-opening");

  window.setTimeout(() => {
    loadingScreen.classList.add("is-unsealing");
  }, TEXT_FADE_DURATION);

  window.setTimeout(() => {
    loadingScreen.classList.add("hidden");
    document.body.classList.remove("loading-active");
    document.querySelector(".hero")?.classList.add("hero-revealed");
  }, TEXT_FADE_DURATION + UNSEAL_DURATION);
};

const isLocalhost = ["localhost", "127.0.0.1", ""].includes(window.location.hostname);

if (loadingScreen && isLocalhost) {
  loadingScreen.classList.add("hidden");
  document.querySelector(".hero")?.classList.add("hero-revealed");
} else if (loadingScreen) {
  document.body.classList.add("loading-active");
} else {
  document.querySelector(".hero")?.classList.add("hero-revealed");
}

window.addEventListener("load", () => {
  if (loadingGuestName) {
    loadingGuestName.textContent = guestName || "";
  }

  if (greeting) {
    greeting.textContent = guestName
      ? `${guestName} ơi, sự hiện diện của bạn là món quà quý giá nhất đối với chúng tôi.`
      : "Sự hiện diện của bạn là món quà quý giá nhất đối với chúng tôi.";
  }
});

// Slideshow
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;
const SLIDE_DURATION = 6000;

const advanceSlide = () => {
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
};

setInterval(advanceSlide, SLIDE_DURATION);

const storySliders = document.querySelectorAll("[data-story-slider]");

storySliders.forEach((slider) => {
  const track = slider.querySelector(".story-slider__track");
  const sliderSlides = slider.querySelectorAll(".story-slider__slide");
  const dots = slider.querySelectorAll("[data-story-dot]");

  const prevButton = document.createElement("button");
  prevButton.className = "story-slider__button story-slider__button--prev";
  prevButton.type = "button";
  prevButton.setAttribute("aria-label", "Xem anh truoc");
  prevButton.setAttribute("data-story-prev", "");
  prevButton.innerHTML = "&#8249;";
  slider.appendChild(prevButton);

  const nextButton = document.createElement("button");
  nextButton.className = "story-slider__button story-slider__button--next";
  nextButton.type = "button";
  nextButton.setAttribute("aria-label", "Xem anh tiep theo");
  nextButton.setAttribute("data-story-next", "");
  nextButton.innerHTML = "&#8250;";
  slider.appendChild(nextButton);

  if (sliderSlides.length <= 1) {
    prevButton.style.display = "none";
    nextButton.style.display = "none";
  }

  if (!track || sliderSlides.length === 0) {
    return;
  }

  let currentStorySlide = 0;

  const updateStorySlider = (nextIndex) => {
    currentStorySlide = (nextIndex + sliderSlides.length) % sliderSlides.length;
    track.style.transform = `translateX(-${currentStorySlide * 100}%)`;

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentStorySlide);
      dot.setAttribute("aria-pressed", dotIndex === currentStorySlide ? "true" : "false");
    });
  };

  prevButton?.addEventListener("click", () => {
    updateStorySlider(currentStorySlide - 1);
  });

  nextButton?.addEventListener("click", () => {
    updateStorySlider(currentStorySlide + 1);
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      updateStorySlider(dotIndex);
    });
  });

  updateStorySlider(0);
});

if (openInvitationButton) {
  openInvitationButton.addEventListener("click", openInvitation);
}

// CD Music Player
const bgMusic = document.getElementById("bg-music");
const cdPlayer = document.getElementById("cd-player");

const startMusic = () => {
  setTimeout(() => {
    if (!bgMusic) return;
    bgMusic.volume = 0.6;
    bgMusic.play().catch(() => {});
  }, 2000);
};

const toggleMute = () => {
  if (!bgMusic || !cdPlayer) return;
  const muted = !bgMusic.muted;
  bgMusic.muted = muted;
  cdPlayer.classList.toggle("is-muted", muted);
  cdPlayer.setAttribute("aria-pressed", String(muted));
};

if (cdPlayer) {
  cdPlayer.addEventListener("click", toggleMute);
}

// Start music after the invitation is opened (requires user gesture)
if (openInvitationButton) {
  openInvitationButton.addEventListener("click", startMusic, { once: true });
}

// Section entrance animations
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        sectionObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll("[data-animate-section]").forEach((el) => sectionObserver.observe(el));

// RSVP

const rsvpMessageInput = document.getElementById("rsvp-message");
const rsvpNameField = document.getElementById("rsvp-name-field");
const rsvpNameInput = document.getElementById("rsvp-name");
const rsvpAcceptBtn = document.getElementById("rsvp-accept");
const rsvpDeclineBtn = document.getElementById("rsvp-decline");
const rsvpFormWrap = document.getElementById("rsvp-form-wrap");
const rsvpFeedback = document.getElementById("rsvp-feedback");
const rsvpFeedbackIcon = document.getElementById("rsvp-feedback-icon");
const rsvpFeedbackText = document.getElementById("rsvp-feedback-text");

if (rsvpNameField) {
  rsvpNameField.hidden = hasGuestNameFromQuery;
}

if (rsvpNameInput) {
  rsvpNameInput.required = !hasGuestNameFromQuery;
}

const sendRsvpToServer = async (attending, name, message) => {
  await fetch(SERVER_URL + "/rsvp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ attending, name, message }),
  });
};

const getRsvpName = () => {
  if (hasGuestNameFromQuery) {
    return guestName;
  }

  const typedName = rsvpNameInput?.value.trim() || "";

  if (!typedName && rsvpNameInput) {
    rsvpNameInput.reportValidity();
    rsvpNameInput.focus();
  }

  return typedName;
};

const submitRsvp = async (attending) => {
  const name = getRsvpName();
  const message = rsvpMessageInput?.value.trim() || "";

  if (!name) {
    return;
  }

  if (rsvpAcceptBtn) rsvpAcceptBtn.disabled = true;
  if (rsvpDeclineBtn) rsvpDeclineBtn.disabled = true;

  try {
    await sendRsvpToServer(attending, name, message);
  } catch (_) {
    // fail silently — still show thank-you
  }

  if (rsvpFormWrap) rsvpFormWrap.hidden = true;
  if (rsvpFeedback) rsvpFeedback.hidden = false;

  if (attending) {
    if (rsvpFeedbackIcon) rsvpFeedbackIcon.textContent = "🎉";
    if (rsvpFeedbackText) {
      rsvpFeedbackText.textContent = `Cảm ơn ${name}! Chúng mình rất vui khi được đón tiếp bạn. Hẹn gặp nhau vào ngày 20 tháng 04 năm 2026 nhé!`;
    }
  } else {
    if (rsvpFeedbackIcon) rsvpFeedbackIcon.textContent = "💌";
    if (rsvpFeedbackText) {
      rsvpFeedbackText.textContent = `Cảm ơn ${name} đã thông báo. Chúng mình rất tiếc khi không được gặp bạn, nhưng luôn trân trọng tình cảm của bạn!`;
    }
  }
};

if (rsvpAcceptBtn) {
  rsvpAcceptBtn.addEventListener("click", () => submitRsvp(true));
}

if (rsvpDeclineBtn) {
  rsvpDeclineBtn.addEventListener("click", () => submitRsvp(false));
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
const lightbox        = document.getElementById("lightbox");
const lightboxImg     = document.getElementById("lightbox-img");
const lightboxClose   = document.getElementById("lightbox-close");
const lightboxPrev    = document.getElementById("lightbox-prev");
const lightboxNext    = document.getElementById("lightbox-next");
const lightboxBackdrop = document.getElementById("lightbox-backdrop");

const galleryImgs = Array.from(
  document.querySelectorAll(".wedding-gallery__grid .gallery-item img")
);

let currentLightboxIdx = 0;

const openLightbox = (idx) => {
  currentLightboxIdx = idx;
  const img = galleryImgs[idx];
  lightboxImg.src = img.dataset.full || img.src;
  lightboxImg.alt = img.alt;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
};

const closeLightbox = () => {
  lightbox.hidden = true;
  lightboxImg.src = "";
  document.body.style.overflow = "";
};

const showPrev = () => {
  const idx = (currentLightboxIdx - 1 + galleryImgs.length) % galleryImgs.length;
  openLightbox(idx);
};

const showNext = () => {
  const idx = (currentLightboxIdx + 1) % galleryImgs.length;
  openLightbox(idx);
};

galleryImgs.forEach((img, idx) => {
  img.parentElement.addEventListener("click", () => openLightbox(idx));
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxBackdrop.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", showPrev);
lightboxNext.addEventListener("click", showNext);

document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape")      closeLightbox();
  if (e.key === "ArrowLeft")   showPrev();
  if (e.key === "ArrowRight")  showNext();
});
