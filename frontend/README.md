# WedPresta — Frontend

Interface utilisateur de la plateforme WedPresta, construite avec React 19 et Vite.

Pour l'installation, la configuration et le lancement, consulter le [README principal](../README.md) à la racine du projet.

## Lancement seul

```bash
npm install
npm run dev
```

Requiert la variable d'environnement `VITE_API_URL` dans un fichier `.env` :

```env
VITE_API_URL=http://localhost:3001
```

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement (port 5173) |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualisation du build |
| `npm test` | Lancer les tests Vitest |
| `npm run test:ci` | Tests avec rapport de couverture |
| `npm run lint` | Analyse statique ESLint |
