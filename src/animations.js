import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("lumen", "0.22, 1, 0.36, 1");

const motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches;

let lenis = null;
let closeMenu = () => {};

const LINES = [
  {
    tile: "0",
    tone: "tone-amber",
    speaker: "Олена",
    time: "00:18",
    text: "Зафіксуємо реліз на п’ятницю, 18:00. Інтеграція зі Slack — на Марку.",
  },
  {
    tile: "1",
    tone: "tone-blue",
    speaker: "Марко",
    time: "00:21",
    text: "Візьму. До четверга покладу чернетку в Notion.",
  },
  {
    tile: "2",
    tone: "tone-sand",
    speaker: "Аня",
    time: "00:24",
    text: "Оновлю макети онбордингу до середи. Три екрани, не вісім.",
  },
];

/** Точка входу: скрол, секції, мікроанімації. */
export function initPage() {
  initSmoothScroll();
  initProgress();
  initHeader();
  initMenu();
  initHero();
  initCursor();
  initMagnetic();
  initSpotlight();
  initBento();
  initHow();
  initCounters();
  initSlider();
  initPricing();
  initFaq();
  initDialog();
  initAnchors();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

function initSmoothScroll() {
  if (!motionOK) return;
  lenis = new Lenis({ duration: 1.05, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function initProgress() {
  if (!motionOK) {
    gsap.set("#progress", { scaleX: 1 });
    return;
  }
  gsap.to("#progress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.25 },
  });
}

function initHeader() {
  const header = document.getElementById("header");
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate(self) {
      const y = self.scroll();
      header.classList.toggle("is-scrolled", y > 8);
      if (!motionOK || document.body.classList.contains("nav-open")) return;
      header.classList.toggle("is-hidden", self.direction === 1 && y > 140);
    },
  });
}

function initMenu() {
  const burger = document.getElementById("burger");
  const panel = document.getElementById("mobile-nav");
  const label = burger.querySelector(".sr-only");
  const icon = burger.querySelector("use");

  closeMenu = () => {
    panel.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    label.textContent = "Відкрити меню";
    icon.setAttribute("href", "#i-menu");
    document.body.classList.remove("nav-open");
    const dialog = document.getElementById("signup");
    if (!dialog.open) lenis?.start();
  };

  const openMenu = () => {
    panel.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    label.textContent = "Закрити меню";
    icon.setAttribute("href", "#i-x");
    document.body.classList.add("nav-open");
    document.getElementById("header").classList.remove("is-hidden");
    lenis?.stop();
  };

  burger.addEventListener("click", () => {
    panel.classList.contains("is-open") ? closeMenu() : openMenu();
  });
  panel.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel.classList.contains("is-open")) closeMenu();
  });
}

function initHero() {
  const glow = document.getElementById("glow");
  if (motionOK && finePointer) {
    const xTo = gsap.quickTo(glow, "x", { duration: 0.9, ease: "power3.out" });
    const yTo = gsap.quickTo(glow, "y", { duration: 0.9, ease: "power3.out" });
    window.addEventListener("pointermove", (event) => {
      xTo(event.clientX);
      yTo(event.clientY);
      gsap.to(glow, { opacity: 1, duration: 0.6, overwrite: "auto" });
    });
  }

  document.querySelectorAll(".display").forEach(splitWords);

  if (motionOK) {
    gsap.set(".word-inner", { yPercent: 110 });
    gsap.set("[data-animate]", { autoAlpha: 0, y: 16 });
  }
  document.documentElement.classList.add("booted");

  if (!motionOK) return;

  gsap.to(".hero .word-inner", {
    yPercent: 0,
    duration: 1.15,
    stagger: 0.05,
    ease: "lumen",
    delay: 0.08,
  });
  gsap.to(".hero [data-animate]", {
    autoAlpha: 1,
    y: 0,
    duration: 0.9,
    stagger: 0.08,
    ease: "lumen",
    delay: 0.45,
  });
  gsap.to(".cta-final .word-inner", {
    yPercent: 0,
    duration: 1.05,
    stagger: 0.045,
    ease: "lumen",
    scrollTrigger: { trigger: ".cta-final", start: "top 78%" },
  });

  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 28,
      autoAlpha: 0,
      duration: 1,
      ease: "lumen",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });

  const mock = document.getElementById("demo");
  const mm = gsap.matchMedia();
  mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
    gsap.fromTo(
      mock,
      { rotateX: 12, rotateY: -8 },
      {
        rotateX: 0,
        rotateY: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });

  const replay = initTranscript();
  document.querySelectorAll('a[href="#demo"]').forEach((link) => {
    link.addEventListener("click", () => replay());
  });
}

