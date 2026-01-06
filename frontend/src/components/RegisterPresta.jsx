// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmMotDePasse, setConfirmMotDePasse] = useState("");
  const [telephone, setTelephone] = useState("");

  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");
    setMessage("");

    if (telephone.length !== 10) {
      setErreur("Le numéro doit contenir 10 chiffres.");
      return;
    }

    // petites validations front
    if (motDePasse.length < 6) {
      setErreur("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (motDePasse !== confirmMotDePasse) {
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          email,
          motDePasse: motDePasse,
          telephone,
        }),
      });

      const data = await res.json();
      console.log("Réponse inscription :", data);

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de l’inscription");
      }

      const loginRes = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          motDePasse, // ⬅ ATTENTION : même nom que ton endpoint de login
        }),
      });

      const loginData = await loginRes.json();
      console.log("Réponse auto-login :", loginData);

      if (!loginRes.ok) {
        // inscription ok mais login auto KO
        setMessage(
          "Compte créé avec succès, mais la connexion automatique a échoué. Vous pouvez vous connecter manuellement."
        );
        return;
      }

      const token = loginData.token || loginData.accessToken || null;
      const user =
        loginData.user || loginData.utilisateur || loginData.data || null;

      if (!token || !user) {
        setMessage(
          "Compte créé, mais la réponse de connexion est inattendue. Connectez-vous manuellement."
        );
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const role = user.role || user.code_role || user.libelle_role || null;

      if (role === "PRESTATAIRE") {
        navigate("/dashboard-presta");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setErreur(err.message || "Erreur lors de l’inscription");
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
        padding: "1rem",
        backgroundImage: "url('/hamza.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255, 215, 215, 0.7)",
          zIndex: 0,
        }}
      />

      {/* carte formulaire */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          boxShadow: "0 10px 30px #b29c9c14",
          maxWidth: "480px",
          width: "100%",
          padding: "2rem",
        }}>
        <h1
          style={{
            fontFamily: "Aboreto, serif",
            fontSize: "1.6rem",
            marginBottom: "0.5rem",
            textAlign: "center",
          }}>
          Inscription prestataire
        </h1>
        <p
          style={{
            textAlign: "center",
            fontSize: ".9rem",
            color: "#555",
            marginBottom: "1.5rem",
          }}>
          Crée ton espace pour proposer tes services de mariage sur WedPresta.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "0.8rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: ".2rem",
                fontSize: ".85rem",
              }}>
              Nom de votre entreprise*
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              style={{
                width: "100%",
                padding: ".5rem .7rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div style={{ marginBottom: "0.8rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: ".2rem",
                fontSize: ".85rem",
              }}>
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: ".5rem .7rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div style={{ marginBottom: "0.8rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: ".2rem",
                fontSize: ".85rem",
              }}>
              Mot de passe *
            </label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              style={{
                width: "100%",
                padding: ".5rem .7rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div style={{ marginBottom: "0.8rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: ".2rem",
                fontSize: ".85rem",
              }}>
              Confirmation du mot de passe *
            </label>
            <input
              type="password"
              value={confirmMotDePasse}
              onChange={(e) => setConfirmMotDePasse(e.target.value)}
              required
              style={{
                width: "100%",
                padding: ".5rem .7rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div style={{ marginBottom: "0.8rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: ".2rem",
                fontSize: ".85rem",
              }}>
              Téléphone
            </label>
            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
              required
              style={{
                width: "100%",
                padding: ".5rem .7rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />

            {telephone.length > 0 && telephone.length < 10 && (
              <p style={{ color: "red", fontSize: ".8rem" }}>
                Le numéro doit contenir 10 chiffres.
              </p>
            )}
          </div>

          {erreur && (
            <p
              style={{
                color: "red",
                fontSize: ".85rem",
                marginBottom: ".5rem",
              }}>
              {erreur}
            </p>
          )}
          {message && (
            <p
              style={{
                color: "green",
                fontSize: ".85rem",
                marginBottom: ".5rem",
              }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: ".6rem 1rem",
              borderRadius: "999px",
              border: "none",
              background: "#2b2626",
              color: "white",
              cursor: "pointer",
              marginTop: ".5rem",
            }}>
            {loading ? "Création du compte..." : "Créer mon compte"}
          </button>
        </form>

        <p
          style={{
            marginTop: "1rem",
            fontSize: ".85rem",
            textAlign: "center",
          }}>
          Déjà un compte ?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              border: "none",
              background: "none",
              color: "#c27b94",
              cursor: "pointer",
              textDecoration: "underline",
            }}>
            Me connecter
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
