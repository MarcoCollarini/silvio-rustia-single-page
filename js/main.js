const header = document.querySelector("#header");
const toggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".mobile-menu");
function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Chiudi menu" : "Apri menu");
  menu.classList.toggle("open", open);
  menu.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("menu-open", open);
  header.classList.toggle("menu-active", open);
}
toggle.addEventListener("click", () =>
  setMenu(toggle.getAttribute("aria-expanded") !== "true"),
);
menu
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});
const onScroll = () => header.classList.toggle("scrolled", scrollY > 45);
onScroll();
addEventListener("scroll", onScroll, { passive: true });
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    }),
  { threshold: 0.14 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
/* Configura qui gli orari verificati. null mantiene il componente neutro finché gli orari non sono confermati. Esempio: 1:[['09:30','13:00'],['15:30','19:30']] */
const businessHours = {
  0: [], // Domenica
  1: [["09:30", "13:00"], ["15:30", "20:30"]],
  2: [["09:30", "13:00"], ["15:30", "19:30"]],
  3: [["09:30", "13:00"], ["15:30", "19:30"]],
  4: [["09:30", "13:00"], ["15:30", "19:30"]],
  5: [["09:30", "13:00"], ["15:30", "19:30"]],
  6: [["09:30", "13:00"]]
};

const dayNames = [
  "Domenica",
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato"
];

function minutes(time) {
  const [hours, mins] = time.split(":").map(Number);
  return hours * 60 + mins;
}

function formatSlots(slots) {
  if (!slots || slots.length === 0) {
    return "Chiuso";
  }

  return slots
    .map(([start, end]) => `${start} – ${end}`)
    .join(" / ");
}

function updateHours() {
  const box = document.querySelector("[data-hours]");
  const hoursList = document.querySelector("[data-hours-list]");

  if (!box || !hoursList) return;

  const now = new Date();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const todaySlots = businessHours[currentDay] || [];

  /*
   * STATO APERTO / CHIUSO
   */
  const activeSlot = todaySlots.find(
    ([start, end]) =>
      currentMinutes >= minutes(start) &&
      currentMinutes < minutes(end)
  );

  const statusText = box.querySelector("span");

  if (activeSlot) {
    box.classList.add("open");

    statusText.innerHTML =
      `<strong>APERTO</strong> · fino alle ${activeSlot[1]}`;
  } else {
    box.classList.remove("open");

    const nextSlotToday = todaySlots.find(
      ([start]) => minutes(start) > currentMinutes
    );

    if (nextSlotToday) {
      statusText.innerHTML =
        `<strong>CHIUSO</strong> · riapre alle ${nextSlotToday[0]}`;
    } else {
      statusText.innerHTML =
        `<strong>CHIUSO</strong>`;
    }
  }

  /*
   * ELENCO COMPLETO ORARI
   */
  hoursList.innerHTML = "";

  dayNames.forEach((day, index) => {
    const row = document.createElement("div");

    row.className = "hours-row";

    if (index === currentDay) {
      row.classList.add("today");
    }

    const dayElement = document.createElement("span");
    dayElement.className = "hours-day";
    dayElement.textContent = day;

    const timeElement = document.createElement("span");
    timeElement.className = "hours-time";
    timeElement.textContent = formatSlots(businessHours[index]);

    row.appendChild(dayElement);
    row.appendChild(timeElement);

    hoursList.appendChild(row);
  });
}

updateHours();

document.querySelector("[data-year]").textContent =
  new Date().getFullYear();
