// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import DashboardPresta from "./pages/DashboardPresta.jsx";
import DashboardAdmin from "./pages/DashboardAdmin.jsx";
import Navbar from "./components/Navbar.jsx";
import Prestations from "./pages/Prestations.jsx";
import Register from "./components/RegisterPresta.jsx";
import OfferDetail from "./pages/OfferDetail.jsx";

function App() {
  const location = useLocation();

  const hideHeader =
    location.pathname === "/login" || location.pathname === "/inscription";

  return (
    <div style={{ fontFamily: "Lora, serif" }}>
      {!hideHeader && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prestations" element={<Prestations />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<Register />} />
        <Route path="/offres/:id" element={<OfferDetail />} />
        <Route path="/dashboard-presta" element={<DashboardPresta />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
      </Routes>
    </div>
  );
}

export default App;