function splitWords(root) {
  root.querySelectorAll(".line").forEach((line) => {
    const words = line.textContent.trim().split(/\s+/);
    const fragment = document.createDocumentFragment();
    words.forEach((word, index) => {
      if (index) fragment.append(" ");
      const outer = document.createElement("span");
      outer.className = "word";
      const inner = document.createElement("span");
      inner.className = "word-inner";
      inner.textContent = word;
      outer.appendChild(inner);
      fragment.append(outer);
    });
    line.replaceChildren(fragment);
  });
}

/** Транскрипт «друкується», потім з’являються задачі. Поза екраном цикл стоїть. */
function initTranscript() {
  const list = document.getElementById("lines");
  const tasks = [...document.querySelectorAll("#tasks li")];
  const tiles = [...document.querySelectorAll("[data-tile]")];
  let token = 0;

  const showFinal = () => {
    list.replaceChildren(...LINES.map((line) => lineNode(line, line.text)));
    tasks.forEach((item) => item.classList.add("is-in"));
    tiles.forEach((tile) => tile.classList.toggle("is-speaking", tile.dataset.tile === "0"));
  };

  const play = async (id) => {
    list.replaceChildren();
    tasks.forEach((item) => item.classList.remove("is-in"));
    for (const line of LINES) {
      if (id !== token) return;
      tiles.forEach((tile) => tile.classList.toggle("is-speaking", tile.dataset.tile === line.tile));
      const node = lineNode(line, "");
      list.appendChild(node);
      await typeText(node.querySelector(".typed"), line.text, () => id !== token);
      await wait(260, () => id !== token);
    }
    if (id !== token) return;
    tasks.forEach((item, index) => {
      window.setTimeout(() => {
        if (id === token) item.classList.add("is-in");
      }, 120 * index);
    });
    await wait(2600, () => id !== token);
    if (id === token) play(id);
  };

  const start = () => {
    token += 1;
    if (!motionOK) {
      showFinal();
      return;
    }
    play(token);
  };

  if (!motionOK) showFinal();
  else {
    const demo = document.getElementById("demo");
    let playing = false;
    const playIfNeeded = () => {
      if (playing) return;
      playing = true;
      start();
    };
    const rect = demo.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) playIfNeeded();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) playIfNeeded();
          else {
            playing = false;
            token += 1;
          }
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(demo);
  }

  return start;
}

function lineNode(line, text) {
  const item = document.createElement("li");
  const who = document.createElement("div");
  who.className = "who";
  const name = document.createElement("span");
  name.className = line.tone;
  name.textContent = line.speaker;
  const time = document.createElement("span");
  time.textContent = line.time;
  who.append(name, time);
  const typed = document.createElement("span");
  typed.className = "typed";
  typed.textContent = text;
  item.append(who, typed);
  return item;
}

function typeText(node, text, cancelled) {
  return new Promise((resolve) => {
    let index = 0;
    let last = 0;
    let acc = 0;
    const frame = (now) => {
      if (cancelled()) return resolve();
      if (!last) last = now;
      acc += now - last;
      last = now;
      if (acc >= 28) {
        acc = 0;
        index = Math.min(text.length, index + 1);
        node.textContent = text.slice(0, index);
      }
      if (index < text.length) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });
}

function wait(ms, cancelled) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(), ms);
    if (cancelled()) resolve();
  });
}

function initCursor() {
  if (!motionOK || !finePointer) return;
  const cursor = document.querySelector(".cursor");
  const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" });
  window.addEventListener("pointermove", (event) => {
    xTo(event.clientX);
    yTo(event.clientY);
  });
  document.querySelectorAll("a, button, input, .slider").forEach((node) => {
    node.addEventListener("pointerenter", () => gsap.to(cursor, { scale: 2.5, duration: 0.35, ease: "lumen" }));
    node.addEventListener("pointerleave", () => gsap.to(cursor, { scale: 1, duration: 0.35, ease: "lumen" }));
  });
}

