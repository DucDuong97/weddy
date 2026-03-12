const loadingScreen = document.getElementById("letter-seal-screen");
const openInvitationButton = document.getElementById("open-invitation");
const loadingGuestName = document.getElementById("loading-guest-name");
const greeting = document.getElementById("attendance-greeting");
const DEFAULT_GUEST_NAME = "";
const TEXT_FADE_DURATION = 600;
const UNSEAL_DURATION = 1000;
let isOpeningInvitation = false;

const params = new URLSearchParams(window.location.search);
const guestName = params.get("name")?.trim() || DEFAULT_GUEST_NAME;

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
    loadingGuestName.textContent = guestName;
  }

  if (greeting) {
    greeting.textContent = `${guestName} ơi, sự hiện diện của bạn là món quà quý giá nhất đối với chúng tôi.`;
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
  const prevButton = slider.querySelector("[data-story-prev]");
  const nextButton = slider.querySelector("[data-story-next]");
  const dots = slider.querySelectorAll("[data-story-dot]");

  if (!track || sliderSlides.length === 0) {
    return;
  }

  let currentStorySlide = 0;
  let autoPlayId;

  const updateStorySlider = (nextIndex) => {
    currentStorySlide = (nextIndex + sliderSlides.length) % sliderSlides.length;
    track.style.transform = `translateX(-${currentStorySlide * 100}%)`;

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentStorySlide);
      dot.setAttribute("aria-pressed", dotIndex === currentStorySlide ? "true" : "false");
    });
  };

  const startAutoPlay = () => {
    if (sliderSlides.length <= 1) {
      return;
    }

    autoPlayId = window.setInterval(() => {
      updateStorySlider(currentStorySlide + 1);
    }, 4500);
  };

  const stopAutoPlay = () => {
    window.clearInterval(autoPlayId);
  };

  prevButton?.addEventListener("click", () => {
    stopAutoPlay();
    updateStorySlider(currentStorySlide - 1);
    startAutoPlay();
  });

  nextButton?.addEventListener("click", () => {
    stopAutoPlay();
    updateStorySlider(currentStorySlide + 1);
    startAutoPlay();
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      stopAutoPlay();
      updateStorySlider(dotIndex);
      startAutoPlay();
    });
  });

  slider.addEventListener("mouseenter", stopAutoPlay);
  slider.addEventListener("mouseleave", startAutoPlay);
  slider.addEventListener("focusin", stopAutoPlay);
  slider.addEventListener("focusout", startAutoPlay);

  updateStorySlider(0);
  startAutoPlay();
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
const SLACK_WEBHOOK = "";

const rsvpMessageInput = document.getElementById("rsvp-message");
const rsvpAcceptBtn = document.getElementById("rsvp-accept");
const rsvpDeclineBtn = document.getElementById("rsvp-decline");
const rsvpFormWrap = document.getElementById("rsvp-form-wrap");
const rsvpFeedback = document.getElementById("rsvp-feedback");
const rsvpFeedbackIcon = document.getElementById("rsvp-feedback-icon");
const rsvpFeedbackText = document.getElementById("rsvp-feedback-text");

const sendRsvpToSlack = async (attending, name, message) => {
  const statusEmoji = attending ? "✅" : "❌";
  const statusLabel = attending ? "Sẽ tham dự" : "Không thể tham dự";
  const lines = [
    `${statusEmoji} *RSVP mới từ thiệp cưới Đức & Hằng*`,
    `*Khách:* ${name || "(Không tên)"}`,
    `*Trả lời:* ${statusLabel}`,
  ];
  if (message) {
    lines.push(`*Lời nhắn:* ${message}`);
  }
  await fetch(SLACK_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: lines.join("\n") }),
  });
};

const submitRsvp = async (attending) => {
  const name = guestName || "(Không tên)";
  const message = rsvpMessageInput?.value.trim() || "";

  if (rsvpAcceptBtn) rsvpAcceptBtn.disabled = true;
  if (rsvpDeclineBtn) rsvpDeclineBtn.disabled = true;

  try {
    await sendRsvpToSlack(attending, name, message);
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
