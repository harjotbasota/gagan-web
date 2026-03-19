import "./style.css";

function cfg() {
  return (
    window.__APP_CONFIG__ || {
      siteName: "Gagandeep Web",
      siteTagline: "Reliable rides. Anytime. Anywhere.",
      siteDescription:
        "Professional transportation with comfort, safety, and style.",
      ownerEmail: "",
      contactFormAction: "",
      primaryPhone: "",
      whatsappUrl: "",
      metaKeywords: "",
      metaOgImage: "",
    }
  );
}

const TESTIMONIALS = [
  {
    quote:
      "Punctual, polite, and professional—exactly what I need for work travel.",
    name: "Ruth P.",
    role: "Sales associate",
  },
  {
    quote:
      "Late nights feel safer. Easy booking, clean car, courteous driver.",
    name: "John W.",
    role: "Retail specialist",
  },
  {
    quote:
      "On-time pickups across the city. Corporate travel without friction.",
    name: "Sophia J.",
    role: "Marketing executive",
  },
  {
    quote:
      "Transparent pricing and reliable advance booking for our team.",
    name: "Liam A.",
    role: "Business analyst",
  },
];

const FAQ = [
  {
    q: "How do I book a ride?",
    a: "Use the form on this page, call us, or share pickup details and we’ll confirm quickly.",
  },
  {
    q: "Can I schedule in advance?",
    a: "Yes—airport runs, meetings, and events can be booked ahead for guaranteed availability.",
  },
  {
    q: "Are fares fixed or metered?",
    a: "It depends on trip type. Airport and longer routes are often fixed; local trips may be metered. You’ll always see clear pricing before you commit.",
  },
  {
    q: "What vehicles do you offer?",
    a: "Sedans, SUVs, executive cars, and stretch options—clean, maintained, and driven by pros.",
  },
  {
    q: "How do I reach the driver?",
    a: "After confirmation you’ll receive pickup details. Support stays available if plans change.",
  },
  {
    q: "I left something in the vehicle—what now?",
    a: "Contact us right away with your trip details; we’ll help recover items when possible.",
  },
];

async function loadPhotoManifest() {
  try {
    const r = await fetch("/photos/manifest.json", { cache: "no-store" });
    if (!r.ok) return {};
    return await r.json();
  } catch {
    return {};
  }
}

function applyText() {
  const c = cfg();
  const telDigits = (c.primaryPhone || "").replace(/[^\d+]/g, "");
  const telHref = telDigits ? `tel:${telDigits}` : "#";

  document.querySelectorAll("[data-site-name]").forEach((el) => {
    el.textContent = c.siteName;
  });
  document.querySelectorAll("[data-footer-name]").forEach((el) => {
    el.textContent = c.siteName;
  });
  const ft = document.querySelector("[data-footer-tagline]");
  if (ft) ft.textContent = c.siteTagline;

  const heroTitle = document.querySelector("[data-hero-title]");
  if (heroTitle) heroTitle.textContent = c.siteTagline;
  const heroLede = document.querySelector("[data-hero-lede]");
  if (heroLede) heroLede.textContent = c.siteDescription;

  const about = document.querySelector("[data-about-lede]");
  if (about) about.textContent = c.siteDescription;

  document.querySelectorAll("[data-tel-link]").forEach((el) => {
    el.setAttribute("href", telHref);
    if (el.textContent.trim() === "" || el.classList.contains("phone-link"))
      el.textContent = c.primaryPhone || "Call us";
  });

  const mail = c.ownerEmail ? `mailto:${c.ownerEmail}` : "#";
  document.querySelectorAll("[data-mail-link]").forEach((el) => {
    el.setAttribute("href", mail);
    el.textContent = c.ownerEmail || "Email";
  });

  const waWrap = document.querySelector("[data-wa-wrap]");
  const waLink = document.querySelector("[data-wa-link]");
  if (c.whatsappUrl && waWrap && waLink) {
    waWrap.hidden = false;
    waLink.setAttribute("href", c.whatsappUrl);
  }

  document.title = `${c.siteName} · Book your ride`;

  const md = document.getElementById("meta-desc");
  if (md) md.setAttribute("content", c.siteDescription);
  const mk = document.getElementById("meta-keywords");
  if (mk) mk.setAttribute("content", c.metaKeywords);
  const ot = document.getElementById("og-title");
  if (ot) ot.setAttribute("content", c.siteName);
  const od = document.getElementById("og-desc");
  if (od) od.setAttribute("content", c.siteDescription);
  const oi = document.getElementById("og-image");
  if (oi && c.metaOgImage) oi.setAttribute("content", c.metaOgImage);
}

