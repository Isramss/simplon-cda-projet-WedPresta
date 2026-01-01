const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const authRoutes = require("./routes/auth.routes");
const offresRoutes = require("./routes/offres.routes");
const usersRoutes = require("./routes/users.routes");

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "API WedPresta opérationnelle 🥳" });
});
app.use("/api/auth", authRoutes);
app.use("/api/offres", offresRoutes);
app.use("/api/users", usersRoutes);

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Le serveur lancé sur le port ${PORT}`);
});
