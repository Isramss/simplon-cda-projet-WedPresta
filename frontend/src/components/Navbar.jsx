import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../index.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1024) setMenuOpen(false);
    }
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || user?.code_role || null;

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/");
  }

  function scrollToSection(id) {
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/#" + id);
      return;
    }
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  }

  const logo = (
    <div
      style={{
        fontWeight: "bold",
        fontFamily: "Aboreto, serif",
        letterSpacing: "2px",
        cursor: "pointer",
        color: "white",
      }}
      onClick={() => { setMenuOpen(false); navigate("/"); }}>
      WEDPRESTA
    </div>
  );

  const linkStyle = { color: "white", textDecoration: "none" };
  const btnStyle = {
    color: "white",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "Lora, serif",
    fontSize: "0.9rem",
  };

  /* ====================== VISITEUR ====================== */
  if (!token) {
    return (
      <header className="navbar" ref={navRef}>
        {/* Gauche vide pour centrer */}
        <div style={{ width: "150px" }} />

        {/* Centre desktop */}
        <nav className="navbar-center">
          <Link to="/" style={linkStyle}>Accueil</Link>
          <Link to="/prestations" style={linkStyle}>Prestations</Link>
          {logo}
          <button style={btnStyle} onClick={() => scrollToSection("apropos")}>À propos</button>
          <button style={btnStyle} onClick={() => scrollToSection("contact")}>Nous contacter</button>
        </nav>

        {/* Droite desktop */}
        <div className="navbar-right">
          <button
            onClick={() => navigate("/inscription")}
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
          <Link to="/login" style={linkStyle}>Connexion</Link>
        </div>

        {/* Logo centré mobile/tablette */}
        <div className="navbar-logo-mobile" onClick={() => { setMenuOpen(false); navigate("/"); }}>
          WEDPRESTA
        </div>

        {/* Hamburger mobile */}
        <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span />
          <span />
          <span />
        </button>

        {/* Menu mobile */}
        <div className={`navbar-mobile-menu ${menuOpen ? "open" : ""}`}>
          <Link to="/" style={linkStyle} onClick={() => setMenuOpen(false)}>Accueil</Link>
          <Link to="/prestations" style={linkStyle} onClick={() => setMenuOpen(false)}>Prestations</Link>
          <button style={btnStyle} onClick={() => scrollToSection("apropos")}>À propos</button>
          <button style={btnStyle} onClick={() => scrollToSection("contact")}>Nous contacter</button>
          <Link to="/inscription" style={linkStyle} onClick={() => setMenuOpen(false)}>Devenir prestataire</Link>
          <Link to="/login" style={linkStyle} onClick={() => setMenuOpen(false)}>Connexion</Link>
        </div>
      </header>
    );
  }

  /* ====================== PRESTATAIRE ====================== */
  if (role === "PRESTATAIRE") {
    return (
      <header className="navbar" ref={navRef}>
        <div style={{ width: "150px" }} />

        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          {logo}
        </div>

        <div className="navbar-right" style={{ fontSize: ".9rem" }}>
          <p style={{ margin: 0 }}>Bienvenue {user.nom || ""} 👋</p>
          <button onClick={handleLogout} style={{ ...btnStyle, border: "1px solid white", padding: ".3rem .7rem", borderRadius: "4px" }}>
            Déconnexion
          </button>
        </div>

        {/* Hamburger mobile */}
        <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span />
          <span />
          <span />
        </button>

        <div className={`navbar-mobile-menu ${menuOpen ? "open" : ""}`}>
          <span style={{ color: "white" }}>Bienvenue {user.nom || ""} 👋</span>
          <button style={btnStyle} onClick={handleLogout}>Déconnexion</button>
        </div>
      </header>
    );
  }

  /* ====================== ADMIN ====================== */
  if (role === "ADMIN") {
    return (
      <header className="navbar" ref={navRef}>
        <div style={{ width: "150px" }} />

        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          {logo}
        </div>

        <div className="navbar-right" style={{ fontSize: ".9rem" }}>
          <p style={{ margin: 0, color: "#fff" }}>Bonjour {user.nom || ""} 👋</p>
          <button onClick={handleLogout} style={{ ...btnStyle, border: "1px solid white", padding: ".3rem .7rem", borderRadius: "4px" }}>
            Déconnexion
          </button>
        </div>

        {/* Hamburger mobile */}
        <button className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span />
          <span />
          <span />
        </button>

        <div className={`navbar-mobile-menu ${menuOpen ? "open" : ""}`}>
          <span style={{ color: "white" }}>Bonjour {user.nom || ""} 👋</span>
          <button style={btnStyle} onClick={handleLogout}>Déconnexion</button>
        </div>
      </header>
    );
  }

  return null;
}

export default Navbar;
