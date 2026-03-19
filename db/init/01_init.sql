--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Homebrew)
-- Dumped by pg_dump version 17.2 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.utilisateurs DROP CONSTRAINT IF EXISTS utilisateurs_id_role_fkey;
ALTER TABLE IF EXISTS ONLY public.offres DROP CONSTRAINT IF EXISTS offres_id_utilisateur_fkey;
ALTER TABLE IF EXISTS ONLY public.offres DROP CONSTRAINT IF EXISTS offres_id_categorie_fkey;
ALTER TABLE IF EXISTS ONLY public.messages DROP CONSTRAINT IF EXISTS messages_id_prestataire_fkey;
ALTER TABLE IF EXISTS ONLY public.messages DROP CONSTRAINT IF EXISTS messages_id_offre_fkey;
ALTER TABLE IF EXISTS ONLY public.adresses DROP CONSTRAINT IF EXISTS adresses_id_utilisateur_fkey;
ALTER TABLE IF EXISTS ONLY public.utilisateurs DROP CONSTRAINT IF EXISTS utilisateurs_pkey;
ALTER TABLE IF EXISTS ONLY public.utilisateurs DROP CONSTRAINT IF EXISTS utilisateurs_email_key;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_code_role_key;
ALTER TABLE IF EXISTS ONLY public.offres DROP CONSTRAINT IF EXISTS offres_pkey;
ALTER TABLE IF EXISTS ONLY public.messages DROP CONSTRAINT IF EXISTS messages_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_libelle_categorie_key;
ALTER TABLE IF EXISTS ONLY public.adresses DROP CONSTRAINT IF EXISTS adresses_pkey;
ALTER TABLE IF EXISTS ONLY public.adresses DROP CONSTRAINT IF EXISTS adresses_id_utilisateur_key;
ALTER TABLE IF EXISTS public.utilisateurs ALTER COLUMN id_utilisateur DROP DEFAULT;
ALTER TABLE IF EXISTS public.roles ALTER COLUMN id_role DROP DEFAULT;
ALTER TABLE IF EXISTS public.offres ALTER COLUMN id_offre DROP DEFAULT;
ALTER TABLE IF EXISTS public.messages ALTER COLUMN id_message DROP DEFAULT;
ALTER TABLE IF EXISTS public.categories ALTER COLUMN id_categorie DROP DEFAULT;
ALTER TABLE IF EXISTS public.adresses ALTER COLUMN id_adresse DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.utilisateurs_id_utilisateur_seq;
DROP TABLE IF EXISTS public.utilisateurs;
DROP SEQUENCE IF EXISTS public.roles_id_role_seq;
DROP TABLE IF EXISTS public.roles;
DROP SEQUENCE IF EXISTS public.offres_id_offre_seq;
DROP TABLE IF EXISTS public.offres;
DROP SEQUENCE IF EXISTS public.messages_id_message_seq;
DROP TABLE IF EXISTS public.messages;
DROP SEQUENCE IF EXISTS public.categories_id_categorie_seq;
DROP TABLE IF EXISTS public.categories;
DROP SEQUENCE IF EXISTS public.adresses_id_adresse_seq;
DROP TABLE IF EXISTS public.adresses;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: adresses; Type: TABLE; Schema: public; Owner: msadak
--

CREATE TABLE public.adresses (
    id_adresse integer NOT NULL,
    code_postal character varying(10),
    ville character varying(100),
    id_utilisateur integer
);


ALTER TABLE public.adresses OWNER TO msadak;

--
-- Name: adresses_id_adresse_seq; Type: SEQUENCE; Schema: public; Owner: msadak
--

CREATE SEQUENCE public.adresses_id_adresse_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.adresses_id_adresse_seq OWNER TO msadak;

--
-- Name: adresses_id_adresse_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: msadak
--

ALTER SEQUENCE public.adresses_id_adresse_seq OWNED BY public.adresses.id_adresse;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: msadak
--

CREATE TABLE public.categories (
    id_categorie integer NOT NULL,
    libelle_categorie character varying(100) NOT NULL,
    description character varying(255)
);


ALTER TABLE public.categories OWNER TO msadak;

--
-- Name: categories_id_categorie_seq; Type: SEQUENCE; Schema: public; Owner: msadak
--

CREATE SEQUENCE public.categories_id_categorie_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_categorie_seq OWNER TO msadak;

--
-- Name: categories_id_categorie_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: msadak
--

