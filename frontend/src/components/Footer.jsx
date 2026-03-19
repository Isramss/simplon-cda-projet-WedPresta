import { Link } from "react-router-dom";
import "../index.css";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#3a3535",
        color: "white",
        padding: "3rem 2rem",
        fontFamily: "Lora, serif",
      }}>

      <div className="footer-grid">

        {/* Colonne gauche — liens */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "1rem" }}>
            Accueil
          </Link>
          <Link to="/prestations" style={{ color: "white", textDecoration: "none", fontSize: "1rem" }}>
            Prestations
          </Link>
          <Link to="/inscription" style={{ color: "white", textDecoration: "none", fontSize: "1rem" }}>
            Devenir prestataire
          </Link>
        </div>

        {/* Colonne centre — logo */}
        <div style={{ textAlign: "center" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <div style={{ fontFamily: "Aboreto, serif", fontSize: "1.8rem", fontWeight: "bold", letterSpacing: "3px", color: "#e8a0a0" }}>
              WED
            </div>
            <div style={{ fontFamily: "Aboreto, serif", fontSize: "1.8rem", fontWeight: "bold", letterSpacing: "3px", color: "#e8a0a0" }}>
              PRESTA
            </div>
          </Link>
        </div>

        {/* Colonne droite — newsletter */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <input
            type="email"
            placeholder="Votre email..."
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "4px",
              border: "none",
              fontSize: "0.9rem",
              width: "220px",
              outline: "none",
              maxWidth: "100%",
            }}
          />
        </div>

      </div>

      {/* Bas de footer — copyright + mentions légales */}
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} WedPresta — Tous droits réservés</span>
        <Link
          to="/mentions-legales"
          style={{ color: "#aaa", textDecoration: "underline", fontSize: "0.75rem" }}>
          Mentions légales
        </Link>
      </div>

    </footer>
  );
}

export default Footer;
