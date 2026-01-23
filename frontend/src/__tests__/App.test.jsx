import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App.jsx";

// On mock toutes les pages + composants utilisés par App
vi.mock("../components/Navbar.jsx", () => ({
  default: () => <div data-testid="navbar">NAVBAR</div>,
}));

vi.mock("../pages/Home.jsx", () => ({
  default: () => <h1>HOME PAGE</h1>,
}));

vi.mock("../pages/Prestations.jsx", () => ({
  default: () => <h1>PRESTATIONS PAGE</h1>,
}));

vi.mock("../pages/Login.jsx", () => ({
  default: () => <h1>LOGIN PAGE</h1>,
}));

vi.mock("../components/RegisterPresta.jsx", () => ({
  default: () => <h1>REGISTER PAGE</h1>,
}));

vi.mock("../pages/OfferDetail.jsx", () => ({
  default: () => <h1>OFFER DETAIL PAGE</h1>,
}));

vi.mock("../pages/DashboardPresta.jsx", () => ({
  default: () => <h1>DASHBOARD PRESTA</h1>,
}));

vi.mock("../pages/DashboardAdmin.jsx", () => ({
  default: () => <h1>DASHBOARD ADMIN</h1>,
}));

function renderWithRoute(route) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );
}

describe("App routing + Navbar", () => {
  it("affiche la Navbar sur /", () => {
    renderWithRoute("/");
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText("HOME PAGE")).toBeInTheDocument();
  });

  it("cache la Navbar sur /login", () => {
    renderWithRoute("/login");
    expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
    expect(screen.getByText("LOGIN PAGE")).toBeInTheDocument();
  });

  it("cache la Navbar sur /inscription", () => {
    renderWithRoute("/inscription");
    expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
    expect(screen.getByText("REGISTER PAGE")).toBeInTheDocument();
  });

  it("rend la page prestations sur /prestations", () => {
    renderWithRoute("/prestations");
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText("PRESTATIONS PAGE")).toBeInTheDocument();
  });

  it("rend l'offer detail sur /offres/:id", () => {
    renderWithRoute("/offres/123");
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText("OFFER DETAIL PAGE")).toBeInTheDocument();
  });

  it("rend le dashboard presta sur /dashboard-presta", () => {
    renderWithRoute("/dashboard-presta");
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText("DASHBOARD PRESTA")).toBeInTheDocument();
  });

  it("rend le dashboard admin sur /dashboard-admin", () => {
    renderWithRoute("/dashboard-admin");
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText("DASHBOARD ADMIN")).toBeInTheDocument();
  });
});
