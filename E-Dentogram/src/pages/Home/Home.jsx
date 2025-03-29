import React, { useState } from "react";
import PersonTable from "../../components/PersonTable/PersonTable.jsx";
import "./Home.css";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddClick = () => {
    // Agregar logica
    console.log("Botón Agregar clickeado");
  };

  return (
    <div className="home-container">
      <h1>Lista de Pacientes</h1>
      <div className="top-bar">
        <button onClick={handleAddClick} className="add-button">
          Agregar
        </button>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <PersonTable searchTerm={searchTerm} />
    </div>
  );
};

export default Home;
