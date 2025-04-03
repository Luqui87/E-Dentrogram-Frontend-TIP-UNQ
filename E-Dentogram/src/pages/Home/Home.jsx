import React, { useState, useEffect } from "react";
import PersonTable from "../../components/PersonTable/PersonTable.jsx";
import "./Home.css";
import API from "../../service/API.jsx";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleAddClick = () => {
    // Agregar logica
    console.log("Botón Agregar clickeado");
  };

  useEffect(() => {
    setLoading(true);

    API.getAllSimplePatients()
      .then((res) => setPatients(res.data))
      .finally(() => setLoading(false));
  }, []);

  console.log(patients);

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
      <PersonTable
        patients={patients}
        searchTerm={searchTerm}
        setPatients={setPatients}
      />
    </div>
  );
};

export default Home;
