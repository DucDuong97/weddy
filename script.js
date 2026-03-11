const loadingScreen = document.getElementById("letter-seal-screen");
const openInvitationButton = document.getElementById("open-invitation");
const loadingGuestName = document.getElementById("loading-guest-name");
const feedback = document.getElementById("form-feedback");
const acceptBtn = document.getElementById("accept-btn");
const greeting = document.getElementById("attendance-greeting");
const DEFAULT_GUEST_NAME = "Nguyễn Văn A";
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
  }, TEXT_FADE_DURATION + UNSEAL_DURATION);
};

const isLocalhost = ["localhost", "127.0.0.1", ""].includes(window.location.hostname);

if (loadingScreen && isLocalhost && false) {
  loadingScreen.classList.add("hidden");
} else if (loadingScreen) {
  document.body.classList.add("loading-active");
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
  if (!bgMusic) return;
  bgMusic.volume = 0.6;
  bgMusic.play().catch(() => {});
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

// Also attempt autoplay on any first interaction with the page
document.addEventListener("click", startMusic, { once: true });

if (acceptBtn && feedback) {
  acceptBtn.addEventListener("click", () => {
    acceptBtn.disabled = true;
    acceptBtn.textContent = "Đã xác nhận";
    feedback.textContent = `Cảm ơn ${guestName}, bạn đã xác nhận tham dự. Hẹn gặp bạn trong ngày vui của chúng tôi!`;
  });
}
