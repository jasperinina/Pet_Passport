import "./styles/globals.scss";

import { useState, useEffect, lazy, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import NotificationBanner from "./components/notification_banner/NotificationBanner";
import Header from "./components/header/Header";
import Pets from "./pages/Pets/Pets";
import UpcomingProcedures from "./pages/UpcomingProcedures/UpcomingProcedures";
import MedicalHistory from "./pages/MedicalHistory/MedicalHistory";
import DoctorVisitPage from "./pages/Procedure/DoctorVisitPage";
import VaccinePage from "./pages/Procedure/VaccinePage";
import TreatmentPage from "./pages/Procedure/TreatmentPage";
import RootPetGate from "./pages/RootPetGate/RootPetGate";

import { getPet } from "./api/pets";
import { hasStoredAuth } from "./api/auth";
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

  const loadPet = useCallback(async () => {
    const params = new URLSearchParams(location.search);
    const petId = params.get("id") || params.get("Id");

    if (!petId) return;

    try {
      const petData = await getPet(parseInt(petId, 10));
      setPet(petData);
    } catch (err) {
      console.error("Ошибка загрузки питомца:", err);
    }
  }, [location.search]);

  useEffect(() => {
    queueMicrotask(loadPet);

    const handlePetUpdate = () => {
      loadPet();
    };

    window.addEventListener("petUpdated", handlePetUpdate);
    return () => {
      window.removeEventListener("petUpdated", handlePetUpdate);
    };
  }, [loadPet]);

  const isPetsPage = location.pathname === "/pets";
  const isLandingPage = location.pathname === "/landing";
  const isPrivacyPolicyPage = location.pathname === "/privacy-policy";
  const isAuthenticated = hasStoredAuth();
  const params = new URLSearchParams(location.search);
  const hasPetId = params.has("id") || params.has("Id");
  const isRootWithoutPetId = location.pathname === "/" && !hasPetId;

  return (
    <div className="app-wrapper">
      {/* NotificationBanner доступен во всем приложении */}
      <NotificationBanner />

      {/* Header теперь сам навигирует через useNavigate */}
      {isAuthenticated && !isPetsPage && !isLandingPage && !isPrivacyPolicyPage && !isRootWithoutPetId && (
        <Header petName={pet?.name} petId={pet?.id ?? pet?.Id} />
      )}

      <main>
        <Routes>
          <Route path="/" element={<RootPetGate />} />
          <Route path="/pets" element={<Pets />} />
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
