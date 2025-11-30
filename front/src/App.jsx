import { useState, useEffect } from "react";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import "./styles/global.css";
import { getPet } from "./api/pets";

function App() {
  const [pet, setPet] = useState(null);

  // Функция загрузки данных о питомце для Header
  const loadPet = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get("id") || urlParams.get("Id");

    if (!petId) {
      return;
    }

    try {
      const petData = await getPet(parseInt(petId, 10));
      setPet(petData);
    } catch (err) {
      console.error("Ошибка загрузки питомца для Header:", err);
    }
  };

  useEffect(() => {
    loadPet();

    // Слушаем событие обновления питомца
    const handlePetUpdate = () => {
      loadPet();
    };

    window.addEventListener('petUpdated', handlePetUpdate);

    return () => {
      window.removeEventListener('petUpdated', handlePetUpdate);
    };
  }, []);

  return (
    <div className="app-wrapper">
      <Header petName={pet?.name} />
      <main>
        <Home />
      </main>
    </div>
  );
}

export default App;