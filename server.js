const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Endpoint “ping”
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Endpoint buat tiket (simulasi)
let tickets = [];
app.post("/api/tickets", (req, res) => {
  const { forkliftId, issue } = req.body;
  const id = "TCK-" + String(tickets.length + 1).padStart(4, "0");
  const newTicket = { id, forkliftId, issue, status: "Received" };
  tickets.push(newTicket);
  res.json(newTicket);
});

// Endpoint ambil semua tiket
app.get("/api/tickets", (req, res) => {
  res.json(tickets);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
