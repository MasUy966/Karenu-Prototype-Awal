// Demo data storage (in-memory)
let tickets = [];
let catalog = [
  { id: "SP-001", name: "Ban Forklift A23", stock: 12, price: 250000 },
  { id: "SP-002", name: "Baterai Forklift B15", stock: 5, price: 4500000 },
  { id: "SP-003", name: "Engine Filter C07", stock: 20, price: 150000 },
  { id: "SP-004", name: "Hydraulic Hose D09", stock: 0, price: 800000 },
];

// Fungsi navigasi antar sections
function showSection(id) {
  document.querySelectorAll(".section").forEach((sec) => (sec.style.display = "none"));
  document.getElementById(id).style.display = "block";
}

// Handle form submit untuk create ticket
function submitTicket(event) {
  event.preventDefault();
  const forkliftId = document.getElementById("forkliftId").value;
  const issue = document.getElementById("issueDesc").value;
  const ticketId = "TCK-" + (tickets.length + 1).toString().padStart(4, "0");
  const newTicket = { ticketId, forkliftId, issue, status: "Received", history: ["Received"] };
  tickets.push(newTicket);
  alert("Ticket created: " + ticketId);
  document.getElementById("ticketForm").reset();
  renderTicketTable();
  showSection("section-track");
}

// Render table ticket di Track Ticket
function renderTicketTable() {
  const tbody = document.getElementById("ticketListBody");
  tbody.innerHTML = "";
  tickets.forEach((t) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${t.ticketId}</td>
      <td>${t.forkliftId}</td>
      <td>${t.status}</td>
      <td>${t.history.join(" → ")}</td>
    `;
    tbody.appendChild(row);
  });
}

// Cari ticket by ID
function searchTicket(event) {
  event.preventDefault();
  const searchId = document.getElementById("searchTicketId").value.trim().toUpperCase();
  const result = tickets.find((t) => t.ticketId === searchId);
  const detailDiv = document.getElementById("ticketDetail");
  if (!result) {
    detailDiv.innerHTML = '<p style="color: red;">Ticket tidak ditemukan.</p>';
  } else {
    detailDiv.innerHTML = `
      <p><strong>ID Ticket:</strong> ${result.ticketId}</p>
      <p><strong>Forklift ID:</strong> ${result.forkliftId}</p>
      <p><strong>Status:</strong> ${result.status}</p>
      <p><strong>History:</strong> ${result.history.join(" → ")}</p>
    `;
  }
}

// Render E-Catalog
function renderCatalog() {
  const container = document.getElementById("catalogGrid");
  container.innerHTML = "";
  catalog.forEach((item) => {
    const card = document.createElement("div");
    card.className = "catalog-item";
    const availability = item.stock > 0 ? "In Stock: " + item.stock : "Out of Stock";
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p><strong>ID:</strong> ${item.id}</p>
      <p><strong>Price:</strong> Rp ${item.price.toLocaleString()}</p>
      <p class="availability">${availability}</p>
      <button class="btn-small" ${item.stock === 0 ? "disabled" : ""}>Order</button>
    `;
    container.appendChild(card);
  });
}

// Simulasi QR Code scan
function scanQRCode() {
  const simulatedId = prompt("Simulasi: Masukkan Forklift ID (via QR)");
  if (simulatedId) {
    document.getElementById("forkliftId").value = simulatedId;
  }
}

// Inisialisasi halaman default
window.onload = () => {
  showSection("section-home");
  renderCatalog();
};
