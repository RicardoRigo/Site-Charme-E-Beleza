const store = window.SalonStore;
let data = store.read();
let activeTab = "services";
let editingService = null;
let editingProfessional = null;

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-admin-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      activeTab = button.dataset.adminTab;
      document.querySelectorAll("[data-admin-tab]").forEach((item) => item.classList.toggle("is-active", item === button));
      render();
    });
  });

  render();
});

function render() {
  data = store.read();
  const root = document.querySelector("[data-admin-root]");
  if (activeTab === "services") root.innerHTML = servicesHtml();
  if (activeTab === "professionals") root.innerHTML = professionalsHtml();
  wireAdmin(root);
}

function servicesHtml() {
  const service = editingService ? data.services.find((item) => item.id === editingService) : null;
  return `
    <h2>Serviços</h2>
    <section class="admin-panel">
      <div class="admin-toolbar">
        <p>Edite os serviços exibidos na página pública.</p>
        <button class="btn btn-gold" type="button" data-new-service>Novo serviço</button>
      </div>
      ${editingService ? serviceForm(service) : ""}
      <div class="admin-list">
        ${data.services.map(serviceRow).join("")}
      </div>
    </section>
  `;
}

function professionalsHtml() {
  const professional = editingProfessional ? data.professionals.find((item) => item.id === editingProfessional) : null;
  return `
    <h2>Profissional</h2>
    <section class="admin-panel">
      <div class="admin-toolbar">
        <p>Edite o perfil da dona, incluindo cursos, treinamentos e competências exibidos no site.</p>
        ${
          data.professionals[0]
            ? `<button class="btn btn-gold" type="button" data-edit-professional="${data.professionals[0].id}">Editar perfil</button>`
            : `<button class="btn btn-gold" type="button" data-new-professional>Adicionar perfil</button>`
        }
      </div>
      ${editingProfessional ? professionalForm(professional) : ""}
      <div class="admin-list">
        ${data.professionals.map(professionalRow).join("")}
      </div>
    </section>
  `;
}

function serviceRow(service) {
  return `
    <article class="admin-row">
      <div>
        <h3>${service.name}</h3>
        <p>${service.category} · ${store.minutes(Number(service.duration || 0))} · ${store.money(Number(service.price || 0))}</p>
        <p>${service.description || ""}</p>
      </div>
      <div class="admin-actions">
        <button type="button" data-edit-service="${service.id}">Editar</button>
        <button type="button" data-delete-service="${service.id}">Excluir</button>
      </div>
    </article>
  `;
}

function professionalRow(professional) {
  const certifications = professional.certifications || [];
  return `
    <article class="admin-row">
      <div>
        <h3>${professional.name}</h3>
        <p>${professional.specialty}</p>
        <p>${professional.description || ""}</p>
        ${certifications.length ? `<div class="admin-tags">${certifications.map((item) => `<span>${item}</span>`).join("")}</div>` : ""}
      </div>
      <div class="admin-actions">
        <button type="button" data-edit-professional="${professional.id}">Editar</button>
      </div>
    </article>
  `;
}

function serviceForm(service) {
  const item = service || { id: "", name: "", category: "", description: "", duration: 60, price: 0, priceLabel: "A partir de", image: "" };
  return `
    <form class="admin-form" data-service-form>
      <div class="field">
        <label>Nome</label>
        <input name="name" value="${item.name}" required>
      </div>
      <div class="field">
        <label>Categoria</label>
        <input name="category" value="${item.category}" required>
      </div>
      <div class="field">
        <label>Duração em minutos</label>
        <input name="duration" type="number" min="15" step="15" value="${item.duration}" required>
      </div>
      <div class="field">
        <label>Preço</label>
        <input name="price" type="number" min="0" step="5" value="${item.price}" required>
      </div>
      <div class="field">
        <label>Rótulo de preço</label>
        <select name="priceLabel">
          <option ${item.priceLabel === "A partir de" ? "selected" : ""}>A partir de</option>
          <option ${item.priceLabel === "Valor fixo" ? "selected" : ""}>Valor fixo</option>
        </select>
      </div>
      <div class="field wide">
        <label>URL da imagem</label>
        <input name="image" value="${item.image || ""}">
      </div>
      <div class="field wide">
        <label>Descrição</label>
        <textarea name="description">${item.description}</textarea>
      </div>
      <button type="submit">Salvar</button>
      <button type="button" data-cancel-edit>Cancelar</button>
    </form>
  `;
}

