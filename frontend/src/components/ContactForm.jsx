import { useState } from "react";
import "../index.css";

function ContactForm({ offre }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [dateMariage, setDateMariage] = useState("");
  const [lieuMariage, setLieuMariage] = useState("");
  const [nbInvites, setNbInvites] = useState("");
  const [budget, setBudget] = useState("");
  const [contenu, setContenu] = useState("");

  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");
    setMessage("");

    if (!nom || !email || !contenu) {
      setErreur("Nom, email et message sont obligatoires.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/messages/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_offre: offre.id_offre,
          nom,
          email,
          telephone,
          date_mariage: dateMariage || null,
          lieu_mariage: lieuMariage || null,
          nb_invites: nbInvites ? Number(nbInvites) : null,
          budget_estime: budget ? Number(budget) : null,
          contenu: contenu,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de l’envoi du message");
      }

      setMessage("Votre demande a bien été envoyée ✨");

      // reset du formulaire
      setNom("");
      setEmail("");
      setTelephone("");
      setDateMariage("");
      setLieuMariage("");
      setNbInvites("");
      setBudget("");
      setContenu("");
    } catch (err) {
      console.error(err);
      setErreur(err.message || "Erreur lors de l’envoi du message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* NOM + EMAIL */}
      <div className="contact-form-field">
        <label>Nom complet *</label>
        <input value={nom} onChange={(e) => setNom(e.target.value)} required />
      </div>

      <div className="contact-form-field">
        <label>Email *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* TELEPHONE */}
      <div className="contact-form-field">
        <label>Téléphone</label>
        <input
          type="tel"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value.replace(/\D/g, ""))}
          maxLength={10}
        />
      </div>

      {/* DATE + LIEU DU MARIAGE */}
      <div className="contact-form-field">
        <label>Date du mariage</label>
        <input
          type="date"
          value={dateMariage}
          onChange={(e) => setDateMariage(e.target.value)}
        />
      </div>

      <div className="contact-form-field">
        <label>Lieu du mariage</label>
        <input
          type="text"
          value={lieuMariage}
          onChange={(e) => setLieuMariage(e.target.value)}
          placeholder="Ville, domaine, région…"
        />
      </div>

      {/* NB INVITES + BUDGET */}
      <div className="contact-form-field">
        <label>Nombre d’invités</label>
        <input
          type="number"
          value={nbInvites}
          onChange={(e) => setNbInvites(e.target.value)}
        />
      </div>

      <div className="contact-form-field">
        <label>Budget estimé (€)</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
      </div>

      {/* MESSAGE */}
      <div className="contact-form-field">
        <label>Votre message *</label>
        <textarea
          rows="4"
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          required
        />
      </div>

      {erreur && <p style={{ color: "red" }}>{erreur}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <button className="contact-submit-btn" disabled={loading} type="submit">
        {loading ? "Envoi..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}

export default ContactForm;
