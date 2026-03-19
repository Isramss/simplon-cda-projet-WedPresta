// src/pages/Prestations.jsx
import { useEffect, useState } from "react";
import OfferCard from "../components/OfferCard";

function Prestations() {
  const [offres, setOffres] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOffers() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/offres`);
        const data = await res.json();
        setOffres(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setOffres([]);
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  const filtered = offres.filter((offre) => {
    const q = search.toLowerCase();
    return (
      offre.titre?.toLowerCase().includes(q) ||
      offre.description?.toLowerCase().includes(q) ||
      offre.libelle_categorie?.toLowerCase().includes(q) ||
      offre.zone_intervention?.toLowerCase().includes(q) // ici
    );
  });

  return (
    <div className="page-container">
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Prestations</h1>

      {/* barre de recherche */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Rechercher par ville, type de prestation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: ".7rem 1rem",
            minWidth: "260px",
            maxWidth: "420px",
            width: "100%",
            borderRadius: "999px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Chargement des prestations...</p>
      ) : filtered.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          Aucune prestation ne correspond à votre recherche.
        </p>
      ) : (
        <div className="offers-grid">
          {filtered.map((offre) => (
            <OfferCard key={offre.id_offre} offre={offre} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Prestations;
