import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateOfferModal from "../components/CreateOfferModal";
import EditOfferModal from "../components/EditOfferModal";

function DashboardPresta() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [offres, setOffres] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState("");
  const [hasFetchedMessages, setHasFetchedMessages] = useState(false);

  const [activeTab, setActiveTab] = useState("offres");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (user.role !== "PRESTATAIRE") {
      navigate("/");
      return;
    }
  }, [token, user.role, navigate]);

  async function fetchMyOffers() {
    try {
      setOffersLoading(true);
      const res = await fetch("http://localhost:3001/api/offres/Mes-offres", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json();
      setOffres(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setOffres([]);
    } finally {
      setOffersLoading(false);
    }
  }

  useEffect(() => {
    fetchMyOffers();
  }, []);

  async function fetchMessages() {
    try {
      setMessagesLoading(true);
      setMessagesError("");

      const res = await fetch(
        "http://localhost:3001/api/messages/mes-messages",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.message || "Erreur lors du chargement des messages"
        );
      }

      setMessages(Array.isArray(data) ? data : []);
      setHasFetchedMessages(true);
    } catch (err) {
      console.error(err);
      setMessagesError(
        err.message || "Impossible de charger vos messages pour le moment."
      );
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }

  // changement onglet
  function handleTabChange(tab) {
    setActiveTab(tab);
    if (tab === "messages" && !hasFetchedMessages) {
      fetchMessages();
    }
  }

  if (offersLoading && !offres.length) {
    return <p style={{ padding: "2rem" }}>Chargement de votre espace...</p>;
  }

  return (
    <div style={{ padding: "2rem 1rem", maxWidth: "1100px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: ".2rem" }}>Mon espace prestataire</h1>
      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        Bienvenue {user.nom || user.prenom || ""} 👋
      </p>

      {/* Onglets */}
      <div
        style={{
          display: "flex",
          gap: ".5rem",
          marginBottom: "1.5rem",
          borderBottom: "1px solid #eee",
        }}>
        <button
          type="button"
          onClick={() => handleTabChange("offres")}
          style={{
            padding: ".5rem 1rem",
            border: "none",
            borderBottom:
              activeTab === "offres"
                ? "2px solid #2b2626"
                : "2px solid transparent",
            background: "transparent",
            cursor: "pointer",
            fontWeight: activeTab === "offres" ? "600" : "400",
          }}>
          Mes offres
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("messages")}
          style={{
            padding: ".5rem 1rem",
            border: "none",
            borderBottom:
              activeTab === "messages"
                ? "2px solid #2b2626"
                : "2px solid transparent",
            background: "transparent",
            cursor: "pointer",
            fontWeight: activeTab === "messages" ? "600" : "400",
          }}>
          Messages reçus
        </button>
      </div>

      {/* Onglet MES OFFRES */}
      {activeTab === "offres" && (
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}>
            <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Mes offres</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: ".4rem .9rem",
                borderRadius: "999px",
                border: "none",
                background: "#2b2626",
                color: "white",
                cursor: "pointer",
                fontSize: ".9rem",
              }}>
              ➕ Créer une offre
            </button>
          </div>

          {offres.length === 0 ? (
            <p>Tu n’as pas encore d’offres.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: ".9rem",
                }}>
                <thead>
                  <tr
                    style={{
                      background: "#f5f5f5",
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}>
                    <th style={{ padding: ".6rem" }}>Image</th>
                    <th style={{ padding: ".6rem" }}>Titre</th>
                    <th style={{ padding: ".6rem" }}>Catégorie</th>
                    <th style={{ padding: ".6rem" }}>Créée le</th>
                    <th style={{ padding: ".6rem" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offres.map((offre) => (
                    <tr
                      key={offre.id_offre}
                      style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: ".6rem" }}>
                        {offre.image_url ? (
                          <img
                            src={offre.image_url}
                            alt={offre.titre}
                            style={{
                              width: "70px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: ".8rem", color: "#999" }}>
                            Pas d’image
                          </span>
                        )}
                      </td>
                      <td style={{ padding: ".6rem" }}>{offre.titre}</td>
                      <td style={{ padding: ".6rem" }}>
                        {offre.libelle_categorie || "-"}
                      </td>
                      <td style={{ padding: ".6rem" }}>
                        {offre.date_creation
                          ? new Date(offre.date_creation).toLocaleDateString(
                              "fr-FR"
                            )
                          : "-"}
                      </td>
                      <td style={{ padding: ".6rem" }}>
                        <button
                          type="button"
                          onClick={() => setEditingOffer(offre)}
                          style={{
                            padding: ".3rem .6rem",
                            borderRadius: "999px",
                            border: "1px solid #333",
                            background: "white",
                            cursor: "pointer",
                            fontSize: ".8rem",
                          }}>
                          ✏️ Modifier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showCreateModal && (
            <CreateOfferModal
              onClose={() => setShowCreateModal(false)}
              onCreated={fetchMyOffers}
            />
          )}

          {editingOffer && (
            <EditOfferModal
              offer={editingOffer}
              onClose={() => setEditingOffer(null)}
              onUpdated={fetchMyOffers}
            />
          )}
        </section>
      )}

      {/* Onglet MESSAGES */}
      {activeTab === "messages" && (
        <section>
          <h2 style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>
            Messages reçus
          </h2>

          {messagesLoading && <p>Chargement des messages...</p>}
          {messagesError && (
            <p style={{ color: "red", marginBottom: "1rem" }}>
              {messagesError}
            </p>
          )}

          {!messagesLoading && messages.length === 0 && !messagesError && (
            <p>Tu n’as pas encore reçu de message.</p>
          )}

          {!messagesLoading && messages.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: ".9rem",
                }}>
                <thead>
                  <tr
                    style={{
                      background: "#f5f5f5",
                      textAlign: "left",
                      borderBottom: "1px solid #ddd",
                    }}>
                    <th style={{ padding: ".6rem" }}>Date</th>
                    <th style={{ padding: ".6rem" }}>Offre</th>
                    <th style={{ padding: ".6rem" }}>Nom</th>
                    <th style={{ padding: ".6rem" }}>Email</th>
                    <th style={{ padding: ".6rem" }}>Invités</th>
                    <th style={{ padding: ".6rem" }}>Budget</th>
                    <th style={{ padding: ".6rem" }}>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr
                      key={msg.id_message}
                      style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: ".6rem", whiteSpace: "nowrap" }}>
                        {msg.date_envoi
                          ? new Date(msg.date_envoi).toLocaleString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td style={{ padding: ".6rem" }}>
                        {msg.titre_offre || "-"}
                      </td>
                      <td style={{ padding: ".6rem" }}>{msg.nom}</td>
                      <td style={{ padding: ".6rem" }}>{msg.email}</td>
                      <td style={{ padding: ".6rem" }}>
                        {msg.nb_invites != null ? msg.nb_invites : "-"}
                      </td>
                      <td style={{ padding: ".6rem" }}>
                        {msg.budget_estime != null
                          ? `${msg.budget_estime} €`
                          : "-"}
                      </td>
                      <td style={{ padding: ".6rem", maxWidth: "260px" }}>
                        <div
                          style={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}>
                          {msg.contenu && msg.contenu.length > 120
                            ? msg.contenu.slice(0, 120) + "..."
                            : msg.contenu}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default DashboardPresta;
