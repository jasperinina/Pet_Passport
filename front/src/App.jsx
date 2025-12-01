import { useState, useEffect } from "react";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import UpcomingProcedures from "./pages/UpcomingProcedures";
import MedicalHistory from "./pages/MedicalHistory";
import "./styles/global.css";
import { getPet } from "./api/pets";

function App() {
  const [pet, setPet] = useState(null);
  const [page, setPage] = useState("home"); // home | upcoming | history

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

  const navigateTo = (targetPage) => {
    setPage(targetPage);
  };

  return (
    <div className="app-wrapper">
      <Header petName={pet?.name} onNavigate={navigateTo} />

      <main>
        {page === "home" && <Home onNavigate={navigateTo} />}
        {page === "upcoming" && <UpcomingProcedures />}
        {page === "history" && <MedicalHistory />}
      </main>

    </div>
  );
}

export default App;
