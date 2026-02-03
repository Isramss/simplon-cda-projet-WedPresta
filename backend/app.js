const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const offresRoutes = require("./routes/offres.routes");
const utilisateursRoutes = require("./routes/users.routes");
const categoriesRoutes = require("./routes/categories.routes");
const adressesRoutes = require("./routes/adresses.routes");
const messagesRoutes = require("./routes/messages.routes");

const app = express();
app.disable("x-powered-by");

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173", // preview vite (optionnel)
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

app.use(express.json());

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
