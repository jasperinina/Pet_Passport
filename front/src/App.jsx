import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Home from "./pages/Home";
import UpcomingProcedures from "./pages/UpcomingProcedures";
import MedicalHistory from "./pages/MedicalHistory";
import DoctorVisitPage from "./pages/DoctorVisitPage";
import VaccinePage from "./pages/VaccinePage";
import TreatmentPage from "./pages/TreatmentPage";

import "./styles/global.css";
import { getPet } from "./api/pets";

function App() {
  const [pet, setPet] = useState(null);

  const loadPet = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get("id") || urlParams.get("Id");

    if (!petId) return;

    try {
      const petData = await getPet(parseInt(petId, 10));
      setPet(petData);
    } catch (err) {
      console.error("Ошибка загрузки питомца для Header:", err);
    }
  };

  useEffect(() => {
    loadPet();

    const handlePetUpdate = () => {
      loadPet();
    };

    window.addEventListener("petUpdated", handlePetUpdate);
    return () => {
      window.removeEventListener("petUpdated", handlePetUpdate);
    };
  }, []);

  return (
    <div className="app-wrapper">
      {/* Header теперь сам навигирует через useNavigate */}
      <Header petName={pet?.name} />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upcoming" element={<UpcomingProcedures />} />
          <Route path="/history" element={<MedicalHistory />} />
          <Route path="/doctor-visit/:eventId" element={<DoctorVisitPage />} />
          <Route path="/vaccine/:eventId" element={<VaccinePage />} />
          <Route path="/treatment/:eventId" element={<TreatmentPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;