function applyPhotos(manifest) {
  document.querySelectorAll("[data-photo]").forEach((el) => {
    const key = el.getAttribute("data-photo");
    const path = manifest?.[key];
    if (!path) return;
    const url = `/photos/${path}`;
    el.style.backgroundImage = `linear-gradient(135deg, rgba(15, 18, 24, 0.35), rgba(15, 18, 24, 0.75)), url("${url}")`;
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
  });

  const heroV = document.querySelector("[data-hero-visual]");
  const heroPath = manifest?.frontpagephoto1;
  if (heroV && heroPath) {
    heroV.style.backgroundImage = `url("/photos/${heroPath}")`;
  }
}

function renderQuotes() {
  const wrap = document.querySelector("[data-quotes]");
  if (!wrap) return;
  wrap.innerHTML = TESTIMONIALS.map(
    (t) => `
    <figure class="quote">
      <blockquote>“${t.quote}”</blockquote>
      <figcaption>
        <strong>${t.name}</strong>
        <span>${t.role}</span>
      </figcaption>
    </figure>`,
  ).join("");
}

function renderFaq() {
  const wrap = document.querySelector("[data-faq]");
  if (!wrap) return;
  wrap.innerHTML = FAQ.map(
    (item, i) => `
    <details class="faq-item" ${i === 0 ? "open" : ""}>
      <summary>${item.q}</summary>
      <p>${item.a}</p>
    </details>`,
  ).join("");

  wrap.querySelectorAll("details").forEach((det) => {
    det.addEventListener("toggle", () => {
      if (!det.open) return;
      wrap.querySelectorAll("details").forEach((d) => {
        if (d !== det) d.open = false;
      });
    });
  });
}

function setupNav() {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  let t;
  window.addEventListener("scroll", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }, 10);
  });
}

function setupForm() {
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-form-status]");
  if (!form || !status) return;

  const c = cfg();
  const action = c.contactFormAction?.trim();
  if (action) form.setAttribute("action", action);
  form.setAttribute("method", "POST");

  form.addEventListener("submit", async (e) => {
    if (!action || action.includes("REPLACE_ME")) {
      e.preventDefault();
      status.textContent =
        "Form endpoint not configured. Set CONTACT_FORM_ACTION in your environment (e.g. Formspree).";
      status.classList.add("is-error");
      return;
    }
    e.preventDefault();
    status.classList.remove("is-error", "is-ok");
    status.textContent = "Sending…";
    const fd = new FormData(form);

    try {
      const res = await fetch(action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        status.textContent = "Thanks—your request was sent. We’ll be in touch shortly.";
        status.classList.add("is-ok");
        form.reset();
      } else {
        status.textContent =
          data?.error || "Something went wrong. Try again or call us.";
        status.classList.add("is-error");
      }
    } catch {
      status.textContent = "Network error. Please try again or call us.";
      status.classList.add("is-error");
    }
  });
}

function setupBrandLink() {
  document.querySelectorAll("[data-brand-link]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

async function init() {
  applyText();
  renderQuotes();
  renderFaq();
  setupNav();
  setupForm();
  setupBrandLink();
  const manifest = await loadPhotoManifest();
  applyPhotos(manifest);
}


function loadConfigScript() {
  return new Promise((resolve) => {
    if (window.__APP_CONFIG__) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = "/config.js";
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });
}

async function boot() {
  await loadConfigScript();
  await init();
}

boot();