function professionalForm(professional) {
  const item = professional || { id: "", name: "", specialty: "", description: "", image: "", instagram: "", certifications: [] };
  return `
    <form class="admin-form" data-professional-form>
      <div class="field">
        <label>Nome</label>
        <input name="name" value="${item.name}" required>
      </div>
      <div class="field">
        <label>Especialidade</label>
        <input name="specialty" value="${item.specialty}" required>
      </div>
      <div class="field">
        <label>Instagram</label>
        <input name="instagram" value="${item.instagram || ""}">
      </div>
      <div class="field">
        <label>URL da foto</label>
        <input name="image" value="${item.image || ""}">
      </div>
      <div class="field wide">
        <label>Descrição</label>
        <textarea name="description">${item.description || ""}</textarea>
      </div>
      <div class="field wide">
        <label>Certificações e competências</label>
        <textarea name="certifications" placeholder="Digite um curso ou competência por linha">${(item.certifications || []).join("\n")}</textarea>
      </div>
      <button type="submit">Salvar</button>
      <button type="button" data-cancel-edit>Cancelar</button>
    </form>
  `;
}

function wireAdmin(root) {
  const newService = root.querySelector("[data-new-service]");
  if (newService) {
    newService.addEventListener("click", () => {
      editingService = "new";
      render();
    });
  }

  root.querySelectorAll("[data-edit-service]").forEach((button) => {
    button.addEventListener("click", () => {
      editingService = button.dataset.editService;
      render();
    });
  });

  root.querySelectorAll("[data-delete-service]").forEach((button) => {
    button.addEventListener("click", () => {
      data.services = data.services.filter((item) => item.id !== button.dataset.deleteService);
      store.write(data);
      render();
    });
  });

  const serviceFormElement = root.querySelector("[data-service-form]");
  if (serviceFormElement) {
    serviceFormElement.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(serviceFormElement);
      const payload = {
        id: editingService === "new" ? `srv-${Date.now()}` : editingService,
        name: form.get("name").trim(),
        category: form.get("category").trim(),
        description: form.get("description").trim(),
        duration: Number(form.get("duration")),
        price: Number(form.get("price")),
        priceLabel: form.get("priceLabel"),
        image: form.get("image").trim() || store.images.cabelos,
      };
      if (editingService === "new") data.services.push(payload);
      else data.services = data.services.map((item) => (item.id === editingService ? payload : item));
      editingService = null;
      store.write(data);
      render();
    });
  }

  const newProfessional = root.querySelector("[data-new-professional]");
  if (newProfessional) {
    newProfessional.addEventListener("click", () => {
      editingProfessional = "new";
      render();
    });
  }

  root.querySelectorAll("[data-edit-professional]").forEach((button) => {
    button.addEventListener("click", () => {
      editingProfessional = button.dataset.editProfessional;
      render();
    });
  });

  root.querySelectorAll("[data-delete-professional]").forEach((button) => {
    button.addEventListener("click", () => {
      data.professionals = data.professionals.filter((item) => item.id !== button.dataset.deleteProfessional);
      store.write(data);
      render();
    });
  });

  const professionalFormElement = root.querySelector("[data-professional-form]");
  if (professionalFormElement) {
    professionalFormElement.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(professionalFormElement);
      const fallbackImage = store.images.dona || store.images.cabelos;
      const payload = {
        id: editingProfessional === "new" ? `pro-${Date.now()}` : editingProfessional,
        name: form.get("name").trim(),
        specialty: form.get("specialty").trim(),
        description: form.get("description").trim(),
        image: form.get("image").trim() || fallbackImage,
        instagram: form.get("instagram").trim(),
        certifications: form
          .get("certifications")
          .split(/\n|,/)
          .map((item) => item.trim())
          .filter(Boolean),
      };
      if (editingProfessional === "new") data.professionals.push(payload);
      else data.professionals = data.professionals.map((item) => (item.id === editingProfessional ? payload : item));
      editingProfessional = null;
      store.write(data);
      render();
    });
  }

  root.querySelectorAll("[data-cancel-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      editingService = null;
      editingProfessional = null;
      render();
    });
  });
}
