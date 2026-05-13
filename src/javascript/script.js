document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".observe-section");
  const header = document.querySelector(".header");
  const projectCards = document.querySelectorAll(".project-card");
  const menuToggle = document.querySelector("#menu-toggle");
  const nav = document.querySelector("#nav");
  const scrollTopBtn = document.querySelector("#scroll-top");
  const progressBar = document.querySelector("#scroll-progress");
  const contactForm = document.querySelector(".contact-form");
  const themeToggle = document.querySelector("#theme-toggle");
  const themeIcon = document.querySelector("#theme-icon");
  const html = document.documentElement;

  // THEME TOGGLE
  function setTheme(theme) {
    html.classList.add("theme-transition");
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (themeIcon) {
      themeIcon.className = theme === "dark" ? "ri-sun-line" : "ri-moon-line";
    }
    setTimeout(() => html.classList.remove("theme-transition"), 300);
  }

  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);

  themeToggle?.addEventListener("click", () => {
    setTheme(html.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  // TYPEWRITER
  const typewriterEl = document.getElementById("typewriter");
  const phrases = [
    "fazendo interfaces modernas",
    "construindo sistemas limpos",
    "automatizando processos",
    "entregando soluções reais",
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typewriterEl.textContent = current.slice(0, charIndex);

    let delay = isDeleting ? 38 : 68;

    if (!isDeleting && charIndex === current.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 380;
    }

    setTimeout(typeLoop, delay);
  }

  if (typewriterEl) {
    setTimeout(typeLoop, 1400);
  }

  // SKILL CARDS STAGGER
  const skillCards = document.querySelectorAll(".skill-card");

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.setProperty(
            "--stagger-delay",
            entry.target.dataset.staggerDelay
          );
          entry.target.classList.add("animated");
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: "-20px 0px" }
  );

  skillCards.forEach((card, i) => {
    card.dataset.staggerDelay = `${i * 0.035}s`;
    skillObserver.observe(card);
  });

  // REVEAL SECTIONS
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach((section) => {
    section.classList.add("reveal");
    revealObserver.observe(section);
  });

  // ACTIVE NAV LINK
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    {
      rootMargin: `-${header ? header.offsetHeight : 82}px 0px -55% 0px`,
      threshold: 0,
    }
  );

  sections.forEach((section) => navObserver.observe(section));

  // SCROLL PROGRESS + SCROLL-TO-TOP
  window.addEventListener(
    "scroll",
    () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;

      if (progressBar) {
        progressBar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : "0%";
      }

      if (scrollTopBtn) {
        scrollTopBtn.classList.toggle("visible", scrolled > 400);
      }
    },
    { passive: true }
  );

  scrollTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // MOBILE MENU
  function closeMobileMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.innerHTML = '<i class="ri-menu-line"></i>';
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.innerHTML = isOpen
        ? '<i class="ri-close-line"></i>'
        : '<i class="ri-menu-line"></i>';
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = (header?.offsetHeight ?? 82) + 10;
      window.scrollTo({ top: target.offsetTop - offset, behavior: "smooth" });
      closeMobileMenu();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMobileMenu();
  });

  // PROJECT CARDS
  projectCards.forEach((card) => {
    const link = card.dataset.link;
    if (!link) return;

    card.addEventListener("click", () =>
      window.open(link, "_blank", "noopener,noreferrer")
    );
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.open(link, "_blank", "noopener,noreferrer");
      }
    });
  });

  // CONTACT FORM
  if (contactForm) {
    const submitBtn = contactForm.querySelector("[type='submit']");
    const successEl = contactForm.querySelector(".form-success");

    function validateField(input) {
      const group = input.closest(".form-group");
      const errorMsg = group?.querySelector(".form-error-msg");
      const isEmpty = !input.value.trim();
      const isInvalidEmail =
        input.type === "email" &&
        !isEmpty &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
      const invalid = isEmpty || isInvalidEmail;

      input.classList.toggle("error", invalid);
      errorMsg?.classList.toggle("visible", invalid);
      return !invalid;
    }

    contactForm
      .querySelectorAll(
        "input:not([type='hidden']):not([name='bot-field']), textarea"
      )
      .forEach((input) => {
        input.addEventListener("blur", () => validateField(input));
        input.addEventListener("input", () => {
          if (input.classList.contains("error")) validateField(input);
        });
      });

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fields = contactForm.querySelectorAll(
        "input:not([type='hidden']):not([name='bot-field']), textarea"
      );
      let allValid = true;
      fields.forEach((f) => {
        if (!validateField(f)) allValid = false;
      });
      if (!allValid) return;

      submitBtn.textContent = "Enviando...";
      submitBtn.disabled = true;

      try {
        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(new FormData(contactForm)).toString(),
        });

        if (!res.ok) throw new Error("Falha no envio");

        fields.forEach((f) =>
          f.closest(".form-group")?.style.setProperty("display", "none")
        );
        submitBtn.style.display = "none";
        contactForm.querySelector(".form-row")?.style.setProperty("display", "none");
        successEl?.classList.add("visible");
      } catch {
        submitBtn.textContent = "Enviar mensagem";
        submitBtn.disabled = false;
        alert("Não foi possível enviar. Use o WhatsApp ou e-mail.");
      }
    });
  }
});