ALTER SEQUENCE public.categories_id_categorie_seq OWNED BY public.categories.id_categorie;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: msadak
--

CREATE TABLE public.messages (
    id_message integer NOT NULL,
    id_offre integer NOT NULL,
    id_prestataire integer NOT NULL,
    nom character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    telephone character varying(20),
    contenu text NOT NULL,
    date_envoi timestamp without time zone DEFAULT now() NOT NULL,
    statut character varying(20) DEFAULT 'NOUVEAU'::character varying NOT NULL,
    date_mariage date,
    lieu_mariage character varying(255),
    nb_invites integer,
    budget_estime character varying(50)
);


ALTER TABLE public.messages OWNER TO msadak;

--
-- Name: messages_id_message_seq; Type: SEQUENCE; Schema: public; Owner: msadak
--

CREATE SEQUENCE public.messages_id_message_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_message_seq OWNER TO msadak;

--
-- Name: messages_id_message_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: msadak
--

ALTER SEQUENCE public.messages_id_message_seq OWNED BY public.messages.id_message;


--
-- Name: offres; Type: TABLE; Schema: public; Owner: msadak
--

CREATE TABLE public.offres (
    id_offre integer NOT NULL,
    titre character varying(150) NOT NULL,
    description text,
    prix_min numeric(10,2),
    prix_max numeric(10,2),
    zone_intervention character varying(150),
    date_creation timestamp without time zone DEFAULT now() NOT NULL,
    date_maj timestamp without time zone,
    statut character varying(20) DEFAULT 'PUBLIEE'::character varying NOT NULL,
    id_categorie integer,
    id_utilisateur integer NOT NULL,
    image_url character varying(2000)
);


ALTER TABLE public.offres OWNER TO msadak;

--
-- Name: offres_id_offre_seq; Type: SEQUENCE; Schema: public; Owner: msadak
--

CREATE SEQUENCE public.offres_id_offre_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.offres_id_offre_seq OWNER TO msadak;

--
-- Name: offres_id_offre_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: msadak
--

ALTER SEQUENCE public.offres_id_offre_seq OWNED BY public.offres.id_offre;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: msadak
--

CREATE TABLE public.roles (
    id_role integer NOT NULL,
    code_role character varying(50) NOT NULL,
    libelle_role character varying(100) NOT NULL
);


ALTER TABLE public.roles OWNER TO msadak;

--
-- Name: roles_id_role_seq; Type: SEQUENCE; Schema: public; Owner: msadak
--

CREATE SEQUENCE public.roles_id_role_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_role_seq OWNER TO msadak;

--
-- Name: roles_id_role_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: msadak
--

ALTER SEQUENCE public.roles_id_role_seq OWNED BY public.roles.id_role;


--
-- Name: utilisateurs; Type: TABLE; Schema: public; Owner: msadak
--

CREATE TABLE public.utilisateurs (
    id_utilisateur integer NOT NULL,
    nom character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    mot_de_passe character varying(255) NOT NULL,
    telephone character varying(20),
    date_creation_compte timestamp without time zone DEFAULT now() NOT NULL,
    actif boolean DEFAULT true NOT NULL,
    id_role integer NOT NULL,
    avatar_url character varying(255)
);


ALTER TABLE public.utilisateurs OWNER TO msadak;

--
-- Name: utilisateurs_id_utilisateur_seq; Type: SEQUENCE; Schema: public; Owner: msadak
--

CREATE SEQUENCE public.utilisateurs_id_utilisateur_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utilisateurs_id_utilisateur_seq OWNER TO msadak;

--
-- Name: utilisateurs_id_utilisateur_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: msadak
--

ALTER SEQUENCE public.utilisateurs_id_utilisateur_seq OWNED BY public.utilisateurs.id_utilisateur;


--
-- Name: adresses id_adresse; Type: DEFAULT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.adresses ALTER COLUMN id_adresse SET DEFAULT nextval('public.adresses_id_adresse_seq'::regclass);


--
-- Name: categories id_categorie; Type: DEFAULT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.categories ALTER COLUMN id_categorie SET DEFAULT nextval('public.categories_id_categorie_seq'::regclass);


--
-- Name: messages id_message; Type: DEFAULT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.messages ALTER COLUMN id_message SET DEFAULT nextval('public.messages_id_message_seq'::regclass);


--
-- Name: offres id_offre; Type: DEFAULT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.offres ALTER COLUMN id_offre SET DEFAULT nextval('public.offres_id_offre_seq'::regclass);


