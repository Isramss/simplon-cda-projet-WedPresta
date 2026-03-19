--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Homebrew)
-- Dumped by pg_dump version 17.2 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

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

