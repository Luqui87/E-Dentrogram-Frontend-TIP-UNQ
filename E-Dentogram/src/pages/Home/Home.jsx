import React, { useState, useEffect } from "react";
import PersonTable from "../../components/PersonTable/PersonTable.jsx";
import "./Home.css";
import API from "../../service/API.jsx";
import "../../components/loader.css"

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);

  const handleAddClick = () => {
    // Agregar logica
    console.log("Botón Agregar clickeado");
  };

  useEffect(() => {
    // useEffect(async () => {
    // try {
    //   setLoading(true);
  
    //   const [_patients, _otraCosa] = await API.getAllSimplePatients();
    //   setPatients(_patients);
    // }
    // finally {
    //   setLoading(false)
    // }
    setLoading(true);

    API.getAllSimplePatients()
      .then(([_patients, _otraCosa]) => setPatients(_patients))
      // TODO: implementar .catch() + Toast + función general para tratar errores
      // 4xx => mensaje de error
      // 5xx => "Ocurrió un error, consulte al administrador del sistema"
      // cualquier otra cosa => error.message
      .finally(() => setLoading(false));

  }, []);

  console.log(patients);

  return (
    loading ? 
    <div className="home-container">
        <span class="loader"></span>
    </div>     
    :

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