--
-- Name: roles id_role; Type: DEFAULT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.roles ALTER COLUMN id_role SET DEFAULT nextval('public.roles_id_role_seq'::regclass);


--
-- Name: utilisateurs id_utilisateur; Type: DEFAULT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.utilisateurs ALTER COLUMN id_utilisateur SET DEFAULT nextval('public.utilisateurs_id_utilisateur_seq'::regclass);


--
-- Data for Name: adresses; Type: TABLE DATA; Schema: public; Owner: msadak
--

COPY public.adresses (id_adresse, code_postal, ville, id_utilisateur) FROM stdin;
1	75000	Paris	\N
2	13000	Marseille	\N
3	69000	Lyon	\N
4	31000	Toulouse	\N
5	06000	Nice	\N
6	44000	Nantes	\N
7	34000	Montpellier	\N
8	67000	Strasbourg	\N
9	33000	Bordeaux	\N
10	59000	Lille	\N
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: msadak
--

COPY public.categories (id_categorie, libelle_categorie, description) FROM stdin;
1	Photographe	\N
2	DJ	\N
3	Traiteur	\N
4	Fleuriste	\N
6	Vidéaste	\N
7	Animation musicale	\N
8	Groupe de musique / Orchestre	\N
9	Lieu de réception	\N
10	Wedding planner	\N
11	Décoration	\N
12	Maquillage / Coiffure	\N
13	Robe de mariée	\N
14	Costume / Tenue homme	\N
15	Bague & bijoux	\N
16	Pâtissier / Pièce montée	\N
17	Voiture / Transport	\N
18	Animateur / Maître de cérémonie	\N
19	Location de matériel	\N
20	Officiant de cérémonie laïque	\N
21	Photobooth	\N
22	Baby-sitting / Animation enfants	\N
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: msadak
--

COPY public.messages (id_message, id_offre, id_prestataire, nom, email, telephone, contenu, date_envoi, statut, date_mariage, lieu_mariage, nb_invites, budget_estime) FROM stdin;
1	15	7	camille Jean	camille@test.fr	0646464646	Bonjour,\n\nNous nous marions le 20 juin 2026 et nous recherchons un traiteur pour environ 120 invités.\nNous aimerions un cocktail dinatoire assez généreux suivi d’un repas assis (entrée – plat – fromage – dessert).\n\nNous avons plusieurs invités végétariens et certaines allergies (gluten et fruits à coque), donc nous cherchons un traiteur qui puisse proposer des alternatives.\n\nNous aimerions également savoir si vous proposez :\n– service en salle\n– vaisselle et nappage\n– gestion des boissons\n– pièce montée ou wedding cake\n\nPourriez-vous nous envoyer une proposition de menu et un devis estimatif s’il vous plaît ?\n\nMerci beaucoup pour votre retour 😊\nCamille & Thomas	2026-01-06 16:30:38.207511	EN_ATTENTE	2026-01-23	Domaine Les Aulnois	150	9000
2	15	7	Isra Msadak	isra.msadak@gmail.com	0646109354	test	2026-01-07 10:54:25.553263	EN_ATTENTE	2026-01-23	Lyon	25	2000
3	15	7	Jean Jean	jean@test.com	0622345678	test tes 	2026-01-07 11:45:28.892798	EN_ATTENTE	2026-01-30	Lyon	30	3000
\.


--
-- Data for Name: offres; Type: TABLE DATA; Schema: public; Owner: msadak
--

