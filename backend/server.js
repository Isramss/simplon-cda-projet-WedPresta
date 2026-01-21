const app = require("./app");
if (process.env.NODE_ENV !== "test") {
  require("dotenv").config();
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Le serveur lancé sur le port ${PORT}`);
});
