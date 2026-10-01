const store = window.SalonStore;
let appData = store.read();

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("[data-year]").textContent = new Date().getFullYear();
  renderPublicSections();
  setupHeader();
  setupReveal();
  setupWhatsappDialog();
});

function renderPublicSections() {
  renderServices();
  renderProfessionals();
  renderInstagram();
  renderFaq();
}

function renderServices() {
  const root = document.querySelector("[data-services]");
  const carousel = document.querySelector("[data-service-carousel]");
  if (!root || !carousel) return;

  const services = appData.services || [];
  root.innerHTML = services
    .map(
      (service, index) => `
        <article class="service-card" aria-label="${index + 1} de ${services.length}">
          <div class="service-card-media">
            <img src="${service.image || store.images.cabelos}" alt="${service.name} no ${appData.salon.name}">
          </div>
          <div class="service-card-body">
            <span class="service-pill">${service.category}</span>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <div class="service-facts">
              <div>
                <small>Duração</small>
                <strong>${store.minutes(Number(service.duration || 0))}</strong>
              </div>
              <div>
                <small>${service.priceLabel || "Valor"}</small>
                <strong>${store.money(Number(service.price || 0))}</strong>
              </div>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  setupServiceCarousel(carousel, services.length);
}

function setupServiceCarousel(carousel, total) {
  const track = carousel.querySelector("[data-services]");
  const viewport = carousel.querySelector(".carousel-viewport");
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const status = carousel.querySelector("[data-carousel-status]");
  let active = 0;
  let startX = null;

  const update = () => {
    track.style.setProperty("--slide", active);
    status.textContent = total ? `${active + 1} de ${total}` : "0 de 0";
    prev.disabled = total <= 1;
    next.disabled = total <= 1;

    track.querySelectorAll(".service-card").forEach((card, index) => {
      const isActive = index === active;
      card.classList.toggle("is-active", isActive);
      card.querySelectorAll("a, button, input, textarea, select").forEach((control) => {
        control.tabIndex = isActive ? 0 : -1;
      });
    });
  };

  const move = (direction) => {
    if (!total) return;
    active = (active + direction + total) % total;
    update();
  };

  prev.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));

  viewport.addEventListener("pointerdown", (event) => {
    startX = event.clientX;
  });

  viewport.addEventListener("pointerup", (event) => {
    if (startX === null) return;
    const distance = event.clientX - startX;
    startX = null;
    if (Math.abs(distance) > 48) move(distance < 0 ? 1 : -1);
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  });

  update();
}

function renderProfessionals() {
  const root = document.querySelector("[data-professionals]");
  root.classList.toggle("single-profile", appData.professionals.length === 1);

  if (appData.professionals.length === 1) {
    const person = appData.professionals[0];
    root.innerHTML = `
        <article class="owner-card reveal">
          <div class="owner-photo">
            <img src="${person.image}" alt="${person.name}, ${person.specialty}">
          </div>
          <div class="owner-profile">
            <h3>${person.name}</h3>
            <span class="meta">${person.specialty}</span>
            <p>${person.description}</p>
          </div>
        </article>
        <article class="credentials-card reveal">
          <p class="eyebrow">Certificações e competências</p>
          <h3>Cursos, técnicas e treinamentos</h3>
          <p>O perfil da Virlene possui um campo próprio para destacar seus cursos, treinamentos e competências.</p>
          <div class="tag-list">
            ${(person.certifications || []).map((item) => `<span>${item}</span>`).join("")}
          </div>
        </article>
    `;
  } else {
    root.innerHTML = appData.professionals
      .map(
        (person) => `
          <article class="professional-card reveal">
            <img src="${person.image}" alt="${person.name}, ${person.specialty}">
            <div class="professional-card-content">
              <h3>${person.name}</h3>
              <span class="meta">${person.specialty}</span>
              <p>${person.description}</p>
              ${(person.certifications || []).length ? `<div class="mini-tags">${person.certifications.slice(0, 3).map((item) => `<span>${item}</span>`).join("")}</div>` : ""}
            </div>
          </article>
        `
      )
      .join("");
  }
}

function renderInstagram() {
  const feed = [
    ...(appData.services || []).map((service) => service.image || store.images.cabelos),
    store.images.resultadoLiso,
    store.images.resultadoOndulado,
  ].slice(0, 6);
  document.querySelector("[data-instagram]").innerHTML = feed
    .map(
      (image) => `
        <a class="insta-tile reveal" href="https://instagram.com/${appData.salon.instagram}" target="_blank" rel="noreferrer">
          <img src="${image}" alt="Publicação do Instagram do ${appData.salon.name}">
          <span>◎</span>
        </a>
      `
    )
    .join("");
}

function renderFaq() {
  const root = document.querySelector("[data-faq]");
  root.innerHTML = appData.faq
    .map(
      (item, index) => `
        <article class="faq-item reveal ${index === 0 ? "is-open" : ""}">
          <button class="faq-question" type="button" aria-expanded="${index === 0 ? "true" : "false"}">
            ${item.q}
            <span>+</span>
          </button>
          <div class="faq-answer">${item.a}</div>
        </article>
      `
    )
    .join("");

  root.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const willOpen = !item.classList.contains("is-open");
      root.querySelectorAll(".faq-item").forEach((el) => {
        el.classList.remove("is-open");
        el.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });
      item.classList.toggle("is-open", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
    });
  });
}

function setupHeader() {
  const header = document.querySelector("[data-header]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 30);

  updateHeader();
  window.addEventListener("scroll", updateHeader);

  toggle.addEventListener("click", () => {
    header.classList.toggle("is-open");
    mobileNav.classList.toggle("is-open");
  });

  document.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("is-open");
      mobileNav.classList.remove("is-open");
    });
  });
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function setupWhatsappDialog() {
  const trigger = document.querySelector("[data-whatsapp-open]");
  const dialog = document.querySelector("[data-whatsapp-dialog]");
  if (!trigger || !dialog || typeof dialog.showModal !== "function") return;

  const form = dialog.querySelector("[data-whatsapp-form]");
  const error = dialog.querySelector("[data-whatsapp-error]");
  const dateInput = form.elements.data;

  dialog.querySelector("[data-whatsapp-services]").insertAdjacentHTML(
    "beforeend",
    (appData.services || []).map((service) => `<option>${service.name}</option>`).join("")
  );

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    dateInput.min = toIsoDate(new Date());
    error.textContent = "";
    dialog.showModal();
  });

  dialog.querySelector("[data-whatsapp-close]").addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    const problem = validateWhatsappForm(form, values);
    error.textContent = problem;
    if (problem) return;

    const message = [
      `Olá, tudo bem? Me chamo ${values.nome.trim()}`,
      `Gostaria de verificar a disponibilidade de agendamento para o serviço ${values.servico}.`,
      "",
      `Tipo de cabelo: ${values.tipo}`,
      `Tamanho: ${values.tamanho}`,
      `Data: ${formatDate(values.data)}`,
      `Hora: ${values.hora}`,
    ].join("\n");

    window.open(store.waLink(message), "_blank", "noopener");
    form.reset();
    dialog.close();
  });
}

function validateWhatsappForm(form, values) {
  if (!values.nome || !values.nome.trim()) return focusField(form, "nome", "Informe seu nome.");
  if (!values.tipo) return focusField(form, "tipo", "Selecione o tipo de cabelo.");
  if (!values.tamanho) return focusField(form, "tamanho", "Selecione o tamanho do cabelo.");
  if (!values.servico) return focusField(form, "servico", "Selecione o serviço desejado.");
  if (!values.data) return focusField(form, "data", "Escolha a data desejada.");
  if (values.data < toIsoDate(new Date())) return focusField(form, "data", "Escolha uma data a partir de hoje.");
  if (new Date(`${values.data}T12:00:00`).getDay() === 0) return focusField(form, "data", "Não atendemos aos domingos. Escolha outra data.");
  if (!values.hora) return focusField(form, "hora", "Escolha o horário desejado.");
  if (values.hora < "09:00" || values.hora > "19:00") return focusField(form, "hora", "Escolha um horário entre 09h e 19h.");
  return "";
}

function focusField(form, name, message) {
  form.elements[name].focus();
  return message;
}

function toIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDate(iso) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}
