import React from "react";
import PersonTable from "../../components/PersonTable/PersonTable.jsx";
import "./Home.css";

const Home = () => {
  const handleAddClick = () => {
    // Lógica para agregar un nuevo paciente
    console.log("Botón Agregar clickeado");
  };

  return (
    <div className="home-container">
      <h1>Lista de Pacientes</h1>
      <button onClick={handleAddClick} className="add-button">
        Agregar
      </button>
      <PersonTable />
    </div>
  );
};

export default Home;