function initMagnetic() {
  if (!motionOK || !finePointer) return;
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      xTo((event.clientX - (rect.left + rect.width / 2)) * 0.28);
      yTo((event.clientY - (rect.top + rect.height / 2)) * 0.4);
    });
    el.addEventListener("pointerleave", () => {
      xTo(0);
      yTo(0);
    });
  });
}

function initSpotlight() {
  if (!finePointer) return;
  document.querySelectorAll(".bento").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });
}

function initBento() {
  const eq = document.getElementById("eq");
  for (let i = 0; i < 28; i += 1) {
    const bar = document.createElement("i");
    bar.style.setProperty("--i", String(i));
    bar.style.setProperty("--h", (0.35 + Math.abs(Math.sin(i * 0.75)) * 0.65).toFixed(2));
    eq.appendChild(bar);
  }
  if (!motionOK) return;

  const long = document.querySelector(".sum-long");
  const short = document.querySelector(".sum-short");
  gsap.set(short, { autoAlpha: 0, y: 10 });
  const summary = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0.8, paused: true });
  summary
    .to(long, { autoAlpha: 0, y: -8, duration: 0.55, ease: "lumen" }, 0.6)
    .to(short, { autoAlpha: 1, y: 0, duration: 0.55, ease: "lumen" }, 0.75);
  bindVisibility("#summary-card", summary);

  const chips = gsap.utils.toArray("#chips .chip");
  const dispatch = gsap.timeline({ repeat: -1, repeatDelay: 0.5, paused: true });
  chips.forEach((chip, index) => {
    dispatch
      .to(chip, { x: 48, autoAlpha: 0.15, duration: 0.55, ease: "power2.in" }, index * 0.28)
      .to(chip, { x: 0, autoAlpha: 1, duration: 0.45, ease: "lumen" }, index * 0.28 + 0.65);
  });
  bindVisibility("#dispatch-card", dispatch);
  initSearchLoop();
}

function bindVisibility(selector, timeline) {
  ScrollTrigger.create({
    trigger: selector,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? timeline.play() : timeline.pause()),
  });
}

function initSearchLoop() {
  const input = document.getElementById("demo-search");
  const hits = document.querySelector(".search-hits");
  const card = document.getElementById("search-card");
  const query = "ціна онбордингу";
  const rows = [
    ["12 бер · Ціни для агенцій", "14:02"],
    ["3 квіт · Ретро Q1", "06:40"],
  ];
  let token = 0;

  const onScreen = () => {
    const rect = card.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  };

  const cycle = async (id) => {
    while (id === token && onScreen()) {
      input.textContent = "";
      hits.hidden = true;
      hits.replaceChildren();
      for (let i = 0; i < query.length; i += 1) {
        if (id !== token || !onScreen()) return;
        input.textContent = query.slice(0, i + 1);
        await wait(70, () => id !== token);
      }
      if (id !== token || !onScreen()) return;
      hits.hidden = false;
      rows.forEach(([label, time]) => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = label;
        const stamp = document.createElement("time");
        stamp.textContent = time;
        li.append(span, stamp);
        hits.appendChild(li);
      });
      await wait(1800, () => id !== token);
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        token += 1;
        if (entry.isIntersecting) cycle(token);
      });
    },
    { threshold: 0.45 },
  );
  observer.observe(card);
}

function initHow() {
  const steps = [...document.querySelectorAll(".step")];
  const panels = [...document.querySelectorAll(".panel")];
  let trigger = null;
  const setStep = (index) => {
    steps.forEach((step, i) => step.classList.toggle("is-active", i === index));
  };

  steps.forEach((step, index) => {
    step.querySelector("button").addEventListener("click", () => {
      if (!trigger) {
        step.scrollIntoView({ behavior: motionOK ? "smooth" : "auto", block: "start" });
        return;
      }
      const y = trigger.start + ((trigger.end - trigger.start) * index) / 2;
      if (lenis) lenis.scrollTo(y);
      else window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  const mm = gsap.matchMedia();
  mm.add("(min-width: 1024px) and (min-height: 740px) and (prefers-reduced-motion: no-preference)", () => {
    gsap.set(panels, { autoAlpha: 0, y: 16 });
    gsap.set(panels[0], { autoAlpha: 1, y: 0 });
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#how",
        start: "top top",
        end: "+=180%",
        pin: ".how-pin",
        scrub: 0.45,
        anticipatePin: 1,
        onUpdate(self) {
          const p = self.progress;
          setStep(p < 0.375 ? 0 : p < 0.875 ? 1 : 2);
        },
      },
    });
    timeline
      .to(panels[0], { autoAlpha: 0, y: -16, duration: 1, ease: "none" }, 1)
      .to(panels[1], { autoAlpha: 1, y: 0, duration: 1, ease: "none" }, 1)
      .to(panels[1], { autoAlpha: 0, y: -16, duration: 1, ease: "none" }, 3)
      .to(panels[2], { autoAlpha: 1, y: 0, duration: 1, ease: "none" }, 3);
    trigger = timeline.scrollTrigger;
    return () => {
      trigger = null;
    };
  });
}

function initCounters() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const end = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const render = (value) => {
      el.textContent = value.toFixed(decimals);
    };
    if (!motionOK) {
      render(end);
      return;
    }
    const state = { value: 0 };
    gsap.to(state, {
      value: end,
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      onUpdate: () => render(state.value),
    });
  });
}