COPY public.offres (id_offre, titre, description, prix_min, prix_max, zone_intervention, date_creation, date_maj, statut, id_categorie, id_utilisateur, image_url) FROM stdin;
15	Traiteur de mariage	Nous vous accompagnons pour faire de votre repas de mariage un moment inoubliable.\n\nNotre équipe de chefs élabore des menus entièrement personnalisables selon vos goûts, votre budget et vos contraintes alimentaires (halal, végétarien, vegan, sans gluten, allergies…).\n\nNous proposons :\n\t•\t🥂 vin d’honneur & cocktails dinatoires\n\t•\t🍽️ repas servis à table ou buffet\n\t•\t🍰 pièce montée & desserts maison\n\t•\t👩‍🍳 service en salle par des serveurs professionnels\n\t•\t🚚 livraison et mise en place sur le lieu de réception\n\nNous travaillons uniquement avec des produits frais et de saison et privilégions les circuits courts.\n\nUn rendez-vous dégustation peut être organisé afin de définir le menu final.	25.00	\N	75000 - Paris	2026-01-06 13:24:47.445048	2026-01-19 15:34:04.595005	ACTIF	3	7	https://plus.unsplash.com/premium_photo-1681841364476-8ae10f8f93b0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
12	Location de voiture	Des voitures élégantes à petit budget	200.00	\N	Lyon	2026-01-04 23:29:27.813642	2026-01-04 23:44:22.319617	ACTIF	\N	3	https://cdn0.mariages.net/vendor/2855/3_2/640/jpeg/da8c6dd0-fb97-42ab-b0d0-da55f7eced87_3_22855-163246552274509.webp
10	DJ Test	Animation musicale de mariage	2000.00	\N	Paris + IDF	2025-12-30 16:36:05.551788	2026-01-04 23:45:01.901354	ACTIF	2	3	https://img.freepik.com/photos-premium/reception-mariage-fete-danse-dj-ambiance-animee_1015182-51565.jpg?semt=ais_hybrid&w=740&q=80
13	Décoratrice d'evenement	Pour sublimer vos événements 	450.00	\N	Lille	2026-01-05 00:52:25.709927	2026-01-05 00:52:25.709927	ACTIF	\N	7	https://images.unsplash.com/photo-1507915977619-6ccfe8003ae6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
14	Pack Vidéo Mariage – Cérémonie & Soirée complète	Je vous accompagne tout au long de votre journée de mariage pour capturer les plus beaux moments : des préparatifs jusqu’à l’ouverture de bal.\n\nLe pack comprend :\n• Présence du vidéaste de la cérémonie à la première danse\n• Captation en 4K avec stabilisation\n• Prises de vues des détails (décoration, lieu, invités, ambiance)\n• Prises de son des moments clés (vœux, discours, cérémonies)\n• Film final de 8 à 12 minutes, monté et étalonné\n• Teaser de 1 minute pour les réseaux sociaux\n• Livraison par lien privé sécurisé\n\nOptions possibles (sur devis) :\n• Drone (si la météo et le lieu le permettent)\n• Interview des proches\n• Livraison sur clé USB personnalisée\n\nN’hésitez pas à me contacter pour adapter le pack à vos besoins et à votre budget.	1300.00	\N	69000 - Lyon	2026-01-06 01:53:22.661332	2026-01-06 02:16:06.629732	ACTIF	6	10	https://images.unsplash.com/photo-1629756048377-09540f52caa1?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: msadak
--

COPY public.roles (id_role, code_role, libelle_role) FROM stdin;
1	ADMIN	Administrateur
2	PRESTATAIRE	Prestataire
\.


--
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: msadak
--

COPY public.utilisateurs (id_utilisateur, nom, email, mot_de_passe, telephone, date_creation_compte, actif, id_role, avatar_url) FROM stdin;
1	Admin Demo	admin@test.fr	A_REMPLACER	\N	2025-12-29 12:41:03.429202	t	1	\N
4	AdminDemo	AdminDemo@test.com	$2b$10$8WR0ZlIHe5tSQTFAmmbmyO0w3gm6wIpdLULziQzMWEcEYU8DIjBku	\N	2025-12-31 15:18:37.070241	t	1	\N
3	Presta Démo	presta.demo@example.com	$2b$10$d0tHalIqLpD5OKnDVfnamOgyfgj9GP/P.1wK4b2i6NV.rzpE7pY9S	0600000000	2025-12-29 17:38:03.174513	t	2	\N
5	Admin	AdminDemo@test2.com	$2b$10$6m85CFXmCELUza1M5tNZX.6R7yXZpFrOy60em9a1Yl3jz14rDZuMi	\N	2025-12-31 15:46:20.994155	t	2	\N
6	Admin	admin.demo@test.com	$2b$10$aqFklt2k1TsVkLmlo90r4OdyTL2xPSsx1FN1ga4a1Fvij/EdoeY72	0600000000	2026-01-01 21:11:19.269007	t	1	\N
2	Presta Demo	presta@test.fr	A_REMPLACER	\N	2025-12-29 12:41:03.429202	f	2	\N
7	Jasmine	traiteur.demo@test.com	$2b$10$.jQGplhygBw0JcFZ00doieLtmA6z5jweqZlW83RseDrLdEaDZrIxC	0600000000	2026-01-01 21:38:54.376413	t	2	\N
8	Photoboot	photographe@test.com	$2b$10$rYRpC3L3d0LqIGId4EhfweOyxD8VVcpyJBxsn0W4ZaXEQChjuA9Je	0612121212	2026-01-06 00:50:08.839605	t	2	\N
9	ModeSonia	modesonia@test.com	$2b$10$K1y0zE1mPnhsQ1imUYGTQ.hXz27pwxUMEmDEzkiTgS9voishEpIoa	0613131313	2026-01-06 00:54:24.183328	t	2	\N
10	VidéasteDream	videaste@test.com	$2b$10$zw0ndaqTSWm30qbptkjA3eLaFF4C3/7qYp1RGqBLurnNXlDFG2KUa	0614141414	2026-01-06 00:59:23.530971	t	2	\N
\.


