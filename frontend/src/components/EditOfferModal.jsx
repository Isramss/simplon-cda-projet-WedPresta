// src/components/EditOfferModal.jsx
import { useState } from "react";

function EditOfferModal({ offer, onClose, onUpdated }) {
  const [titre, setTitre] = useState(offer.titre || "");
  const [description, setDescription] = useState(offer.description || "");
  const [prixMin, setPrixMin] = useState(offer.prix_min || "");
  const [zone, setZone] = useState(offer.zone_intervention || "");
  const [imageUrl, setImageUrl] = useState(offer.image_url || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3001/api/offres/${offer.id_offre}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            titre,
            description,
            prix_min: prixMin || null,
            zone_intervention: zone || null,
            image_url: imageUrl || null,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erreur lors de la modification");
        return;
      }

      setMessage("Offre modifiée avec succès ✅");

      if (onUpdated) onUpdated();

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error(err);
      setMessage("Erreur serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}>
      <div
        style={{
          background: "white",
          padding: "1.8rem",
          borderRadius: "14px",
          width: "40%",
          maxWidth: "95%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
          position: "relative",
        }}>
        {/* Bouton fermer */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "0.7rem",
            right: "0.7rem",
            border: "none",
            background: "transparent",
            fontSize: "1.1rem",
            cursor: "pointer",
          }}>
          ✕
        </button>

        <h2
          style={{
            marginBottom: "1rem",
            fontSize: "1.3rem",
            fontWeight: "600",
          }}>
          Modifier l’offre
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Titre */}
          <div style={{ marginBottom: "0.8rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: ".2rem",
                fontSize: ".85rem",
              }}>
              Titre de l’offre *
            </label>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              required
              style={{
                width: "100%",
                padding: ".5rem .7rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: "0.8rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: ".2rem",
                fontSize: ".85rem",
              }}>
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              style={{
                width: "100%",
                padding: ".5rem .7rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                resize: "vertical",
              }}
            />
          </div>

          {/* Prix + Zone */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.8rem",
              marginBottom: "0.8rem",
            }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: ".2rem",
                  fontSize: ".85rem",
                }}>
                Prix minimum (en €)
              </label>
              <input
                type="number"
                value={prixMin}
                onChange={(e) => setPrixMin(e.target.value)}
                min={0}
                style={{
                  width: "80%",
                  padding: ".5rem .7rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: ".2rem",
                  fontSize: ".85rem",
                }}>
                Ville / zone d’intervention
              </label>
              <input
                type="text"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                style={{
                  width: "80%",
                  padding: ".5rem .7rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "0.8rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: ".2rem",
                fontSize: ".85rem",
              }}>
              URL de l’image
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              style={{
                width: "100%",
                padding: ".5rem .7rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          {message && (
            <p
              style={{
                marginTop: ".3rem",
                marginBottom: ".5rem",
                fontSize: ".85rem",
                color: message.includes("succès") ? "green" : "red",
              }}>
              {message}
            </p>
          )}

          {/* Boutons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: ".5rem",
              marginTop: "1rem",
            }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: ".5rem 1rem",
                borderRadius: "999px",
                border: "1px solid #ccc",
                background: "white",
                cursor: "pointer",
              }}>
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: ".5rem 1.2rem",
                borderRadius: "999px",
                border: "none",
                background: "#2b2626",
                color: "white",
                cursor: "pointer",
              }}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditOfferModal;
