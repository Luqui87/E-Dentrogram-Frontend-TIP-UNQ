import React, { useState, useEffect } from "react";
import PersonTable from "../../components/PersonTable/PersonTable.jsx";
import "./Home.css";
import API from "../../service/API.jsx";
import "../../components/loader.css";
import { toast } from "react-toastify";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);

  const [dentistId, setDentistId] = useState("");

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

    API.getDentist(localStorage.getItem("username"))
      .then((res) => {
        setPatients(res.data.patients);
        setDentistId(res.data.dentistID);
        setLoading(false);
      })
      .catch((error) => {
        handleApiError(error);
        // TODO: implementar .catch() + Toast + función general para tratar errores
        // 4xx => mensaje de error
        // 5xx => "Ocurrió un error, consulte al administrador del sistema"
        // cualquier otra cosa => error.message
      })
      .finally();
  }, []);

  const handleApiError = (error) => {
    if (error.response) {
      const status = error.response.status;

      switch (true) {
        case status >= 400 && status < 500:
          toast.error(error.response.data || "Error del cliente.");
          break;
        case status >= 500:
          toast.error("Error del servidor. Consulte al administrador.");
          break;
        default:
          toast.error("Error inesperado.");
      }
    } else {
      toast.error("No se pudo conectar con el servidor.");
    }
  };

  return loading ? (
    <div className="home-container">
      <span class="loader" style={{ margin: "auto" }}></span>
    </div>
  ) : (
    <div className="home-container">
      <div className="top-bar">
        <h1>Listado de Pacientes</h1>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleAddClick} className="add-button">
          Agregar Paciente +
        </button>
      </div>
      <PersonTable
        patients={patients}
        searchTerm={searchTerm}
        setPatients={setPatients}
        dentistId={dentistId}
      />
    </div>
  );
};

export default Home;
