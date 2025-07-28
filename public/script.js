// public/script.js

// Demo data storage (client-side, in-memory) tidak lagi dibutuhkan karena kita memanggil API
// Jadi kita akan mengubah logic untuk fetch ke backend.

// Fungsi navigasi antar sections
function showSection(id) {
  document.querySelectorAll(".section").forEach((sec) => (sec.style.display = "none"));
  document.getElementById(id).style.display = "block";
}

// Render E-Catalog mengambil data dari API
function renderCatalog() {
  fetch("/api/catalog")
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("catalogGrid");
      container.innerHTML = "";
      data.forEach((item) => {
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
    })
    .catch((err) => console.error("Error fetch catalog:", err));
}

// Render semua tiket mengambil data dari API
function renderTicketTable() {
  fetch("/api/tickets")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("ticketListBody");
      tbody.innerHTML = "";
      data.forEach((t) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${t.id}</td>
          <td>${t.forkliftId}</td>
          <td>${t.status}</td>
          <td>${t.history.join(" → ")}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch((err) => console.error("Error fetch tickets:", err));
}

// Handle form submit untuk create ticket via API
function submitTicket(event) {
  event.preventDefault();
  const forkliftId = document.getElementById("forkliftId").value;
  const issue = document.getElementById("issueDesc").value;
  fetch("/api/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ forkliftId, issue }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to create ticket");
      return res.json();
    })
    .then((newTicket) => {
      alert("Ticket created: " + newTicket.id);
      document.getElementById("ticketForm").reset();
      renderTicketTable();
      showSection("section-track");
    })
    .catch((err) => {
      console.error(err);
      alert("Gagal membuat ticket: " + err.message);
    });
}

// Cari ticket by ID lewat API
function searchTicket(event) {
  event.preventDefault();
  const searchId = document.getElementById("searchTicketId").value.trim().toUpperCase();
  fetch(`/api/tickets/${searchId}`)
    .then((res) => {
      if (res.status === 404) {
        throw new Error("Ticket tidak ditemukan");
      }
      return res.json();
    })
    .then((result) => {
      const detailDiv = document.getElementById("ticketDetail");
      detailDiv.innerHTML = `
        <p><strong>ID Ticket:</strong> ${result.id}</p>
        <p><strong>Forklift ID:</strong> ${result.forkliftId}</p>
        <p><strong>Status:</strong> ${result.status}</p>
        <p><strong>History:</strong> ${result.history.join(" → ")}</p>
      `;
    })
    .catch((err) => {
      document.getElementById("ticketDetail").innerHTML =
        '<p style="color: red;">Ticket tidak ditemukan.</p>';
      console.error("Error fetch ticket by ID:", err);
    });
}

// Simulasi QR Code scan (dummy)
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
  renderTicketTable();
};
