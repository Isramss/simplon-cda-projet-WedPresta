const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "API WedPresta opérationnelle 🥳" });
});

app.use("/api/auth", authRoutes);
// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Le serveur lancé sur le port ${PORT}`);
});
