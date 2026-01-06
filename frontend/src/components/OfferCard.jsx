import { useNavigate } from "react-router-dom";

function OfferCard({ offre }) {
  const navigate = useNavigate();

  // Je limite la description sur la carte
  const shortDescription =
    offre.description && offre.description.length > 120
      ? offre.description.slice(0, 120) + "..."
      : offre.description;

  return (
    <article
      style={{
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        overflow: "hidden",
        maxWidth: "320px",
        display: "flex",
        flexDirection: "column",
      }}>
      {offre.image_url && (
        <div style={{ height: "180px", overflow: "hidden" }}>
          <img
            src={offre.image_url}
            alt={offre.titre}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      <div
        style={{
          padding: "1rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}>
        <p style={{ fontSize: ".8rem", color: "#c44" }}>
          {offre.zone_intervention ? `${offre.zone_intervention} • ` : ""}
          {offre.libelle_categorie}
        </p>

        <h3 style={{ margin: ".3rem 0 .6rem", fontSize: "1.1rem" }}>
          {offre.titre}
        </h3>

        <p style={{ fontSize: ".85rem", color: "#555", minHeight: "3.2rem" }}>
          {shortDescription}
        </p>

        {offre.prix_min && (
          <p style={{ marginTop: ".5rem", fontWeight: "bold" }}>
            À partir de {offre.prix_min} €
          </p>
        )}

        <button
          style={{
            marginTop: "auto",
            padding: ".4rem .9rem",
            fontSize: ".85rem",
            borderRadius: "999px",
            border: "1px solid #333",
            background: "white",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/offres/${offre.id_offre}`)}>
          En savoir plus
        </button>
      </div>
    </article>
  );
}

export default OfferCard;
