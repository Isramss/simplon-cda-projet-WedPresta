// src/pages/DashboardAdmin.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardAdmin() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role || user.code_role || user.libelle_role || null;

  const [view, setView] = useState("prestataires"); // "prestataires" | "offres"

  const [prestataires, setPrestataires] = useState([]);
  const [prestaLoading, setPrestaLoading] = useState(true);
  const [prestaError, setPrestaError] = useState("");

  const [offres, setOffres] = useState([]);
  const [offresLoading, setOffresLoading] = useState(true);
  const [offresError, setOffresError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (role !== "ADMIN") {
      navigate("/");
      return;
    }
  }, [token, role, navigate]);

  async function fetchPrestataires() {
    setPrestaLoading(true);
    setPrestaError("");

    try {
      const res = await fetch(
        "http://localhost:3001/api/utilisateurs/prestataires",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erreur lors du chargement");
      }

      setPrestataires(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setPrestaError(err.message || "Erreur serveur");
      setPrestataires([]);
    } finally {
      setPrestaLoading(false);
    }
  }

  async function fetchOffres() {
    setOffresLoading(true);
    setOffresError("");

    try {
      const res = await fetch("http://localhost:3001/api/offres", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erreur lors du chargement");
      }

      setOffres(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setOffresError(err.message || "Erreur serveur");
      setOffres([]);
    } finally {
      setOffresLoading(false);
    }
  }

  useEffect(() => {
    if (view === "prestataires") {
      fetchPrestataires();
    } else {
      fetchOffres();
    }
  }, [view]);

  async function handleToggleStatut(presta) {
    const currentActif =
      typeof presta.actif === "boolean"
        ? presta.actif
        : presta.statut_compte === "ACTIF";

    const newActif = !currentActif;
    const newStatutTexte = newActif ? "ACTIF" : "INACTIF";

    if (
      !window.confirm(
        `Confirmer le passage de ${presta.nom} en statut "${newStatutTexte}" ?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/api/utilisateurs/${presta.id_utilisateur}/actif`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ actif: newActif }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la mise à jour");
      }

      setPrestataires((prev) =>
        prev.map((p) =>
          p.id_utilisateur === presta.id_utilisateur
            ? {
                ...p,
                actif: newActif,
                statut_compte: newStatutTexte,
              }
            : p
        )
      );
    } catch (err) {
      alert(err.message || "Erreur lors de la mise à jour du statut.");
    }
  }

  async function handleDeleteOffer(offre) {
    if (
      !window.confirm(`Confirmer la suppression de l’offre "${offre.titre}" ?`)
    ) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/api/offres/${offre.id_offre}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la suppression");
      }

      setOffres((prev) => prev.filter((o) => o.id_offre !== offre.id_offre));
    } catch (err) {
      alert(err.message || "Erreur lors de la suppression de l’offre.");
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1
        style={{
          marginBottom: "0.5rem",
          display: "flex",
          justifyContent: "center",
        }}>
        Espace administrateur
      </h1>

      {/* Switch vues */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}>
        <button
          type="button"
          onClick={() => setView("prestataires")}
          style={{
            padding: "0.4rem 1rem",
            borderRadius: "999px",
            border: view === "prestataires" ? "none" : "1px solid #ccc",
            background: view === "prestataires" ? "#2b2626" : "white",
            color: view === "prestataires" ? "white" : "#333",
            cursor: "pointer",
            fontSize: ".9rem",
          }}>
          Prestataires
        </button>
        <button
          type="button"
          onClick={() => setView("offres")}
          style={{
            padding: "0.4rem 1rem",
            borderRadius: "999px",
            border: view === "offres" ? "none" : "1px solid #ccc",
            background: view === "offres" ? "#2b2626" : "white",
            color: view === "offres" ? "white" : "#333",
            cursor: "pointer",
            fontSize: ".9rem",
          }}>
          Offres
        </button>
      </div>

      {/* Vue PRESTATAIRES */}
      {view === "prestataires" && (
        <section>
          <h2 style={{ marginBottom: "1rem" }}>Liste des prestataires</h2>

          {prestaLoading ? (
            <p>Chargement des prestataires...</p>
          ) : prestaError ? (
            <p style={{ color: "red" }}>{prestaError}</p>
          ) : prestataires.length === 0 ? (
            <p>Aucun prestataire trouvé.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "600px",
                }}>
                <thead>
                  <tr
                    style={{
                      background: "#f7f3f3",
                      textAlign: "left",
                      fontSize: ".9rem",
                    }}>
                    <th
                      style={{
                        padding: "0.6rem",
                        borderBottom: "1px solid #eee",
                      }}>
                      ID
                    </th>
                    <th
                      style={{
                        padding: "0.6rem",
                        borderBottom: "1px solid #eee",
                      }}>
                      Nom
                    </th>
                    <th
                      style={{
                        padding: "0.6rem",
                        borderBottom: "1px solid #eee",
                      }}>
                      Email
                    </th>
                    <th
                      style={{
                        padding: "0.6rem",
                        borderBottom: "1px solid #eee",
                      }}>
                      Statut
                    </th>
                    <th
                      style={{
                        padding: "0.6rem",
                        borderBottom: "1px solid #eee",
                      }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prestataires.map((p) => {
                    const isActif =
                      typeof p.actif === "boolean"
                        ? p.actif
                        : p.statut_compte === "ACTIF";
                    const statutTexte = isActif ? "ACTIF" : "INACTIF";

                    return (
                      <tr key={p.id_utilisateur}>
                        <td
                          style={{
                            padding: "0.6rem",
                            borderBottom: "1px solid #f0f0f0",
                          }}>
                          {p.id_utilisateur}
                        </td>
                        <td
                          style={{
                            padding: "0.6rem",
                            borderBottom: "1px solid #f0f0f0",
                          }}>
                          {p.nom}
                        </td>
                        <td
                          style={{
                            padding: "0.6rem",
                            borderBottom: "1px solid #f0f0f0",
                          }}>
                          {p.email}
                        </td>
                        <td
                          style={{
                            padding: "0.6rem",
                            borderBottom: "1px solid #f0f0f0",
                          }}>
                          <span
                            style={{
                              padding: ".2rem .6rem",
                              borderRadius: "999px",
                              fontSize: ".8rem",
                              background: isActif
                                ? "rgba(46, 204, 113, 0.12)"
                                : "rgba(231, 76, 60, 0.12)",
                              color: isActif ? "#27ae60" : "#c0392b",
                            }}>
                            {statutTexte}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "0.6rem",
                            borderBottom: "1px solid #f0f0f0",
                          }}>
                          <button
                            type="button"
                            onClick={() => handleToggleStatut(p)}
                            style={{
                              padding: ".35rem .9rem",
                              borderRadius: "999px",
                              border: "none",
                              cursor: "pointer",
                              fontSize: ".8rem",
                              background: isActif ? "#c0392b" : "#27ae60",
                              color: "white",
                            }}>
                            {isActif ? "Désactiver" : "Activer"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Vue OFFRES */}
      {view === "offres" && (
        <section>
          <h2 style={{ marginBottom: "1rem" }}>Toutes les offres</h2>

          {offresLoading ? (
            <p>Chargement des offres...</p>
          ) : offresError ? (
            <p style={{ color: "red" }}>{offresError}</p>
          ) : offres.length === 0 ? (
            <p>Aucune offre trouvée.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "700px",
                }}>
                <thead>
                  <tr
                    style={{
                      background: "#f7f3f3",
                      textAlign: "left",
                      fontSize: ".9rem",
                    }}>
                    <th
                      style={{
                        padding: "0.6rem",
                        borderBottom: "1px solid #eee",
                      }}>
                      Image
                    </th>
                    <th
                      style={{
                        padding: "0.6rem",
                        borderBottom: "1px solid #eee",
                      }}>
                      Titre
                    </th>
                    <th
                      style={{
                        padding: "0.6rem",
                        borderBottom: "1px solid #eee",
                      }}>
                      Prestataire
                    </th>
                    <th
                      style={{
                        padding: "0.6rem",
                        borderBottom: "1px solid #eee",
                      }}>
                      Email
                    </th>
                    <th
                      style={{
                        padding: "0.6rem",
                        borderBottom: "1px solid #eee",
                      }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {offres.map((offre) => (
                    <tr key={offre.id_offre}>
                      <td
                        style={{
                          padding: "0.6rem",
                          borderBottom: "1px solid #f0f0f0",
                        }}>
                        {offre.image_url ? (
                          <img
                            src={offre.image_url}
                            alt={offre.titre}
                            style={{
                              width: "70px",
                              height: "70px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "70px",
                              height: "70px",
                              borderRadius: "8px",
                              background: "#eee",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: ".75rem",
                              color: "#999",
                            }}>
                            Pas d’image
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "0.6rem",
                          borderBottom: "1px solid #f0f0f0",
                        }}>
                        {offre.titre}
                      </td>
                      <td
                        style={{
                          padding: "0.6rem",
                          borderBottom: "1px solid #f0f0f0",
                        }}>
                        {offre.prestataire_nom || "-"}
                      </td>
                      <td
                        style={{
                          padding: "0.6rem",
                          borderBottom: "1px solid #f0f0f0",
                        }}>
                        {offre.prestataire_email || "-"}
                      </td>
                      <td
                        style={{
                          padding: "0.6rem",
                          borderBottom: "1px solid #f0f0f0",
                        }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteOffer(offre)}
                          style={{
                            padding: ".35rem .9rem",
                            borderRadius: "999px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: ".8rem",
                            background: "#c0392b",
                            color: "white",
                          }}>
                          Supprimer
                        </button>
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

export default DashboardAdmin;
