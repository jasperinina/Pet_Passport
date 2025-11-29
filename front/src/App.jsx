import Header from "./components/layout/Header";
import Home from "./pages/Home";
import "./styles/global.css";

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <main>
        <Home />
      </main>
    </div>
  );
}

export default App;