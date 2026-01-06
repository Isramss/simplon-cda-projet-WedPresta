// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || user?.code_role || null;

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  function scrollToSection(id) {
    // si on n’est pas sur la home, on y va d’abord
    if (location.pathname !== "/") {
      navigate("/#" + id);
      return;
    }
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }

  const headerStyle = {
    position: "sticky",
    top: 0,
    zIndex: 10,
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(10px)",
    color: "white",
  };

  const logo = (
    <div
      style={{
        fontWeight: "bold",
        fontFamily: "Aboreto, serif",
        letterSpacing: "2px",
        cursor: "pointer",
      }}
      onClick={() => navigate("/")}>
      WEDPRESTA
    </div>
  );

  /* ======================
            VISITEUR 
     ====================== */
  if (!token) {
    return (
      <header style={headerStyle}>
        <div style={{ width: "150px" }} />

        <nav
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            gap: "1.5rem",
            alignItems: "center",
            fontSize: ".9rem",
          }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            Accueil
          </Link>

          <Link
            to="/prestations"
            style={{ color: "white", textDecoration: "none" }}>
            Prestations
          </Link>

          {logo}

          <button
            type="button"
            style={{
              color: "white",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => scrollToSection("apropos")}>
            À propos
          </button>

          <button
            type="button"
            style={{
              color: "white",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => scrollToSection("contact")}>
            Nous contacter
          </button>
        </nav>

        <div
          style={{
            display: "flex",
            gap: "0.8rem",
            alignItems: "center",
          }}>
          <button
            onClick={() => navigate("/register")}
            style={{
              padding: ".4rem 1rem",
              borderRadius: "999px",
              border: "1px solid white",
              background: "none",
              color: "white",
              cursor: "pointer",
              fontSize: ".85rem",
            }}>
            Devenir prestataire
          </button>

          <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
            Connexion
          </Link>
        </div>
      </header>
    );
  }

  /* ======================
      PRESTATAIRE
     ====================== */
  if (role === "PRESTATAIRE") {
    return (
      <header style={headerStyle}>
        {/* espace gauche */}
        <div style={{ width: "150px" }} />

        {/* centre : logo seul */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          {logo}
        </div>

        {/* droite : liens presta */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            fontSize: ".9rem",
          }}>
          <p>Bienvenue {user.nom || user.prenom || ""} 👋</p>
          <button
            onClick={handleLogout}
            style={{
              marginLeft: ".5rem",
              padding: ".3rem .7rem",
              cursor: "pointer",
            }}>
            Déconnexion
          </button>
        </div>
      </header>
    );
  }

  /* ======================
      ADMIN
     ====================== */
  if (role === "ADMIN") {
    return (
      <header style={headerStyle}>
        {/* espace gauche */}
        <div style={{ width: "150px" }} />

        {/* centre : logo */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          {logo}
        </div>

        {/* droite : liens admin */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            fontSize: ".9rem",
          }}>
          <p style={{ color: "#fff" }}>
            Bonjour {user.nom || user.prenom || ""} 👋
          </p>

          <button
            onClick={handleLogout}
            style={{
              marginLeft: ".5rem",
              padding: ".3rem .7rem",
              cursor: "pointer",
            }}>
            Déconnexion
          </button>
        </div>
      </header>
    );
  }

  return null;
}

export default Navbar;
