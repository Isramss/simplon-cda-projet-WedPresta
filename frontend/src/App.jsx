// src/App.jsx
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import DashboardPresta from "./pages/DashboardPresta.jsx";
import DashboardAdmin from "./pages/DashboardAdmin.jsx";
import Navbar from "./components/Navbar.jsx";
import Prestations from "./pages/Prestations.jsx";
import Register from "./components/RegisterPresta.jsx";
import OfferDetail from "./pages/OfferDetail.jsx";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const role = user?.role || user?.code_role || user?.libelle_role || null;

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

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
