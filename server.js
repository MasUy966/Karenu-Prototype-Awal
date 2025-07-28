// server.js
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// In-memory storage (dummy)
let tickets = [];
let catalog = [
  { id: "SP-001", name: "Ban Forklift A23", stock: 12, price: 250000 },
  { id: "SP-002", name: "Baterai Forklift B15", stock: 5, price: 4500000 },
  { id: "SP-003", name: "Engine Filter C07", stock: 20, price: 150000 },
  { id: "SP-004", name: "Hydraulic Hose D09", stock: 0, price: 800000 },
];

// Middleware
app.use(bodyParser.json());
// Serve static files di folder public
app.use(express.static(path.join(__dirname, "public")));

// Routes API

// 1. Ping test
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

// 2. GET katalog suku-cadang
app.get("/api/catalog", (req, res) => {
  // Kirim semua item katalog
  res.json(catalog);
});

// 3. GET semua tiket
app.get("/api/tickets", (req, res) => {
  res.json(tickets);
});

// 4. GET satu tiket berdasarkan ID
app.get("/api/tickets/:ticketId", (req, res) => {
  const { ticketId } = req.params;
  const ticket = tickets.find((t) => t.id === ticketId.toUpperCase());
  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }
  res.json(ticket);
});

// 5. POST buat tiket baru
app.post("/api/tickets", (req, res) => {
  const { forkliftId, issue } = req.body;
  if (!forkliftId || !issue) {
    return res.status(400).json({ error: "forkliftId and issue are required" });
  }
  const id = "TCK-" + String(tickets.length + 1).padStart(4, "0");
  const newTicket = {
    id,
    forkliftId,
    issue,
    status: "Received",
    history: ["Received"],
  };
  tickets.push(newTicket);
  res.status(201).json(newTicket);
});

// 6. PUT update status tiket (opsional, misal untuk admin/customer service)
app.put("/api/tickets/:ticketId/status", (req, res) => {
  const { ticketId } = req.params;
  const { status } = req.body;
  const ticket = tickets.find((t) => t.id === ticketId.toUpperCase());
  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }
  if (!status) {
    return res.status(400).json({ error: "status is required" });
  }
  ticket.status = status;
  ticket.history.push(status);
  res.json(ticket);
});

// Fallback: jika route tidak cocok, kirim index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
