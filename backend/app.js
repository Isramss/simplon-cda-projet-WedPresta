const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const offresRoutes = require("./routes/offres.routes");
const utilisateursRoutes = require("./routes/users.routes");
const categoriesRoutes = require("./routes/categories.routes");
const adressesRoutes = require("./routes/adresses.routes");
const messagesRoutes = require("./routes/messages.routes");

const app = express();

app.use(cors());
app.use(express.json());

// healthcheck (super utile pour CI/Docker)
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.get("/", (req, res) => {
  res.json({ message: "API WedPresta opérationnelle 🥳" });
});

app.use("/api/auth", authRoutes);
app.use("/api/offres", offresRoutes);
app.use("/api/utilisateurs", utilisateursRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/adresses", adressesRoutes);
app.use("/api/messages", messagesRoutes);

module.exports = app;
