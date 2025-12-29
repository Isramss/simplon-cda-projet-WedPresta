//Inscription
async function register(req, res) {
  try {
    console.log("register - body reçu:", req.body);

    return res.json({
      message: "register OK (Pas encore connecté à la BDD)",
      bodyRecu: req.body,
    });
  } catch (error) {
    console.error("Erreur dans register :", error);
    return res.status(500).json({ message: "Erreur serveur dans register " });
  }
}

// Connexion

async function login(req, res) {
  try {
    console.log("login - body reçu :", req.body);

    return res.json({
      message: "login OK ( Pas encore connecté à la BDD)",
      bodyRecu: req.body,
    });
  } catch (error) {
    console.error("Erreur dans login :", error);
    return res.status(500).json({ message: "Erreur serveur dans login " });
  }
}

module.exports = {
  register,
  login,
};
