import "./styles/globals.scss";

import { useState, useEffect, lazy, useCallback, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import NotificationBanner from "./components/notification_banner/NotificationBanner";
import Header from "./components/header/Header";
import RootPetGate from "./pages/RootPetGate/RootPetGate";
import LoadingState from "./components/events/LoadingState/LoadingState";

import { getPet } from "./api/pets";
import { hasStoredAuth } from "./api/auth";
import { useNotification } from "./context/NotificationContext";
import NotificationService from "./services/notificationService";
import { logger } from "./utils/logger";

const Landing = lazy(() => import("./pages/Landing/Landing"));
const Pets = lazy(() => import("./pages/Pets/Pets"));
const UpcomingProcedures = lazy(() => import("./pages/UpcomingProcedures/UpcomingProcedures"));
const MedicalHistory = lazy(() => import("./pages/MedicalHistory/MedicalHistory"));
const DoctorVisitPage = lazy(() => import("./pages/Procedure/DoctorVisitPage"));
const VaccinePage = lazy(() => import("./pages/Procedure/VaccinePage"));
const TreatmentPage = lazy(() => import("./pages/Procedure/TreatmentPage"));
const RecommendedProcedures = lazy(() => import("./pages/RecommendedProcedures/RecommendedProcedures"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy/PrivacyPolicy"));

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
      logger.error("Ошибка загрузки питомца:", err);
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
        <Suspense fallback={<LoadingState message="Загрузка страницы..." />}>
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
        </Suspense>
      </main>
    </div>
  );
}

export default App;
