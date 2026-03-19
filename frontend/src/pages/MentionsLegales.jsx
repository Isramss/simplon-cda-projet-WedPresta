function MentionsLegales() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem 2rem", lineHeight: "1.8" }}>
      <h1 style={{ marginBottom: "2rem" }}>Mentions légales</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Éditeur du site</h2>
        <p>
          Le site WedPresta est édité dans le cadre d'un projet de formation CDA (Concepteur Développeur d'Applications)
          réalisé à Simplon.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Hébergement</h2>
        <p>
          Ce site est hébergé localement dans le cadre d'un environnement de développement.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Propriété intellectuelle</h2>
        <p>
          L'ensemble des contenus présents sur le site WedPresta (textes, images, structure) sont la propriété
          exclusive de leurs auteurs. Toute reproduction ou utilisation sans autorisation préalable est interdite.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Données personnelles</h2>
        <p>
          Les informations collectées via les formulaires (nom, email, téléphone) sont utilisées uniquement
          dans le cadre de la mise en relation entre prestataires et clients. Elles ne sont pas transmises
          à des tiers. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de
          suppression de vos données.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Cookies</h2>
        <p>
          Ce site n'utilise pas de cookies de traçage. Les données de session sont stockées localement
          dans votre navigateur (localStorage) et ne sont pas partagées.
        </p>
      </section>
    </div>
  );
}

export default MentionsLegales;
