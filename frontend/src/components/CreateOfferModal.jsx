import { useEffect, useState } from "react";

function CreateOfferModal({ onClose, onCreated }) {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [prixMin, setPrixMin] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [idCategorie, setIdCategorie] = useState("");

  const [adresses, setAdresses] = useState([]);
  const [selectedAdresseId, setSelectedAdresseId] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState("");

  const [adrLoading, setAdrLoading] = useState(true);
  const [adrError, setAdrError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:3001/api/categories");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Erreur lors du chargement des catégories"
          );
        }

        setCategories(data);
      } catch (err) {
        console.error(err);
        setCatError("Impossible de charger les catégories.");
      } finally {
        setCatLoading(false);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchAdresses() {
      try {
        const res = await fetch("http://localhost:3001/api/adresses");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Erreur lors du chargement des adresses"
          );
        }

        setAdresses(data);
      } catch (err) {
        console.error(err);
        setAdrError("Impossible de charger les adresses.");
      } finally {
        setAdrLoading(false);
      }
    }

    fetchAdresses();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!idCategorie) {
      setMessage("Merci de choisir une catégorie.");
      return;
    }

    if (!selectedAdresseId) {
      setMessage("Merci de choisir une ville / zone d’intervention.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const adresseObj = adresses.find(
        (a) => String(a.id_adresse) === String(selectedAdresseId)
      );

      const zone_intervention = adresseObj
        ? `${adresseObj.code_postal} - ${adresseObj.ville}`
        : null;

      const res = await fetch("http://localhost:3001/api/offres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titre,
          description,
          prix_min: prixMin || null,
          zone_intervention,
          image_url: imageUrl || null,
          id_categorie: Number(idCategorie),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erreur lors de la création de l’offre");
        return;
      }

      setMessage("Offre créée avec succès 🎉");

      if (onCreated) {
        onCreated();
      }

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error(err);
      setMessage("Erreur serveur lors de la création de l’offre");
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
          width: "480px",
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
          Créer une nouvelle offre
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

          {/* Prix + Ville / zone (via adresses) */}
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
                Ville / zone d’intervention *
              </label>

              {adrLoading ? (
                <p style={{ fontSize: ".85rem" }}>Chargement des villes...</p>
              ) : adrError ? (
                <p style={{ fontSize: ".85rem", color: "red" }}>{adrError}</p>
              ) : (
                <select
                  value={selectedAdresseId}
                  onChange={(e) => setSelectedAdresseId(e.target.value)}
                  required
                  style={{
                    width: "80%",
                    padding: ".5rem .7rem",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    background: "white",
                  }}>
                  <option value="">-- Sélectionne une ville --</option>
                  {adresses.map((adr) => (
                    <option key={adr.id_adresse} value={adr.id_adresse}>
                      {adr.code_postal} - {adr.ville}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Catégorie */}
          <div style={{ marginBottom: "0.8rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: ".2rem",
                fontSize: ".85rem",
              }}>
              Catégorie *
            </label>

            {catLoading ? (
              <p style={{ fontSize: ".85rem" }}>Chargement des catégories...</p>
            ) : catError ? (
              <p style={{ fontSize: ".85rem", color: "red" }}>{catError}</p>
            ) : (
              <select
                value={idCategorie}
                onChange={(e) => setIdCategorie(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: ".5rem .7rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}>
                <option value="">-- Sélectionne une catégorie --</option>
                {categories.map((cat) => (
                  <option key={cat.id_categorie} value={cat.id_categorie}>
                    {cat.libelle_categorie}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Image */}
          <div style={{ marginBottom: "0.8rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: ".2rem",
                fontSize: ".85rem",
              }}>
              URL de l’image (optionnel)
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
              disabled={loading || catLoading || adrLoading}
              style={{
                padding: ".5rem 1.2rem",
                borderRadius: "999px",
                border: "none",
                background: "#2b2626",
                color: "white",
                cursor: "pointer",
              }}>
              {loading ? "Création..." : "Créer l’offre"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateOfferModal;
