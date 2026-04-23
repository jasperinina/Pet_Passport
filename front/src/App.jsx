import "./styles/globals.scss";

import { useState, useEffect, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import NotificationBanner from "./components/notification_banner/NotificationBanner";
import Header from "./components/header/Header";
import Home from "./pages/Home/Home";
import UpcomingProcedures from "./pages/UpcomingProcedures/UpcomingProcedures";
import MedicalHistory from "./pages/MedicalHistory/MedicalHistory";
import DoctorVisitPage from "./pages/Procedure/DoctorVisitPage";
import VaccinePage from "./pages/Procedure/VaccinePage";
import TreatmentPage from "./pages/Procedure/TreatmentPage";

import { getPet } from "./api/pets";
import { useNotification } from "./context/NotificationContext";
import NotificationService from "./services/notificationService";
import RecommendedProcedures from "./pages/RecommendedProcedures/RecommendedProcedures";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";

const Landing = lazy(() => import("./pages/Landing/Landing"));

function App() {
  const { showError, showSuccess, showWarning, showInfo } = useNotification();
  const location = useLocation();

  useEffect(() => {
    NotificationService.init(
      (message, title) => showError(message, title),
      (message, title) => showSuccess(message, title),
      (message, title) => showWarning(message, title),
      (message, title) => showInfo(message, title)
    );
  }, [showError, showSuccess, showWarning, showInfo]);

  const [pet, setPet] = useState(null);

  const loadPet = async () => {
    const params = new URLSearchParams(window.location.search);
    const petId = params.get("id") || params.get("Id");

    if (!petId) return;

    try {
      const petData = await getPet(parseInt(petId, 10));
      setPet(petData);
    } catch (err) {
      console.error("Ошибка загрузки питомца:", err);
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

  const isLandingPage = location.pathname === "/landing";
  const isPrivacyPolicyPage = location.pathname === "/privacy-policy";

  return (
    <div className="app-wrapper">
      {/* NotificationBanner доступен во всем приложении */}
      <NotificationBanner />

      {/* Header теперь сам навигирует через useNavigate */}
      {!isLandingPage && !isPrivacyPolicyPage && <Header petName={pet?.name} />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upcoming" element={<UpcomingProcedures />} />
          <Route path="/recommendations" element={<RecommendedProcedures />} />
          <Route path="/history" element={<MedicalHistory />} />
          <Route path="/doctor-visit/:eventId" element={<DoctorVisitPage />} />
          <Route path="/vaccine/:eventId" element={<VaccinePage />} />
          <Route path="/treatment/:eventId" element={<TreatmentPage />} />

          <Route path="/landing" element={<Landing />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;