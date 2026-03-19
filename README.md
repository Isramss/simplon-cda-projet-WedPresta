# WedPresta

Plateforme de mise en relation entre futurs mariés et prestataires de mariage (photographes, traiteurs, DJ, décorateurs, etc.).

Les visiteurs peuvent consulter les offres et envoyer une demande de devis directement depuis la fiche d'une prestation. Les prestataires gèrent leurs offres et consultent les messages reçus depuis un espace dédié. Un administrateur peut activer/désactiver des comptes et superviser l'ensemble des offres.

---

## Stack technique

| Côté | Technologie |
|------|-------------|
| Backend | Node.js 20, Express 5, PostgreSQL 15 |
| Frontend | React 19, Vite 7, React Router 7 |
| Auth | JWT + bcrypt |
| Tests | Jest + Supertest (backend), Vitest + Testing Library (frontend) |
| CI/CD | GitHub Actions |
| Conteneurisation | Docker + Docker Compose |

---

## Prérequis

- [Node.js](https://nodejs.org/) v20+ (backend) / v22+ (frontend)
- [Docker](https://www.docker.com/) et Docker Compose
- [PostgreSQL](https://www.postgresql.org/) v15 (si lancement sans Docker)

---

## Lancement avec Docker (recommandé)

Copier le fichier d'environnement Docker et l'adapter si besoin :

```bash
cp .env.docker.example .env.docker
```

Démarrer les trois services (base de données, backend, frontend) :

```bash
docker-compose up --build
```

L'application est accessible sur :
- Frontend : http://localhost:5173
- Backend (API) : http://localhost:3001

---

## Lancement manuel (développement)

### 1. Base de données

Créer une base PostgreSQL et exécuter le script d'initialisation :

```bash
psql -U <user> -d <database> -f db/init/01_init.sql
```

Ce script crée les tables et insère des données de démonstration (catégories, utilisateurs, offres exemples).

### 2. Backend

```bash
cd backend
cp .env.example .env   # puis renseigner les variables
npm install
npm run dev
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # puis renseigner VITE_API_URL
npm install
npm run dev
```

---

## Variables d'environnement

### Backend — fichier `backend/.env`

```env
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USER=ton_user
DB_PASSWORD=ton_mdp
DB_NAME=wedpresta

JWT_SECRET=une_chaine_aleatoire_longue_et_unique
```

### Frontend — fichier `frontend/.env`

```env
VITE_API_URL=http://localhost:3001
```

---

## Structure du projet

```
wedpresta/
├── backend/
│   ├── controllers/       # Logique métier (auth, offres, messages, users)
│   ├── middleware/        # Authentification JWT, contrôle des rôles
│   ├── routes/            # Déclaration des endpoints Express
│   ├── __tests__/         # Tests Jest + Supertest
│   ├── app.js             # Configuration Express (CORS, routes)
│   ├── server.js          # Point d'entrée
│   └── db.js              # Pool de connexion PostgreSQL
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Navbar, Footer, OfferCard, ContactForm, modals
│   │   ├── pages/         # Home, Prestations, OfferDetail, Login, Dashboards
│   │   ├── __tests__/     # Tests Vitest + Testing Library
│   │   ├── App.jsx        # Routage principal
│   │   └── index.css      # Styles globaux + responsive
│   └── vite.config.js
│
├── db/
│   └── init/              # Scripts SQL d'initialisation
│
├── docker-compose.yml
└── .github/
    └── workflows/
        └── ci.yml         # Pipeline CI (build + test backend et frontend)
```

---

## Routes API

### Authentification — `/api/auth`

| Méthode | Endpoint | Accès | Description |
|---------|----------|-------|-------------|
| POST | `/register` | Public | Inscription prestataire |
| POST | `/login` | Public | Connexion, retourne un JWT |
| GET | `/profile` | JWT requis | Infos de l'utilisateur connecté |

### Offres — `/api/offres`

| Méthode | Endpoint | Accès | Description |
|---------|----------|-------|-------------|
| GET | `/` | Public | Liste toutes les offres actives |
| GET | `/:id` | Public | Détail d'une offre |
| GET | `/mes-offres` | PRESTATAIRE | Offres du prestataire connecté |
| POST | `/` | PRESTATAIRE | Créer une offre |
| PUT | `/:id` | PRESTATAIRE | Modifier une offre (propriétaire uniquement) |
| DELETE | `/:id` | PRESTATAIRE / ADMIN | Supprimer une offre |

### Messages / Devis — `/api/messages`

| Méthode | Endpoint | Accès | Description |
|---------|----------|-------|-------------|
| POST | `/devis` | Public | Envoyer une demande de devis |
| GET | `/mes-messages` | PRESTATAIRE / ADMIN | Messages reçus |

### Utilisateurs — `/api/utilisateurs`

| Méthode | Endpoint | Accès | Description |
|---------|----------|-------|-------------|
| GET | `/prestataires` | ADMIN | Liste des prestataires |
| PUT | `/:id/actif` | ADMIN | Activer / désactiver un compte |

---

## Rôles et accès

| Rôle | Permissions |
|------|------------|
| Visiteur | Consulter les offres, envoyer un devis |
| PRESTATAIRE | Gérer ses propres offres, lire ses messages |
| ADMIN | Tout ce qui précède + gérer les comptes prestataires |

Un compte prestataire doit être **activé par un administrateur** avant de pouvoir se connecter.

---

## Tests

### Backend (Jest + Supertest)

```bash
cd backend
npm test              # lancement simple
npm run test:ci       # avec rapport de couverture
```

Couvre : inscription, connexion, profil, CRUD offres, envoi et lecture de devis.

### Frontend (Vitest + Testing Library)

```bash
cd frontend
npm test              # lancement simple
npm run test:ci       # avec rapport de couverture
```

Couvre : rendu des routes, affichage conditionnel de la navbar selon le rôle.

---

## CI/CD

Le pipeline GitHub Actions (`.github/workflows/ci.yml`) se déclenche sur chaque push vers `main`, `develop` ou une branche `feature/**`.

Il exécute dans l'ordre :
1. Build + lint du backend
2. Tests du backend
3. Build du frontend
4. Tests du frontend

---

## Comptes de démonstration

Après l'initialisation de la base avec `01_init.sql` :

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| ADMIN | admin@wedpresta.fr | admin123 |
| PRESTATAIRE | sophie.martin@example.com | presta123 |

---

## Améliorations prévues

- Rate limiting sur les endpoints d'authentification
- Upload d'images directement depuis le dashboard prestataire
- Notifications email lors de la réception d'un devis
- Réinitialisation du mot de passe
- Filtres avancés sur la page des prestations (catégorie, budget, région)
