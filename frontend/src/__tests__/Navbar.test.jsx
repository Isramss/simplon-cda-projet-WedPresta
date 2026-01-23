import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

// ---- Mocks react-router-dom: useNavigate + useLocation ----
const mockNavigate = vi.fn();
let mockPathname = "/";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: mockPathname }),
  };
});

function renderNavbar(route = "/") {
  mockPathname = route;
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Navbar />
    </MemoryRouter>
  );
}

beforeEach(() => {
  mockNavigate.mockReset();
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Navbar", () => {
  it("VISITEUR: affiche les liens Accueil/Prestations + Connexion + bouton Devenir prestataire", () => {
    // Pas de token => visiteur
    renderNavbar("/");

    expect(screen.getByText("Accueil")).toBeInTheDocument();
    expect(screen.getByText("Prestations")).toBeInTheDocument();
    expect(screen.getByText("Connexion")).toBeInTheDocument();
    expect(screen.getByText("Devenir prestataire")).toBeInTheDocument();

    // Le logo est visible
    expect(screen.getByText("WEDPRESTA")).toBeInTheDocument();
  });

  it("VISITEUR: click sur le logo navigue vers /", () => {
    renderNavbar("/prestations");
    fireEvent.click(screen.getByText("WEDPRESTA"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("VISITEUR: scrollToSection depuis une autre page -> navigate vers /#apropos", () => {
    renderNavbar("/prestations");

    fireEvent.click(screen.getByText("À propos"));
    expect(mockNavigate).toHaveBeenCalledWith("/#apropos");
  });

  it("VISITEUR: scrollToSection sur la home -> scrollIntoView appelé si section existe", () => {
    // On est sur la home
    renderNavbar("/");

    const scrollIntoView = vi.fn();
    const section = document.createElement("div");
    section.id = "contact";
    section.scrollIntoView = scrollIntoView;
    document.body.appendChild(section);

    fireEvent.click(screen.getByText("Nous contacter"));

    expect(scrollIntoView).toHaveBeenCalled();

    section.remove();
  });

  it("PRESTATAIRE: affiche Bienvenue + bouton Déconnexion, et pas les liens visiteur", () => {
    localStorage.setItem("token", "abc");
    localStorage.setItem(
      "user",
      JSON.stringify({ role: "PRESTATAIRE", nom: "Sam" })
    );

    renderNavbar("/");

    expect(screen.getByText(/Bienvenue Sam/i)).toBeInTheDocument();
    expect(screen.getByText("Déconnexion")).toBeInTheDocument();

    // Les liens visiteur ne doivent plus être là
    expect(screen.queryByText("Connexion")).not.toBeInTheDocument();
    expect(screen.queryByText("Devenir prestataire")).not.toBeInTheDocument();
    expect(screen.queryByText("Accueil")).not.toBeInTheDocument();
    expect(screen.queryByText("Prestations")).not.toBeInTheDocument();

    // Logo visible
    expect(screen.getByText("WEDPRESTA")).toBeInTheDocument();
  });

  it("ADMIN: affiche Bonjour + bouton Déconnexion", () => {
    localStorage.setItem("token", "abc");
    localStorage.setItem(
      "user",
      JSON.stringify({ role: "ADMIN", nom: "Alex" })
    );

    renderNavbar("/");

    expect(screen.getByText(/Bonjour Alex/i)).toBeInTheDocument();
    expect(screen.getByText("Déconnexion")).toBeInTheDocument();
    expect(screen.getByText("WEDPRESTA")).toBeInTheDocument();
  });

  it("LOGOUT: supprime token+user du localStorage et navigate('/')", () => {
    localStorage.setItem("token", "abc");
    localStorage.setItem(
      "user",
      JSON.stringify({ role: "PRESTATAIRE", nom: "Sam" })
    );

    renderNavbar("/dashboard-presta");

    fireEvent.click(screen.getByText("Déconnexion"));

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("ROLE inconnu avec token -> retourne null (rien affiché)", () => {
    localStorage.setItem("token", "abc");
    localStorage.setItem("user", JSON.stringify({ role: "AUTRE" }));

    const { container } = renderNavbar("/");

    // Navbar retourne null => container vide
    expect(container.firstChild).toBeNull();
  });
});