--
-- Name: adresses_id_adresse_seq; Type: SEQUENCE SET; Schema: public; Owner: msadak
--

SELECT pg_catalog.setval('public.adresses_id_adresse_seq', 10, true);


--
-- Name: categories_id_categorie_seq; Type: SEQUENCE SET; Schema: public; Owner: msadak
--

SELECT pg_catalog.setval('public.categories_id_categorie_seq', 22, true);


--
-- Name: messages_id_message_seq; Type: SEQUENCE SET; Schema: public; Owner: msadak
--

SELECT pg_catalog.setval('public.messages_id_message_seq', 3, true);


--
-- Name: offres_id_offre_seq; Type: SEQUENCE SET; Schema: public; Owner: msadak
--

SELECT pg_catalog.setval('public.offres_id_offre_seq', 15, true);


--
-- Name: roles_id_role_seq; Type: SEQUENCE SET; Schema: public; Owner: msadak
--

SELECT pg_catalog.setval('public.roles_id_role_seq', 2, true);


--
-- Name: utilisateurs_id_utilisateur_seq; Type: SEQUENCE SET; Schema: public; Owner: msadak
--

SELECT pg_catalog.setval('public.utilisateurs_id_utilisateur_seq', 10, true);


--
-- Name: adresses adresses_id_utilisateur_key; Type: CONSTRAINT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.adresses
    ADD CONSTRAINT adresses_id_utilisateur_key UNIQUE (id_utilisateur);


--
-- Name: adresses adresses_pkey; Type: CONSTRAINT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.adresses
    ADD CONSTRAINT adresses_pkey PRIMARY KEY (id_adresse);


--
-- Name: categories categories_libelle_categorie_key; Type: CONSTRAINT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_libelle_categorie_key UNIQUE (libelle_categorie);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id_categorie);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id_message);


--
-- Name: offres offres_pkey; Type: CONSTRAINT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.offres
    ADD CONSTRAINT offres_pkey PRIMARY KEY (id_offre);


--
-- Name: roles roles_code_role_key; Type: CONSTRAINT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_code_role_key UNIQUE (code_role);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id_role);


--
-- Name: utilisateurs utilisateurs_email_key; Type: CONSTRAINT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_email_key UNIQUE (email);


--
-- Name: utilisateurs utilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (id_utilisateur);


--
-- Name: adresses adresses_id_utilisateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.adresses
    ADD CONSTRAINT adresses_id_utilisateur_fkey FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateurs(id_utilisateur);


--
-- Name: messages messages_id_offre_fkey; Type: FK CONSTRAINT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_id_offre_fkey FOREIGN KEY (id_offre) REFERENCES public.offres(id_offre) ON DELETE CASCADE;


--
-- Name: messages messages_id_prestataire_fkey; Type: FK CONSTRAINT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_id_prestataire_fkey FOREIGN KEY (id_prestataire) REFERENCES public.utilisateurs(id_utilisateur) ON DELETE CASCADE;


--
-- Name: offres offres_id_categorie_fkey; Type: FK CONSTRAINT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.offres
    ADD CONSTRAINT offres_id_categorie_fkey FOREIGN KEY (id_categorie) REFERENCES public.categories(id_categorie);


--
-- Name: offres offres_id_utilisateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.offres
    ADD CONSTRAINT offres_id_utilisateur_fkey FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateurs(id_utilisateur);


--
-- Name: utilisateurs utilisateurs_id_role_fkey; Type: FK CONSTRAINT; Schema: public; Owner: msadak
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_id_role_fkey FOREIGN KEY (id_role) REFERENCES public.roles(id_role);


--
-- PostgreSQL database dump complete
--