function initSlider() {
  const root = document.getElementById("slider");
  const prev = document.querySelector("[data-prev]");
  const next = document.querySelector("[data-next]");
  const amount = () => {
    const card = root.querySelector(".t-card");
    return (card?.offsetWidth || 320) + 12;
  };
  const behavior = motionOK ? "smooth" : "auto";
  prev.addEventListener("click", () => root.scrollBy({ left: -amount(), behavior }));
  next.addEventListener("click", () => root.scrollBy({ left: amount(), behavior }));
  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") next.click();
    if (event.key === "ArrowLeft") prev.click();
  });

  if (!finePointer) return;
  let dragging = false;
  let startX = 0;
  let startLeft = 0;
  root.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse") return;
    dragging = true;
    startX = event.clientX;
    startLeft = root.scrollLeft;
    root.classList.add("is-dragging");
    root.setPointerCapture(event.pointerId);
  });
  root.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    root.scrollLeft = startLeft - (event.clientX - startX);
  });
  const stop = () => {
    dragging = false;
    root.classList.remove("is-dragging");
  };
  root.addEventListener("pointerup", stop);
  root.addEventListener("pointercancel", stop);
}

function initPricing() {
  const switches = [...document.querySelectorAll("[data-bill]")];
  const prices = [...document.querySelectorAll("[data-month]")];
  switches.forEach((button) => {
    button.addEventListener("click", () => {
      const yearly = button.dataset.bill === "year";
      switches.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      prices.forEach((el) => {
        const next = Number(yearly ? el.dataset.year : el.dataset.month);
        const current = Number(el.textContent);
        if (!motionOK || current === next) {
          el.textContent = String(next);
          return;
        }
        const state = { value: current };
        gsap.to(state, {
          value: next,
          duration: 0.55,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = String(Math.round(state.value));
          },
        });
      });
    });
  });
}

function initFaq() {
  const items = [...document.querySelectorAll(".faq-item")];
  items.forEach((item) => {
    const button = item.querySelector("button");
    button.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");
      items.forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector("button").setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
        item.querySelector(".faq-panel").removeAttribute("aria-hidden");
      }
      items.forEach((other) => {
        if (!other.classList.contains("is-open")) {
          other.querySelector(".faq-panel").setAttribute("aria-hidden", "true");
        }
      });
    });
  });
}

function initDialog() {
  const dialog = document.getElementById("signup");
  const form = document.getElementById("signup-form");
  const done = document.getElementById("signup-done");
  const error = form.querySelector(".form-error");

  document.querySelectorAll("[data-open-signup]").forEach((button) => {
    button.addEventListener("click", () => {
      closeMenu();
      dialog.showModal();
      lenis?.stop();
    });
  });

  dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    lenis?.start();
    form.hidden = false;
    done.hidden = true;
    error.textContent = "";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = String(new FormData(form).get("email") || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error.textContent = "Перевірте адресу — бракує @ або домену.";
      return;
    }
    try {
      localStorage.setItem("lumen-pilot", email);
    } catch {
      /* приватний режим браузера */
    }
    done.querySelector("[data-email]").textContent = email;
    form.hidden = true;
    done.hidden = false;
  });
}

function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -72 });
      else target.scrollIntoView({ behavior: motionOK ? "smooth" : "auto" });
    });
  });
}
