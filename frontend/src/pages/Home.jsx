// src/pages/Home.jsx
import { useEffect, useState } from "react";
import OfferCard from "../components/OfferCard";

function Home() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOffers() {
      try {
        const res = await fetch("http://localhost:3001/api/offres");
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

  const populaires = offres.slice(0, 3); // 3 cartes pour la home

  return (
    <div>
      <section
        style={{
          padding: "4rem 2rem",
          background:
            "linear-gradient(to bottom, rgba(255, 215, 215, 0.7)), url('./hamza.jpg') center/cover",
          color: "white",
          textAlign: "center",
        }}>
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            background: "rgba(255,255,255,0.15)",
            padding: "2rem",
            borderRadius: "12px",
            backdropFilter: "blur(4px)",
          }}>
          <p style={{ fontSize: "1.2rem", lineHeight: "1.6" }}>
            “ Votre mariage, notre réseau de confiance. <br />
            Trouvez les meilleurs prestataires à portée de clic.
          </p>
          <p
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1rem",
              fontStyle: "italic",
            }}>
            — WedPresta
          </p>
        </div>
      </section>

      {/* PRESTATIONS POPULAIRES */}
      <section style={{ padding: "3rem 2rem" }}>
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
          Les prestations populaires
        </h2>

        {loading ? (
          <p style={{ textAlign: "center" }}>Chargement des offres...</p>
        ) : populaires.length === 0 ? (
          <p style={{ textAlign: "center" }}>
            Aucune offre disponible pour le moment.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "2rem",
              maxWidth: "1100px",
              margin: "0 auto",
            }}>
            {populaires.map((offre) => (
              <OfferCard key={offre.id_offre} offre={offre} />
            ))}
          </div>
        )}
      </section>

      {/* Vos retours (placeholder pour l’instant) */}
      <section
        style={{
          padding: "3rem 2rem 4rem",
          background: "#faf5f7",
          textAlign: "center",
        }}>
        <h2>Vos retours</h2>
        <p style={{ marginTop: "1rem", color: "#666" }}>
          (Section témoignages à venir)
        </p>
      </section>
    </div>
  );
}

export default Home;
