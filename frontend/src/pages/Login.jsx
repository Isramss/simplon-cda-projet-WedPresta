// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            motDePasse,
          }),
        }
      );

      const data = await res.json();
      console.log("Réponse login API :", data);

      if (!res.ok || data.message === "Identifiant invalides") {
        throw new Error(data.message || "Identifiants invalides");
      }

      // Récupère le token + user
      const token = data.token || data.accessToken || null;
      const user = data.user || data.utilisateur || data.data || null;

      if (!token || !user) {
        throw new Error("Réponse de connexion inattendue");
      }

      // Stock dans localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Rôle pour redirection
      const role = user.role || user.code_role || user.libelle_role || null;

      if (role === "ADMIN") {
        navigate("/dashboard-admin");
      } else if (role === "PRESTATAIRE") {
        navigate("/dashboard-presta");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setErreur(err.message || "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url('./hamza.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(255,215,215,0.7)",
        }}
      />

      {/* carte login */}
      <div
        style={{
          position: "relative",
          width: "520px",
          maxWidth: "95%",
          backgroundColor: "rgba(136,135,135,0.36)",
          borderRadius: "12px",
          padding: "2.5rem 3rem",
          color: "white",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          backdropFilter: "blur(6px)",
        }}>
        {/* Titre "Prestataires" */}
        <h2
          style={{
            fontFamily: "Aboreto, cursive",
            textAlign: "center",
            marginBottom: "0.75rem",
            fontSize: "1.3rem",
            letterSpacing: "1px",
          }}>
          Prestataires
        </h2>

        {/* Logo texte */}
        <div
          style={{
            fontFamily: "Aboreto, cursive",
            fontSize: "2.5rem",
            textAlign: "center",
            marginBottom: "2rem",
            color: "#f9c3c3",
          }}
          onClick={() => navigate("/")}>
          WedPresta
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.2rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: ".3rem",
                fontSize: ".95rem",
              }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: ".6rem .75rem",
                borderRadius: "4px",
                border: "1px solid #ddd",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "0.6rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: ".3rem",
                fontSize: ".95rem",
              }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              style={{
                width: "100%",
                padding: ".6rem .75rem",
                borderRadius: "4px",
                border: "1px solid #ddd",
                outline: "none",
              }}
            />
          </div>

          <div
            style={{
              textAlign: "right",
              fontSize: ".8rem",
              marginBottom: "0.8rem",
              opacity: 0.9,
            }}>
            Mot de passe oublié ?
          </div>

          {erreur && (
            <p
              style={{
                color: "#ffb3b3",
                marginBottom: "1rem",
                fontSize: ".9rem",
              }}>
              {erreur}
            </p>
          )}

          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: ".6rem 2rem",
                cursor: "pointer",
                borderRadius: "999px",
                border: "1px solid white",
                background: "linear-gradient(90deg, #f6c1cf, #f5a4c2, #e98fb8)",
                color: "#3d2a2e",
                fontWeight: "600",
                minWidth: "180px",
              }}>
              {loading ? "Connexion..." : "Connexion"}
            </button>
          </div>

          <p style={{ marginTop: "1rem", fontSize: ".85rem" }}>
            Pas encore de compte ?{" "}
            <button
              type="button"
              onClick={() => navigate("/inscription")}
              style={{
                border: "none",
                background: "none",
                color: "#c27b94",
                cursor: "pointer",
                textDecoration: "underline",
              }}>
              Créer un compte prestataire
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
