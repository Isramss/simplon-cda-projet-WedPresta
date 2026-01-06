// src/pages/OfferDetails.jsx
import "../index.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContactForm from "../components/ContactForm";

function OfferDetail() {
  const { id } = useParams();

  const [offre, setOffre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOffer() {
      try {
        const res = await fetch(`http://localhost:3001/api/offres/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Erreur lors du chargement de l’offre"
          );
        }

        setOffre(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Erreur lors du chargement de l’offre");
      } finally {
        setLoading(false);
      }
    }

    fetchOffer();
  }, [id]);

  if (loading) {
    return <p style={{ padding: "2rem" }}>Chargement de l’offre...</p>;
  }

  if (error) {
    return <p style={{ padding: "2rem", color: "red" }}>{error}</p>;
  }

  if (!offre) {
    return <p style={{ padding: "2rem" }}>Offre introuvable.</p>;
  }

  return (
    <div style={{ padding: "2rem 1rem", maxWidth: "1100px", margin: "0 auto" }}>
      <div className="offer-details-layout">
        {/* Colonne gauche */}
        <div>
          {offre.image_url && (
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                maxHeight: "420px",
              }}>
              <img
                src={offre.image_url}
                alt={offre.titre}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}

          <h1
            style={{
              marginTop: "1.5rem",
              marginBottom: ".5rem",
              fontSize: "1.8rem",
              fontFamily: "Lora, serif",
            }}>
            {offre.titre}
          </h1>

          <p
            style={{
              fontSize: ".9rem",
              color: "#c27b94",
              marginBottom: ".5rem",
            }}>
            {offre.libelle_categorie}
            {offre.zone_intervention && ` • ${offre.zone_intervention}`}
          </p>

          {offre.prix_min && (
            <p
              style={{
                fontWeight: "bold",
                fontSize: "1rem",
                marginBottom: "1rem",
              }}>
              À partir de {offre.prix_min} €
            </p>
          )}

          <h2
            style={{
              fontSize: "1.1rem",
              marginTop: "1.5rem",
              marginBottom: ".5rem",
            }}>
            Description
          </h2>
          <p style={{ fontSize: ".95rem", lineHeight: 1.5 }}>
            {offre.description}
          </p>

          {offre.prestataire_nom && (
            <p
              style={{
                marginTop: "1rem",
                fontSize: ".9rem",
                color: "#555",
                fontStyle: "italic",
              }}>
              Prestataire : {offre.prestataire_nom}
            </p>
          )}
        </div>

        {/* Colonne droite : formulaire */}
        <aside className="offer-details-aside">
          <h2
            style={{
              fontSize: "1.2rem",
              marginBottom: ".5rem",
              fontFamily: "Aboreto, serif",
            }}>
            Contacter le prestataire
          </h2>
          <p
            style={{
              fontSize: ".85rem",
              color: "#555",
              marginBottom: "1rem",
            }}>
            Partage quelques détails sur ton mariage, le prestataire te répondra
            par email.
          </p>

          <ContactForm offre={offre} />
        </aside>
      </div>
    </div>
  );
}

export default OfferDetail;
