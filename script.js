const eventDetails = {
  title: "Griha Pravesam Ceremony at Sree Padmam",
  family: "The Narayanan Family",
  house: "Sree Padmam",
  address: "Sree Padmam, Kalpathy, Palakkad, Kerala, India",
  start: new Date("2027-01-18T06:42:00+05:30"),
  end: new Date("2027-01-18T13:30:00+05:30"),
  description:
    "Join the Narayanan family for Ganapathy Homam, Vasthu Shanti, Paal Kachal, and traditional banana leaf lunch.",
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

window.addEventListener("load", () => {
  setTimeout(() => $("#loader")?.classList.add("loaded"), 620);
});

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  setupNavigation();
  setupReveals();
  setupPetals();
  setupCountdown();
  setupSharing();
  setupCalendarLinks();
  setupBellToggle();
});

function setupNavigation() {
  const navbar = $("#navbar");
  const menuToggle = $("#menuToggle");
  const navMenu = $("#navMenu");

  const updateNav = () => {
    navbar?.classList.toggle("nav-scrolled", window.scrollY > 24);
  };

  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });

  menuToggle?.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navMenu.classList.toggle("hidden", !isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  $$("#navMenu a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navMenu.classList.add("hidden");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });
}

function setupReveals() {
  const revealItems = $$(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -50px 0px" },
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
    observer.observe(item);
  });
}

function setupPetals() {
  const field = $(".petal-field");
  if (!field) return;

  for (let index = 0; index < 28; index += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.setProperty("--left", `${Math.random() * 100}%`);
    petal.style.setProperty("--size", `${8 + Math.random() * 12}px`);
    petal.style.setProperty("--opacity", `${0.22 + Math.random() * 0.45}`);
    petal.style.setProperty("--rotate", `${Math.random() * 180}deg`);
    petal.style.setProperty("--duration", `${12 + Math.random() * 12}s`);
    petal.style.setProperty("--delay", `${Math.random() * -18}s`);
    petal.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
    field.appendChild(petal);
  }
}

function setupCountdown() {
  const timer = $("#countdown");
  if (!timer) return;

  const units = {
    days: $('[data-unit="days"]', timer),
    hours: $('[data-unit="hours"]', timer),
    minutes: $('[data-unit="minutes"]', timer),
    seconds: $('[data-unit="seconds"]', timer),
  };

  const render = () => {
    const distance = Math.max(0, eventDetails.start.getTime() - Date.now());
    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    units.days.textContent = String(days).padStart(3, "0");
    units.hours.textContent = String(hours).padStart(2, "0");
    units.minutes.textContent = String(minutes).padStart(2, "0");
    units.seconds.textContent = String(seconds).padStart(2, "0");
  };

  render();
  setInterval(render, 1000);
}

function setupSharing() {
  const currentUrl = window.location.href.split("#")[0];
  const message = encodeURIComponent(
    `${eventDetails.family} invites you to the ${eventDetails.title} on 18 January 2027 at ${eventDetails.address}. ${currentUrl}`,
  );
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventDetails.address)}`;

  $("#whatsappShare")?.setAttribute("href", `https://wa.me/?text=${message}`);
  $("#mapsButton")?.setAttribute("href", mapUrl);
  $("#shareLocation")?.setAttribute(
    "href",
    `https://wa.me/?text=${encodeURIComponent(`Location for ${eventDetails.title}: ${eventDetails.address} ${mapUrl}`)}`,
  );

  $("#copyAddress")?.addEventListener("click", async (event) => {
    const button = event.currentTarget;
    try {
      await navigator.clipboard.writeText(eventDetails.address);
      button.textContent = "Address Copied";
    } catch {
      button.textContent = "Copy Manually";
    }
    setTimeout(() => {
      button.textContent = "Copy Address";
    }, 1800);
  });
}

function setupCalendarLinks() {
  const formatGoogleDate = (date) => date.toISOString().replace(/[-:]/g, "").replace(".000", "");
  const googleDates = `${formatGoogleDate(eventDetails.start)}/${formatGoogleDate(eventDetails.end)}`;
  const query = new URLSearchParams({
    action: "TEMPLATE",
    text: eventDetails.title,
    dates: googleDates,
    details: eventDetails.description,
    location: eventDetails.address,
  });

  $("#googleCalendar")?.setAttribute("href", `https://calendar.google.com/calendar/render?${query.toString()}`);

  const outlookQuery = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: eventDetails.title,
    startdt: eventDetails.start.toISOString(),
    enddt: eventDetails.end.toISOString(),
    body: eventDetails.description,
    location: eventDetails.address,
  });
  $("#outlookCalendar")?.setAttribute("href", `https://outlook.live.com/calendar/0/deeplink/compose?${outlookQuery}`);

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sree Padmam//Griha Pravesam//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@sreepadmam`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(eventDetails.start)}`,
    `DTEND:${formatIcsDate(eventDetails.end)}`,
    `SUMMARY:${eventDetails.title}`,
    `DESCRIPTION:${eventDetails.description}`,
    `LOCATION:${eventDetails.address}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  $("#appleCalendar")?.setAttribute("href", URL.createObjectURL(blob));
}

function formatIcsDate(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(".000", "");
}

function setupBellToggle() {
  const button = $("#musicToggle");
  let audioContext;
  let intervalId;

  const playBell = () => {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    const output = audioContext.createGain();
    output.gain.setValueAtTime(0.0001, now);
    output.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
    output.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);
    output.connect(audioContext.destination);

    [523.25, 659.25, 784].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.detune.setValueAtTime(index * 4, now);
      oscillator.connect(output);
      oscillator.start(now);
      oscillator.stop(now + 2.65);
    });
  };

  button?.addEventListener("click", () => {
    const active = button.classList.toggle("active");
    if (active) {
      playBell();
      intervalId = window.setInterval(playBell, 9000);
    } else {
      window.clearInterval(intervalId);
    }
  });
}
